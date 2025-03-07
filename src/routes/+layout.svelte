<script>
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { AudioRecorder } from '$lib/components/search/index';
	import { Button } from '$lib/components/ui/button/index';
	import { ArrowLeft, AudioLines, CircleHelp, History, Home, Mic, Plus, Rss, Search } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Menubar from '$lib/components/ui/menubar/index';
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { writable } from 'svelte/store';
	import { toast } from 'svelte-sonner';

	const installPrompt = writable(null);
	const isInstalled = writable(false);

	const checkInstalled = async () => {
		if (window.navigator.standalone) {
			isInstalled.set(true);
			return;
		}

		if (window.matchMedia('(display-mode: standalone)').matches) {
			isInstalled.set(true);
			return;
		}

		try {
			// @ts-ignore
			const relatedApps = await navigator.getInstalledRelatedApps?.() || [];
			if (relatedApps.length > 0) {
				isInstalled.set(true);
			}
		} catch (e) {
			console.log('Could not check for installed related apps:', e);
		}
	};

	const handleInstall = async () => {
		const prompt = $installPrompt;
		if (!prompt) return;

		try {
			await prompt.prompt();
			const result = await prompt.userChoice;
			if (result.outcome === 'accepted') {
				isInstalled.set(true);
				installPrompt.set(null);
			}
			console.log('Install prompt result:', result);
		} catch (e) {
			console.error('Installation failed:', e);
		}
	};

	let scrollIntervalId = $state(null);
	let attempts = $state(0);

	// Utility function to handle scrolling to hash elements with retry logic
	function createHashScrollHandler(options = {}) {
		const {
			maxAttempts = 50,
			interval = 100,
			highlightDuration = 3000,
			highlightClasses = ['bg-yellow-200', 'underline', 'decoration-yellow-400']
		} = options;



		function scrollToHashElement(hash) {
			if (!hash) return null;

			const elementId = hash.slice(1); // Remove the # from the hash
			const element = document.getElementById(elementId);

			if (element) {
				// Clear any existing highlight timeouts
				const existingTimeoutId = element.dataset.highlightTimeoutId;
				if (existingTimeoutId) {
					clearTimeout(Number(existingTimeoutId));
				}

				// Schedule the scroll and highlight
				setTimeout(() => {
					// Scroll the element into view
					element.scrollIntoView({
						behavior: 'smooth',
						block: 'start'
					});

					// Add highlight classes
					element.classList.add(...highlightClasses);

					// Remove highlight classes after duration
					const timeoutId = setTimeout(() => {
						element.classList.remove(...highlightClasses);
						delete element.dataset.highlightTimeoutId;
					}, highlightDuration);

					// Store the timeout ID for cleanup
					element.dataset.highlightTimeoutId = timeoutId;
				}, 100);

				return true;
			}

			return false;
		}

		function startScrollAttempts(hash) {
			attempts = 0;

			// Try immediate scroll first
			if (scrollToHashElement(hash)) {
				return null; // Success, no need for interval
			}

			// If immediate scroll fails, start polling
			return setInterval(() => {
				attempts++;

				if (attempts >= maxAttempts) {
					clearInterval(scrollIntervalId);
					console.log(`Failed to find element with hash ${hash} after ${maxAttempts} attempts`);
					return;
				}

				if (scrollToHashElement(hash)) {
					clearInterval(scrollIntervalId);
				}
			}, interval);
		}

		function cleanup() {
			if (scrollIntervalId) {
				clearInterval(scrollIntervalId);
			}

			// Clean up any existing highlights
			const hash = window.location.hash.slice(1);
			if (hash) {
				const element = document.getElementById(hash);
				if (element) {
					element.classList.remove(...highlightClasses);
					const timeoutId = element.dataset.highlightTimeoutId;
					if (timeoutId) {
						clearTimeout(Number(timeoutId));
						delete element.dataset.highlightTimeoutId;
					}
				}
			}
		}

		// Return the public interface
		return {
			initialize(hash = window.location.hash) {
				cleanup();
				if (hash) {
					scrollIntervalId = startScrollAttempts(hash);
				}
			},
			cleanup
		};
	}

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(r) {
					console.log('Service Worker registered:', r);
				},
				onRegisterError(error) {
					console.error('Service Worker registration error:', error);
				}
			});
		}

		await checkInstalled();

		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			installPrompt.set(e);
			console.log('Install prompt event captured');
		});

		window.addEventListener('appinstalled', () => {
			isInstalled.set(true);
			installPrompt.set(null);
			console.log('PWA was installed');
		});

		const scrollHandler = createHashScrollHandler({
			maxAttempts: 50,
			interval: 100,
			highlightDuration: 3000,
			highlightClasses: ['bg-yellow-200', 'underline', 'decoration-yellow-400']
		});

		scrollHandler.initialize();

		return () => {
			scrollHandler.cleanup();
		};
	});

	const webManifest = $state(pwaInfo ? pwaInfo.webManifest.linkTag : '');


	function range(start, end) {
		// Ensure that start is less than or equal to end
		if (start > end) [start, end] = [end, start];

		// Create an array with the desired length and fill it with consecutive numbers
		return Array.from({ length: end - start + 1 }, (_, index) => start + index);
	}

	let { children, data } = $props();

	let hadiths = data.hadiths;


	const pages = range(1, 604);

	const juzs = [
		{ number: 1, name: 'Alif Lam Mim', surahs: '1:1 - 2:141' },
		{ number: 2, name: 'Sayaqul', surahs: '2:142 - 2:252' },
		{ number: 3, name: 'Tilka \'r-Rusul', surahs: '2:253 - 3:92' },
		{ number: 4, name: 'Lantanalu', surahs: '3:93 - 4:23' },
		{ number: 5, name: 'Wal Mohsanat', surahs: '4:24 - 4:147' },
		{ number: 6, name: 'Ya Ayyuha \'lladhina Amanu', surahs: '4:148 - 5:81' },
		{ number: 7, name: 'Wa Iza Sami\'u', surahs: '5:82 - 6:110' },
		{ number: 8, name: 'Wa Lau Annana', surahs: '6:111 - 7:87' },
		{ number: 9, name: 'Qad Aflaha', surahs: '7:88 - 8:40' },
		{ number: 10, name: 'Wa A’lamu', surahs: '8:41 - 9:92' },
		{ number: 11, name: 'Ya’tadhiruna', surahs: '9:93 - 11:5' },
		{ number: 12, name: 'Wa Mamin Da’aba', surahs: '11:6 - 12:52' },
		{ number: 13, name: 'Wa Ma Ubrioo', surahs: '12:53 - 14:52' },
		{ number: 14, name: 'Rubama', surahs: '15:1 - 16:128' },
		{ number: 15, name: 'Subhana \'lladhi', surahs: '17:1 - 18:74' },
		{ number: 16, name: 'Qal Alam', surahs: '18:75 - 20:135' },
		{ number: 17, name: 'Aqtarabat', surahs: '21:1 - 22:78' },
		{ number: 18, name: 'Qadd Aflaha', surahs: '23:1 - 25:20' },
		{ number: 19, name: 'Wa Qalalladhina', surahs: '25:21 - 27:55' },
		{ number: 20, name: 'A’man Khalaq', surahs: '27:56 - 29:45' },
		{ number: 21, name: 'Utlu Ma Oohiya', surahs: '29:46 - 33:30' },
		{ number: 22, name: 'Wa Manyaqnut', surahs: '33:31 - 36:21' },
		{ number: 23, name: 'Wa Mali', surahs: '36:22 - 39:31' },
		{ number: 24, name: 'Faman Azlam', surahs: '39:32 - 41:46' },
		{ number: 25, name: 'Ilayhi Yuraddu', surahs: '41:47 - 45:37' },
		{ number: 26, name: 'Ha Meem', surahs: '46:1 - 51:30' },
		{ number: 27, name: 'Qala Fama Khatbukum', surahs: '51:31 - 57:29' },
		{ number: 28, name: 'Qadd Sami’ Allah', surahs: '58:1 - 66:12' },
		{ number: 29, name: 'Tabarakalladhi', surahs: '67:1 - 77:50' },
		{ number: 30, name: 'Amma Yatasa’alun', surahs: '78:1 - 114:6' }
	];
	const surahs = [
		{ number: 1, name: 'Al-Fatihah', arabicName: 'الفاتحة', versesCount: 7 },
		{ number: 2, name: 'Al-Baqarah', arabicName: 'البقرة', versesCount: 286 },
		{ number: 3, name: 'Ali \'Imran', arabicName: 'آل عمران', versesCount: 200 },
		{ number: 4, name: 'An-Nisa', arabicName: 'النساء', versesCount: 176 },
		{ number: 5, name: 'Al-Ma\'idah', arabicName: 'المائدة', versesCount: 120 },
		{ number: 6, name: 'Al-An\'am', arabicName: 'الأنعام', versesCount: 165 },
		{ number: 7, name: 'Al-A\'raf', arabicName: 'الأعراف', versesCount: 206 },
		{ number: 8, name: 'Al-Anfal', arabicName: 'الأنفال', versesCount: 75 },
		{ number: 9, name: 'At-Tawbah', arabicName: 'التوبة', versesCount: 129 },
		{ number: 10, name: 'Yunus', arabicName: 'يونس', versesCount: 109 },
		{ number: 11, name: 'Hud', arabicName: 'هود', versesCount: 123 },
		{ number: 12, name: 'Yusuf', arabicName: 'يوسف', versesCount: 111 },
		{ number: 13, name: 'Ar-Ra\'d', arabicName: 'الرعد', versesCount: 43 },
		{ number: 14, name: 'Ibrahim', arabicName: 'إبراهيم', versesCount: 52 },
		{ number: 15, name: 'Al-Hijr', arabicName: 'الحجر', versesCount: 99 },
		{ number: 16, name: 'An-Nahl', arabicName: 'النحل', versesCount: 128 },
		{ number: 17, name: 'Al-Isra', arabicName: 'الإسراء', versesCount: 111 },
		{ number: 18, name: 'Al-Kahf', arabicName: 'الكهف', versesCount: 110 },
		{ number: 19, name: 'Maryam', arabicName: 'مريم', versesCount: 98 },
		{ number: 20, name: 'Taha', arabicName: 'طه', versesCount: 135 },
		{ number: 21, name: 'Al-Anbiya', arabicName: 'الأنبياء', versesCount: 112 },
		{ number: 22, name: 'Al-Hajj', arabicName: 'الحج', versesCount: 78 },
		{ number: 23, name: 'Al-Mu’minun', arabicName: 'المؤمنون', versesCount: 118 },
		{ number: 24, name: 'An-Nur', arabicName: 'النور', versesCount: 64 },
		{ number: 25, name: 'Al-Furqan', arabicName: 'الفرقان', versesCount: 77 },
		{ number: 26, name: 'Ash-Shu\'ara', arabicName: 'الشعراء', versesCount: 227 },
		{ number: 27, name: 'An-Naml', arabicName: 'النمل', versesCount: 93 },
		{ number: 28, name: 'Al-Qasas', arabicName: 'القصص', versesCount: 88 },
		{ number: 29, name: 'Al-Ankabut', arabicName: 'العنكبوت', versesCount: 69 },
		{ number: 30, name: 'Ar-Rum', arabicName: 'الروم', versesCount: 60 },
		{ number: 31, name: 'Luqman', arabicName: 'لقمان', versesCount: 34 },
		{ number: 32, name: 'As-Sajdah', arabicName: 'السجدة', versesCount: 30 },
		{ number: 33, name: 'Al-Ahzab', arabicName: 'الأحزاب', versesCount: 73 },
		{ number: 34, name: 'Saba', arabicName: 'سبأ', versesCount: 54 },
		{ number: 35, name: 'Fatir', arabicName: 'فاطر', versesCount: 45 },
		{ number: 36, name: 'Ya-Sin', arabicName: 'يس', versesCount: 83 },
		{ number: 37, name: 'As-Saffat', arabicName: 'الصافات', versesCount: 182 },
		{ number: 38, name: 'Sad', arabicName: 'ص', versesCount: 88 },
		{ number: 39, name: 'Az-Zumar', arabicName: 'الزمر', versesCount: 75 },
		{ number: 40, name: 'Ghafir', arabicName: 'غافر', versesCount: 85 },
		{ number: 41, name: 'Fussilat', arabicName: 'فصلت', versesCount: 54 },
		{ number: 42, name: 'Ash-Shura', arabicName: 'الشورى', versesCount: 53 },
		{ number: 43, name: 'Az-Zukhruf', arabicName: 'الزخرف', versesCount: 89 },
		{ number: 44, name: 'Ad-Dukhan', arabicName: 'الدخان', versesCount: 59 },
		{ number: 45, name: 'Al-Jathiyah', arabicName: 'الجاثية', versesCount: 37 },
		{ number: 46, name: 'Al-Ahqaf', arabicName: 'الأحقاف', versesCount: 35 },
		{ number: 47, name: 'Muhammad', arabicName: 'محمد', versesCount: 38 },
		{ number: 48, name: 'Al-Fath', arabicName: 'الفتح', versesCount: 29 },
		{ number: 49, name: 'Al-Hujurat', arabicName: 'الحجرات', versesCount: 18 },
		{ number: 50, name: 'Qaf', arabicName: 'ق', versesCount: 45 },
		{ number: 51, name: 'Adh-Dhariyat', arabicName: 'الذاريات', versesCount: 60 },
		{ number: 52, name: 'At-Tur', arabicName: 'الطور', versesCount: 49 },
		{ number: 53, name: 'An-Najm', arabicName: 'النجم', versesCount: 62 },
		{ number: 54, name: 'Al-Qamar', arabicName: 'القمر', versesCount: 55 },
		{ number: 55, name: 'Ar-Rahman', arabicName: 'الرحمن', versesCount: 78 },
		{ number: 56, name: 'Al-Waqi’ah', arabicName: 'الواقعة', versesCount: 96 },
		{ number: 57, name: 'Al-Hadid', arabicName: 'الحديد', versesCount: 29 },
		{ number: 58, name: 'Al-Mujadilah', arabicName: 'المجادلة', versesCount: 22 },
		{ number: 59, name: 'Al-Hashr', arabicName: 'الحشر', versesCount: 24 },
		{ number: 60, name: 'Al-Mumtahanah', arabicName: 'الممتحنة', versesCount: 13 },
		{ number: 61, name: 'As-Saff', arabicName: 'الصف', versesCount: 14 },
		{ number: 62, name: 'Al-Jumu\'ah', arabicName: 'الجمعة', versesCount: 11 },
		{ number: 63, name: 'Al-Munafiqun', arabicName: 'المنافقون', versesCount: 11 },
		{ number: 64, name: 'At-Taghabun', arabicName: 'التغابن', versesCount: 18 },
		{ number: 65, name: 'At-Talaq', arabicName: 'الطلاق', versesCount: 12 },
		{ number: 66, name: 'At-Tahrim', arabicName: 'التحريم', versesCount: 12 },
		{ number: 67, name: 'Al-Mulk', arabicName: 'الملك', versesCount: 30 },
		{ number: 68, name: 'Al-Qalam', arabicName: 'القلم', versesCount: 52 },
		{ number: 69, name: 'Al-Haqqah', arabicName: 'الحاقة', versesCount: 52 },
		{ number: 70, name: 'Al-Ma\'arij', arabicName: 'المعارج', versesCount: 44 },
		{ number: 71, name: 'Nuh', arabicName: 'نوح', versesCount: 28 },
		{ number: 72, name: 'Al-Jinn', arabicName: 'الجن', versesCount: 28 },
		{ number: 73, name: 'Al-Muzzammil', arabicName: 'المزمل', versesCount: 20 },
		{ number: 74, name: 'Al-Muddathir', arabicName: 'المدثر', versesCount: 56 },
		{ number: 75, name: 'Al-Qiyamah', arabicName: 'القيامة', versesCount: 40 },
		{ number: 76, name: 'Al-Insan', arabicName: 'الإنسان', versesCount: 31 },
		{ number: 77, name: 'Al-Mursalat', arabicName: 'المرسلات', versesCount: 50 },
		{ number: 78, name: 'An-Naba', arabicName: 'النبأ', versesCount: 40 },
		{ number: 79, name: 'An-Nazi\'at', arabicName: 'النازعات', versesCount: 46 },
		{ number: 80, name: 'Abasa', arabicName: 'عبس', versesCount: 42 },
		{ number: 81, name: 'At-Takwir', arabicName: 'التكوير', versesCount: 29 },
		{ number: 82, name: 'Al-Infitar', arabicName: 'الإنفطار', versesCount: 19 },
		{ number: 83, name: 'Al-Mutaffifin', arabicName: 'المطففين', versesCount: 36 },
		{ number: 84, name: 'Al-Inshiqaq', arabicName: 'الإنشقاق', versesCount: 25 },
		{ number: 85, name: 'Al-Buruj', arabicName: 'البروج', versesCount: 22 },
		{ number: 86, name: 'At-Tariq', arabicName: 'الطارق', versesCount: 17 },
		{ number: 87, name: 'Al-A\'la', arabicName: 'الأعلى', versesCount: 19 },
		{ number: 88, name: 'Al-Ghashiyah', arabicName: 'الغاشية', versesCount: 26 },
		{ number: 89, name: 'Al-Fajr', arabicName: 'الفجر', versesCount: 30 },
		{ number: 90, name: 'Al-Balad', arabicName: 'البلد', versesCount: 20 },
		{ number: 91, name: 'Ash-Shams', arabicName: 'الشمس', versesCount: 15 },
		{ number: 92, name: 'Al-Lail', arabicName: 'الليل', versesCount: 21 },
		{ number: 93, name: 'Ad-Duhaa', arabicName: 'الضحى', versesCount: 11 },
		{ number: 94, name: 'Ash-Sharh', arabicName: 'الشرح', versesCount: 8 },
		{ number: 95, name: 'At-Tin', arabicName: 'التين', versesCount: 8 },
		{ number: 96, name: 'Al-\'Alaq', arabicName: 'العلق', versesCount: 19 },
		{ number: 97, name: 'Al-Qadr', arabicName: 'القدر', versesCount: 5 },
		{ number: 98, name: 'Al-Bayyinah', arabicName: 'البينة', versesCount: 8 },
		{ number: 99, name: 'Az-Zalzalah', arabicName: 'الزلزلة', versesCount: 8 },
		{ number: 100, name: 'Al-Adiyat', arabicName: 'العاديات', versesCount: 11 },
		{ number: 101, name: 'Al-Qari\'ah', arabicName: 'القارعة', versesCount: 11 },
		{ number: 102, name: 'At-Takathur', arabicName: 'التكاثر', versesCount: 8 },
		{ number: 103, name: 'Al-Asr', arabicName: 'العصر', versesCount: 3 },
		{ number: 104, name: 'Al-Humazah', arabicName: 'الهمزة', versesCount: 9 },
		{ number: 105, name: 'Al-Fil', arabicName: 'الفيل', versesCount: 5 },
		{ number: 106, name: 'Quraish', arabicName: 'قريش', versesCount: 4 },
		{ number: 107, name: 'Al-Ma\'un', arabicName: 'الماعون', versesCount: 7 },
		{ number: 108, name: 'Al-Kawthar', arabicName: 'الكوثر', versesCount: 3 },
		{ number: 109, name: 'Al-Kafirun', arabicName: 'الكافرون', versesCount: 6 },
		{ number: 110, name: 'An-Nasr', arabicName: 'النصر', versesCount: 3 },
		{ number: 111, name: 'Al-Masad', arabicName: 'المسد', versesCount: 5 },
		{ number: 112, name: 'Al-Ikhlas', arabicName: 'الإخلاص', versesCount: 4 },
		{ number: 113, name: 'Al-Falaq', arabicName: 'الفلق', versesCount: 5 },
		{ number: 114, name: 'An-Nas', arabicName: 'الناس', versesCount: 6 }
	];


	// Standard booleans for state
	let open = $state(false);
	let query = $state('');
	let showVoiceSearch = $state(false)

	// Utility function to normalize text for searching
	function normalizeText(text) {
		return text.toLowerCase()
			.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
			.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
			.replace(/[^\w\s]/g, '');
	}


	function handleKeydown(e) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}





