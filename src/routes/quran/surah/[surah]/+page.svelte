<script lang="ts">
	import { ScrollArea } from "$lib/components/ui/scroll-area/index"
	import * as Carousel from "$lib/components/ui/carousel/index"
	import Verse from "$lib/components/quran/verse.svelte"
	import SurahInfo from "$lib/components/quran/surah-info.svelte"
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';

	/** @type {any} */
	let { data } = $props()

	let reader;

	let isMobile = $state(false)

	onMount(() => {
		isMobile = window.innerWidth < 768
		window.addEventListener('resize', () => {
			isMobile = window.innerWidth < 768
		})
	})


	let api = $state<CarouselAPI>();
	let current = $state(0);
	const count = $derived(api ? api.scrollSnapList().length : 0);

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
{#await data.surah}
	<Loading message="Loading surah data..." />
{:then surah}
	{#if isMobile}
		<Carousel.Root setApi={(emblaApi) => (api = emblaApi)} orientation="vertical" opts={{
			align: 'start',
			loop: false
		}}>
			<Carousel.Content side="bottom" class="mx-auto">
				<Carousel.Item>
					<SurahInfo info={{
                    chapter: surah.data.verses[0]?.chapter,
                    name: surah.data.name,
                    revelation: surah.data.revelation,
                    versesCount: surah.data.versesCount
                }}
										 audioUrls={surah.data.verses[0]?.chapter !== 1 ? [getReciterBasmalah(surah.data.verses[0].audioUrl), ...surah.data.verses.map(v => v.audioUrl)] : [...surah.data.verses.map(v => v.audioUrl)]}
										 onRead={() => {
                    document.getElementById('reader').scrollTo({
                    behavior: 'smooth'
                    })
                }}
										 onMurajah={() => {
                    // Navigate to murajah page with current surah
                    navigate(`/murajah/${surah.data.verses[0]?.chapter}`)
                }}
										 onHistory={() => {
                    // Navigate to history page filtered by current surah
                    navigate(`/history?surah=${surah.data.verses[0]?.chapter}`)
                }}
					/>
				</Carousel.Item>
				<Carousel.Item>
					<div class="min-h-[calc(100vh-8rem)] p-3 text-pretty sm:p-8 text-right" dir="rtl">
						{#each surah.data.verses as verse}
							{#if verse.chapter !== 1 && verse.verse === 1}
								<img src="/bismillah.png" alt="Bismillah" class="h-auto mb-8" />
							{/if}
							<Verse {...verse} />
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
				<SurahInfo info={{
                    chapter: surah.data.verses[0]?.chapter,
                    name: surah.data.name,
                    revelation: surah.data.revelation,
                    versesCount: surah.data.versesCount
                }}
									 audioUrls={[getReciterBasmalah(surah.data.verses[0].audioUrl), ...surah.data.verses.map(v => v.audioUrl)]}
									 onRead={() => {
                    reader.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center'
                    })
                }}
									 onMurajah={() => {
                // Navigate to murajah page with current surah
                navigate(`/murajah/${surah.data.verses[0]?.chapter}`)
            }}
									 onHistory={() => {
                // Navigate to history page filtered by current surah
                navigate(`/history?surah=${surah.data.verses[0]?.chapter}`)
            }}
				/>
				<div bind:this={reader} class="min-h-[50vh] p-3 text-pretty sm:p-8 text-right" dir="rtl">
					{#each surah.data.verses as verse}
						{#if verse.chapter !== 1 && verse.verse === 1}
							<img src="/bismillah.png" alt="Bismillah" class="h-auto mb-8" />
							{/if}
						<Verse {...verse} />
					{/each}
				</div>
			</div>
		</ScrollArea>
	{/if}
{/await}

