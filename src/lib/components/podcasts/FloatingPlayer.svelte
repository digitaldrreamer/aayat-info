<script lang="ts">
	import { Button } from "$lib/components/ui/button/index";
	import { Slider } from "$lib/components/ui/slider/index";
	import { Play, Pause, Rewind, FastForward, Download, Info } from "lucide-svelte";

	let { episode, onprevious, onnext, ondownload, oninfo } = $props()

	let audio = $state(null);
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);

	const formattedCurrentTime = $derived(formatTime(currentTime));
	const formattedDuration = $derived(formatTime(duration));

	function setMediaSessionMetadata() {
		if ('mediaSession' in navigator && episode) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: episode.title,
				artist: "Mufti Menk",
				artwork: [
					{
						src: "https://artwork.muslimcentral.com/mufti-menk-150x150.jpg",
						sizes: "150x150",
						type: "image/jpeg"
					}
				]
			});

			// Set up media session action handlers
			navigator.mediaSession.setActionHandler('play', () => {
				if (audio) {
					audio.play();
					isPlaying = true;
				}
			});

			navigator.mediaSession.setActionHandler('pause', () => {
				if (audio) {
					audio.pause();
					isPlaying = false;
				}
			});

			navigator.mediaSession.setActionHandler('previoustrack', () => {
				if (onprevious) onprevious();
			});

			navigator.mediaSession.setActionHandler('nexttrack', () => {
				if (onnext) onnext();
			});

			navigator.mediaSession.setActionHandler('seekbackward', () => {
				skipBackward();
			});

			navigator.mediaSession.setActionHandler('seekforward', () => {
				skipForward();
			});
		}
	}

	function togglePlay() {
		if (!audio) return;

		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
		isPlaying = !isPlaying;
	}

	function skipBackward() {
		if (!audio) return;
		audio.currentTime = Math.max(0, audio.currentTime - 15);
	}

	function skipForward() {
		if (!audio) return;
		audio.currentTime = Math.min(duration, audio.currentTime + 15);
	}

	function handleTimeUpdate() {
		if (audio) {
			currentTime = audio.currentTime;
			// Update media session position state
			if ('setPositionState' in navigator.mediaSession) {
				navigator.mediaSession.setPositionState({
					duration: duration,
					playbackRate: audio.playbackRate,
					position: currentTime
				});
			}
		}
	}

	function handleLoadedMetadata() {
		if (audio) {
			duration = audio.duration;
			// Set metadata when audio is loaded
			setMediaSessionMetadata();
			// Automatically start playing when new episode loads
			audio.play();
			isPlaying = true;
		}
	}

	function handleEnded() {
		// Call the next episode function when the current episode ends
		if (onnext) {
			onnext();
		}
	}

	function formatTime(seconds: number) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	// Effect to handle episode changes
	$effect(() => {
		if (audio && episode) {
			try {
				audio.src = episode.url;
				audio.load();
				// Update metadata when episode changes
				setMediaSessionMetadata();
			} catch (error) {
				console.error('Error loading audio:', error);
				isPlaying = false;
			}
		}
	});
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
					max={duration || 0}
					step={1}
					class="flex-grow"
				/>
				<span class="text-sm">{formattedDuration}</span>
			</div>
		</div>
		<div class="flex items-center space-x-2 mt-2 sm:mt-0">
			<Button variant="ghost" size="icon" onclick={skipBackward} class="sm:inline-flex">
				<Rewind class="h-4 w-4" />
			</Button>
			<Button variant="ghost" size="icon" onclick={togglePlay}>
				{#if isPlaying}
					<Pause class="h-4 w-4" />
				{:else}
					<Play class="h-4 w-4" />
				{/if}
			</Button>
			<Button variant="ghost" size="icon" onclick={skipForward} class="sm:inline-flex">
				<FastForward class="h-4 w-4" />
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
		onended={handleEnded}
	></audio>
</div>