<script lang="ts">
	import { Button } from "$lib/components/ui/button/index";
	import { Slider } from "$lib/components/ui/slider/index";
	import { Play, Pause, SkipBack, SkipForward, Download, Info } from "lucide-svelte";

	let { episode, onprevious, onnext, ondownload, oninfo } = $props()


	let audio = $state();
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);

	const formattedCurrentTime = $derived(formatTime(currentTime));
	const formattedDuration = $derived(formatTime(duration));

	function togglePlay() {
		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
		isPlaying = !isPlaying;
	}

	function handleTimeUpdate() {
		currentTime = audio.currentTime;
	}

	function handleLoadedMetadata() {
		duration = audio.duration;
	}


	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	}
</script>

<div class="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-2 sm:p-4">
	<div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
		<img src="https://artwork.muslimcentral.com/mufti-menk-150x150.jpg" alt="Mufti Menk" class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg" />
		<div class="flex-grow w-full sm:w-auto">
			<h3 class="font-semibold truncate text-center sm:text-left">{episode.title}</h3>
			<div class="flex items-center space-x-2 mt-2">
				<span class="text-sm">{formattedCurrentTime}</span>
				<Slider
					value={[currentTime]}
					min={0}
					max={duration}
					step={1}
					class="flex-grow"
				/>
				<span class="text-sm">{formattedDuration}</span>
			</div>
		</div>
		<div class="flex items-center space-x-2 mt-2 sm:mt-0">
			<Button variant="ghost" size="icon" onclick={onprevious} class="hidden sm:inline-flex">
				<SkipBack class="h-4 w-4" />
			</Button>
			<Button variant="ghost" size="icon" onclick={togglePlay}>
				{#if isPlaying}
					<Pause class="h-4 w-4" />
				{:else}
					<Play class="h-4 w-4" />
				{/if}
			</Button>
			<Button variant="ghost" size="icon" onclick={onnext} class="hidden sm:inline-flex">
				<SkipForward class="h-4 w-4" />
			</Button>
			<Button variant="ghost" size="icon" onclick={ondownload}>
				<Download class="h-4 w-4" />
			</Button>
			<Button variant="ghost" size="icon" onclick={oninfo}>
				<Info class="h-4 w-4" />
			</Button>
		</div>
	</div>
	<audio
		bind:this={audio}
		src={episode.url}
		ontimeupdate={handleTimeUpdate}
		onloadedmetadata={handleLoadedMetadata}
	></audio>
</div>

