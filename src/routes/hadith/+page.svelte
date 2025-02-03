<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import * as Dialog from "$lib/components/ui/dialog";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import { Search, ArrowLeft, Book } from "lucide-svelte";
	import { Badge } from "$lib/components/ui/badge";
	import { fade } from "svelte/transition";
	import Loading from '$lib/components/Loading.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props()

	let selectedBook = $state(null);
	let showDialog = $state(false);
	let showPreview = $state(false);
	let selectedSection = $state(null);
	let searchTerm = $state("");

	function openBookDialog(book) {
		selectedBook = book;
		showDialog = true;
		showPreview = false;
		searchTerm = "";
	}

	function closeDialog() {
		showDialog = false;
		selectedBook = null;
		showPreview = false;
		selectedSection = null;
	}

	function openPreview(section) {
		selectedSection = section;
		showPreview = true;
	}

	function backToList() {
		showPreview = false;
		selectedSection = null;
	}

	function getSectionCount(book) {
		if (book?.sections) {
			return Object.values(book.sections).filter(section => typeof section === "string" && section !== "").length;
		}

		if (book?.section_details) {
			return Object.values(book.section_details)
				.filter(section => section?.hadithnumber_first && section.hadithnumber_first !== 0)
				.length;
		}

		return 0; // Default if no sections exist
	}


	const filteredSections = $derived(selectedBook
		? (selectedBook.sections
				? Object.entries(selectedBook.sections)
					.filter(([_, name]) => typeof name === "string" && name.toLowerCase().includes(searchTerm.toLowerCase()))
					.filter(([_, name]) => name !== "")
				: Object.entries(selectedBook.section_details || {}) // Handle section_details case
					.filter(([id, details]) => details.hadithnumber_first !== 0)
					.map(([id]) => [id, `Section ${id}`]) // Placeholder names if sections are missing
		)
		: []
	);

</script>
{#await data.books}
	<Loading message="Loading Hadith Books..." />
	{:then booksRes}
	{#if booksRes.success}
		{@const books = booksRes?.data?.books}
		<div class="min-h-screen bg-neutral-50 p-8">
	<h1 class="text-3xl font-bold mb-8 text-center text-neutral-900">Hadith Books</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each Object.values(books) as book}
			<button
				class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-left"
				onclick={() => openBookDialog(book)}
			>
				<h2 class="text-xl font-semibold mb-2 text-neutral-900">{book.name}</h2>
				<div class="flex flex-wrap gap-2 mb-2">
					<Badge variant="secondary">English</Badge>
					<Badge variant="secondary">Arabic</Badge>
				</div>
				<p class="text-neutral-600 mb-1">Sections: {getSectionCount(book)}</p>
				<p class="text-neutral-600">Hadiths: {book.last_hadithnumber}</p>
			</button>
		{/each}
	</div>

	<Dialog.Root bind:open={showDialog}>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>{selectedBook?.name}</Dialog.Title>
				<Dialog.Description>Select a section to read</Dialog.Description>
			</Dialog.Header>
			{#if !showPreview}
				<div class="space-y-4">
					<div class="relative">
						<Search class="absolute left-2 top-2.5 h-4 w-4 text-neutral-500" />
						<Input placeholder="Search sections" class="pl-8" bind:value={searchTerm} />
					</div>
					<ScrollArea class="h-[50vh]">
						{#each filteredSections as [id, name], i}
							<button
								class="w-full text-left p-2 hover:bg-neutral-100 rounded transition-colors duration-200"
								onclick={() => openPreview({id, name})}
							>
								{i + 1}. {name}
							</button>
						{/each}
					</ScrollArea>
				</div>
			{:else}
				<div class="space-y-4" transition:fade>
					<h3 class="text-lg font-semibold">{selectedSection.name}</h3>
					<p class="text-neutral-600">Book: {selectedBook.name}</p>
					<div class="flex justify-between">
						<Button variant="outline" onclick={backToList}>
							<ArrowLeft class="mr-2 h-4 w-4" />
							Back
						</Button>
						<Button onclick={() => (goto(`/hadith/book/${selectedBook.id}/chapter/${selectedSection.id}`))}>
							<Book class="mr-2 h-4 w-4" />
							Read
						</Button>
					</div>
				</div>
			{/if}
		</Dialog.Content>
	</Dialog.Root>
</div>
		{/if}
	{/await}