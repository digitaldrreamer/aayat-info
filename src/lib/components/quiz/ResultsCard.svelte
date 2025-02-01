<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Save, RotateCcw } from "lucide-svelte";
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';

	let { score, totalQuestions } = $props();
	let html2pdf;


	const percentage = $derived(Math.round((score / totalQuestions) * 100));

	function saveResults() {
		// Implement save functionality
		console.log("Saving results");
	}

	function restartQuiz() {
		goto('/quran/quiz')
	}
</script>

<div class="w-full max-w-md" transition:fade>
<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl font-bold text-center">Quiz Results</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-4">
		<div class="flex justify-center">
		</div>
		<p class="text-center text-xl">
			You scored {score} out of {totalQuestions}
		</p>
		<p class="text-center">
			{#if percentage >= 80}
				Excellent job! You're a Quran expert!
			{:else if percentage >= 60}
				Good effort! Keep studying to improve.
			{:else}
				Keep practicing! You'll improve with more study.
			{/if}
		</p>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button variant="outline" class="w-full" onclick={restartQuiz}>
			<RotateCcw class="mr-2 h-5 w-5" />
			Try Again
		</Button>
	</Card.Footer>
</Card.Root>
</div>
