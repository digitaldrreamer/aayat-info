import getPodcasts from '$lib/utils/podcasts.js';

export const load = async () => {
	const req = await fetch('https://api.aayah.info/api/v1/podcasts')
	const res = await req.json()
	return {
		...res
	}
}