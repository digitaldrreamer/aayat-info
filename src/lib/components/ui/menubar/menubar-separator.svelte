<script>
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let { ref = $bindable(null), class: className, ...restProps } = $props();
</script>

<MenubarPrimitive.Separator
	bind:ref
	class={cn("bg-muted -mx-1 my-1 h-px", className)}
	{...restProps}
/>
