<script lang="ts">
	import { ScrollArea } from "$lib/components/ui/scroll-area"
	import * as Carousel from "$lib/components/ui/carousel"
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

	const navigate = () => {}
</script>
{#await data.surah}
	<Loading message="Loading surah data..." />
{:then surah}
	{#if isMobile}
		<Carousel.Root orientation="vertical" opts={{
			align: 'start',
			loop: false
		}}>
			<Carousel.Content class="mx-auto">
				<Carousel.Item>
					<SurahInfo info={{
                    chapter: surah.data.verses[0]?.chapter,
                    name: surah.data.name,
                    revelation: surah.data.revelation,
                    versesCount: surah.data.versesCount
                }}
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
                name: {
                    ar: "سُوْرَةُ الْفَاتِحَةِ",
                    en: "The Opening"
                },
                revelation: "Mecca",
                versesCount: surah.data.verses.length
            }}
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
						<Verse {...verse} />
					{/each}
				</div>
			</div>
		</ScrollArea>
	{/if}
{/await}

