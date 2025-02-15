import { url } from '$lib/url.js'

export const load = async () => {
	const retrievePodcasts = async () => {
	const req = await fetch(`${url}/api/v1/podcasts`)
	return await req.json()
	}
	return {
		podcasts: retrievePodcasts()
	}
}