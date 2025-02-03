
export const load = async () => {
	const retrievePodcasts = async () => {
	const req = await fetch('https://api.aayah.info/api/v1/podcasts')
	return await req.json()
	}
	return {
		podcasts: retrievePodcasts()
	}
}