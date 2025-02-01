<script lang="ts">
	interface SurahInfo {
		chapter: number;
		name: {
			ar: string;
			en: string;
		};
		revelation: "Mecca" | "Madina";
		versesCount: number;
	}

	let { info } = $props<{ info: SurahInfo }>()
</script>

<div class="min-h-full flex items-center justify-center p-6 bg-background">
	<div class="text-center space-y-8">
		<!-- Surah Number -->
		<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 ring-1 ring-primary/10">
			<span class="text-2xl font-secondary font-bold">{info.chapter}</span>
		</div>

		<!-- Surah Name -->
		<div class="space-y-4">
			<h1 class="text-4xl font-ar-primary leading-normal" lang="ar" dir="rtl">
				{info.name.ar}
			</h1>
			<h2 class="text-2xl font-secondary font-semibold tracking-tight">
				{info.name.en}
			</h2>
		</div>

		<!-- Surah Info -->
		<div class="flex items-center justify-center gap-4 text-sm text-muted-foreground">
			<span>{info.revelation}</span>
			<span>•</span>
			<span>{info.versesCount} Verses</span>
		</div>
	</div>
</div>

