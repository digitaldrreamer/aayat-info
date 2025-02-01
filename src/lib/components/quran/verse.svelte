<script lang="ts">
	import * as Sheet from "$lib/components/ui/sheet/index.js";
	import { Button } from "$lib/components/ui/button";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import { Play, Pause, Copy, Share2, Loader } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { onDestroy } from 'svelte';
	import convertToArabic from 'num-to-arabic';

	interface VerseProps {
		chapter: number;
		verse: number;
		text: string;
		translation: string;
		audioUrl: string;
		tafsir: string;
	}

	let { highlighted = false, chapter, verse, text, translation, audioUrl, tafsir } = $props<VerseProps>();
	let audio = $state<Audio | null>(null);
	/**
	 * @type {'off' | 'paused' | 'playing' | 'loading'}
	 */
	let audioState = $state<'off' | 'paused' | 'playing' | 'loading'>('off');
	let open = $state(false);

	function copyText(text: string) {
		navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard");
	}

	function shareVerse() {
		if (navigator.share) {
			navigator.share({
				title: `Verse ${chapter}:${verse}`,
				text: `${text}\n\n${translation}`,
				url: window.location.href
			});
		} else {
			copyText(`${text}\n\n${translation}`);
		}
	}

	function playAudio() {
		if (!audio) {
			audio = new Audio(audioUrl);

			// Handle loading and playback states
			audio.onwaiting = () => audioState = 'loading'; // Buffering
			audio.oncanplay = () => audioState = 'playing'; // Ready to play
			audio.onended = () => audioState = 'off'; // Auto-stop when finished
			audio.onerror = (e) => {
				audioState = 'off'
				toast.error(e?.message)
			}; // Handle errors
		}

		audio.play()
			.then(() => {
				audioState = 'playing';
			})
			.catch(console.error);
	}

	function pauseAudio() {
		if (audio) {
			audio.pause();
			audioState = 'paused';
		}
	}

	function destroyAudio() {
		if (audio) {
			audio.pause();
			audio = null;
		}
		audioState = 'off';
	}

	onDestroy(() => {
		destroyAudio();
	});

	$inspect(audioState)
</script>

<span
	id={`verse:${verse}`}
	onclick={() => open = !open}
	class="inline cursor-pointer {highlighted ? 'bg-yellow-200 underline decoration-yellow-400' : ''} text-[16px] sm:text-[20px] md:text-[22px] lg:text-[28px] font-ar-primary leading-[2.5] hover:text-primary/80"
	lang="ar"
	dir="rtl"
>
	{text} ﴿{convertToArabic(verse)}﴾
</span>

<Sheet.Root bind:open>
	<Sheet.Overlay class="fixed inset-0 bg-black/40" />
	<Sheet.Content class="fixed bottom-0 left-0 right-0 mt-24 flex h-[85vh] flex-col rounded-t-lg bg-background">
		<div class="flex items-center justify-between border-b px-4 py-3">
			<span class="text-sm font-medium">Verse {chapter}:{verse}</span>
			<div class="flex gap-2">
				<Button variant="ghost" size="icon" onclick={() => copyText(text)} aria-label="Copy Arabic text">
					<Copy class="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="icon" onclick={shareVerse} aria-label="Share verse">
					<Share2 class="h-4 w-4" />
				</Button>

				<!-- Audio Controls -->
				{#if ['paused', 'off'].includes(audioState)}
					<Button variant="ghost" size="icon" onclick={playAudio} aria-label="Play audio">
						<Play class="h-4 w-4" />
					</Button>
				{:else if audioState === "loading"}
					<Button variant="ghost" size="icon" disabled aria-label="Loading audio">
						<Loader class="h-4 w-4 animate-spin" />
					</Button>
				{:else if audioState === "playing"}
					<Button variant="ghost" size="icon" onclick={pauseAudio} aria-label="Pause audio">
						<Pause class="h-4 w-4" />
					</Button>
				{/if}
			</div>
		</div>

		<ScrollArea class="flex-1 p-4">
			<div class="space-y-6">
				<div class="space-y-4">
					<p
						class="text-2xl font-ar-primary leading-relaxed text-right cursor-pointer"
						lang="ar"
						dir="rtl"
						onclick={() => copyText(text)}
					>
						{text}
					</p>
					<p class="text-lg cursor-pointer" onclick={() => copyText(translation)}>
						{translation}
					</p>
				</div>

				<div class="space-y-2">
					<h3 class="font-semibold">Tafsir</h3>
					<div class="text-sm text-muted-foreground whitespace-pre-line">
						{tafsir}
					</div>
				</div>
			</div>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
