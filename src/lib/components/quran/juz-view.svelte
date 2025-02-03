<script lang="ts">
	import { Button } from "$lib/components/ui/button/index"
	import { BookOpen, Brain, History } from "lucide-svelte"
	import AudioControlGroup from '$lib/components/quran/audio-control-group.svelte';
	import { goto } from '$app/navigation';

	interface JuzInfo {
		number: number;
		name: string;
		startVerse: {
			chapter: number;
			verse: number;
		};
		versesCount: number;
	}

	let { info, audioUrls = [], onRead = $bindable(() => {}), onMurajah = $bindable(() => {}), onHistory = $bindable(() => {}) } = $props<{
		info: JuzInfo,
		onRead?: () => void,
		onMurajah?: () => void,
		onHistory?: () => void
	}>()
</script>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center mx-auto">
	<div class="space-y-8 text-center">
		<div class="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 ring-1 ring-primary/10">
			<span class="text-3xl font-secondary font-bold">{info.number}</span>
		</div>

		<div class="space-y-4">
			<h1 class="text-5xl font-secondary font-semibold tracking-tight">
				{info.name}
			</h1>
			<h2 class="text-2xl text-muted-foreground">
				Starting from Surah {info.startVerse.chapter}, Verse {info.startVerse.verse}
			</h2>
		</div>

		<div class="flex items-center justify-center gap-4 text-sm text-muted-foreground">
			<span>{info.versesCount} Verses</span>
		</div>

		<div class="flex items-center justify-center gap-4">
			<Button variant="default" class="gap-2" onclick={onRead}>
				<BookOpen class="h-4 w-4" />
				Read
			</Button>
			<Button variant="outline" class="gap-2" onclick={() => goto('/quran/quiz')}>
				<Brain class="h-4 w-4" />
				Murajah Test
			</Button>
			<Button variant="ghost" class="gap-2" onclick={onHistory}>
				<History class="h-4 w-4" />
				History
			</Button>
		</div>
		<AudioControlGroup {audioUrls} />
	</div>
</div>

