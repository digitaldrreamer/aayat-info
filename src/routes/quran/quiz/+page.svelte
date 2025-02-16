<script lang="ts">
	import { Button } from "$lib/components/ui/button/index";
	import * as Card from "$lib/components/ui/card/index";
	import { Brain, PlayCircle } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import * as Select from "$lib/components/ui/select/index.js";
	import { user } from '$lib/stores/settings'
	import { toast } from 'svelte-sonner';

	function startQuiz() {
		// Implement navigation to QuizPage
		goto('/quran/quiz/start')
	}

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

const checkFromValidity = (value) => {
	if (Number(value) > Number($user.quiz.to)) {
		toast.error('Starting surah cannot be greater than ending surah', {
			duration: 8000,
			description: "Defaults back to ending surah"
		})
		$user.quiz.from = $user.quiz.to
	}
}

const checkToValidity = (value) => {
	if (Number(value) < Number($user.quiz.from)) {
		toast.error('Ending surah cannot be less than starting surah', {
			duration: 8000,
			description: "Defaults back to starting surah"
		})
		$user.quiz.to = $user.quiz.from
	}
}
</script>

<svelte:head>
	<title>Test your Quran Memorisation on Aayah.info – A Minimalist Muslim Companion</title>
	<meta property="og:title" content="Test your Quran Memorisation on Aayah.info – A Minimalist Muslim Companion" />
	<meta name="twitter:title" content="Test your Quran Memorisation on Aayah.info – A Minimalist Muslim Companion" />
</svelte:head>

<div class="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title class="text-2xl font-bold text-center flex flex-col justify-center items-center">
				<Brain class="size-12 mb-4" />

				Quran Quiz Challenge</Card.Title>
			<Card.Description class="text-center">Test your knowledge of the Quran</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<p class="text-center">Are you ready to challenge yourself with questions about the Quran?</p>
			<ul class="list-disc list-inside">
				<li>{$user.quiz.questions} questions</li>
				<li>Multiple choice answers</li>
				<li>Audio clips from the Quran</li>
				<li>Track your progress</li>
			</ul>

			<label for="from-surah" class="block text-sm font-medium text-gray-700">From Surah {surahs.find(sur => sur.number === $user.quiz.from)?.name}</label>
			<Select.Root type="single" onValueChange={checkFromValidity} bind:value={$user.quiz.from} id="from-surah">
				<Select.Trigger class="w-full">
					{surahs.find(sur => sur.number === Number($user.quiz.from))?.name} {surahs.find(sur => sur.number === Number($user.quiz.from))?.arabicName}
				</Select.Trigger>
				<Select.Content>
					{#each surahs as surah}
						<Select.Item value={String(surah.number)}>{surah.name} - {surah.arabicName}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<label for="to-surah" class="block text-sm font-medium text-gray-700">To Surah {surahs.find(sur => sur.number === $user.quiz.to)?.name}</label>
			<Select.Root type="single" onValueChange={checkToValidity} bind:value={$user.quiz.to} id="to-surah">
				<Select.Trigger class="w-full">
					{surahs.find(sur => sur.number === Number($user.quiz.to))?.name} {surahs.find(sur => sur.number === Number($user.quiz.to))?.arabicName}
				</Select.Trigger>
				<Select.Content>
					{#each surahs as surah}
						<Select.Item value={String(surah.number)}>{surah.name} - {surah.arabicName}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<label for="num-questions" class="block text-sm font-medium text-gray-700">Number of Questions</label>
			<Select.Root type="single" bind:value={$user.quiz.questions} id="num-questions">
				<Select.Trigger class="w-full">
					{$user.quiz.questions} Questions
				</Select.Trigger>
				<Select.Content>
					<Select.Item value={5}>5 Questions</Select.Item>
					<Select.Item value={10}>10 Questions</Select.Item>
					<Select.Item value={15}>15 Questions</Select.Item>
					<Select.Item value={20}>20 Questions</Select.Item>
					<Select.Item value={25}>25 Questions</Select.Item>
					<Select.Item value={30}>30 Questions</Select.Item>
				</Select.Content>
			</Select.Root>

		</Card.Content>
		<Card.Footer class="flex justify-center">
			<Button onclick={startQuiz} class="w-full">
				<PlayCircle class="mr-2 h-5 w-5" />
				Start Quiz
			</Button>
		</Card.Footer>
	</Card.Root>
</div>