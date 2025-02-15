import { url } from '$lib/url.js'
export const load = async () => {
	let hadiths = []
	try {
		const response = await fetch(`${url}/api/v1/hadith`);
		const result = await response.json();
		const books = Object.values(result?.data?.books || {});


		// Add books to hadiths
		hadiths = books.map(book => ({
			label: book.name,
			link: `/hadith/books/${book.id}`
		}));

		// Add collections to hadiths
		books.forEach(book => {
			book.collection.forEach((col, index) => {
				hadiths.push({
					label: col,
					link: `/hadith/books/${book.id}/${index}`
				});
			});
		});

	} catch (error) {
		console.error("Error fetching hadiths:", error);
}
	return {
			hadiths
	}
}