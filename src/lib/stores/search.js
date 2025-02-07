import { writable } from 'svelte/store';
import debounce from 'lodash/debounce';

// Create stores for state management
export const searchQuery = writable('');
export const searchResults = writable({
	surahs: { results: [], total: 0, hasMore: false },
	juzs: { results: [], total: 0, hasMore: false },
	pages: { results: [], total: 0, hasMore: false },
	hadiths: { results: [], total: 0, hasMore: false }
});

// Memoization cache for search results
const searchCache = new Map();
const CACHE_SIZE = 100;
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Optimized text normalization with memoization
const normalizeCache = new Map();
export function normalizeText(text) {
	if (!text) return '';

	const cached = normalizeCache.get(text);
	if (cached) return cached;

	const normalized = text.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
		.replace(/[^\w\s]/g, '');

	normalizeCache.set(text, normalized);
	if (normalizeCache.size > CACHE_SIZE) {
		const firstKey = normalizeCache.keys().next().value;
		normalizeCache.delete(firstKey);
	}

	return normalized;
}

// Optimized Levenshtein distance calculation with early termination
export function levenshteinDistance(str1, str2, maxDistance = 3) {
	if (Math.abs(str1.length - str2.length) > maxDistance) return maxDistance + 1;

	const matrix = Array(str1.length + 1).fill(null)
		.map(() => Array(str2.length + 1).fill(null));

	for (let i = 0; i <= str1.length; i++) matrix[i][0] = i;
	for (let j = 0; j <= str2.length; j++) matrix[0][j] = j;

	let minDistanceInRow;
	for (let i = 1; i <= str1.length; i++) {
		minDistanceInRow = maxDistance + 1;
		for (let j = 1; j <= str2.length; j++) {
			matrix[i][j] = Math.min(
				matrix[i-1][j] + 1,
				matrix[i][j-1] + 1,
				matrix[i-1][j-1] + (str1[i-1] !== str2[j-1] ? 1 : 0)
			);
			minDistanceInRow = Math.min(minDistanceInRow, matrix[i][j]);
		}
		if (minDistanceInRow > maxDistance) return maxDistance + 1;
	}

	return matrix[str1.length][str2.length];
}

// Enhanced fuzzy matching with configurable weights
export function fuzzyMatch(query, text, options = {}) {
	const {
		threshold = 0.3,
		exactMatchBonus = 0.2,
		prefixMatchBonus = 0.1,
		maxDistance = 3
	} = options;

	if (!query) return { match: true, score: 1 };

	const normalizedQuery = normalizeText(query);
	const normalizedText = normalizeText(text);

	// Exact match check
	if (normalizedText === normalizedQuery) {
		return { match: true, score: 1 + exactMatchBonus };
	}

	// Prefix match check
	if (normalizedText.startsWith(normalizedQuery)) {
		return { match: true, score: 0.9 + prefixMatchBonus };
	}

	// Contains check
	if (normalizedText.includes(normalizedQuery)) {
		return { match: true, score: 0.8 };
	}

	// Word-by-word fuzzy matching
	const queryWords = normalizedQuery.split(/\s+/);
	const textWords = normalizedText.split(/\s+/);

	let matchCount = 0;
	let totalScore = 0;

	for (const queryWord of queryWords) {
		let bestWordScore = 0;

		for (const textWord of textWords) {
			const distance = levenshteinDistance(queryWord, textWord, maxDistance);
			const maxLength = Math.max(queryWord.length, textWord.length);
			const similarity = 1 - (distance / maxLength);

			bestWordScore = Math.max(bestWordScore, similarity);
		}

		if (bestWordScore > threshold) {
			matchCount++;
			totalScore += bestWordScore;
		}
	}

	const finalScore = totalScore / queryWords.length;
	return {
		match: matchCount > 0,
		score: finalScore
	};
}

// Optimized search function with worker support
export function getFilteredResults(query, items, options = {}) {
	const cacheKey = `${query}-${JSON.stringify(options)}`;
	const cached = searchCache.get(cacheKey);
	if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
		return cached.results;
	}

	const {
		searchFields = ['name', 'arabicName', 'number'],
		limit = 10,
		offset = 0,
		minScore = 0.3
	} = options;

	if (!query) {
		const results = {
			results: items.slice(offset, offset + limit),
			total: items.length,
			hasMore: items.length > offset + limit
		};
		searchCache.set(cacheKey, { results, timestamp: Date.now() });
		return results;
	}

	const scoredResults = items.map(item => {
		let maxScore = 0;

		for (const field of searchFields) {
			if (item[field]) {
				const { score } = fuzzyMatch(query, String(item[field]), { minScore });
				maxScore = Math.max(maxScore, score);
			}
		}

		return { item, score: maxScore };
	});

	const filteredResults = scoredResults
		.filter(result => result.score >= minScore)
		.sort((a, b) => b.score - a.score);

	const results = {
		results: filteredResults.slice(offset, offset + limit).map(result => result.item),
		total: filteredResults.length,
		hasMore: filteredResults.length > offset + limit
	};

	searchCache.set(cacheKey, { results, timestamp: Date.now() });
	if (searchCache.size > CACHE_SIZE) {
		const firstKey = searchCache.keys().next().value;
		searchCache.delete(firstKey);
	}

	return results;
}

// Debounced search update
export const debouncedSearch = debounce((query, items) => {
	const results = {
		surahs: getFilteredResults(query, items.surahs, {
			searchFields: ['name', 'arabicName', 'number'],
			limit: 4
		}),
		juzs: getFilteredResults(query, items.juzs, {
			searchFields: ['name', 'surahs', 'number'],
			limit: 3
		}),
		pages: getFilteredResults(query, items.pages.map(p => ({ number: p })), {
			searchFields: ['number'],
			limit: 3
		}),
		hadiths: getFilteredResults(query, items.hadiths || [], {
			searchFields: ['label'],
			limit: 5
		})
	};

	searchResults.set(results);
}, 150);

