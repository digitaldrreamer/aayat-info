<!-- ResultsCard.svelte -->
<script lang="ts">
	import { Button } from "$lib/components/ui/button/index";
	import * as Card from "$lib/components/ui/card/index";
	import { RotateCcw, Volume2, Pause } from "lucide-svelte";
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';

	let { results } = $props();

	let currentAudio: HTMLAudioElement | null = null;
	let nowPlaying: string | null = null;

	const score = $derived(results.filter(r => r.isCorrect).length);
	const totalQuestions = $derived(results.length);
	const percentage = $derived(Math.round((score / totalQuestions) * 100));

	function playAudio(url: string) {
		if (currentAudio) {
			currentAudio.pause();
			currentAudio = null;
			nowPlaying = null;
		}

		currentAudio = new Audio(url);
		currentAudio.play().catch(console.error);
		nowPlaying = url;

		currentAudio.addEventListener('pause', () => nowPlaying = null);
		currentAudio.addEventListener('ended', () => nowPlaying = null);
	}

	onDestroy(() => {
		if (currentAudio) {
			currentAudio.pause();
			currentAudio = null;
		}
	});

	function restartQuiz() {
		goto('/quran/quiz')
	}
</script>

<div class="w-full max-w-2xl" transition:fade>
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-2xl font-bold text-center">Quiz Results</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-6">
			<div class="text-center space-y-2">
				<p class="text-3xl font-bold">{score}/{totalQuestions}</p>
				<p class="text-lg text-muted-foreground">
					({percentage}%) {percentage >= 80 ? '🎉 Excellent!' : percentage >= 60 ? '👍 Good Job!' : '💪 Keep Practicing!'}
				</p>
			</div>

			<div class="space-y-4">
				{#each results as result, index}
					<div class="p-4 rounded-lg border transition-colors {result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
						<div class="flex items-center gap-3 mb-2">
							<button
								onclick={() => playAudio(result.question.audio_url)}
								class="p-2 rounded-full hover:bg-gray-100 transition-colors"
							>
								{#if nowPlaying === result.question.audio_url}
									<Pause class="h-5 w-5 text-blue-600" />
								{:else}
									<Volume2 class="h-5 w-5 text-gray-600" />
								{/if}
							</button>
							<span class="font-medium">Question {index + 1}</span>
							<span class:italic={!result.isCorrect}>
								{#if result.isCorrect}
									<span class="text-green-600">✓ Correct</span>
								{:else}
									<span class="text-red-600">✗ Incorrect</span>
								{/if}
							</span>
						</div>

						{#if !result.isCorrect}
							<div class="ml-11 space-y-2">
								<p class="text-sm">
									<span class="font-medium">Your answer:</span>
									<span class="text-red-700">{result.selectedAnswer || 'No answer'}</span>
								</p>
								<p class="text-sm">
									<span class="font-medium">Correct answer:</span>
									<span class="text-green-700">{result.question.correct}</span>
								</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</Card.Content>
		<Card.Footer>
			<Button onclick={restartQuiz} class="w-full">
				<RotateCcw class="mr-2 h-5 w-5" />
				Try Again
			</Button>
		</Card.Footer>
	</Card.Root>
</div>