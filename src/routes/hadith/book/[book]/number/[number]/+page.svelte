<script lang="ts">
	import { Button } from "$lib/components/ui/button/index";
	import * as Card from "$lib/components/ui/card/index";
	import { Badge } from "$lib/components/ui/badge/index";
	import { Share, Copy, Book, Bookmark } from "lucide-svelte";
	import { toast } from 'svelte-sonner';
	import { goto} from '$app/navigation';

	let { data } = $props()
	const hadithData = data
	const { metadata, hadiths } = hadithData.data.hadith;
	const hadith = hadiths[0];
	console.log(hadith.reference)

	function copyHadith() {
		const textToCopy = `${hadith.text.en}\n\n${hadith.text.ar}\n\nReference: ${metadata.name}, ${Object.values(metadata.section)[0]}, Hadith ${hadith.hadithnumber}`;
		navigator.clipboard.writeText(textToCopy).then(() => {
			toast.success("Hadith Copied", {
				description: "The hadith has been copied to your clipboard.",
			});
		});
	}

	function shareHadith() {
		if (navigator.share) {
			navigator.share({
				title: `Hadith ${hadith.hadithnumber}`,
				text: `${hadith.text.en}\n\n${hadith.text.ar}\n\nReference: ${metadata.name}, ${Object.values(metadata.section)[0]}, Hadith ${hadith.hadithnumber}\nSource: ${window.location.href}`,
				url: window.location.href
			});
		} else {
			copyHadith()
		}
	}

	function viewSection() {
		// Implement view section functionality
		console.log(`Viewing section: ${Object.values(metadata.section)[0]}`);
		toast.success("Viewing Section", {
			description: `Navigating to ${Object.values(metadata.section)[0]}`,
		});
		goto(`/hadith/book/${hadith.reference.book}/chapter/${Object.keys(metadata.section)[0]}`)
	}

	function viewBook() {
		// Implement view book functionality
		console.log(`Viewing book: ${metadata.name}`);
		toast.success("Viewing Book", {
			description: `Navigating to ${metadata.name}`,
		});
		goto(`/hadith/book/${hadith.reference.book}`)
	}
</script>

<div class="min-h-screen bg-neutral-50 p-8">
	<div class="max-w-4xl mx-auto">
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-2xl font-bold">{metadata.name}</Card.Title>
				<Card.Description>{Object.values(metadata.section)[0]}</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-6">
					<div class="flex justify-between items-center">
						<span class="text-lg font-semibold">Hadith {hadith.hadithnumber}</span>
						<div class="flex space-x-2">
							<Button variant="outline" size="icon" onclick={copyHadith}>
								<Copy class="h-4 w-4" />
							</Button>
							<Button variant="outline" size="icon" onclick={shareHadith}>
								<Share class="h-4 w-4" />
							</Button>
						</div>
					</div>
					<div class="space-y-4">
						<p class="font-ar-primary text-right text-xl leading-relaxed">{hadith.text.ar}</p>
						<p class="font-primary text-base">{hadith.text.en}</p>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each hadith.grades as grade}
							<Badge variant="secondary">
								{grade.name}: {grade.grade}
							</Badge>
						{/each}
					</div>
				</div>
			</Card.Content>
			<Card.Footer class="flex justify-between">
				<Button variant="outline" onclick={viewSection}>
					<Bookmark class="mr-2 h-4 w-4" />
					View Section
				</Button>
				<Button variant="outline" onclick={viewBook}>
					<Book class="mr-2 h-4 w-4" />
					View Book
				</Button>
			</Card.Footer>
		</Card.Root>
	</div>
</div>