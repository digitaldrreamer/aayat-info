export const load = async ({ params, fetch }) => {
	const { juz } = params
	const fetchSurah = async (num) => {
		const req = await fetch(`https://api.aayah.info/api/v1/quran/ara-qurandoorinonun/juz/${num}?audio=Alafasy_128kbps&tafsir=en-tafisr-ibn-kathir`)
		const res = await req.json()
		const transReq = await fetch(`https://api.aayah.info/api/v1/quran/eng-abdullahyusufal/juz/${num}?audio=Alafasy_128kbps&tafsir=en-tafisr-ibn-kathir`)
		const transRes = await transReq.json()
		const surahs = res.data.juz.verses.map(v => v.chapter)
			const newReq = await fetch('https://api.aayah.info/api/v1/quran/')
		const newRes = await newReq.json()
		let surahData = newRes.data.quran.chapters.filter(chap => surahs.includes(chap.chapter))

		return {
			success: res?.success,
			data: {
				verses: [
					...res.data.juz.verses.map((v, i) => {
						return {
							...v,
							translation: transRes.data.juz.verses[i].text
						}
					})
				],
				surahData,
			}

		}
	}
	return {
		juz: fetchSurah(juz),
		number: juz
	}
}