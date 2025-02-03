<script>
	// Define the action
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Share, Copy, Check, Loader } from 'lucide-svelte';
	import * as Card from "$lib/components/ui/card/index";
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state'
	import share from '$lib/share.js';
	let { number, bookTitle, sectionTitle } = $props()


	function shareHadith(hadith) {
		// Implement share functionality
		share({
			title: `Hadith ${hadith.hadithnumber}`,
			text: `${hadith.text.en}\n\n${hadith.text.ar}\n\nReference: ${bookTitle}, ${sectionTitle}, Hadith ${hadith.hadithnumber}`,
			url: window.location.href
		})
			.then(() => {
				toast.success("Hadith copied!")
			})
	}

	function copyHadith(hadith) {
		const textToCopy = `${hadith.text.en}\n\n${hadith.text.ar}\n\nReference: ${bookTitle}, ${sectionTitle}, Hadith ${hadith.hadithnumber}`;
		navigator.clipboard.writeText(textToCopy).then(() => {
			toast.success(
				"Hadith Copied",{
					description: "The hadith has been copied to your clipboard.",
				}
			);
		});
	}

	const getClasses = (grade) => {
		if (grade.toLowerCase().includes('hassan')) return `bg-neutral-100 text-neutral-800 dark:bg-neutral-700 text-white hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-700 hover:text-white`

		if (grade.toLowerCase().includes('sahih')) return `bg-green-800 text-green-50 dark:bg-green-600 text-white hover:bg-green-800 hover:text-green-50 dark:hover:bg-green-600 hover:text-white`

		if (grade.toLowerCase().includes('daif')) return `bg-red-800 text-white dark:bg-red-700 hover:bg-red-800 hover:text-white dark:hover:bg-red-700`

		if (grade.toLowerCase().includes('shadh')) return `bg-brown-800 text-white dark:bg-brown-700 hover:bg-brown-800 hover:text-white dark:hover:bg-brown-700`
	}

	function inView(node, { threshold = 0.1, callback } = {}) {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					callback(); // Run your function when the element comes into view
					observer.unobserve(node); // Optional: stop observing if you only want it to run once
				}
			},
			{ threshold }
		);

		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	// Your function to run when element is visible
	async function handleVisible () {
		const req = await fetch(`/api/v1/hadith/${page.params.book}/section/${page.params.chapter}/${number}`)
		const res =  await req.json()
		hadith = res?.data?.hadith.hadiths[0]
	}

	let hadith = $state();
</script>

<div use:inView={{ threshold: 0.2, callback: handleVisible }}>
{#if hadith}
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex justify-between items-center">
				<span>Hadith {hadith.hadithnumber}</span>
				<div class="flex space-x-2">
					<Button variant="outline" size="icon" onclick={() => shareHadith(hadith)}>
						<Share class="h-4 w-4" />
					</Button>
					<Button variant="outline" size="icon" onclick={() => copyHadith(hadith)}>
						<Copy class="h-4 w-4" />
					</Button>
				</div>
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="space-y-4">
				<p onclick={() => copyHadith(hadith)} class="font-ar-primary text-right text-xl leading-relaxed">{hadith.text.ar}</p>
				<p onclick={() => copyHadith(hadith)} class="font-primary text-base">{hadith.text.en}</p>
			</div>
		</Card.Content>
		<Card.Footer>
			<div class="flex flex-wrap gap-2 text-xs">
				{#each hadith.grades as grade}
					<Badge class={getClasses(grade.grade)} variant="secondary">
						{grade.name}: {grade.grade}
					</Badge>
				{/each}
			</div>
		</Card.Footer>
	</Card.Root>
	{:else}
	<Loader class="h-4 w-4 animate-spin" />
	{/if}
</div>
