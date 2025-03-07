<script lang="ts">
	import { slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// This could be passed as a prop in a real implementation
	export let queueItems = [
		{ title: "Surah Al-Fatiha", artist: "Mishary Rashid Alafasy", active: true },
		{ title: "Surah Al-Baqarah (1-5)", artist: "Mishary Rashid Alafasy" },
		{ title: "Surah Al-Ikhlas", artist: "Mishary Rashid Alafasy" },
	];

	function selectTrack(index: number) {
		dispatch('select', index);
	}
</script>

<div class="absolute right-0 top-20 bottom-0 w-64 bg-white/90 backdrop-blur-sm shadow-lg p-4 overflow-y-auto z-10">
	<h3 class="font-bold mb-4">Queue</h3>

	{#if queueItems.length === 0}
		<p class="text-sm text-gray-500">Queue is empty</p>
	{:else}
		<ul class="space-y-2">
			{#each queueItems as item, index}
				<li
					class="py-2 px-3 rounded-lg transition-colors duration-200 cursor-pointer {item.active ? 'bg-primary/10' : 'hover:bg-gray-100'}"
				onclick={() => selectTrack(index)}
				>
					<p class="font-semibold truncate text-sm">{item.title}</p>
					<p class="text-sm text-gray-500 truncate">{item.artist}</p>
				</li>
				{/each}
		</ul>
			{/if}
</div>