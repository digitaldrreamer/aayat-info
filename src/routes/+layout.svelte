<script>
	import '../app.css';
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import * as Command from "$lib/components/ui/command/index";
	import * as Menubar from "$lib/components/ui/menubar/index";
	import { AudioRecorder } from '$lib/components/search/index';
	import { Button } from '$lib/components/ui/button/index';
	import { Search, Mic, History, Home, Settings, UserCircle, RefreshCw, Plus } from 'lucide-svelte';

	// Standard booleans for state
	let open = $state(false);
	let showBookmarks = $state(false);
	let showHistory = $state(false);
	let showVoiceSearch = $state(false);

	/** @type {Array<{id: string, text: string, arabic: string}>} */
	const suggestions = $state([
		{
			id: '1:1',
			text: 'Al-Fatihah',
			arabic: 'الفاتحة'
		},
		{
			id: '2:255',
			text: 'Ayatul Kursi',
			arabic: 'آية الكرسي'
		},
		{
			id: '36:1',
			text: 'Surah Yasin',
			arabic: 'سورة يس'
		}
	]);

	function handleKeydown(e) {
		if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}

	let { children } = $props()

	/**
	 * Navigate to a new page
	 * @param {string} path - The path to navigate to
	 */
	const navigate = (path) => {
		// Navigation implementation (e.g., using svelte-navigator or svelte-routing)
	};
</script>

<svelte:document onkeydown={handleKeydown} />

<div class="h-screen bg-background text-foreground font-primary flex flex-col">
	<!-- Top Bar -->
	<header
		class="fixed top-0 left-0 right-0 h-14 px-4 border-b bg-background/80 backdrop-blur-sm z-50"
		in:fly={{ y: -20, duration: 300, easing: quintOut }}
	>
		<div class="h-full flex items-center justify-between max-w-screen-2xl mx-auto">
			<div class="flex items-center gap-2">
				<Button variant="ghost" size="icon">
					<UserCircle class="w-5 h-5" />
				</Button>
				<Button variant="ghost" size="icon">
					<RefreshCw class="w-5 h-5" />
				</Button>
			</div>
			<h1 class="font-secondary text-lg font-semibold">aayah.info</h1>
			<Button variant="ghost" size="icon">
				<Settings class="w-5 h-5" />
			</Button>
		</div>
	</header>

	<!-- Main Content Area -->
	<main class="flex-grow pt-16 pb-20 container max-w-screen-2xl mx-auto p-4">
		{@render children?.()}
	</main>

	<!-- Mobile Bottom Navigation -->
	<!-- Mobile Bottom Navigation -->
	<nav
		class="md:hidden fixed bottom-4 inset-x-4 h-14 bg-background border rounded-full shadow-lg z-50"
		in:fly={{ y: 20, duration: 300, easing: quintOut }}
	>
		<div class="relative h-full flex items-center justify-between px-6">
			<Button
				variant="ghost"
				class="flex flex-col items-center gap-1"
				onclick={() => navigate('/')}
			>
				<Home class="w-5 h-5" />
				<span class="text-xs">Home</span>
			</Button>

			<div class="absolute left-1/2 -translate-x-1/2 -top-6">
				<Button
					class="h-16 w-16 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-50 shadow-md"
					onclick={() => open = true}
				>
					<Plus class="w-6 h-6" />
				</Button>
			</div>

			<Button
				variant="ghost"
				class="flex flex-col items-center gap-1"
				onclick={() => navigate('/history')}
			>
				<History class="w-5 h-5" />
				<span class="text-xs">History</span>
			</Button>
		</div>
	</nav>


	<!-- Desktop Menubar -->
	<div
		class="hidden md:block fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
		in:fly={{ y: 20, duration: 300, easing: quintOut }}
	>
		<div class="bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg p-1">
			<Menubar.Root>
				<Menubar.Menu>
					<Menubar.Trigger>Search</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item onclick={() => open = true}>
							Quick Search <Menubar.Shortcut>⌘K</Menubar.Shortcut>
						</Menubar.Item>
						<Menubar.Item onclick={() => showVoiceSearch = true}>
							Voice Search
						</Menubar.Item>
						<Menubar.Separator />
						<Menubar.Sub>
							<Menubar.SubTrigger>Recent Searches</Menubar.SubTrigger>
							<Menubar.SubContent>
								{#each suggestions as { text, arabic }}
									<Menubar.Item>
										<span class="font-secondary">{text}</span>
										<span class="font-ar-primary text-sm text-muted-foreground ml-2">{arabic}</span>
									</Menubar.Item>
								{/each}
							</Menubar.SubContent>
						</Menubar.Sub>
					</Menubar.Content>
				</Menubar.Menu>

				<Menubar.Menu>
					<Menubar.Trigger>View</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.CheckboxItem bind:checked={showBookmarks}>
							Show Bookmarks
						</Menubar.CheckboxItem>
						<Menubar.CheckboxItem bind:checked={showHistory}>
							Show History
						</Menubar.CheckboxItem>
						<Menubar.Separator />
						<Menubar.Item inset>
							Reload <Menubar.Shortcut>⌘R</Menubar.Shortcut>
						</Menubar.Item>
						<Menubar.Separator />
						<Menubar.Item inset>Toggle Dark Mode</Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>

				<Menubar.Menu>
					<Menubar.Trigger>Tools</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item>
							Translation Settings
						</Menubar.Item>
						<Menubar.Item>
							Reading Preferences
						</Menubar.Item>
						<Menubar.Separator />
						<Menubar.Sub>
							<Menubar.SubTrigger>Share</Menubar.SubTrigger>
							<Menubar.SubContent>
								<Menubar.Item>Copy Link</Menubar.Item>
								<Menubar.Item>Share via Email</Menubar.Item>
								<Menubar.Item>Share via Message</Menubar.Item>
							</Menubar.SubContent>
						</Menubar.Sub>
					</Menubar.Content>
				</Menubar.Menu>
			</Menubar.Root>
		</div>
	</div>

	<!-- Command Dialog -->
	<Command.Dialog bind:open>
		<Command.Input placeholder="Search Quran, Hadith, Dua and more..." />
		<Command.List>
			<Command.Empty>No results found.</Command.Empty>
			<Command.Group heading="Recent">
				{#each suggestions as { text, arabic }}
					<Command.Item>
						<div class="flex flex-col">
							<span class="font-secondary">{text}</span>
							<span class="font-ar-primary text-sm text-muted-foreground">{arabic}</span>
						</div>
					</Command.Item>
				{/each}
			</Command.Group>
			<Command.Separator />
			<Command.Group heading="Actions">
				<Command.Item onclick={() => showVoiceSearch = !showVoiceSearch}>
					<div class="flex items-center">
						<Mic class="mr-2 h-4 w-4" />
						<span>Voice Search</span>
					</div>
				</Command.Item>
				<Command.Item>
					<div class="flex items-center">
						<Search class="mr-2 h-4 w-4" />
						<span>Advanced Search</span>
					</div>
				</Command.Item>
			</Command.Group>
		</Command.List>
	</Command.Dialog>
</div>

<AudioRecorder bind:isOpen={showVoiceSearch} />

<Toaster />
