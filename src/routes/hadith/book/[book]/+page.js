export const load = async ({ fetch, params }) => {
	const req = await fetch(`https://api.aayah.info/api/v1/hadith/${params.book}`)
	const res = await req.json()
	return {
		...res.data.book
	}
}