<script>
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let { class: className, level = 3, ref = $bindable(null), ...restProps } = $props();
</script>

<AlertDialogPrimitive.Title
	bind:ref
	class={cn("text-lg font-semibold", className)}
	{level}
	{...restProps}
/>
