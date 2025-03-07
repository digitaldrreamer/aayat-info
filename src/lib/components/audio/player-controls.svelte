<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Play, Pause, Rewind, FastForward, SkipBack, SkipForward } from 'lucide-svelte';

	/** @type {{
    isPlaying: boolean,
    togglePlay: () => void,
    skip: (seconds: number) => void,
    miniPlayer?: boolean
  }} */
	export let isPlaying;
	export let togglePlay;
	export let skip;
	export let miniPlayer = false;
</script>

<div class="flex items-center space-x-1 {miniPlayer ? '' : 'justify-center w-full'}">
	{#if !miniPlayer}
		<Button variant="ghost" size="icon" onclick={() => skip(-30)}>
			<SkipBack class="h-4 w-4" />
		</Button>
	{/if}

	<Button variant="ghost" size="icon" onclick={() => skip(-15)}>
		<Rewind class="h-4 w-4" />
	</Button>

	<Button
		variant={miniPlayer ? "ghost" : "default"}
		size="icon"
		class={miniPlayer ? "" : "h-12 w-12"}
		onclick={togglePlay}
	>
		{#if isPlaying}
			<Pause class={miniPlayer ? "h-5 w-5" : "h-6 w-6"} />
		{:else}
			<Play class={miniPlayer ? "h-5 w-5" : "h-6 w-6"} />
		{/if}
	</Button>

	<Button variant="ghost" size="icon" onclick={() => skip(15)}>
		<FastForward class="h-4 w-4" />
	</Button>

	{#if !miniPlayer}
		<Button variant="ghost" size="icon" onclick={() => skip(30)}>
			<SkipForward class="h-4 w-4" />
		</Button>
	{/if}
</div>