</script>

<svelte:head>
	{@html webManifest}
	<meta name="theme-color" content="#ffffff"/>
<meta name="google" content="notranslate">
	<link rel="apple-touch-icon" href="/pwa-192x192.png">
		<!-- Standard Meta Tags -->
		<title>Aayah.info – A Minimalist Muslim Companion</title>
		<meta name="description" content="Aayah.info is a minimalist Muslim companion web app. Find Hadith, read and listen to the Quran, see Duas, stream Mufti Menk podcasts, and test your Murajah." />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />

		<!-- Open Graph Meta Tags (For Facebook, LinkedIn, etc.) -->
		<meta property="og:title" content="Aayah.info – A Minimalist Muslim Companion" />
		<meta property="og:description" content="Find Hadith, read and listen to the Quran, see Duas, stream Mufti Menk podcasts, and test your Murajah—all in a clean, minimalist experience." />
		<meta property="og:image" content="https://i.postimg.cc/SRXkS6vq/1.png" />
		<meta property="og:url" content="https://aayah.info" />
		<meta property="og:type" content="website" />

		<!-- Twitter Card Meta Tags -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content="Aayah.info – A Minimalist Muslim Companion" />
		<meta name="twitter:description" content="Find Hadith, read and listen to the Quran, see Duas, stream Mufti Menk podcasts, and test your Murajah—all in a clean, minimalist experience." />
		<meta name="twitter:image" content="https://i.postimg.cc/SRXkS6vq/1.png" />
		<meta name="twitter:url" content="https://aayah.info" />

	<script defer src="https://umami-one-omega.vercel.app/script.js" data-website-id="5167e72f-6d85-49d7-ba7f-a4cf09e19490"></script>
