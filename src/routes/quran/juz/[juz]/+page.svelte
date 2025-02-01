<script lang="ts">
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import * as Carousel from "$lib/components/ui/carousel";
	import Verse from "$lib/components/quran/verse.svelte";
	import JuzInfo from "$lib/components/quran/juz-view.svelte";
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import NewSurah from '$lib/components/quran/new-surah.svelte'

	/** @type {any} */
	let { data } = $props()

	let isMobile = $state(false)

	onMount(() => {
		isMobile = window.innerWidth < 768
		window.addEventListener('resize', () => {
			isMobile = window.innerWidth < 768
		})
	})

	const navigate = () => {}
</script>

{#await data.juz}
	<Loading message="Loading juz data..." />
{:then juz}
	{#if juz?.success}
	{@const verses = juz.data.verses}
	{#if isMobile}
		<Carousel.Root>
			<Carousel.Content class="mx-auto">
				<Carousel.Item>
					<JuzInfo info={{
						number: parseInt(data.number),
						name: `Juz ${data.number}`,
						startVerse: {
							chapter: verses[0].chapter,
							verse: verses[0].verse
						},
						versesCount: verses.length
					}}
									 onRead={() => {
						// Scroll to verses or navigate to reading view
					}}
									 onMurajah={() => {
						// Navigate to murajah page with current juz
						navigate(`/murajah/juz/${data.number}`)
					}}
									 onHistory={() => {
						// Navigate to history page filtered by current juz
						navigate(`/history?juz=${data.number}`)
					}}
					/>
				</Carousel.Item>
				<Carousel.Item>
					<div class="min-h-[calc(100vh-8rem)] p-3 text-pretty sm:p-8 text-right" dir="rtl">
						{#each verses as verse}
							{#if verse.verse === 1}
								<NewSurah {...juz.data.surahData.find(s => s.chapter === verse.chapter)} />
								{/if}
							{#if verse.chapter !== 1 && verse.verse === 1}
								<img src="/bismillah.png" alt="Bismillah" class="h-auto mt-2 mb-8" />
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
				</Carousel.Item>
			</Carousel.Content>
			<div class="flex justify-center gap-2 py-2">
				<Carousel.Previous />
				<Carousel.Next />
			</div>
		</Carousel.Root>
	{:else}
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
								 onRead={() => {
					// Scroll to verses or navigate to reading view
				}}
								 onMurajah={() => {
					// Navigate to murajah page with current juz
					navigate(`/murajah/juz/${data.number}`)
				}}
								 onHistory={() => {
					// Navigate to history page filtered by current juz
					navigate(`/history?juz=${data.number}`)
				}}
				/>
				<div class="min-h-[50vh] p-3 text-pretty sm:p-8 text-right" dir="rtl">
					{#each verses as verse}
						{#if verse.verse === 1}
							<NewSurah {...juz.data.surahData.find(s => s.chapter === verse.chapter)} />
						{/if}
						{#if verse.chapter !== 1 && verse.verse === 1}
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
		{/if}
{/await}

