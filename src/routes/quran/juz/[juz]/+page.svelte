<script lang="ts">
	import { ScrollArea } from "$lib/components/ui/scroll-area/index";
	import * as Carousel from "$lib/components/ui/carousel/index";
	import Verse from "$lib/components/quran/verse.svelte";
	import JuzInfo from "$lib/components/quran/juz-view.svelte";
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import NewSurah from '$lib/components/quran/new-surah.svelte'
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	/** @type {any} */
	let { data } = $props()


	const navigate = (url) => {
		goto(url)
	}
</script>

{#await data.juz}
	<Loading message="Loading juz data..." />
{:then juz}
						{console.log(juz)}
	{#if juz?.success}
	{@const verses = juz.data.verses}
		<ScrollArea class="h-[calc(100vh-4rem)] mx-auto w-full">
			<div class="container max-w-3xl mx-auto">
				<JuzInfo info={{
					number: parseInt(data.number),
					name: `Juz ${data.number}`,
					startVerse: {
						chapter: verses[0].chapter,
						verse: verses[0].verse
					},
					versesCount: verses.length
				}}
								 audioUrls={[...juz.data.audioUrls]}
								 onRead={() => {
					// Scroll to verses or navigate to reading view
				}}
								 onMurajah={() => {
					// Navigate to murajah page with current juz
					navigate(`/quran/quiz`)
				}}
								 onHistory={() => {
					// Navigate to history page filtered by current juz
					toast.error('History', {description: "Feature currently unavailable"})
				}}
				/>
				<div class="min-h-[50vh] p-3 text-pretty sm:p-8 text-right" dir="rtl">
					{#each verses as verse}
						{#if verse.verse === 1}
							<NewSurah {...juz.data.surahData.find(s => s.chapter === verse.chapter)} />
						{/if}
						{#if verse.chapter !== 1 && verse.chapter !== 9 && verse.verse === 1}
							<img src="/bismillah.png" alt="Bismillah" class="h-auto mb-8" />
						{/if}
						<Verse
							chapter={verse.chapter}
							verse={verse.verse}
							text={verse.text}
							translation={verse.translation}
							audioUrl={verse.audioUrl}
							tafsir={verse.tafsir.text}
						/>
					{/each}
				</div>
			</div>
		</ScrollArea>
		{/if}
{/await}

