<script>
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let { ref = $bindable(null), class: className, ...restProps } = $props();
</script>

<MenubarPrimitive.Root
	bind:ref
	class={cn(
		"bg-background flex h-9 items-center space-x-1 rounded-md border p-1 shadow-sm",
		className
	)}
	{...restProps}
/>
