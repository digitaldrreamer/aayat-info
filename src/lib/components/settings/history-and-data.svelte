<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";

	let history = [
		{ type: "Quran", surah: "Al-Baqarah", ayah: 255, timestamp: "2023-06-01T12:00:00Z" },
		{ type: "Hadith", book: "Sahih Bukhari", number: 1, timestamp: "2023-06-02T14:30:00Z" },
		// Add more history items
	];

	function clearHistory() {
		history = [];
		// Clear history from local storage or backend
	}

	function exportData() {
		// Implement data export functionality
		console.log("Exporting data...");
	}
</script>

<Card.Root>
	<div class="p-6 space-y-4">
		<h2 class="text-2xl font-semibold">History and Data</h2>
		<div class="space-y-2 max-h-64 overflow-y-auto">
			{#each history as item}
				<div class="p-3 bg-gray-100 rounded-lg shadow">
					<p class="font-semibold">{item.type}: {item.type === "Quran" ? `Surah ${item.surah}, Ayah ${item.ayah}` : `${item.book} #${item.number}`}</p>
					<p class="text-sm text-gray-600">{new Date(item.timestamp).toLocaleString()}</p>
				</div>
			{/each}
		</div>
		<div class="flex space-x-2">
			<Button onclick={clearHistory} variant="destructive">Clear History</Button>
			<Button onclick={exportData}>Export Data</Button>
		</div>
	</div>
</Card.Root>