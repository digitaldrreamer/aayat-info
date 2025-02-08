<script lang="ts">
	import { Play, Pause, SkipForward, SkipBack, Square } from "lucide-svelte";
	import { Button } from "$lib/components/ui/button/index";
	import { onDestroy } from "svelte";

	let { audioUrls } = $props<{ audioUrls: string[] }>();

	let currentIndex = $state(0);
	let audio = $state<Audio | null>(null);
	let audioState = $state<'off' | 'paused' | 'playing' | 'loading'>('off');
	let preloadedAudios = $state<Map<number, Audio>>(new Map());
	const BATCH_SIZE = 5;

	// Function to preload a batch of audio files
	async function preloadBatch(startIndex: number) {
		const endIndex = Math.min(startIndex + BATCH_SIZE, audioUrls.length);

		// Clear old preloaded audios that we don't need anymore
		for (const [index, preloadedAudio] of preloadedAudios.entries()) {
			if (index < startIndex - BATCH_SIZE || index >= endIndex) {
				preloadedAudio.src = '';
				preloadedAudios.delete(index);
			}
		}

		// Preload new batch
		for (let i = startIndex; i < endIndex; i++) {
			if (!preloadedAudios.has(i)) {
				const newAudio = new Audio(audioUrls[i]);
				// Set preload attribute to auto to start loading immediately
				newAudio.preload = 'auto';
				preloadedAudios.set(i, newAudio);
			}
		}
	}

	function loadAudio(index: number) {
		if (index < 0 || index >= audioUrls.length) return;
		if (audio) audio.pause();

		// Use preloaded audio if available
		if (preloadedAudios.has(index)) {
			audio = preloadedAudios.get(index)!;
		} else {
			audio = new Audio(audioUrls[index]);
		}

		audio.onwaiting = () => (audioState = "loading");
		audio.oncanplay = () => (audioState = "playing");
		audio.onended = () => nextAudio();
		audio.onerror = () => (audioState = "off");
		currentIndex = index;

		// Preload next batch when loading current audio
		const nextBatchStart = Math.floor((index + BATCH_SIZE) / BATCH_SIZE) * BATCH_SIZE;
		preloadBatch(nextBatchStart);
	}

	function playAudio() {
		if (!audio) {
			loadAudio(currentIndex);
			// Preload first batch when starting playback
			preloadBatch(0);
		}
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
		// Clear all preloaded audios
		for (const preloadedAudio of preloadedAudios.values()) {
			preloadedAudio.src = '';
		}
		preloadedAudios.clear();
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
