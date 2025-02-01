<script lang="ts">
	import { onMount } from 'svelte'
	import { fly, scale } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import { Book, Mic, BookOpen, Brain, Calendar, BookMarked, BookText, Trophy, Flame, Star } from 'lucide-svelte'
	import { Button } from "$lib/components/ui/button"
	import * as Card from "$lib/components/ui/card/index"
	import { Progress } from "$lib/components/ui/progress"
	import { Separator } from "$lib/components/ui/separator/index.js"

	/** @type {number} */
	let progressValue = $state(0)
	/** @type {number} */
	let streakCount = $state(0)

	/** @type {Array<{title: string, description: string, icon: any, href: string}>} */
	const readActions = [
		{
			title: "Quran",
			description: "Read and study the Holy Quran",
			icon: Book,
			href: "/quran"
		},
		{
			title: "Hadith",
			description: "Explore authenticated Hadith collections",
			icon: BookOpen,
			href: "/hadith"
		},
		{
			title: "Tafsir",
			description: "Deep dive into Quranic interpretation",
			icon: BookText,
			href: "/tafsir"
		},
		{
			title: "Dua",
			description: "Daily prayers and supplications",
			icon: BookMarked,
			href: "/dua"
		}
	]

	/** @type {Array<{title: string, description: string, icon: any, href: string}>} */
	const aiActions = [
		{
			title: "AI Recitation",
			description: "Practice recitation with AI assistance",
			icon: Mic,
			href: "/ai/recite"
		},
		{
			title: "Murajah Tracker",
			description: "Track your memorization progress",
			icon: Calendar,
			href: "/murajah"
		},
		{
			title: "AI Assistant",
			description: "Get help understanding Islamic texts",
			icon: Brain,
			href: "/ai/assist"
		}
	]

	/** @type {Array<{title: string, value: number, total: number, icon: any, color: string}>} */
	const achievements = [
		{
			title: "Daily Streak",
			value: 7,
			total: 30,
			icon: Flame,
			color: "bg-orange-500"
		},
		{
			title: "Pages Read",
			value: 124,
			total: 604,
			icon: Book,
			color: "bg-emerald-500"
		},
		{
			title: "Memorized",
			value: 3,
			total: 30,
			icon: Star,
			color: "bg-violet-500"
		}
	]

	/**
	 * Navigate to a page
	 * @param {string} path
	 */
	function navigate(path) {
		// Navigation implementation
	}

	onMount(() => {
		// Animate progress bars
		progressValue = 100
		streakCount = 7
	})
</script>

<div class="min-h-[calc(100vh-8rem)] container max-w-2xl mx-auto p-4 space-y-8">


	<!-- Read Section -->
	<section class="space-y-4" in:fly={{ y: 20, duration: 500, delay: 400 }}>
		<h2 class="text-lg font-secondary font-semibold flex items-center gap-2">
			<Book class="w-5 h-5" />
			Read & Learn
		</h2>
		<div class="grid gap-4 sm:grid-cols-2">
			{#each readActions as action, i}
				<Card.Root
					class="group relative overflow-hidden transition-all hover:bg-secondary hover:scale-[1.02]"
				>
					<button
						class="w-full h-full p-6 text-left"
						onclick={() => navigate(action.href)}
					>
						<div class="flex items-start gap-4">
							<div class="rounded-lg bg-primary/5 p-2 ring-1 ring-primary/10">
								<svelte:component
									this={action.icon}
									class="w-5 h-5 transition-transform group-hover:scale-110 duration-300"
								></svelte:component>
							</div>
							<div class="space-y-1">
								<h3 class="font-secondary font-medium leading-none">
									{action.title}
								</h3>
								<p class="text-sm text-muted-foreground">
									{action.description}
								</p>
							</div>
						</div>
					</button>
				</Card.Root>
			{/each}
		</div>
	</section>

	<Separator />

	<!-- AI Features Section -->
	<section class="space-y-4" in:fly={{ y: 20, duration: 500, delay: 600 }}>
		<h2 class="text-lg font-secondary font-semibold flex items-center gap-2">
			<Brain class="w-5 h-5" />
			AI Features
		</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each aiActions as action, i}
				<Card.Root
					class="group relative overflow-hidden transition-all hover:bg-secondary hover:scale-[1.02]"
				>
					<button
						class="w-full h-full p-6 text-left"
						onclick={() => navigate(action.href)}
					>
						<div class="flex items-start gap-4">
							<div class="rounded-lg bg-primary/5 p-2 ring-1 ring-primary/10">
								<svelte:component
									this={action.icon}
									class="w-5 h-5 transition-transform group-hover:scale-110 duration-300"
								></svelte:component>
							</div>
							<div class="space-y-1">
								<h3 class="font-secondary font-medium leading-none">
									{action.title}
								</h3>
								<p class="text-sm text-muted-foreground">
									{action.description}
								</p>
							</div>
						</div>
					</button>
				</Card.Root>
			{/each}
		</div>
	</section>

	<!-- Achievements Section -->
	<section class="pt-4" in:fly={{ y: 20, duration: 500, delay: 800 }}>
		<Card.Root class="overflow-hidden">
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<Trophy class="w-5 h-5 text-yellow-500" />
					Your Progress
				</Card.Title>
				<Card.Description>Track your learning journey</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-6">
					{#each achievements as { title, value, total, icon: Icon, color }, i}
						<div
							class="space-y-2"
							in:scale={{ duration: 300, delay: 900 + i * 100 }}
						>
							<div class="flex justify-between">
								<div class="flex items-center gap-2">
									<div class={`p-1.5 rounded-full ${color}`}>
										<svelte:component this={Icon} class="w-4 h-4 text-white" ></svelte:component>
									</div>
									<span class="text-sm font-medium">{title}</span>
								</div>
								<span class="text-sm text-muted-foreground">
                                    {value} / {total}
                                </span>
							</div>
							<Progress
								value={progressValue * (value / total)}
								class="h-2 transition-all duration-1000 ease-out"
							/>
							{#if title === "Daily Streak"}
								<div class="flex gap-1 pt-1">
									{#each Array(7) as _, i}
										<div
											class="w-6 h-1 rounded-full transition-all duration-500"
											class:bg-orange-500={i < streakCount}
											class:bg-secondary={i >= streakCount}
											style:transition-delay={`${i * 100}ms`}
										></div>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	</section>
</div>

