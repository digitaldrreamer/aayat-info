export const load = async ({ params }) => {
	const req = await fetch(`https://api.aayah.info/api/v1/hadith/${params.book}/section/${params.chapter}/${params.number}`)
	const res = await req.json()

	return {
		...res
	}
}