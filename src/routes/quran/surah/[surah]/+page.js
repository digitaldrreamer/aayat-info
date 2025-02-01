export const load = async ({ params, fetch }) => {
	const { surah } = params
	const fetchSurah = async (num) => {
		const req = await fetch(`http://localhost:5175/api/v1/quran/ara-qurandoorinonun/surah/${num}?audio=Alafasy_128kbps&tafsir=en-tafisr-ibn-kathir`)
		const res = await req.json()
		const quranReq = await fetch('http://localhost:5175/api/v1/quran')
		const quranRes = await quranReq.json()
		return {
			success: res?.success && quranRes?.success,
			data: {
				...quranRes.data.quran.chapters.find(c => c.chapter === Number(surah)),
				...res.data
			}

		}
	}
	return {
		surah: fetchSurah(surah)
	}
}