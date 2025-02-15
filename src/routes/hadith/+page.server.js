import { url } from '$lib/url.js'

export const load = async ({ fetch }) => {
	const getHadithBooks = async () => {
		const req = await fetch(`${url}/api/v1/hadith`);
		return await req.json();
	};
	return {
		books: getHadithBooks()
	};
};