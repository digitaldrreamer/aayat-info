import { redirect } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
	const infoReq = await fetch(`https://api.aayah.info/api/v1/hadith/${params.book}`)
	const infoRes = await infoReq.json()
	const req = await fetch(
		`https://api.aayah.info/api/v1/hadith/${params.book}/section/${params.chapter}`
	);
	const res = await req.json();
	// eslint-disable-next-line no-unsafe-optional-chaining
	const { from, to } = res?.data?.section;
	if (!from || !to) redirect(302, '/');

	function range(start, end) {
		// Ensure that start is less than or equal to end
		if (start > end) [start, end] = [end, start];

		// Create an array with the desired length and fill it with consecutive numbers
		return Array.from({ length: end - start + 1 }, (_, index) => start + index);
	}

	return {
		numbers: range(from, to),
		sectionTitle: infoRes.data.book.sections[params.chapter],
		bookTitle: infoRes.data.book.name
	};
};
