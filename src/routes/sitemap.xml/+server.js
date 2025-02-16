import { url } from '$lib/url.js';

export const GET = async ({ fetch }) => {
	const req = await fetch(url + '/api/v1/search')
	const res = await req.json()
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://aayah.info</loc>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
${res.map(link  =>  `
<url>
<loc>${link}</loc>
<changefreq>weekly</changefreq>
<lastmod>2025/05/16</lastmod>
</url>
`).join('')}
</urlset>`;
	return new Response(sitemap);
}
