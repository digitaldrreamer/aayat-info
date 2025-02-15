import { redirect } from '@sveltejs/kit';
import { url } from '$lib/url.js'

export const load = async ({ params, fetch }) => {
	try {
		// Fetch book info
		const infoReq = await fetch(`${url}/api/v1/hadith/${params.book}`);
		const infoRes = await infoReq.json();

		// Get book data using the correct path
		const bookData = infoRes?.data?.book;
		if (!bookData) {
			console.error('Book data not found in the response');
			throw redirect(302, '/');
		}

		// Fetch section info
		const req = await fetch(`${url}/api/v1/hadith/${params.book}/section/${params.chapter}`);
		const res = await req.json();

		// Get section data
		const sectionData = res?.data?.section;
		if (!sectionData) {
			console.error(`No section data found for section ${params.chapter}`);
			throw redirect(302, '/');
		}

		// Use the section's from/to values directly from the section response
		const { from, to } = sectionData;
		if (!from || !to) {
			console.error(`Invalid hadith range: ${from} - ${to}`);
			throw redirect(302, '/');
		}

		// Get section details from the book data if available
		const sectionDetails = bookData.section_details?.[params.chapter];

		// Generate number range
		function range(start, end) {
			if (start > end) [start, end] = [end, start];
			return Array.from({ length: end - start + 1 }, (_, index) => start + index);
		}

		return {
			numbers: range(from, to),
			sectionTitle: sectionDetails?.title ?? `Section ${params.chapter}`,
			bookTitle: bookData.name ?? "Unknown Book"
		};

	} catch (error) {
		console.error("Load function error:", error);
		throw redirect(302, '/');
	}
};