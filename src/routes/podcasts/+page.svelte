<script lang="ts">
	import { Button } from "$lib/components/ui/button/index";
	import { Input } from "$lib/components/ui/input/index";
	import * as Card from "$lib/components/ui/card/index";
	import * as Carousel from "$lib/components/ui/carousel/index";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index";
	import { Search, Play, Download, Info, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import FloatingPlayer from '$lib/components/podcasts/FloatingPlayer.svelte';
	import InfoModal from '$lib/components/podcasts/InfoModal.svelte';
	import DownloadModal from '$lib/components/podcasts/DownloadModal.svelte';
	import Loading from '$lib/components/Loading.svelte';

	// Enhanced fuzzy matching with scoring
	function fuzzyMatch(query, text, threshold = 0.3) {
		if (!query) return { match: true, score: 1 };

		const normalizedQuery = normalizeText(query);
		const normalizedText = normalizeText(text);

		if (normalizedText.includes(normalizedQuery)) {
			return { match: true, score: 1 };
		}

		const queryWords = normalizedQuery.split(/\s+/);
		const textWords = normalizedText.split(/\s+/);

		let matchCount = 0;
		let totalScore = 0;

		for (const queryWord of queryWords) {
			let bestWordScore = 0;

			for (const textWord of textWords) {
				const distance = levenshteinDistance(queryWord, textWord);
				const maxLength = Math.max(queryWord.length, textWord.length);
				const similarity = 1 - (distance / maxLength);

				if (similarity > bestWordScore) {
					bestWordScore = similarity;
				}
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

	// Levenshtein distance calculation
	function levenshteinDistance(str1, str2) {
		const m = str1.length;
		const n = str2.length;
		const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

		for (let i = 0; i <= m; i++) dp[i][0] = i;
		for (let j = 0; j <= n; j++) dp[0][j] = j;

		for (let i = 1; i <= m; i++) {
			for (let j = 1; j <= n; j++) {
				if (str1[i - 1] === str2[j - 1]) {
					dp[i][j] = dp[i - 1][j - 1];
				} else {
					dp[i][j] = 1 + Math.min(
						dp[i - 1][j],
						dp[i][j - 1],
						dp[i - 1][j - 1]
					);
				}
			}
		}

		return dp[m][n];
	}

	let { data } = $props();
	let searchQuery = $state("");
	let currentEpisode = $state(null);
	let showInfoModal = $state(false);
	let showDownloadModal = $state(false);
	let currentPage = $state(1);
	const episodesPerPage = 10;

	function getFilteredAudioList(podcasts, query) {
		if (!podcasts?.audioList) return [];
		return podcasts.audioList.filter(audio =>
			fuzzyMatch(query, audio.title).match
		);
	}

	function normalizeText(text) {
		return text.toLowerCase().replace(/[^\w\s]/g, '');
	}

	function playEpisode(episode) {
		currentEpisode = episode;
	}

	function playPreviousEpisode(podcasts) {
		if (!podcasts?.audioList) return;

		const filteredList = getFilteredAudioList(podcasts, searchQuery);

		// If no filtered list, return
		if (filteredList.length === 0) return;

		// If no current episode, select the last episode
		if (!currentEpisode) {
			currentEpisode = filteredList[filteredList.length - 1];
			return;
		}

		const currentIndex = filteredList.findIndex(episode =>
			episode.url === currentEpisode.url
		);

		// If current episode not found, select the last episode
		if (currentIndex === -1) {
			currentEpisode = filteredList[filteredList.length - 1];
			return;
		}

		// If current episode is first, wrap around to the last episode
		if (currentIndex === 0) {
			currentEpisode = filteredList[filteredList.length - 1];
			return;
		}

		// Select and play previous episode
		currentEpisode = filteredList[currentIndex - 1];
	}

	function playNextEpisode(podcasts) {
		if (!podcasts?.audioList) return;

		const filteredList = getFilteredAudioList(podcasts, searchQuery);

		// If no filtered list, return
		if (filteredList.length === 0) return;

		// If no current episode, select the first episode
		if (!currentEpisode) {
			currentEpisode = filteredList[0];
			return;
		}

		const currentIndex = filteredList.findIndex(episode =>
			episode.url === currentEpisode.url
		);

		// If current episode not found, select the first episode
		if (currentIndex === -1) {
			currentEpisode = filteredList[0];
			return;
		}

		// If current episode is last, wrap around to the first episode
		if (currentIndex === filteredList.length - 1) {
			currentEpisode = filteredList[0];
			return;
		}

		// Select and play next episode
		currentEpisode = filteredList[currentIndex + 1];
	}

	function openInfoModal() {
		showInfoModal = true;
	}

	function openDownloadModal(episode) {
		if (currentEpisode && !episode.downloadLink) episode = currentEpisode;
		currentEpisode = episode;
		showDownloadModal = true;
	}

	function closeInfoModal() {
		showInfoModal = false;
	}

	function closeDownloadModal() {
		showDownloadModal = false;
	}

	function downloadEpisode() {
		if (currentEpisode) {
			window.open(currentEpisode.downloadLink, '_blank');
		}
		closeDownloadModal();
	}

	function goToPage(page, totalPages) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	function openSeries(series) {
		window.open(series.link, '_blank');
	}
</script>

<div class="min-h-screen bg-neutral-50 p-8">
	<div class="max-w-4xl mx-auto space-y-8">
		<h1 class="text-3xl font-bold text-center">Mufti Menk Podcasts</h1>

		{#await data.podcasts}
			<Loading message="Loading Podcasts data. This might take a while..." />
		{:then podcasts}
			<div class="relative">
				<Search class="absolute left-2 top-2.5 h-4 w-4 text-neutral-500" />
				<Input
					type="text"
					placeholder="Search episodes"
					class="pl-8"
					bind:value={searchQuery}
				/>
			</div>

			{#if podcasts?.audioList}
				{@const filteredList = getFilteredAudioList(podcasts, searchQuery)}
				{@const totalPages = Math.ceil(filteredList.length / episodesPerPage)}
				{@const paginatedList = filteredList.slice(
					(currentPage - 1) * episodesPerPage,
					currentPage * episodesPerPage
				)}

				<ScrollArea class="h-[calc(100vh-24rem)]">
					<div class="space-y-4">
						{#each paginatedList as episode}
							<Card.Root>
								<Card.Header>
									<Card.Title>{episode.title}</Card.Title>
									<Card.Description>{episode.date} | {episode.duration}</Card.Description>
								</Card.Header>
								<Card.Footer class="flex justify-between gap-2 mt-4">
									<Button variant="outline" class="w-full sm:w-auto" onclick={() => playEpisode(episode)}>
										<Play class="mr-2 h-4 w-4" />
										<span class="hidden sm:inline">Play</span>
									</Button>
									<Button variant="outline" class="w-full sm:w-auto" onclick={() => openDownloadModal(episode)}>
										<Download class="mr-2 h-4 w-4" />
										<span class="hidden sm:inline">Download</span>
									</Button>
								</Card.Footer>
							</Card.Root>
						{/each}
					</div>
				</ScrollArea>

				<div class="flex justify-center items-center space-x-2">
					<Button variant="outline" onclick={() => goToPage(currentPage - 1, totalPages)} disabled={currentPage === 1}>
						<ChevronLeft class="h-4 w-4" />
					</Button>
					<span>Page {currentPage} of {totalPages}</span>
					<Button variant="outline" onclick={() => goToPage(currentPage + 1, totalPages)} disabled={currentPage === totalPages}>
						<ChevronRight class="h-4 w-4" />
					</Button>
				</div>
			{/if}

			{#if podcasts?.seriesList}
				<div class="mt-8">
					<Carousel.Root class="w-full py-4">
						<h2 class="text-2xl font-bold mb-4 text-center">Series</h2>
						<Carousel.Content>
							{#each podcasts.seriesList as series}
								<Carousel.Item class="w-full md:basis-1/2 lg:basis-1/3 p-2">
									<Card.Root class="h-full">
										<Card.Header class="p-6">
											<Card.Title class="text-center">{series.title}</Card.Title>
										</Card.Header>
										<Card.Footer class="p-4">
											<Button variant="outline" class="w-full" onclick={() => openSeries(series)}>
												View Series
											</Button>
										</Card.Footer>
									</Card.Root>
								</Carousel.Item>
							{/each}
						</Carousel.Content>
						<div class="flex justify-center w-full gap-2 pt-4">
							<Carousel.Previous />
							<Carousel.Next />
						</div>
					</Carousel.Root>
				</div>
			{/if}

			<p class="text-sm text-neutral-500 text-center">
				Disclaimer: Audio content is scraped daily from MuslimCentral (https://muslimcentral.com/audio/mufti-menk/).
				All content belongs to their respective owners.
			</p>
		{:catch error}
			<div class="text-center text-red-500">
				Error loading podcasts: {error.message}
			</div>
		{/await}
	</div>

	{#if currentEpisode}
		<FloatingPlayer
			episode={currentEpisode}
			oninfo={openInfoModal}
			ondownload={openDownloadModal}
			onprevious={() => playPreviousEpisode(data.podcasts)}
			onnext={() => playNextEpisode(data.podcasts)}
		/>
	{/if}

	<InfoModal show={showInfoModal} onclose={closeInfoModal} />
	<DownloadModal
		show={showDownloadModal}
		episode={currentEpisode}
		onclose={closeDownloadModal}
		ondownload={downloadEpisode}
	/>
</div>