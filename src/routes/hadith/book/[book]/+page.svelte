<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import { Book, BookOpen } from "lucide-svelte";
	import { goto } from '$app/navigation';

	// Mock data for demonstration
	let { data: book } = $props()

	function getSectionCount(book) {
		return Object.values(book.sections).filter(section => section !== "").length;
	}

	function readSection(sectionId) {
		// Implement navigation to the specific section
		console.log(`Reading section ${sectionId}`);
	}

	function readAll() {
		// Implement navigation to read all sections
		console.log("Reading all sections");
	}
</script>

<div class="min-h-screen bg-neutral-50 p-8">
	<div class="max-w-4xl mx-auto">
		<header class="mb-8">
			<h1 class="text-3xl font-bold mb-2 text-neutral-900">{book.name}</h1>
			<div class="flex justify-between items-center">
				<p class="text-neutral-600">
					{getSectionCount(book)} Sections | {book.last_hadithnumber} Hadiths
				</p>
				<Button onclick={readAll}>
					<BookOpen class="mr-2 h-4 w-4" />
					Read All
				</Button>
			</div>
		</header>

		<ScrollArea class="h-[calc(100vh-12rem)]">
			<div class="grid gap-6">
				{#each Object.entries(book.sections).filter(([_, name]) => name !== "") as [id, name], index}
					<Card.Root>
						<Card.Header>
							<Card.Title class="flex justify-between items-center">
								<span>{index + 1}. {name}</span>
								<span class="text-sm font-normal text-neutral-500">
                  {book.section_details[id].hadithnumber_last - book.section_details[id].hadithnumber_first + 1} Hadiths
                </span>
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<p class="text-neutral-600">
								Hadiths {book.section_details[id].hadithnumber_first} - {book.section_details[id].hadithnumber_last}
							</p>
						</Card.Content>
						<Card.Footer>
							<Button onclick={() => {
								goto(window.location.pathname + '/chapter/' + id)
							}} variant="outline" class="w-full" onclick={() => readSection(id)}>
								<Book class="mr-2 h-4 w-4" />
								Read Section
							</Button>
						</Card.Footer>
					</Card.Root>
				{/each}
			</div>
		</ScrollArea>
	</div>
</div>