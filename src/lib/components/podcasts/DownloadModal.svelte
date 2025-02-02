<script lang="ts">
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Button } from "$lib/components/ui/button";


	let { episode = null, show = false, onclose, ondownload } = $props()


	function closeModal() {
		onclose()
	}

	function downloadEpisode() {
		ondownload()
	}
</script>

<AlertDialog.Root bind:open={show}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Download Episode</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to download this episode?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<div class="py-4">
			{#if episode}
				<p><strong>Title:</strong> {episode.title}</p>
				<p><strong>Duration:</strong> {episode.duration}</p>
				<p><strong>Size:</strong> {episode.size}</p>
			{/if}
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Cancel asChild>
				Cancel
			</AlertDialog.Cancel>
			<AlertDialog.Action onclick={downloadEpisode} asChild>
				Download
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

