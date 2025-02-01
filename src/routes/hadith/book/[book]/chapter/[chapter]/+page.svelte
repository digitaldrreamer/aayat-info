<script lang="ts">
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import LoadHadithOnView from '$lib/components/quran/load-hadith-on-view.svelte'
	import { page } from '$app/state'



	let { data } = $props()
	const { bookTitle, sectionTitle } = data
</script>

<div class="min-h-screen bg-neutral-50 p-8">
	<div class="max-w-4xl mx-auto">
		<header class="mb-8">
			<a href={`/hadith/book/${page.params.book}`} class="block text-3xl font-bold mb-2 text-neutral-900">{bookTitle}</a>
			<a href={`/hadith/book/${page.params.book}/chapter/${page.params.chapter}`} class="block text-xl font-semibold text-neutral-700">{sectionTitle}</a>
		</header>

		<ScrollArea class="h-[calc(100vh-12rem)]">
			<div class="space-y-8">
				{#each data.numbers as hadith}
					<LoadHadithOnView number={hadith} {bookTitle} {sectionTitle} />
				{/each}
			</div>
		</ScrollArea>
	</div>
</div>
