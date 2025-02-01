export const load = async ({ params, fetch }) => {
	const { page } = params
	const fetchSurah = async (num) => {
		const req = await fetch(`https://api/aayah.info/api/v1/quran/ara-qurandoorinonun/page/${num}?audio=Alafasy_128kbps&tafsir=en-tafisr-ibn-kathir`)
		const res = await req.json()
		const transReq = await fetch(`https://api/aayah.info/api/v1/quran/eng-abdullahyusufal/page/${num}?audio=Alafasy_128kbps&tafsir=en-tafisr-ibn-kathir`)
		const transRes = await transReq.json()
		const surahs = res.data.verses.map(v => v.chapter)
		const newReq = await fetch('https://api/aayah.info/api/v1/quran/')
		const newRes = await newReq.json()
		let surahData = newRes.data.quran.chapters.filter(chap => surahs.includes(chap.chapter))

		return {
			success: res?.success,
			data: {
				verses: [
					...res.data.verses.map((v, i) => {
						return {
							...v,
							translation: transRes.data.verses[i].text
						}
					})
				],
				surahData,
				audioUrl: res.data.audioUrl
			}

		}
	}
	return {
		page: fetchSurah(page),
		number: page
	}
}