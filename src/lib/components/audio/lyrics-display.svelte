<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { fade } from 'svelte/transition';

	interface Segment {
		word_start_index?: number;
		word_end_index?: number;
		start_msec?: number;
		end_msec?: number;
	}

	interface SubtitleLine {
		surah: number;
		ayah: number;
		segments: Segment[];
		stats: {
			insertions: number;
			deletions: number;
			transpositions: number;
		};
	}

	export let subtitles: SubtitleLine[] = [];
	export let currentTime: number = 0; // in milliseconds
	export let quranText: string[] = []; // Array of words from quran-uthmani.txt

	let activeLineIndex: number | null = null;
	let activeWordIndices: number[] = [];
	let container: HTMLDivElement;
	let hasInitialized = false;

	// Initialize the component by mapping ayahs to words if segments are empty
	onMount(() => {
		if (subtitles && subtitles.length > 0 && quranText && quranText.length > 0) {
			populateSegmentData();
			hasInitialized = true;
		}
	});

	// Populate segment data based on ayah numbers if missing
	function populateSegmentData() {
		// For Al-Fatiha (Surah 1)
		const wordRanges = [
			[0, 3],    // Ayah 1: words 0-3
			[4, 7],    // Ayah 2: words 4-7
			[8, 9],    // Ayah 3: words 8-9
			[10, 12],  // Ayah 4: words 10-12
			[13, 16]   // Ayah 5-7: words 13-16
		];

		// Create a new array of subtitles with proper segment data
		const newSubtitles = [...subtitles];

		for (let i = 0; i < newSubtitles.length; i++) {
			if (i < wordRanges.length) {
				const [start, end] = wordRanges[i];
				const start_msec = i * 2000; // 2 seconds per ayah
				const end_msec = start_msec + 2000;

				newSubtitles[i] = {
					...newSubtitles[i],
					segments: [{
						word_start_index: start,
						word_end_index: end,
						start_msec,
						end_msec
					}]
				};
			}
		}

		// Update the subtitles array (must be done as reassignment for reactivity)
		subtitles = newSubtitles;
	}

	// Update active line based on current time
	$: if (hasInitialized && subtitles && subtitles.length > 0 && quranText && quranText.length > 0) {
		// Reset active indices
		activeLineIndex = null;
		activeWordIndices = [];

		// Simple demo mode: each ayah is active for 2 seconds
		const ayahIndex = Math.floor((currentTime / 2000) % subtitles.length);
		activeLineIndex = ayahIndex;

		// Get word indices for this ayah
		if (subtitles[ayahIndex] && subtitles[ayahIndex].segments && subtitles[ayahIndex].segments[0]) {
			const segment = subtitles[ayahIndex].segments[0];
			if (segment && typeof segment.word_start_index === 'number' && typeof segment.word_end_index === 'number') {
				for (let i = segment.word_start_index; i <= segment.word_end_index; i++) {
					if (i >= 0 && i < quranText.length) {
						activeWordIndices.push(i);
					}
				}
			}
		}
	}

	afterUpdate(() => {
		// Scroll to active line if container exists
		if (container && activeLineIndex !== null && activeLineIndex >= 0) {
			// Make sure the container has child elements
			if (container.children && container.children.length > activeLineIndex) {
				const activeElement = container.children[activeLineIndex];
				if (activeElement) {
					activeElement.scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					});
				}
			}
		}
	});

	// Function to get words for a specific ayah
	function getAyahWords(index: number): { text: string, isActive: boolean }[] {
		const words: { text: string, isActive: boolean }[] = [];

		// Fixed word ranges for Al-Fatiha
		const wordRanges = [
			[0, 3],    // Ayah 1: words 0-3
			[4, 7],    // Ayah 2: words 4-7
			[8, 9],    // Ayah 3: words 8-9
			[10, 12],  // Ayah 4: words 10-12
			[13, 16]   // Ayah 5-7: words 13-16
		];

		if (index < wordRanges.length) {
			const [start, end] = wordRanges[index];
			for (let i = start; i <= end && i < quranText.length; i++) {
				words.push({
					text: quranText[i],
					isActive: activeWordIndices.includes(i)
				});
			}
		}

		return words;
	}
</script>

<div
	bind:this={container}
	class="h-full overflow-y-auto overflow-x-hidden py-4 px-6 space-y-10 no-scrollbar bg-black"
	style="scroll-snap-type: y mandatory;"
>
	{#if subtitles && subtitles.length > 0 && quranText && quranText.length > 0}
		{#each subtitles as line, index}
			{#if index < 5} <!-- Only show the first 5 ayahs -->
				{@const words = getAyahWords(index)}
				{#if words.length > 0}
					<div
						class="text-center transition-all duration-300 {index === activeLineIndex ? 'bg-white/5' : ''} text-2xl leading-relaxed rtl p-4 rounded"
						class:opacity-40={index !== activeLineIndex}
						class:opacity-100={index === activeLineIndex}
						class:font-semibold={index === activeLineIndex}
					style="scroll-snap-align: center; min-height: 60px;"
					>
					<div class="inline-flex flex-wrap justify-center gap-2">
						{#each words as word}
								<span
									class="transition-all duration-200 {index !== activeLineIndex ? 'text-white/40' : ''}"
									class:text-white={word.isActive || index === activeLineIndex}
							class:scale-110={word.isActive}
							class:font-bold={word.isActive}
							>
							{word.text}
							</span>
						{/each}
					</div>
					</div>
				{/if}
			{/if}
		{/each}
	{:else}
		<div class="h-full flex items-center justify-center">
			<p class="text-white/70 text-center">Loading Quran text...</p>
		</div>
	{/if}
</div>

<style>
    /* Hide scrollbar but keep functionality */
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }

    /* Right-to-left text for Arabic */
    .rtl {
        direction: rtl;
    }
</style>