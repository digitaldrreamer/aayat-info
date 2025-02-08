export const load = async ({ params, fetch }) => {
	const { juz } = params;

	const fetchSurah = async (num) => {
		try {
			// First fetch - Arabic verses
			const req = await fetch(`https://api.aayah.info/api/v1/quran/ara-qurandoorinonun/juz/${num}?audio=Alafasy_128kbps&tafsir=en-tafisr-ibn-kathir`);
			const res = await req.json();

			if (!res?.data?.juz) {
				throw new Error('Invalid Arabic verses response structure');
			}

			// Second fetch - English translation
			const transReq = await fetch(`https://api.aayah.info/api/v1/quran/eng-abdullahyusufal/juz/${num}?audio=Alafasy_128kbps&tafsir=en-tafisr-ibn-kathir`);
			const transRes = await transReq.json();

			if (!transRes?.data?.juz) {
				throw new Error('Invalid translation response structure');
			}

			// Get unique surah numbers
			const surahs = [...new Set(res.data.juz.map(v => v.chapter))];

			// Third fetch - Get surah metadata
			const newReq = await fetch('https://api.aayah.info/api/v1/quran/');
			const newRes = await newReq.json();

			if (!newRes?.data?.quran?.chapters) {
				throw new Error('Invalid metadata response structure');
			}

			const surahData = newRes.data.quran.chapters
				.filter(chap => surahs.includes(chap.chapter))
				.map(chap => ({
					chapter: chap.chapter,
					name: chap.name,
					revelation: chap.revelation,
					versesCount: chap.versesCount
				}));

			// Group verses by surah
			let currentSurah = null;
			let verses = [];
			let audioUrls = [];

			res.data.juz.forEach((arabicVerse, index) => {
				const translationVerse = transRes.data.juz[index];

				// If we encounter a new surah
				if (currentSurah !== arabicVerse.chapter) {
					currentSurah = arabicVerse.chapter;
					// Add basmalah audio for new surahs except Fatiha (1) and Tawbah (9)
					if (arabicVerse.chapter !== 1 && arabicVerse.chapter !== 9) {
						audioUrls.push(arabicVerse.audioUrl.replace(/\/[^\/]*$/, "/001001.mp3"));
					}
				}

				// Add the verse audio
				audioUrls.push(arabicVerse.audioUrl);

				verses.push({
					chapter: arabicVerse.chapter,
					verse: arabicVerse.verse,
					text: arabicVerse.text,
					translation: translationVerse.text,
					audioUrl: arabicVerse.audioUrl,
					tafsir: {
						text: translationVerse.tafsir.text
					}
				});
			});

			return {
				success: true,
				data: {
					verses,
					surahData,
					audioUrls
				}
			};

		} catch (error) {
			console.error('Error in fetchSurah:', {
				error: error.message,
				errorStack: error.stack,
				juzNumber: num
			});
			return {
				success: false,
				error: error.message,
				data: { verses: [], surahData: [], audioUrls: [] }
			};
		}
	};

	try {
		const juzData = fetchSurah(juz);


		return {
			juz: juzData,
			number: juz
		};
	} catch (error) {
		console.error('Error in load function:', {
			error: error.message,
			juzNumber: juz
		});
		throw error;
	}
};