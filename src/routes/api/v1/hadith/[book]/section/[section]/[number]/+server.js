import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	const req = await fetch(`${url}/api/v1/hadith/${params.book}/section/${params.section}/${params.number}`)
	return json({
		...await req.json()
	})
}