import { url } from '$lib/url.js'

export const load = async ({ params }) => {
	const req = await fetch(`${url}/api/v1/hadith/${params.book}/section/${params.chapter}/${params.number}`)
	const res = await req.json()

	return {
		...res
	}
}