<script lang="ts">
	import { onMount } from 'svelte';
	import * as Select from "$lib/components/ui/select";
	import { Button } from "$lib/components/ui/button";
	import ReciterSettings from "./reciter-settings.svelte";
	import HistoryAndData from "./history-and-data.svelte";
	import AccountSync from "./account-sync.svelte";
	import BookmarksManager from "./bookmarks-manager.svelte";
	import OfflineDataManager from "./offline-data-manager.svelte";
	import AchievementsAndBadges from "./achievements-and-badges.svelte";
	import UserAnalytics from "./user-analytics.svelte";

	let activeTab = $state('reciters');
	let isMobile = $state(false);

	const tabs = [
		{ value: 'reciters', label: 'Reciters' },
		{ value: 'history', label: 'History & Data' },
		{ value: 'account', label: 'Account' },
		{ value: 'bookmarks', label: 'Bookmarks' },
		{ value: 'offline', label: 'Offline Data' },
		{ value: 'achievements', label: 'Achievements' },
		{ value: 'analytics', label: 'Analytics' }
	];

	let activeTabLabel = $state("")
	$effect(() => {
		activeTabLabel = tabs.find(t => t.value === activeTab)?.label ?? "Select a setting"
	})

	function setActiveTab(tab) {
		activeTab = tab;
	}

	function handleSelectChange(value) {
		activeTab = value;
	}

	onMount(() => {
		const mediaQuery = window.matchMedia('(max-width: 768px)');
		isMobile = mediaQuery.matches;

		const handleResize = (e) => {
			isMobile = e.matches;
		};

		mediaQuery.addListener(handleResize);

		return () => {
			mediaQuery.removeListener(handleResize);
		};
	});
</script>

<div class="container mx-auto p-4 max-w-4xl">
	<h1 class="text-3xl font-bold mb-6">Settings</h1>

	{#if isMobile}
		<Select.Root type="single" value={activeTab} onValueChange={handleSelectChange}>
			<Select.Trigger class="w-full mb-4">
				{activeTabLabel}
			</Select.Trigger>
			<Select.Content>
				{#each tabs as tab}
					<Select.Item value={tab.value}>{tab.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	{:else}
		<div class="flex space-x-2 mb-6 overflow-x-auto pb-2">
			{#each tabs as tab}
				<Button
					variant={activeTab === tab.value ? 'default' : 'outline'}
					onclick={() => setActiveTab(tab.value)}
					class="whitespace-nowrap"
				>
					{tab.label}
				</Button>
			{/each}
		</div>
	{/if}

	<div class="mt-6">
		{#if activeTab === 'reciters'}
			<ReciterSettings />
		{:else if activeTab === 'history'}
			<HistoryAndData />
		{:else if activeTab === 'account'}
			<AccountSync />
		{:else if activeTab === 'bookmarks'}
			<BookmarksManager />
		{:else if activeTab === 'offline'}
			<OfflineDataManager />
		{:else if activeTab === 'achievements'}
			<AchievementsAndBadges />
		{:else if activeTab === 'analytics'}
			<UserAnalytics />
		{/if}
	</div>
</div>

<style>
    /* Add custom scrollbar styles for the horizontal tab bar */
    .overflow-x-auto::-webkit-scrollbar {
        height: 4px;
    }
    .overflow-x-auto::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    .overflow-x-auto::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 2px;
    }
    .overflow-x-auto::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>