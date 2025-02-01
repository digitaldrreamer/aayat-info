<script lang="ts">
	import { Button } from "$lib/components/ui/button/index";
	import * as Card from "$lib/components/ui/card/index";
	import { PlayCircle } from "lucide-svelte";
	import { goto } from '$app/navigation';

	function startQuiz() {
		// Implement navigation to QuizPage
		goto('/quran/quiz/start')
	}
</script>

<div class="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title class="text-2xl font-bold text-center">Quran Quiz Challenge</Card.Title>
			<Card.Description class="text-center">Test your knowledge of the Quran</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<p class="text-center">Are you ready to challenge yourself with questions about the Quran?</p>
			<ul class="list-disc list-inside">
				<li>10 questions</li>
				<li>Multiple choice answers</li>
				<li>Audio clips from the Quran</li>
				<li>Track your progress</li>
			</ul>
		</Card.Content>
		<Card.Footer class="flex justify-center">
			<Button onclick={startQuiz} class="w-full">
				<PlayCircle class="mr-2 h-5 w-5" />
				Start Quiz
			</Button>
		</Card.Footer>
	</Card.Root>
</div>