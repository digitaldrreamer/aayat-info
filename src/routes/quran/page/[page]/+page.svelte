<script lang="ts">
	import { ScrollArea } from "$lib/components/ui/scroll-area/index";
	import { Button } from "$lib/components/ui/button/index";
	import { Play, Share, Pause, Square, Loader } from 'lucide-svelte';
	import Verse from "$lib/components/quran/verse.svelte";
	import Loading from '$lib/components/Loading.svelte';
	import NewSurah from '$lib/components/quran/new-surah.svelte'
	import share from '$lib/share.js'
	import { onDestroy } from 'svelte';

	let { data } = $props()
	let audio = $state(null);
	/**
	 * @type {'off' | 'paused' | 'playing' | 'loading'}
	 */
	let audioState = $state('off');

	function playAudio(url) {
		if (!audio) {
			audio = new Audio(url);

			// Handle loading state
			audio.onwaiting = () => audioState = 'loading'; // Buffering
			audio.oncanplay = () => audioState = 'playing'; // Ready to play

			// Handle end and errors
			audio.onended = () => audioState = 'off';
			audio.onerror = () => audioState = 'off';
		}

		audio.play()
			.then(() => {
				audioState = 'playing';
			})
			.catch(console.error);
	}

	function pauseAudio() {
		if (audio) {
			audio.pause();
			audioState = 'paused';
		}
	}

	function shareHadith () {
		share({
			title: `Quran Page ${data.number}`,
			text: `Quran Page ${data.number}`,
			url: window.location.href
		})
	}

	function destroyAudio() {
		if (audio) {
			audio.pause();
			audio = null;
		}
		audioState = 'off';
	}

	onDestroy(() => {
		destroyAudio();
	});

	$inspect(audioState)
</script>

<svelte:head>
	<title>Read Quran {data.number} on Aayah.info – A Minimalist Muslim Companion</title>
	<meta property="og:title" content="Read Quran {data.number} on Aayah.info – A Minimalist Muslim Companion" />
	<meta name="twitter:title" content="Read Quran {data.number} on Aayah.info – A Minimalist Muslim Companion" />
</svelte:head>

{#await data.page}
	<Loading message="Loading Quran Page Data..." />
	{:then page}
	{#if page?.success}
		{@const verses = page.data.verses}
<div class="min-h-screen bg-neutral-50 text-neutral-900">
	<header class="sticky top-0 bg-neutral-100 shadow-sm z-10">
		<div class="container mx-auto px-4 py-2 flex justify-between items-center">
			<h1 class="text-2xl font-bold">Page {data.number}</h1>
			<div class="flex gap-2">

				{#if ['playing', 'paused'].includes(audioState)}
					<Button variant="outline" size="icon" onclick={destroyAudio} aria-label="Cancel audio">
						<Square class="h-4 w-4" />
					</Button>
				{/if}

				{#if ['paused', 'off'].includes(audioState)}
					<Button variant="outline" size="icon" onclick={() => playAudio(page?.data?.audioUrl)} aria-label="Play audio">
						<Play class="h-4 w-4" />
					</Button>
				{:else if audioState === "loading"}
					<Button variant="outline" size="icon" disabled aria-label="Loading audio">
						<Loader class="h-4 w-4 animate-spin" />
					</Button>
				{:else if audioState === "playing"}
					<Button variant="outline" size="icon" onclick={pauseAudio} aria-label="Pause audio">
						<Pause class="h-4 w-4" />
					</Button>
				{/if}


				<Button onclick={() => shareHadith(data.page)} variant="outline" size="icon">
					<Share class="h-4 w-4" />
				</Button>
			</div>
		</div>
	</header>

	<main class="container mx-auto px-4 py-8">
		<ScrollArea class="h-[calc(100vh-5rem)]">
			<div class="max-w-3xl mx-auto">
				<div class="space-y-6 text-right" dir="rtl">
					{#each verses as verse}
						{#if verse.verse === 1}
							<NewSurah {...page.data.surahData.find(s => s.chapter === verse.chapter)} />
						{/if}
						<Verse {...verse} />
					{/each}
				</div>
			</div>
		</ScrollArea>
	</main>
</div>
		{/if}
	{/await}