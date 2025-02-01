<script lang="ts">
	import { onMount } from 'svelte'
	import * as Carousel from "$lib/components/ui/carousel/index.js"
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js"
	import QuranPage from './quran-page.svelte'

	interface JuzInfo {
		number: number;
		name: string;
		startVerse: {
			chapter: number;
			verse: number;
		};
	}

	let { info } = $props<{ info: JuzInfo }>()

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
			<!-- Juz Title -->
			<Carousel.Item>
				<div class="min-h-full flex items-center justify-center p-6 bg-background">
					<div class="text-center space-y-6">
						<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 ring-1 ring-primary/10">
							<span class="text-2xl font-secondary font-bold">{info.number}</span>
						</div>
						<h1 class="text-3xl font-secondary font-semibold tracking-tight">
							Juz {info.number}
						</h1>
						<p class="text-sm text-muted-foreground">
							Starting from Surah {info.startVerse.chapter}, Verse {info.startVerse.verse}
						</p>
					</div>
				</div>
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
			<!-- Juz Title -->
			<div class="min-h-[50vh] flex items-center justify-center p-6 bg-background">
				<div class="text-center space-y-6">
					<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 ring-1 ring-primary/10">
						<span class="text-2xl font-secondary font-bold">{info.number}</span>
					</div>
					<h1 class="text-3xl font-secondary font-semibold tracking-tight">
						Juz {info.number}
					</h1>
					<p class="text-sm text-muted-foreground">
						Starting from Surah {info.startVerse.chapter}, Verse {info.startVerse.verse}
					</p>
				</div>
			</div>

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

