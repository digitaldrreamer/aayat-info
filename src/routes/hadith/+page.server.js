export const load = async ({ fetch }) => {
	const getHadithBooks = async () => {
		const req = await fetch('https://api.aayah.info/api/v1/hadith');
		return await req.json();
	};
	return {
		books: getHadithBooks()
	};
};