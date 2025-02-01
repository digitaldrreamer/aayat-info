<script lang="ts">
	import { onMount } from 'svelte'
	import * as Carousel from "$lib/components/ui/carousel/index.js"
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js"
	import SurahTitle from './surah-title.svelte'
	import QuranPage from './quran-page.svelte'

	interface SurahInfo {
		chapter: number;
		name: {
			ar: string;
			en: string;
		};
		revelation: "Mecca" | "Madina";
		versesCount: number;
	}

	let { info } = $props<{ info: SurahInfo }>()

	/** @type {any[]} */
	let pages = $state([]) // This would be populated with actual page data
	let isMobile = $state(false)

	onMount(() => {
		isMobile = window.innerWidth < 768
		window.addEventListener('resize', () => {
			isMobile = window.innerWidth < 768
		})
	})
</script>

{#if isMobile}
	<Carousel.Root class="w-full">
		<Carousel.Content>
			<Carousel.Item>
				<SurahTitle {info} />
			</Carousel.Item>
			{#each pages as page, i}
				<Carousel.Item>
					<QuranPage
						pageNumber={i + 1}
						content={page.content}
						translation={page.translation}
					/>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<div class="flex justify-center gap-2 py-2">
			<Carousel.Previous />
			<Carousel.Next />
		</div>
	</Carousel.Root>
{:else}
	<ScrollArea class="h-[calc(100vh-4rem)]">
		<div class="container max-w-3xl mx-auto">
			<SurahTitle {info} />
			{#each pages as page, i}
				<QuranPage
					pageNumber={i + 1}
					content={page.content}
					translation={page.translation}
					className="border-t"
				/>
			{/each}
		</div>
	</ScrollArea>
{/if}

