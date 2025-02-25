import { url } from '$lib/url.js';

let cachedSitemap = null;

export const GET = async ({ fetch }) => {
	if (!cachedSitemap) {
		const req = await fetch(url + '/api/v1/search');
		const res = await req.json();

		cachedSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://aayah.info</loc>
    <changefreq>never</changefreq>
    <priority>0.7</priority>
  </url>
  ${res.map(object => `
  <url>
    <loc>${object.url}</loc>
    <changefreq>never</changefreq>
    <lastmod>2025-05-16</lastmod>
  </url>`).join('')}
</urlset>`;
	}

	return new Response(cachedSitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
		}
	});
};
