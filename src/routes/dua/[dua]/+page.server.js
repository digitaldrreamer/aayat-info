import { url } from '$lib/url.js'
export const load = async ({ fetch, params }) => {
	const req = await fetch(`${url}/api/v1/hisnul-muslim?index=${params.dua}`)
	const res = await req.json()

	return {
		...res.data.dua
	}
}