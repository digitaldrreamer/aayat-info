<script lang="ts">
	import { ScrollArea } from "$lib/components/ui/scroll-area/index"
	import * as Carousel from "$lib/components/ui/carousel/index"
	import Verse from "$lib/components/quran/verse.svelte"
	import SurahInfo from "$lib/components/quran/surah-info.svelte"
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { toast } from 'svelte-sonner';

	/** @type {any} */
	let { data } = $props()

	let reader;



	const openQuran = () => {
		if (api && current === 1) {
			api.scrollNext()
		}
	}

	function getReciterBasmalah(url) {
		return url.replace(/\/[^\/]*$/, "/001001.mp3");
	}



	const navigate = () => {}
</script>

<svelte:head>
	<title>Read Surah {surah.data.name.ar} ({surah.data.name.en}) on Aayah.info – A Minimalist Muslim Companion</title>
	<meta property="og:title" content="Read Surah {surah.data.name.ar} ({surah.data.name.en}) on Aayah.info – A Minimalist Muslim Companion" />
	<meta name="twitter:title" content="Read Surah {surah.data.name.ar} ({surah.data.name.en}) on Aayah.info – A Minimalist Muslim Companion" />
</svelte:head>

{#await data.surah}
	<Loading message="Loading surah data..." />
{:then surah}
		<ScrollArea class="h-[calc(100vh-4rem)] mx-auto w-full">
			<div class="container max-w-3xl mx-auto">
				<SurahInfo info={{
                    chapter: surah.data.verses[0]?.chapter,
                    name: surah.data.name,
                    revelation: surah.data.revelation,
                    versesCount: surah.data.versesCount
                }}
									 audioUrls={surah.data.verses[0].chapter !== 1 && surah.data.verses[0].chapter !== 9 ? [getReciterBasmalah(surah.data.verses[0].audioUrl), ...surah.data.verses.map(v => v.audioUrl)] : [...surah.data.verses.map(v => v.audioUrl)]}
									 onRead={() => {
                    reader.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center'
                    })
                }}
									 onMurajah={() => {
                // Navigate to murajah page with current surah
                navigate(`/quran/quiz`)
            }}
									 onHistory={() => {
                // Navigate to history page filtered by current surah
                toast.error('History', {
									description: 'Feature currently unavailable'
                })
            }}
				/>
				<div bind:this={reader} class="min-h-[50vh] p-3 text-pretty sm:p-8 text-right" dir="rtl">
					{#each surah.data.verses as verse}
						{#if verse.chapter !== 1 && verse.chapter !== 9 && verse.verse === 1}
							<img src="/bismillah.png" alt="Bismillah" class="h-auto mb-8" />
							{/if}
						<Verse {...verse} />
					{/each}
				</div>
			</div>
		</ScrollArea>
{/await}