</svelte:head>

<svelte:document onkeydown={handleKeydown} />

<div class="h-screen bg-background text-foreground font-primary flex flex-col">
	<!-- Top Bar -->
	<header
		class="fixed top-0 left-0 right-0 h-14 px-4 border-b bg-background/80 backdrop-blur-sm z-50"
		in:fly={{ y: -20, duration: 300, easing: quintOut }}
	>
		<div class="h-full flex items-center justify-between max-w-screen-2xl mx-auto">
			<div class="flex items-center gap-2">
				{#if page.url.pathname !== "/"}
					<Button title="Go Back" onclick={() => {
            if (window.history.length === 0) goto('/')
            else window.history.back()
          }} variant="ghost" size="icon">
						<ArrowLeft class="mr-2 size-5" />
					</Button>
				{/if}
				<Button title="Home" variant="ghost" size="icon" onclick={() => (goto('/'))}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
							 stroke="currentColor" class="size-6">
						<path stroke-linecap="round" stroke-linejoin="round"
									d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
					</svg>
				</Button>
			</div>

			<a href="/" class="font-secondary text-lg font-semibold">
				<img class="size-6" src="/logo.png" alt="aayah.info" />
			</a>

			<div class="flex items-center gap-2">
<!--				<Button title="Pitch" onclick={() => (goto('/pitch'))} variant="ghost" size="icon">-->
<!--					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"-->
<!--							 stroke="currentColor" class="size-6">-->
<!--						<path stroke-linecap="round" stroke-linejoin="round"-->
<!--									d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />-->
<!--					</svg>-->
<!--				</Button>-->
				{#if $isInstalled && !$installPrompt}
				<Button title="Developer Notice" variant="ghost" onclick={() => (goto('/dev-notice'))} size="icon">
					<CircleHelp class="size-5" />
				</Button>
					{/if}
				<Button title="Sitemap" href="/sitemap.xml" variant="link">
					<Rss class="size-5" />
				</Button>
<!--				<Button title="Settings" variant="ghost" onclick={() => (goto('/settings'))} size="icon">-->
<!--					<Settings class="size-5" />-->
<!--				</Button>-->
				{#if !$isInstalled && $installPrompt}
				<Button title="Install Webapp" variant="ghost" onclick={handleInstall} size="icon">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
									</svg>

								</Button>
					{/if}

			</div>
		</div>
	</header>

	<!-- Main Content Area -->
	<main class="flex-grow pt-16 pb-20 container max-w-screen-2xl mx-auto p-4">
		{@render children?.()}
	</main>


	{#if page.url.pathname !== '/podcasts' && page.url.pathname !== '/test' && !page.url.pathname.startsWith('/quiz') && page.url.pathname !== ('/pitch')}
	<!-- Mobile Bottom Navigation -->
	<nav
		class="md:hidden fixed bottom-4 inset-x-4 h-14 bg-background border rounded-full shadow-lg z-50"
		in:fly={{ y: 20, duration: 300, easing: quintOut }}
	>
		<div class="relative h-full flex items-center justify-between px-6">
			<Button
				variant="ghost"
				class="flex flex-col items-center gap-1"
				onclick={() => goto('/search')}
			>
				<Search class="w-5 h-5" />
				<span class="text-xs">Search</span>
			</Button>

			<div class="absolute left-1/2 -translate-x-1/2 -top-6">
				<Button
					class="h-16 w-16 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-50 shadow-md"
					onclick={() => toast.info('Voice Search', {
						description: "Voice search is being fixed and is temporarily unavailable."
					})}
				>
					<Mic class="w-6 h-6" />
				</Button>
			</div>

			<Button
				variant="ghost"
				class="flex flex-col items-center gap-1"
				onclick={() => goto('/podcasts')}
			>
				<AudioLines class="w-5 h-5" />
				<span class="text-xs">Podcasts</span>
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
						<Menubar.Item onclick={() => toast.info('Voice Search', {
						description: "Voice search is being fixed and is temporarily unavailable."
					})}>
							Audio Search
						</Menubar.Item>
							<Menubar.Item onclick={() => {
								goto('/search')
							}}>
								Text Search
							</Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>
				<Menubar.Menu>
					<Menubar.Trigger>Home</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item onclick={() => goto('/')}>
						Go Home
						</Menubar.Item>
						{#if !$isInstalled && $installPrompt}
						<Menubar.Item onclick={handleInstall}>
							Install WebApp
						</Menubar.Item>
							{/if}
					</Menubar.Content>
				</Menubar.Menu>

				<Menubar.Menu>
					<Menubar.Trigger>Links</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item inset onclick={() => goto('/quran')}>
							Qur'an
						</Menubar.Item>
						<Menubar.Item inset onclick={() => goto('/hadith')}>
							Hadith
						</Menubar.Item>
						<Menubar.Item inset onclick={() => goto('/podcasts')}>
							Podcasts
						</Menubar.Item>
						<Menubar.Item inset onclick={() => goto('/dua')}>
							Dua
						</Menubar.Item>
						<Menubar.Item inset onclick={() => goto('/quran/quiz')}>
							Murajah Quiz
						</Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>

				<Menubar.Menu>
					<Menubar.Trigger>More</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item onclick={() => goto('/pitch')}>
							Hackathon Pitch
						</Menubar.Item>
						<Menubar.Item onclick={() => goto('/dev-notice')}>
							Dev Note
						</Menubar.Item>
						<Menubar.Separator />
						<Menubar.Sub>
							<Menubar.SubTrigger>Open Source</Menubar.SubTrigger>
							<Menubar.SubContent>
								<Menubar.Item onclick={() => window.open('https://github.com/digitaldrreamer/aayat-info')}>
									Frontend Repo
								</Menubar.Item>
								<Menubar.Item onclick={() => window.open('https://github.com/digitaldrreamer/aayah-info-api')}>
									Backend Repo
								</Menubar.Item>
								<Menubar.Item onclick={() => window.open('https://api.aayah.info')}>
									API Docs
								</Menubar.Item>
								<Menubar.Item onclick={() => window.open('https://liktr.ee/digitaldrreamer')}>
									Contact Dev
								</Menubar.Item>
							</Menubar.SubContent>
						</Menubar.Sub>
					</Menubar.Content>
				</Menubar.Menu>
			</Menubar.Root>
		</div>
	</div>

	<!-- Audio Recorder Component -->
	<AudioRecorder bind:isOpen={showVoiceSearch} />
		{/if}

	<!-- Toast Notifications -->
	<Toaster />
</div>

<style>
    :global(.bg-yellow-200) {
        transition: background-color 0.3s ease-in-out;
    }
</style>