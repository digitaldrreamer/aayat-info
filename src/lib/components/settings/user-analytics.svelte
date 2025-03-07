<script lang="ts">
	import { Card } from "$lib/components/ui/card";
	import { Clock, Book, Mic, PieChart } from 'lucide-svelte';

	let analytics = {
		listenHours: 50,
		readHours: 30,
		hadithRead: 200,
		duaRead: 50,
		totalHours: 80,
	};

	const analyticsItems = [
		{ title: "Listening Hours", value: analytics.listenHours, icon: Clock, color: "bg-blue-100 text-blue-600" },
		{ title: "Reading Hours", value: analytics.readHours, icon: Book, color: "bg-green-100 text-green-600" },
		{ title: "Hadith Read", value: analytics.hadithRead, icon: Mic, color: "bg-yellow-100 text-yellow-600" },
		{ title: "Dua Read", value: analytics.duaRead, icon: PieChart, color: "bg-purple-100 text-purple-600" },
	];
</script>

<Card>
	<div class="p-6 space-y-4">
		<h2 class="text-2xl font-semibold">User Analytics</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{#each analyticsItems as { title, value, icon: Icon, color }}
				<div class={`p-4 rounded-lg ${color}`}>
					<div class="flex items-center justify-between">
						<h3 class="font-semibold">{title}</h3>
						<Icon class="w-5 h-5" />
					</div>
					<p class="text-2xl font-bold mt-2">{value}</p>
				</div>
			{/each}
			<div class="p-4 bg-red-100 text-red-600 rounded-lg sm:col-span-2">
				<div class="flex items-center justify-between">
					<h3 class="font-semibold">Total Hours Used</h3>
					<Clock class="w-5 h-5" />
				</div>
				<p class="text-2xl font-bold mt-2">{analytics.totalHours}</p>
			</div>
		</div>
		<p class="text-2xl font-bold mt-2">{analytics.totalHours}</p>
	</div>
</Card>