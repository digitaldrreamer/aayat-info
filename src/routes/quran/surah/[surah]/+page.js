export const load = async ({ params, fetch }) => {
	const { surah } = params
	const fetchSurah = async (num) => {
		const req = await fetch(`https://api/aayah.info/api/v1/quran/ara-qurandoorinonun/surah/${num}?audio=Alafasy_128kbps&tafsir=en-tafisr-ibn-kathir`)
		const res = await req.json()
		const transReq = await fetch(`https://api/aayah.info/api/v1/quran/eng-abdullahyusufal/surah/${num}?audio=Alafasy_128kbps&tafsir=en-tafisr-ibn-kathir`)
		const transRes = await transReq.json()
		const quranReq = await fetch('https://api/aayah.info/api/v1/quran')
		const quranRes = await quranReq.json()
		return {
			success: res?.success && quranRes?.success,
			data: {
				...quranRes.data.quran.chapters.find(c => c.chapter === Number(surah)),
				verses: [
					...res.data.verses.map((v, i) => {
						return {
							...v,
							translation: transRes.data.verses[i].text
						}
				})
				]
			}

		}
	}
	return {
		surah: fetchSurah(surah)
	}
}