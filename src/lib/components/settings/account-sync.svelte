<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card } from "$lib/components/ui/card";
	import {  Apple } from 'lucide-svelte';

	let isGoogleSynced = false;
	let isAppleSynced = false;

	function syncGoogle() {
		// Implement Google sync
		isGoogleSynced = true;
	}

	function syncApple() {
		// Implement Apple sync
		isAppleSynced = true;
	}
</script>

<Card>
	<div class="p-6 space-y-4">
		<h2 class="text-2xl font-semibold">Account Sync</h2>
		<div class="space-y-4">
			<Button onclick={syncGoogle} disabled={isGoogleSynced} class="w-full justify-start" variant={isGoogleSynced ? "secondary" : "default"}>
				<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="currentColor"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
				{isGoogleSynced ? "Google Account Synced" : "Sync with Google"}
			</Button>
			<Button onclick={syncApple} disabled={isAppleSynced} class="w-full justify-start" variant={isAppleSynced ? "secondary" : "default"}>
				<Apple class="mr-2 h-4 w-4" />
				{isAppleSynced ? "Apple ID Synced" : "Sync with Apple ID"}
			</Button>
		</div>
	</div>
</Card>