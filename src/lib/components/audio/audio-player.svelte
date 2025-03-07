<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import PlayerControls from './player-controls.svelte';
	import ExpandedView from './expanded-view.svelte';
	import Queue from './queue.svelte';
	import { Button } from "$lib/components/ui/button";
	import { Expand, Minimize, Settings } from 'lucide-svelte';
	import CustomSlider from './custom-slider.svelte';
	import { createAudioStore } from '$lib/stores/audio-store';

	export type TrackInfo = {
		title: string;
		artist: string;
		albumArt: string;
	};

	export type Lyric = {
		time: number;
		text: string;
	};

	export type Mode = 'normal' | 'lyrics' | 'slideshow';

	export type SubtitleSegment = [number, number, number, number];

	export type SubtitleLine = {
		surah: number;
		ayah: number;
		segments: SubtitleSegment[];
		stats: {
			insertions: number;
			deletions: number;
			transpositions: number;
		};
	};

	/** @type {{
    audioSrc: string,
    trackInfo: TrackInfo,
    lyrics: Lyric[],
    subtitles?: SubtitleLine[],
    quranText?: string[]
  }} */
	export let audioSrc;
	export let trackInfo;
	export let lyrics = [
		{ time: 60, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
		{ time: 5980, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
		{ time: 1310, text: "الرَّحْمَٰنِ الرَّحِيمِ" },
		{ time: 12000, text: "مَالِكِ يَوْمِ الدِّينِ" }
	];
	export let subtitles = [
		{
			"ayah": 1,
			"segments": [
				[
					0,
					1,
					60,
					610
				],
				[
					1,
					2,
					620,
					1310
				],
				[
					2,
					3,
					1320,
					2450
				],
				[
					3,
					4,
					2460,
					5970
				]
			],
			"surah": 1,
			"stats": {
				"deletions": 0,
				"transpositions": 0,
				"insertions": 0
			}
		},
		{
			"ayah": 2,
			"segments": [
				[
					0,
					1,
					80,
					960
				],
				[
					1,
					2,
					970,
					1800
				],
				[
					2,
					3,
					1810,
					2460
				],
				[
					3,
					4,
					2470,
					5140
				]
			],
			"surah": 1,
			"stats": {
				"deletions": 0,
				"transpositions": 0,
				"insertions": 0
			}
		},
		{
			"ayah": 3,
			"segments": [
				[
					0,
					1,
					40,
					1230
				],
				[
					1,
					2,
					1240,
					4160
				]
			],
			"surah": 1,
			"stats": {
				"deletions": 0,
				"transpositions": 0,
				"insertions": 0
			}
		},
		{
			"ayah": 4,
			"segments": [
				[
					0,
					1,
					60,
					840
				],
				[
					1,
					2,
					850,
					1400
				],
				[
					2,
					3,
					1410,
					4280
				]
			],
			"surah": 1,
			"stats": {
				"deletions": 0,
				"transpositions": 0,
				"insertions": 0
			}
		},
		{
			"ayah": 5,
			"segments": [
				[
					0,
					1,
					30,
					970
				],
				[
					1,
					2,
					980,
					1710
				],
				[
					2,
					3,
					1720,
					2870
				],
				[
					3,
					4,
					2880,
					6290
				]
			],
			"surah": 1,
			"stats": {
				"deletions": 0,
				"transpositions": 0,
				"insertions": 0
			}
		},
		{
			"ayah": 6,
			"segments": [
				[
					0,
					1,
					30,
					670
				],
				[
					1,
					2,
					680,
					1630
				],
				[
					2,
					3,
					1640,
					5120
				]
			],
			"surah": 1,
			"stats": {
				"deletions": 0,
				"transpositions": 0,
				"insertions": 0
			}
		},
		{
			"ayah": 7,
			"segments": [
				[
					0,
					1,
					30,
					740
				],
				[
					1,
					2,
					750,
					1700
				],
				[
					2,
					3,
					1710,
					2620
				],
				[
					3,
					4,
					2630,
					3590
				],
				[
					4,
					5,
					3600,
					4210
				],
				[
					5,
					6,
					4220,
					5290
				],
				[
					6,
					7,
					5300,
					6320
				],
				[
					7,
					8,
					6330,
					6630
				],
				[
					8,
					9,
					6640,
					12320
				]
			],
			"surah": 1,
			"stats": {
				"deletions": 0,
				"transpositions": 0,
				"insertions": 0
			}
		}
	];
	export let quranText = [
		"بِسْمِ", "اللَّهِ", "الرَّحْمَٰنِ", "الرَّحِيمِ"
	];
	export let initialMode: Mode = 'normal';

	// Create audio store
	const audioStore = createAudioStore();
	const {
		audio,
		isPlaying,
		currentTime,
		duration,
		playbackRate,
		volume,
		togglePlay,
		setSource,
		seek,
		skip,
		setPlaybackRate,
		setVolume
	} = audioStore;

	// UI state
	let isExpanded = false;
	let currentMode: Mode = initialMode;
	let showQueue = false;
	let showSettings = false;

	// Derived values
	$: progress = $duration > 0 ? ($currentTime / $duration) * 100 : 0;

	function handleSeek(newProgress: number) {
		seek((newProgress / 100) * $duration);
	}

	function toggleExpand() {
		isExpanded = !isExpanded;
	}

	function changeMode(mode: Mode) {
		currentMode = mode;
	}

	function toggleQueue() {
		showQueue = !showQueue;
		if (showQueue) showSettings = false;
	}

	function toggleSettings() {
		showSettings = !showSettings;
		if (showSettings) showQueue = false;
	}

	// Format time helper
	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	// Set audio source when component mounts
	onMount(() => {
		setSource(audioSrc);
	});

	// Clean up when component is destroyed
	onDestroy(() => {
		$audio?.pause();
	});
</script>

<div class={`fixed transition-all duration-300 ease-in-out
            overflow-hidden bg-white/80 backdrop-blur-lg shadow-lg
            ${isExpanded ? 'inset-0 rounded-none' : 'bottom-0 h-20 left-0 right-0 md:left-1/2 md:right-auto md:w-[32rem] md:-translate-x-1/2 md:bottom-4 md:rounded-xl'}`}>

	<div class="h-full flex flex-col">
		<!-- Mini player (always visible) -->
		<div class="flex-shrink-0 h-20 px-4 flex items-center justify-between relative">
			<!-- Album art and track info -->
			<div class="flex items-center flex-1 min-w-0 pr-2">
				<img
					src={trackInfo.albumArt || "/placeholder.svg"}
					alt="Album Art"
					class="w-12 h-12 rounded-md mr-3 object-cover"
				/>
				<div class="min-w-0">
					<p class="font-semibold text-sm truncate">{trackInfo.title}</p>
					<p class="text-xs text-gray-500 truncate">{trackInfo.artist}</p>
					{#if !isExpanded}
						<div class="w-full mt-1 max-w-[120px]">
							<CustomSlider value={progress} max={100} onchange={handleSeek} />
						</div>
					{/if}
				</div>
			</div>

			<!-- Controls -->
			<div class="flex items-center space-x-1">
				{#if !isExpanded}
					<PlayerControls
						isPlaying={$isPlaying}
						{togglePlay}
						{skip}
						miniPlayer={true}
					/>
				{:else}
					<Button variant="ghost" size="icon" onclick={toggleSettings}>
						<Settings class="h-4 w-4" />
					</Button>
				{/if}
				<Button variant="ghost" size="icon" onclick={toggleExpand}>
					{#if isExpanded}
						<Minimize class="h-4 w-4" />
					{:else}
						<Expand class="h-4 w-4" />
					{/if}
				</Button>
			</div>
		</div>

		<!-- Expanded view -->
		{#if isExpanded}
			<div class="flex-grow flex flex-col overflow-hidden" transition:fade={{ duration: 150 }}>
				<ExpandedView
					currentMode={currentMode}
					{subtitles}
					{quranText}
					{trackInfo}
					{lyrics}
					currentTime={$currentTime}
					{progress}
					duration={$duration}
					{seek}
					{handleSeek}
					{changeMode}
					{toggleQueue}
				/>

				<div class="flex-shrink-0 p-4 border-t border-gray-100">
					<CustomSlider value={progress} max={100} onchange={handleSeek} />
					<div class="flex justify-between text-sm text-gray-500 mt-1">
						<span>{formatTime($currentTime)}</span>
						<span>{formatTime($duration)}</span>
					</div>

					<div class="flex items-center justify-between mt-4">
						<PlayerControls
							isPlaying={$isPlaying}
							{togglePlay}
							{skip}
							miniPlayer={false}
						/>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Queue sidebar -->
	{#if showQueue && isExpanded}
		<div transition:slide={{ axis: 'x', duration: 200 }}>
			<Queue />
		</div>
	{/if}

	<!-- Settings panel -->
	{#if showSettings && isExpanded}
		<div class="absolute right-0 top-20 w-64 bg-white/90 backdrop-blur-sm shadow-lg p-4 rounded-l-lg"
				 transition:slide={{ axis: 'x', duration: 200 }}>
			<h3 class="font-bold mb-4">Settings</h3>

			<div class="space-y-4">
				<div>
					<label class="text-sm font-medium mb-2 block">Playback Speed</label>
					<div class="flex items-center space-x-2">
						<span class="text-xs">{$playbackRate}x</span>
						<CustomSlider
							value={$playbackRate * 50}
							max={100}
							onchange={(val) => setPlaybackRate(val / 50)}
						/>
					</div>
				</div>

				<div>
					<label class="text-sm font-medium mb-2 block">Volume</label>
					<div class="flex items-center space-x-2">
						<span class="text-xs">{Math.round($volume * 100)}%</span>
						<CustomSlider
							value={$volume * 100}
							max={100}
							onchange={(val) => setVolume(val / 100)}
						/>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>