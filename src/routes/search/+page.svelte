<script>
	import { onMount } from "svelte";
	import * as Card from '$lib/components/ui/card/index.js'
	import { liteClient as algoliasearch } from "algoliasearch/lite";
	import instantsearch from "instantsearch.js";
	import {
		searchBox,
		hits,
		configure,
		poweredBy,
	} from "instantsearch.js/es/widgets";
	import "instantsearch.css/themes/reset.css";
	import { AudioLines, Book, BookMarked, BookOpen } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	const navigate = (url) => goto(new URL(url).pathname)

	onMount(() => {
		// Dynamically inject styles for the search UI with light mode overrides
		const styles = document.createElement("style");
		styles.textContent = `
      .ais-InstantSearch {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        background-color: #ffffff;
        color: #1f2937;
        border-radius: 0.5rem;
      }
      .ais-SearchBox-form {
        position: relative;
      }
      .ais-SearchBox-input {
        width: 100%;
        box-shadow: none;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        padding: 0.75rem 2.5rem;
        background-color: #ffffff;
        color: #1f2937;
      }
      .ais-SearchBox-submit,
      .ais-SearchBox-reset {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        appearance: none;
      }
      .ais-SearchBox-submit {
        left: 0.75rem;
      }
      .ais-SearchBox-reset {
        right: 0.75rem;
      }
      .ais-Hits-item {
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1.25rem;
        box-shadow: none;
        border-bottom: 1px solid #e5e7eb;
      }
      .ais-Hits-item:last-child {
        border-bottom: none;
      }
      .ais-Hits-item p {
        margin-bottom: 0.25rem;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .ais-Hits-item .primary-text {
        font-weight: 600;
        color: #111827;
      }
      .ais-Hits-item mark {
        color: #2563eb;
        background-color: #dbeafe;
        font-style: normal;
      }
      .ais-SearchBox-submitIcon {
        width: 1rem;
        height: 1rem;
        color: #6b7280;
      }
      #hits {
        padding: 1rem;
      }
      #algolia-footer {
        display: flex;
        justify-content: flex-end;
        padding: 1rem;
        border-top: 1px solid #e5e7eb;
      }
      .hide-content {
        display: none !important;
      }
    `;
		document.head.appendChild(styles);

		// Create the search container and insert it at the top of the body
		const searchBarContainer = document.querySelector("body");
		const searchBarNode = document.createElement("div");
		searchBarNode.setAttribute("class", "ais-InstantSearch mt-8");
		searchBarNode.innerHTML = `
      <div class="px-4 mt-16" id="searchbox"></div>
      <div id="hits" class="hide-content"></div>
      <div id="algolia-footer" class="hide-content"></div>
    `;
		searchBarContainer.prepend(searchBarNode);

		// Initialize Algolia's search client using the liteClient
		const searchClient = algoliasearch(
			"P1PS03A0BG",
			"aa40f76889864575b485ca55e5bfe481"
		);

		// Set up InstantSearch with the provided index and widgets
		const search = instantsearch({
			indexName: "www_aayah_info_p1ps03a0bg_articles",
			searchClient,
			onStateChange({ uiState, setUiState }) {
				const hitsContainer = document.querySelector("#hits");
				const footerContainer = document.querySelector("#algolia-footer");

				if (!uiState["www_aayah_info_p1ps03a0bg_articles"]?.query) {
					hitsContainer.classList.add("hide-content");
					footerContainer?.classList.add("hide-content");
					setUiState(uiState);
					return;
				}

				hitsContainer.classList.remove("hide-content");
				footerContainer?.classList.remove("hide-content");
				setUiState(uiState);
			},
		});

		search.addWidgets([
			searchBox({
				container: "#searchbox",
				placeholder: "Find Qur'an, Hadith, or Dua...",
			}),
			configure({
				hitsPerPage: 5,
			}),
			poweredBy({
				container: "#algolia-footer",
			}),
			hits({
				container: "#hits",
				templates: {
					item: (hit, { html, components }) => html`
						<div class="cursor-pointer" onclick=${() => navigate(hit.url)}>
							<p class="primary-text">
								${components.Highlight({ hit, attribute: "name" })}
							</p>
							<p class="text-sm text-gray-600">
								${hit.type ? hit.type.slice(0, 150) + "..." : ""}
							</p>
						</div>
					`,
				},
			}),
		]);

		search.start();
	});



	/** @type {Array<{title: string, description: string, icon: any, href: string}>} */
	const readActions = [
		{
			title: 'Quran',
			description: 'Read and study the Holy Quran',
			icon: Book,
			href: '/quran'
		},
		{
			title: 'Hadith',
			description: 'Explore Hadith collections',
			icon: BookOpen,
			href: '/hadith'
		},
		{
			title: 'Podcasts',
			description: 'Audio Podcasts from Mufti Menk',
			icon: AudioLines,
			href: '/podcasts'
		},
		{
			title: 'Dua',
			description: 'Daily prayers and supplications',
			icon: BookMarked,
			href: '/dua'
		}
	];
</script>

<svelte:head>
	<title>Find anything on Aayah.info – A Minimalist Muslim Companion</title>
	<meta property="og:title" content="Find anything on Aayah.info – A Minimalist Muslim Companion" />
	<meta name="twitter:title" content="Find anything on Aayah.info – A Minimalist Muslim Companion" />
</svelte:head>

<main class="min-h-screen bg-neutral-50 px-4 py-8">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-4xl font-bold text-neutral-900 mb-4 text-center">Knowledge Base Search</h1>
		<p class="text-neutral-600 text-center mb-8">
			Find Surah, Juz, Verse in Qur'an, Books, Collections and Hadith in Hadith and Dua. Use the search bar above to find exactly what you're looking for.
		</p>
		<div class="bg-white p-6 rounded-lg shadow-md">
			<h2 class="text-2xl font-semibold text-neutral-800 mb-4">Popular Topics</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				{#each readActions as action}
					<Card.Root
						class="group relative overflow-hidden transition-all hover:bg-secondary hover:scale-[1.02]"
					>
						<button
							class="w-full h-full p-6 text-left"

						>
							<div class="flex items-start gap-4">
								<div class="rounded-lg bg-primary/5 p-2 ring-1 ring-primary/10">
									<svelte:component
										this={action.icon}
										class="w-5 h-5 transition-transform group-hover:scale-110 duration-300"
									></svelte:component>
								</div>
								<div class="space-y-1">
									<h3 class="font-secondary font-medium leading-none">
										{action.title}
									</h3>
									<p class="text-sm text-muted-foreground">
										{action.description}
									</p>
								</div>
							</div>
						</button>
					</Card.Root>
				{/each}
			</div>
		</div>
	</div>
</main>