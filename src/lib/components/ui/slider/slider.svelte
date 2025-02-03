<script>
	import { Slider as SliderPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let { ref = $bindable(null), class: className, value = $bindable(), ...restProps } = $props();

	export { className as class };
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<SliderPrimitive.Root
	bind:ref
	bind:value
	class={cn("relative flex w-full touch-none select-none items-center", className)}
	{...restProps}
>
	{#snippet children({ thumbs })}
		<span class="bg-primary/20 relative h-1.5 w-full grow overflow-hidden rounded-full">
			<SliderPrimitive.Range class="bg-primary absolute h-full" />
		</span>
		{#each thumbs as thumb}
			<SliderPrimitive.Thumb
				index={thumb}
				class="border-primary/50 bg-background focus-visible:ring-ring block size-4 rounded-full border shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
			/>
		{/each}
	{/snippet}
</SliderPrimitive.Root>
