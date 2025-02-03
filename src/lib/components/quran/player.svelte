<script lang="ts">
	import { onMount } from 'svelte'
	import { tweened } from 'svelte/motion'
	import { fade, scale } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import * as Dialog from "$lib/components/ui/dialog/index"
	import { Button } from "$lib/components/ui/button/index"
	import { Skeleton } from "$lib/components/ui/skeleton/index"
	import { Progress } from "$lib/components/ui/progress/index"
	import { ScrollArea } from "$lib/components/ui/scroll-area/index"
	import {
		ChevronDown,
		Play,
		Pause,
		SkipBack,
		SkipForward,
		Loader2,
		Minimize2,
		Music
	} from 'lucide-svelte'

	/** @type {{ number: string, text: string, translation: string }[]} */
	let verses = $state([
		{ number: '2:255', text: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ', translation: 'Allah - there is no deity except Him, the Ever-Living, the Self-Sustaining' },
		{ number: '2:256', text: 'لَآ إِكْرَاهَ فِى ٱلدِّينِ', translation: 'There shall be no compulsion in religion' },
		{ number: '2:257', text: 'ٱللَّهُ وَلِىُّ ٱلَّذِينَ ءَامَنُوا', translation: 'Allah is the ally of those who believe' }
	])

	/** @type {number} */
	let currentVerseIndex = $state(1)
	/** @type {boolean} */
	let isPlaying = $state(false)
	/** @type {boolean} */
	let isLoading = $state(false)
	/** @type {boolean} */
	let isExpanded = $state(false)
	/** @type {boolean} */
	let isMinimized = $state(true)
	/** @type {number} */
	let progress = $state(45)
	/** @type {HTMLDivElement} */
	let playerElement
	/** @type {DOMRect | null} */
	let windowSize = null
	let isMobile = $state(false)

	let position = {
		x: tweened(0, { duration: 300, easing: quintOut }),
		y: tweened(0, { duration: 300, easing: quintOut })
	}

	function updateWindowSize() {
		windowSize = document.documentElement.getBoundingClientRect()
		if (windowSize && !isMinimized) {
			position.x.set(isMobile ? 0 : (windowSize.width - playerElement.offsetWidth - 16))
			position.y.set(isMobile ? 0 : (windowSize.height - playerElement.offsetHeight - 16))
		}
	}

	function togglePlay() {
		if (isLoading) return
		isPlaying = !isPlaying
	}

	function previousVerse() {
		if (currentVerseIndex > 0) {
			isLoading = true
			setTimeout(() => {
				currentVerseIndex--
				isLoading = false
			}, 1000)
		}
	}

	function nextVerse() {
		if (currentVerseIndex < verses.length - 1) {
			isLoading = true
			setTimeout(() => {
				currentVerseIndex++
				isLoading = false
			}, 1000)
		}
	}

	function minimize() {
		isMinimized = true
		isExpanded = false
	}

	function maximize() {
		isMinimized = false
		updateWindowSize()
	}

	onMount(() => {
		isMobile = window.innerWidth < 768
		updateWindowSize()

		window.addEventListener('resize', () => {
			isMobile = window.innerWidth < 768
			updateWindowSize()
		})

		// Initial position (bottom right)
		if (windowSize) {
			position.x.set(windowSize.width - 80)  // 64px button + 16px margin
			position.y.set(windowSize.height - 80) // 64px button + 16px margin
		}

		return () => {
			window.removeEventListener('resize', updateWindowSize)
		}
	})
</script>

{#if isMinimized}
	<!-- Floating Button -->
	<Button
		variant="default"
		size="icon"
		class="fixed z-50 w-16 h-16 rounded-full shadow-lg"
		style="transform: translate3d({$position.x}px, {$position.y}px, 0)"
		onclick={maximize}
	>
		<Music class="h-6 w-6" />
		{#if isPlaying}
			<div
				class="absolute inset-0 rounded-full border-2 border-primary animate-ping"
				in:scale={{ duration: 200 }}
			/>
		{/if}
	</Button>
{:else}
	<!-- Full Player -->
	<div
		bind:this={playerElement}
		class="fixed inset-0 z-50 bg-background/80 backdrop-blur-lg"
		transition:fade={{ duration: 200 }}
	>
		<div class="relative h-full flex flex-col">
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b">
				<div class="w-10" /> <!-- Spacer for alignment -->
				<div class="text-center">
					{#if isLoading}
						<Skeleton class="h-4 w-24" />
					{:else}
						<p class="text-sm font-medium">{verses[currentVerseIndex].number}</p>
					{/if}
				</div>
				<Button
					variant="ghost"
					size="icon"
					class="shrink-0"
					onclick={minimize}
					aria-label="Minimize player"
				>
					<Minimize2 class="h-5 w-5" />
				</Button>
			</div>

			<!-- Main Content -->
			<ScrollArea class="flex-1">
				<div class="container max-w-2xl mx-auto p-4 space-y-8">
					<!-- Controls -->
					<div class="flex flex-col items-center gap-4">
						<div class="flex items-center justify-center gap-8">
							<Button
								variant="ghost"
								size="icon"
								disabled={currentVerseIndex === 0 || isLoading}
								onclick={previousVerse}
								aria-label="Previous verse"
							>
								<SkipBack class="h-6 w-6" />
							</Button>

							<Button
								size="icon"
								class="h-16 w-16"
								onclick={togglePlay}
								disabled={isLoading}
								aria-label={isPlaying ? "Pause" : "Play"}
							>
								{#if isLoading}
									<Loader2 class="h-8 w-8 animate-spin" />
								{:else if isPlaying}
									<Pause class="h-8 w-8" />
								{:else}
									<Play class="h-8 w-8" />
								{/if}
							</Button>

							<Button
								variant="ghost"
								size="icon"
								disabled={currentVerseIndex === verses.length - 1 || isLoading}
								onclick={nextVerse}
								aria-label="Next verse"
							>
								<SkipForward class="h-6 w-6" />
							</Button>
						</div>

						<Progress value={progress} class="w-full max-w-md h-1" />
					</div>

					<!-- Verses -->
					<div class="space-y-8">
						<!-- Previous Verse -->
						{#if currentVerseIndex > 0}
							<div class="space-y-2 opacity-50">
								<p class="text-sm font-medium">{verses[currentVerseIndex - 1].number}</p>
								<p class="text-xl font-ar-primary text-right leading-relaxed" lang="ar" dir="rtl">
									{verses[currentVerseIndex - 1].text}
								</p>
								<p class="text-sm text-muted-foreground">
									{verses[currentVerseIndex - 1].translation}
								</p>
							</div>
						{/if}

						<!-- Current Verse -->
						<div class="space-y-2">
							<p class="text-sm font-medium">{verses[currentVerseIndex].number}</p>
							<p class="text-3xl font-ar-primary text-right leading-relaxed" lang="ar" dir="rtl">
								{verses[currentVerseIndex].text}
							</p>
							<p class="text-base">
								{verses[currentVerseIndex].translation}
							</p>
						</div>

						<!-- Next Verse -->
						{#if currentVerseIndex < verses.length - 1}
							<div class="space-y-2 opacity-50">
								<p class="text-sm font-medium">{verses[currentVerseIndex + 1].number}</p>
								<p class="text-xl font-ar-primary text-right leading-relaxed" lang="ar" dir="rtl">
									{verses[currentVerseIndex + 1].text}
								</p>
								<p class="text-sm text-muted-foreground">
									{verses[currentVerseIndex + 1].translation}
								</p>
							</div>
						{/if}
					</div>
				</div>
			</ScrollArea>
		</div>
	</div>
{/if}

