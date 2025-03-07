<script lang="ts">
	import { fade } from 'svelte/transition';
	import CustomSlider from './custom-slider.svelte';
	import { Button } from "$lib/components/ui/button";
	import { Music, Mic, Presentation, List } from 'lucide-svelte';
	import LyricsDisplay from './lyrics-display.svelte';

	export type Mode = 'normal' | 'lyrics' | 'slideshow';
	export type Lyric = { time: number; text: string };
	export type TrackInfo = { title: string; artist: string; albumArt: string };
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
    currentMode: Mode,
    trackInfo: TrackInfo,
    lyrics: Lyric[],
    currentTime: number,
    subtitles: SubtitleLine[],
    quranText: string[],
    progress: number,
    duration: number,
    seek: (time: number) => void,
    handleSeek: (progress: number) => void,
    changeMode: (mode: Mode) => void,
    toggleQueue: () => void
  }} */
	export let currentMode;
	export let trackInfo;
	export let lyrics = [];
	export let currentTime = 0;
	export let subtitles = [];
	export let quranText = [];
	export let progress = 0;
	export let duration = 0;
	export let seek;
	export let handleSeek;
	export let changeMode;
	export let toggleQueue;

	$: currentLyricIndex = lyrics.findIndex((lyric, index, arr) =>
		currentTime >= lyric.time && (index === arr.length - 1 || currentTime < arr[index + 1].time)
	);

	// Parse subtitle segments for the LyricsDisplay component
	$: parsedSubtitles = subtitles.map(line => ({
		...line,
		segments: line.segments.map(seg => ({
			word_start_index: seg[0],
			word_end_index: seg[1],
			start_msec: seg[2],
			end_msec: seg[3]
		}))
	}));

	// Format time for display
	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<div class="flex-grow overflow-hidden flex flex-col" in:fade={{ duration: 200 }}>
	<div class="flex-grow overflow-y-auto">
		{#if currentMode === 'normal'}
			<div class="h-full flex flex-col items-center justify-center p-8">
				<img
					src={trackInfo.albumArt || "/placeholder.svg"}
					alt="Album Art"
					class="w-64 h-64 rounded-lg shadow-lg mb-8 object-cover"
				/>
				<h2 class="text-2xl font-bold mb-2">{trackInfo.title}</h2>
				<p class="text-lg text-gray-600">{trackInfo.artist}</p>
			</div>
		{:else if currentMode === 'lyrics'}
			<LyricsDisplay subtitles={parsedSubtitles} currentTime={currentTime * 1000} quranText={quranText} />
		{:else if currentMode === 'slideshow'}
			<div class="h-full relative">
				<div
					class="absolute inset-0 bg-cover bg-center"
					style="background-image: url('{trackInfo.albumArt}');"
				></div>
				<div class="absolute inset-0 flex items-center justify-center bg-black/50">
					{#if currentLyricIndex >= 0}
						<p class="text-white text-4xl font-bold text-center px-8" in:fade={{ duration: 500 }}>
							{lyrics[currentLyricIndex]?.text}
						</p>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<div class="flex-shrink-0 px-4 pt-2 pb-4 flex justify-between items-center">
		<Button variant={currentMode === 'normal' ? "default" : "ghost"} size="sm" onclick={() => changeMode('normal')}>
			<Music class="h-4 w-4 mr-2" />
			Normal
		</Button>
		<Button variant={currentMode === 'lyrics' ? "default" : "ghost"} size="sm" onclick={() => changeMode('lyrics')}>
			<Mic class="h-4 w-4 mr-2" />
			Lyrics
		</Button>
		<Button variant={currentMode === 'slideshow' ? "default" : "ghost"} size="sm" onclick={() => changeMode('slideshow')}>
			<Presentation class="h-4 w-4 mr-2" />
			Slideshow
		</Button>
		<Button variant="ghost" size="sm" onclick={toggleQueue}>
			<List class="h-4 w-4 mr-2" />
			Queue
		</Button>
	</div>
</div>