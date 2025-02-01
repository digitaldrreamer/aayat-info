<script>
	import ArrowLeft from "lucide-svelte/icons/arrow-left";
	import { getEmblaContext } from "./context.js";
	import { cn } from "$lib/utils.js";
	import { Button } from "$lib/components/ui/button/index.js";

	let {
		ref = $bindable(null),
		class: className,
		variant = "outline",
		size = "icon",
		...restProps
	} = $props();

	const emblaCtx = getEmblaContext("<Carousel.Previous/>");
</script>

<Button
	{variant}
	{size}
	class={cn(
		"absolute size-8 touch-manipulation rounded-full",
		emblaCtx.orientation === "horizontal"
			? "-left-12 top-1/2 -translate-y-1/2"
			: "-top-12 left-1/2 -translate-x-1/2 rotate-90",
		className
	)}
	disabled={!emblaCtx.canScrollPrev}
	on:click={emblaCtx.scrollPrev}
	on:keydown={emblaCtx.handleKeyDown}
	{...restProps}
	bind:ref
>
	<ArrowLeft />
	<span class="sr-only">Previous slide</span>
</Button>
