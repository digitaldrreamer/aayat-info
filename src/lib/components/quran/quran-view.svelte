<script lang="ts">
	import { cn } from "$lib/utils"

	interface PageProps {
		pageNumber: number;
		content: string;
		translation?: string;
		className?: string;
	}

	let { pageNumber, content, translation, className = "" } = $props<PageProps>()
</script>

<div class={cn("relative p-6 bg-background", className)}>
	<!-- Page Number -->
	<div class="absolute top-2 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">
		{pageNumber}
	</div>

	<!-- Main Content -->
	<div class="space-y-6 pt-6">
		<p class="text-2xl font-ar-primary leading-loose text-right" lang="ar" dir="rtl">
			{content}
		</p>
		{#if translation}
			<p class="text-sm text-muted-foreground">
				{translation}
			</p>
		{/if}
	</div>
</div>

