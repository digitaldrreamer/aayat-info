<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card } from "$lib/components/ui/card";
	import { Trash2 } from 'lucide-svelte';

	let bookmarks = [
		{ type: "Quran", surah: "Al-Fatiha", ayah: 1 },
		{ type: "Hadith", book: "Sahih Muslim", number: 1 },
		// Add more bookmarks
	];

	function deleteBookmark(index: number) {
		bookmarks = bookmarks.filter((_, i) => i !== index);
		// Update bookmarks in local storage or backend
	}

	function clearAllBookmarks() {
		bookmarks = [];
		// Clear all bookmarks from local storage or backend
	}
</script>

<Card>
	<div class="p-6 space-y-4">
		<h2 class="text-2xl font-semibold">Bookmarks</h2>
		<div class="space-y-2 max-h-64 overflow-y-auto">
			{#each bookmarks as bookmark, index}
				<div class="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow">
					<span class="font-medium">{bookmark.type}: {bookmark.type === "Quran" ? `Surah ${bookmark.surah}, Ayah ${bookmark.ayah}` : `${bookmark.book} #${bookmark.number}`}</span>
					<Button variant="ghost" size="sm" onclick={() => deleteBookmark(index)}>
						<Trash2 class="h-4 w-4" />
					</Button>
				</div>
			{/each}
		</div>
		<Button variant="destructive" onclick={clearAllBookmarks} class="w-full">Clear All Bookmarks</Button>
	</div>
</Card>