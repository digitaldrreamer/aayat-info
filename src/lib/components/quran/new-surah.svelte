<script lang="ts">
	import * as Card from "$lib/components/ui/card/index"
	import { cn } from "$lib/utils"

	interface SurahDividerProps {
		chapter: number;
		name: {
			ar: string;
			en: string;
		};
		revelation: "Mecca" | "Madina";
		versesCount: number;
		className?: string;
	}

	let { chapter, name, revelation, versesCount, className } = $props<SurahDividerProps>()
</script>

<Card.Root class={cn("w-full border-t-2 mt-4 mb-2", className)}>
	<Card.Content class="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
		<div class="flex items-center gap-6">
			<div class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/5 ring-1 ring-primary/10">
				<span class="text-lg font-secondary font-semibold">{chapter}</span>
			</div>
			<div class="space-y-1 text-center sm:text-left">
				<h3 class="text-2xl font-ar-primary leading-normal" lang="ar" dir="rtl">
					{name.ar}
				</h3>
				<h4 class="text-lg font-secondary font-medium tracking-tight">
					{name.en}
				</h4>
			</div>
		</div>
		<div class="flex items-center gap-4 text-sm text-muted-foreground">
			<span>{revelation}</span>
			<span>•</span>
			<span>{versesCount} Verses</span>
		</div>
	</Card.Content>
</Card.Root>

