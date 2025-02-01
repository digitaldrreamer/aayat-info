export const load = async ({ fetch }) => {
	const getHadithBooks = async () => {
		const req = await fetch('http://localhost:5175/api/v1/hadith');
		return await req.json();
	};
	return {
		books: getHadithBooks()
	};
};