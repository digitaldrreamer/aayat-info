<script lang="ts">
	import { Play, Pause, SkipForward, SkipBack, Square } from "lucide-svelte";
	import { Button } from "$lib/components/ui/button";
	import { onDestroy } from "svelte";

	let { audioUrls } = $props<{ audioUrls: string[] }>();

	let currentIndex = $state(0);
	let audio = $state<Audio | null>(null);
	let audioState = $state<'off' | 'paused' | 'playing' | 'loading'>('off');

	function loadAudio(index: number) {
		if (index < 0 || index >= audioUrls.length) return;
		if (audio) audio.pause();
		audio = new Audio(audioUrls[index]);
		audio.onwaiting = () => (audioState = "loading");
		audio.oncanplay = () => (audioState = "playing");
		audio.onended = () => nextAudio();
		audio.onerror = () => (audioState = "off");
		currentIndex = index;
	}

	function playAudio() {
		if (!audio) loadAudio(currentIndex);
		audio?.play().then(() => (audioState = "playing"));
	}

	function pauseAudio() {
		audio?.pause();
		audioState = "paused";
	}

	function nextAudio() {
		if (currentIndex < audioUrls.length - 1) {
			loadAudio(currentIndex + 1);
			playAudio();
		}
	}

	function prevAudio() {
		if (currentIndex > 0) {
			loadAudio(currentIndex - 1);
			playAudio();
		}
	}

	function cancelAudio() {
		if (audio) {
			audio.pause();
			audio = null;
		}
		audioState = "off";
		currentIndex = 0;
	}

	onDestroy(() => cancelAudio());
</script>

<div class="flex gap-2 w-full mx-auto items-center justify-center">
	<Button onclick={prevAudio} aria-label="Previous"><SkipBack /></Button>
	{#if ['paused', 'off'].includes(audioState)}
		<Button onclick={playAudio} aria-label="Play"><Play /></Button>
	{:else if audioState === "playing"}
		<Button onclick={pauseAudio} aria-label="Pause"><Pause /></Button>
	{/if}
	<Button onclick={nextAudio} aria-label="Next"><SkipForward /></Button>
	<Button onclick={cancelAudio} aria-label="Cancel" variant="destructive"><Square /></Button>
</div>
