<script lang="ts">
	import { Card } from "$lib/components/ui/card";
	import { Progress } from "$lib/components/ui/progress";
	import { Trophy, Book, Mic, Calendar } from 'lucide-svelte';

	let achievements = [
		{ title: "Quran Recitation", value: 50, total: 100, icon: Book, color: "bg-blue-500" },
		{ title: "Hadith Read", value: 75, total: 100, icon: Mic, color: "bg-green-500" },
		{ title: "Daily Streak", value: 5, total: 7, icon: Calendar, color: "bg-orange-500" },
	];

	let progressValue = 100;
	let streakCount = 5;
</script>

<Card>
	<div class="p-6 space-y-4">
		<div class="flex items-center gap-2">
			<Trophy class="w-6 h-6 text-yellow-500" />
			<h2 class="text-2xl font-semibold">Your Progress</h2>
		</div>
		<p class="text-gray-600">Track your learning journey</p>
		<div class="grid gap-6">
			{#each achievements as { title, value, total, icon: Icon, color }}
				<div class="space-y-2">
					<div class="flex justify-between">
						<div class="flex items-center gap-2">
							<div class={`p-1.5 rounded-full ${color}`}>
								<svelte:component this={Icon} class="w-4 h-4 text-white" />
							</div>
							<span class="text-sm font-medium">{title}</span>
						</div>
						<span class="text-sm text-gray-600">
              {value} / {total}
            </span>
					</div>
					<Progress value={progressValue * (value / total)} class="h-2" />
					{#if title === "Daily Streak"}
						<div class="flex gap-1 pt-1">
							{#each Array(7) as _, i}
								<div
									class="w-6 h-1 rounded-full transition-all duration-500"
									class:bg-orange-500={i < streakCount}
									class:bg-gray-300={i >= streakCount}
									style:transition-delay={`${i * 100}ms`}
								/>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</Card>