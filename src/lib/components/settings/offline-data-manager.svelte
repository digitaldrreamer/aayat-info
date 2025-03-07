<script lang="ts">
	import { Progress } from "$lib/components/ui/progress";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Music, FileText } from 'lucide-svelte';

	let storageUsage = {
		audio: 250, // MB
		text: 50, // MB
	};

	let totalStorage = 1024; // MB

	$: audioPercentage = (storageUsage.audio / totalStorage) * 100;
	$: textPercentage = (storageUsage.text / totalStorage) * 100;
	$: totalUsedPercentage = ((storageUsage.audio + storageUsage.text) / totalStorage) * 100;

	function clearOfflineData() {
		// Implement clearing offline data
		console.log("Clearing offline data...");
	}
</script>

<Card.Root>
	<div class="p-6 space-y-4">
		<h2 class="text-2xl font-semibold">Offline Data and Storage</h2>
		<div class="space-y-4">
			<div>
				<div class="flex justify-between items-center mb-2">
					<div class="flex items-center">
						<Music class="mr-2 h-4 w-4" />
						<span>Audio</span>
					</div>
					<span class="text-sm text-gray-600">{storageUsage.audio} MB</span>
				</div>
				<Progress value={audioPercentage} class="h-2" />
			</div>
			<div>
				<div class="flex justify-between items-center mb-2">
					<div class="flex items-center">
						<FileText class="mr-2 h-4 w-4" />
						<span>Text</span>
					</div>
					<span class="text-sm text-gray-600">{storageUsage.text} MB</span>
				</div>
				<Progress value={textPercentage} class="h-2" />
			</div>
			<div>
				<div class="flex justify-between items-center mb-2">
					<span class="font-semibold">Total Used</span>
					<span class="text-sm text-gray-600">{storageUsage.audio + storageUsage.text} MB / {totalStorage} MB</span>
				</div>
				<Progress value={totalUsedPercentage} class="h-2" />
			</div>
		</div>
		<Button onclick={clearOfflineData} variant="destructive" class="w-full">Clear Offline Data</Button>
	</div>
</Card.Root>