<script lang="ts">
	import * as Select from "$lib/components/ui/select";

	let defaultReciter = "Mishary Rashid Alafasy";
	const reciters = [
		"Mishary Rashid Alafasy",
		"Abdul Rahman Al-Sudais",
		"Saud Al-Shuraim",
		"Saad Al-Ghamdi",
		// Add more reciters
	];

	function handleReciterChange(event: CustomEvent) {
		defaultReciter = event.detail;
		// Save to local storage or send to backend
	}
</script>

<div class="space-y-4">
	<h2 class="text-2xl font-semibold">Default Reciter Settings</h2>
	<Select.Root onchange={handleReciterChange} value={defaultReciter ?? 'Select a reciter'}>
		<Select.Trigger class="w-full">
		</Select.Trigger>
		<Select.Content>
			{#each reciters as reciter}
				<Select.Item value={reciter}>{reciter}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>