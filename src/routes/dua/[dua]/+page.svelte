<script lang="ts">
	import * as Card from "$lib/components/ui/card/index";
	import { Button } from "$lib/components/ui/button/index";
	import { Badge } from "$lib/components/ui/badge/index";
	import { ArrowLeft, Copy, Volume2 } from "lucide-svelte";
	import { toast } from 'svelte-sonner';

	let { data } = $props()
	let dua = data;

	function goBack() {
		// Implement navigation back to dua list
		console.log("Navigating back to dua list");
	}

	function copyDua() {
		const textToCopy = `${dua.arabic}\n\n${dua.latin}\n\n${dua.translation}`;
		navigator.clipboard.writeText(textToCopy).then(() => {
			toast.success("Dua Copied", {
				description: "The dua has been copied to your clipboard.",
			});
		});
	}

	function playAudio() {
		// Implement audio playback
		console.log("Playing audio for dua");
		toast.success("Audio", {
			description: "Playing audio for dua",
		});
	}
</script>

<div class="min-h-screen bg-neutral-50 p-8">
	<div class="max-w-4xl mx-auto space-y-8">
		<Button variant="ghost" onclick={goBack} class="mb-4">
			<ArrowLeft class="mr-2 h-4 w-4" />
			Back to Duas
		</Button>

		<Card.Root>
			<Card.Header>
				<Card.Title class="text-2xl font-bold">{dua.title}</Card.Title>
				<Card.Description>{dua.source}</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div>
					<h3 class="text-lg font-semibold mb-2">Arabic</h3>
					<p class="font-ar-primary text-right text-xl leading-relaxed">{dua.arabic}</p>
				</div>
				<div>
					<h3 class="text-lg font-semibold mb-2">Transliteration</h3>
					<p class="italic">{dua.latin}</p>
				</div>
				<div>
					<h3 class="text-lg font-semibold mb-2">Translation</h3>
					<p>{dua.translation}</p>
				</div>
				<div>
					<h3 class="text-lg font-semibold mb-2">Benefits</h3>
					<p>{dua.benefits}</p>
				</div>
				<div>
					<h3 class="text-lg font-semibold mb-2">Notes</h3>
					<p>{dua.notes}</p>
				</div>
			</Card.Content>
			<Card.Footer class="flex justify-between">
				<Button variant="outline" onclick={copyDua}>
					<Copy class="mr-2 h-4 w-4" />
					<span class="hidden sm:inline">Copy Dua</span>
				</Button>
				<Button variant="outline" onclick={playAudio}>
					<Volume2 class="mr-2 h-4 w-4" />
					<span class="hidden sm:inline">Play Audio</span>
				</Button>
			</Card.Footer>
		</Card.Root>
	</div>
</div>