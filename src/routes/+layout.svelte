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
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	// Standard booleans for state
	let open = $state(false);
	let showBookmarks = $state(false);
	let showHistory = $state(false);
	let showVoiceSearch = $state(false);
	let query = $state("");

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

	const surahs = [
		{ number: 1, name: "Al-Fatihah", arabicName: "الفاتحة", versesCount: 7 },
		{ number: 2, name: "Al-Baqarah", arabicName: "البقرة", versesCount: 286 },
		{ number: 3, name: "Ali 'Imran", arabicName: "آل عمران", versesCount: 200 },
		{ number: 4, name: "An-Nisa", arabicName: "النساء", versesCount: 176 },
		{ number: 5, name: "Al-Ma'idah", arabicName: "المائدة", versesCount: 120 },
		{ number: 6, name: "Al-An'am", arabicName: "الأنعام", versesCount: 165 },
		{ number: 7, name: "Al-A'raf", arabicName: "الأعراف", versesCount: 206 },
		{ number: 8, name: "Al-Anfal", arabicName: "الأنفال", versesCount: 75 },
		{ number: 9, name: "At-Tawbah", arabicName: "التوبة", versesCount: 129 },
		{ number: 10, name: "Yunus", arabicName: "يونس", versesCount: 109 },
		{ number: 11, name: "Hud", arabicName: "هود", versesCount: 123 },
		{ number: 12, name: "Yusuf", arabicName: "يوسف", versesCount: 111 },
		{ number: 13, name: "Ar-Ra'd", arabicName: "الرعد", versesCount: 43 },
		{ number: 14, name: "Ibrahim", arabicName: "إبراهيم", versesCount: 52 },
		{ number: 15, name: "Al-Hijr", arabicName: "الحجر", versesCount: 99 },
		{ number: 16, name: "An-Nahl", arabicName: "النحل", versesCount: 128 },
		{ number: 17, name: "Al-Isra", arabicName: "الإسراء", versesCount: 111 },
		{ number: 18, name: "Al-Kahf", arabicName: "الكهف", versesCount: 110 },
		{ number: 19, name: "Maryam", arabicName: "مريم", versesCount: 98 },
		{ number: 20, name: "Taha", arabicName: "طه", versesCount: 135 },
		{ number: 21, name: "Al-Anbiya", arabicName: "الأنبياء", versesCount: 112 },
		{ number: 22, name: "Al-Hajj", arabicName: "الحج", versesCount: 78 },
		{ number: 23, name: "Al-Mu’minun", arabicName: "المؤمنون", versesCount: 118 },
		{ number: 24, name: "An-Nur", arabicName: "النور", versesCount: 64 },
		{ number: 25, name: "Al-Furqan", arabicName: "الفرقان", versesCount: 77 },
		{ number: 26, name: "Ash-Shu'ara", arabicName: "الشعراء", versesCount: 227 },
		{ number: 27, name: "An-Naml", arabicName: "النمل", versesCount: 93 },
		{ number: 28, name: "Al-Qasas", arabicName: "القصص", versesCount: 88 },
		{ number: 29, name: "Al-Ankabut", arabicName: "العنكبوت", versesCount: 69 },
		{ number: 30, name: "Ar-Rum", arabicName: "الروم", versesCount: 60 },
		{ number: 31, name: "Luqman", arabicName: "لقمان", versesCount: 34 },
		{ number: 32, name: "As-Sajdah", arabicName: "السجدة", versesCount: 30 },
		{ number: 33, name: "Al-Ahzab", arabicName: "الأحزاب", versesCount: 73 },
		{ number: 34, name: "Saba", arabicName: "سبأ", versesCount: 54 },
		{ number: 35, name: "Fatir", arabicName: "فاطر", versesCount: 45 },
		{ number: 36, name: "Ya-Sin", arabicName: "يس", versesCount: 83 },
		{ number: 37, name: "As-Saffat", arabicName: "الصافات", versesCount: 182 },
		{ number: 38, name: "Sad", arabicName: "ص", versesCount: 88 },
		{ number: 39, name: "Az-Zumar", arabicName: "الزمر", versesCount: 75 },
		{ number: 40, name: "Ghafir", arabicName: "غافر", versesCount: 85 },
		{ number: 41, name: "Fussilat", arabicName: "فصلت", versesCount: 54 },
		{ number: 42, name: "Ash-Shura", arabicName: "الشورى", versesCount: 53 },
		{ number: 43, name: "Az-Zukhruf", arabicName: "الزخرف", versesCount: 89 },
		{ number: 44, name: "Ad-Dukhan", arabicName: "الدخان", versesCount: 59 },
		{ number: 45, name: "Al-Jathiyah", arabicName: "الجاثية", versesCount: 37 },
		{ number: 46, name: "Al-Ahqaf", arabicName: "الأحقاف", versesCount: 35 },
		{ number: 47, name: "Muhammad", arabicName: "محمد", versesCount: 38 },
		{ number: 48, name: "Al-Fath", arabicName: "الفتح", versesCount: 29 },
		{ number: 49, name: "Al-Hujurat", arabicName: "الحجرات", versesCount: 18 },
		{ number: 50, name: "Qaf", arabicName: "ق", versesCount: 45 },
		{ number: 51, name: "Adh-Dhariyat", arabicName: "الذاريات", versesCount: 60 },
		{ number: 52, name: "At-Tur", arabicName: "الطور", versesCount: 49 },
		{ number: 53, name: "An-Najm", arabicName: "النجم", versesCount: 62 },
		{ number: 54, name: "Al-Qamar", arabicName: "القمر", versesCount: 55 },
		{ number: 55, name: "Ar-Rahman", arabicName: "الرحمن", versesCount: 78 },
		{ number: 56, name: "Al-Waqi’ah", arabicName: "الواقعة", versesCount: 96 },
		{ number: 57, name: "Al-Hadid", arabicName: "الحديد", versesCount: 29 },
		{ number: 58, name: "Al-Mujadilah", arabicName: "المجادلة", versesCount: 22 },
		{ number: 59, name: "Al-Hashr", arabicName: "الحشر", versesCount: 24 },
		{ number: 60, name: "Al-Mumtahanah", arabicName: "الممتحنة", versesCount: 13 },
		{ number: 61, name: "As-Saff", arabicName: "الصف", versesCount: 14 },
		{ number: 62, name: "Al-Jumu'ah", arabicName: "الجمعة", versesCount: 11 },
		{ number: 63, name: "Al-Munafiqun", arabicName: "المنافقون", versesCount: 11 },
		{ number: 64, name: "At-Taghabun", arabicName: "التغابن", versesCount: 18 },
		{ number: 65, name: "At-Talaq", arabicName: "الطلاق", versesCount: 12 },
		{ number: 66, name: "At-Tahrim", arabicName: "التحريم", versesCount: 12 },
		{ number: 67, name: "Al-Mulk", arabicName: "الملك", versesCount: 30 },
		{ number: 68, name: "Al-Qalam", arabicName: "القلم", versesCount: 52 },
		{ number: 69, name: "Al-Haqqah", arabicName: "الحاقة", versesCount: 52 },
		{ number: 70, name: "Al-Ma'arij", arabicName: "المعارج", versesCount: 44 },
		{ number: 71, name: "Nuh", arabicName: "نوح", versesCount: 28 },
		{ number: 72, name: "Al-Jinn", arabicName: "الجن", versesCount: 28 },
		{ number: 73, name: "Al-Muzzammil", arabicName: "المزمل", versesCount: 20 },
		{ number: 74, name: "Al-Muddathir", arabicName: "المدثر", versesCount: 56 },
		{ number: 75, name: "Al-Qiyamah", arabicName: "القيامة", versesCount: 40 },
		{ number: 76, name: "Al-Insan", arabicName: "الإنسان", versesCount: 31 },
		{ number: 77, name: "Al-Mursalat", arabicName: "المرسلات", versesCount: 50 },
		{ number: 78, name: "An-Naba", arabicName: "النبأ", versesCount: 40 },
		{ number: 79, name: "An-Nazi'at", arabicName: "النازعات", versesCount: 46 },
		{ number: 80, name: "Abasa", arabicName: "عبس", versesCount: 42 },
		{ number: 81, name: "At-Takwir", arabicName: "التكوير", versesCount: 29 },
		{ number: 82, name: "Al-Infitar", arabicName: "الإنفطار", versesCount: 19 },
		{ number: 83, name: "Al-Mutaffifin", arabicName: "المطففين", versesCount: 36 },
		{ number: 84, name: "Al-Inshiqaq", arabicName: "الإنشقاق", versesCount: 25 },
		{ number: 85, name: "Al-Buruj", arabicName: "البروج", versesCount: 22 },
		{ number: 86, name: "At-Tariq", arabicName: "الطارق", versesCount: 17 },
		{ number: 87, name: "Al-A'la", arabicName: "الأعلى", versesCount: 19 },
		{ number: 88, name: "Al-Ghashiyah", arabicName: "الغاشية", versesCount: 26 },
		{ number: 89, name: "Al-Fajr", arabicName: "الفجر", versesCount: 30 },
		{ number: 90, name: "Al-Balad", arabicName: "البلد", versesCount: 20 },
		{ number: 91, name: "Ash-Shams", arabicName: "الشمس", versesCount: 15 },
		{ number: 92, name: "Al-Lail", arabicName: "الليل", versesCount: 21 },
		{ number: 93, name: "Ad-Duhaa", arabicName: "الضحى", versesCount: 11 },
		{ number: 94, name: "Ash-Sharh", arabicName: "الشرح", versesCount: 8 },
		{ number: 95, name: "At-Tin", arabicName: "التين", versesCount: 8 },
		{ number: 96, name: "Al-'Alaq", arabicName: "العلق", versesCount: 19 },
		{ number: 97, name: "Al-Qadr", arabicName: "القدر", versesCount: 5 },
		{ number: 98, name: "Al-Bayyinah", arabicName: "البينة", versesCount: 8 },
		{ number: 99, name: "Az-Zalzalah", arabicName: "الزلزلة", versesCount: 8 },
		{ number: 100, name: "Al-Adiyat", arabicName: "العاديات", versesCount: 11 },
		{ number: 101, name: "Al-Qari'ah", arabicName: "القارعة", versesCount: 11 },
		{ number: 102, name: "At-Takathur", arabicName: "التكاثر", versesCount: 8 },
		{ number: 103, name: "Al-Asr", arabicName: "العصر", versesCount: 3 },
		{ number: 104, name: "Al-Humazah", arabicName: "الهمزة", versesCount: 9 },
		{ number: 105, name: "Al-Fil", arabicName: "الفيل", versesCount: 5 },
		{ number: 106, name: "Quraish", arabicName: "قريش", versesCount: 4 },
		{ number: 107, name: "Al-Ma'un", arabicName: "الماعون", versesCount: 7 },
		{ number: 108, name: "Al-Kawthar", arabicName: "الكوثر", versesCount: 3 },
		{ number: 109, name: "Al-Kafirun", arabicName: "الكافرون", versesCount: 6 },
		{ number: 110, name: "An-Nasr", arabicName: "النصر", versesCount: 3 },
		{ number: 111, name: "Al-Masad", arabicName: "المسد", versesCount: 5 },
		{ number: 112, name: "Al-Ikhlas", arabicName: "الإخلاص", versesCount: 4 },
		{ number: 113, name: "Al-Falaq", arabicName: "الفلق", versesCount: 5 },
		{ number: 114, name: "An-Nas", arabicName: "الناس", versesCount: 6 }
	];

	const juzs = [
		{ number: 1, name: "Alif Lam Mim", surahs: "1:1 - 2:141" },
		{ number: 2, name: "Sayaqul", surahs: "2:142 - 2:252" },
		{ number: 3, name: "Tilka 'r-Rusul", surahs: "2:253 - 3:92" },
		{ number: 4, name: "Lantanalu", surahs: "3:93 - 4:23" },
		{ number: 5, name: "Wal Mohsanat", surahs: "4:24 - 4:147" },
		{ number: 6, name: "Ya Ayyuha 'lladhina Amanu", surahs: "4:148 - 5:81" },
		{ number: 7, name: "Wa Iza Sami'u", surahs: "5:82 - 6:110" },
		{ number: 8, name: "Wa Lau Annana", surahs: "6:111 - 7:87" },
		{ number: 9, name: "Qad Aflaha", surahs: "7:88 - 8:40" },
		{ number: 10, name: "Wa A’lamu", surahs: "8:41 - 9:92" },
		{ number: 11, name: "Ya’tadhiruna", surahs: "9:93 - 11:5" },
		{ number: 12, name: "Wa Mamin Da’aba", surahs: "11:6 - 12:52" },
		{ number: 13, name: "Wa Ma Ubrioo", surahs: "12:53 - 14:52" },
		{ number: 14, name: "Rubama", surahs: "15:1 - 16:128" },
		{ number: 15, name: "Subhana 'lladhi", surahs: "17:1 - 18:74" },
		{ number: 16, name: "Qal Alam", surahs: "18:75 - 20:135" },
		{ number: 17, name: "Aqtarabat", surahs: "21:1 - 22:78" },
		{ number: 18, name: "Qadd Aflaha", surahs: "23:1 - 25:20" },
		{ number: 19, name: "Wa Qalalladhina", surahs: "25:21 - 27:55" },
		{ number: 20, name: "A’man Khalaq", surahs: "27:56 - 29:45" },
		{ number: 21, name: "Utlu Ma Oohiya", surahs: "29:46 - 33:30" },
		{ number: 22, name: "Wa Manyaqnut", surahs: "33:31 - 36:21" },
		{ number: 23, name: "Wa Mali", surahs: "36:22 - 39:31" },
		{ number: 24, name: "Faman Azlam", surahs: "39:32 - 41:46" },
		{ number: 25, name: "Ilayhi Yuraddu", surahs: "41:47 - 45:37" },
		{ number: 26, name: "Ha Meem", surahs: "46:1 - 51:30" },
		{ number: 27, name: "Qala Fama Khatbukum", surahs: "51:31 - 57:29" },
		{ number: 28, name: "Qadd Sami’ Allah", surahs: "58:1 - 66:12" },
		{ number: 29, name: "Tabarakalladhi", surahs: "67:1 - 77:50" },
		{ number: 30, name: "Amma Yatasa’alun", surahs: "78:1 - 114:6" }
	];

	// Generate pages 1 to 604.
	const pages = Array.from({ length: 604 }, (_, i) => i + 1);

	// Simple fuzzy match: checks if query is a substring (case-insensitive).
	function fuzzyMatch(query, text) {
		if (!query) return true;
		return text.toLowerCase().includes(query.toLowerCase());
	}

	// Reactive filtered results based on the query.
	const filteredSurahs = $derived(surahs.filter(
		surah =>
			fuzzyMatch(query, surah.name) ||
			fuzzyMatch(query, surah.arabicName) ||
			fuzzyMatch(query, String(surah.number))
	));

	const filteredJuzs = $derived(juzs.filter(
		juz =>
			fuzzyMatch(query, juz.name) ||
			fuzzyMatch(query, juz.surahs) ||
			fuzzyMatch(query, String(juz.number))
	));

	const filteredPages = $derived(pages.filter(page => fuzzyMatch(query, String(page))));

	// Navigation functions.
	function handleSurahClick(surah) {
		goto(`/quran/surah/${surah.number}`);
	}

	function handleJuzClick(juz) {
		goto(`/quran/juz/${juz.number}`);
	}

	function handlePageClick(page) {
		goto(`/quran/page/${page}`);
	}

	let hadiths = $state([])

	onMount(() => {
		fetch('https://api.aayah.info/api/v1/hadith')
			.then(req => req.json()) // Fix: Call .json() as a function
			.then(res => {
				console.log(res);
				return Object.values(res?.data?.books || {}); // Fix: Ensure books exist
			})
			.then(array => {
				hadiths = [...hadiths, ...array.map(el => ({
					label: el.name,
					link: `/hadith/books/${el.id}`
				}))];

				array.forEach(arr => {
					arr.collection.forEach((col, i) => {
						hadiths.push({ // Fix: Use .push() instead of creating new arrays
							label: col,
							link: `/hadith/books/${arr.id}/${i}`
						});
					});
				});
			})
			.catch(e => toast.error(e?.message))
			.finally(() => toast.info(`${hadiths.length}`)); // Fix: Use .length instead of .count

	})
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
			<a href="/" class="font-secondary text-lg font-semibold">
				<img class="size-6" src="/logo.png" alt="aayah.info" />
			</a>
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
		<Command.Input
			placeholder="Search Quran, Hadith, Dua and more..."
			bind:value={query}
		/>

		<Command.List>
			{#if !filteredSurahs.length && !filteredJuzs.length && !filteredPages.length}
				<Command.Empty>No results found.</Command.Empty>
			{/if}

			{#if filteredSurahs.length}
				<Command.Group heading="Surahs">
					{#each filteredSurahs.slice(0,4) as surah}
						<Command.Item onclick={() => handleSurahClick(surah)}>
							<div class="flex flex-col">
								<span class="font-secondary">{surah.name}</span>
								<span class="font-ar-primary text-sm text-muted-foreground">
                {surah.arabicName}
              </span>
							</div>
						</Command.Item>
					{/each}
				</Command.Group>
			{/if}

			{#if filteredJuzs.length}
				<Command.Group heading="Juzs">
					{#each filteredJuzs.slice(0,3) as juz}
						<Command.Item onclick={() => handleJuzClick(juz)}>
							<div class="flex flex-col">
								<span class="font-secondary">{juz.name}</span>
								<span class="text-sm text-muted-foreground">
                {juz.surahs}
              </span>
							</div>
						</Command.Item>
					{/each}
				</Command.Group>
			{/if}

			{#if filteredPages.length}
				<Command.Group heading="Pages">
					{#each filteredPages.slice(0,3) as page}
						<Command.Item onclick={() => handlePageClick(page)}>
							<div class="flex items-center">
								<span>Page {page}</span>
							</div>
						</Command.Item>
					{/each}
				</Command.Group>
			{/if}

			<Command.Separator />

			<Command.Group heading="Actions">
				<Command.Item onclick={() => (showVoiceSearch = !showVoiceSearch)}>
					<div class="flex items-center">
						<Mic class="mr-2 h-4 w-4" />
						<span>Voice Search (AI)</span>
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
