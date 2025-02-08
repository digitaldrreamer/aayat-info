import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "goremote-africa",
            project: "aayah-info"
        }
    }), sveltekit(), SvelteKitPWA({
        registerType: 'autoUpdate',
        manifest: {
            name: 'Aayah.info',
            short_name: 'Aayah.info',
            description: 'A Minimalist Muslim Companion Webapp. Find Hadith. Read and Listen to Quran. See Duas. Stream Mufti Menk Podcasts. Test your Murajah.',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            display_override: ["window-control-overlay", "minimal-ui"],
            scope: '/',
            start_url: '/',
            screenshots: [
                {
                    src: "/images/1.webp",
                    type: "image/webp",
                    label: "Info 1"
                },
                {
                    src: "/images/2.webp",
                    type: "image/webp",
                    label: "Info 1"
                },
                {
                    src: "/images/3.webp",
                    type: "image/webp",
                    label: "Info 1"
                },
                {
                    src: "/images/4.webp",
                    type: "image/webp",
                    label: "Info 1"
                },
                {
                    src: "/images/5.webp",
                    type: "image/webp",
                    label: "Info 1"
                },
                {
                    src: "/images/6.webp",
                    type: "image/webp",
                    label: "Info 1"
                },
                {
                    src: "/images/7.webp",
                    type: "image/webp",
                    label: "Info 1"
                },
                {
                    src: "/images/8.webp",
                    type: "image/webp",
                    label: "Info 1"
                },
                {
                    src: "/images/9.webp",
                    type: "image/webp",
                    label: "Info 1"
                },
                {
                    src: "/images/10.webp",
                    type: "image/webp",
                    label: "Info 1"
                },
            ],
            "shortcuts": [
                {
                    "name": "Open Quran",
                    "short_name": "Open Quran",
                    "description": "Read Quran or Listen to Quran with Translation and Tafseer.",
                    "url": "/quran",
                    "icons": [{ "src": "/icons/quran.png", "sizes": "192x192" }]
                },
                {
                    "name": "Read Hadith",
                    "short_name": "Read Hadith",
                    "description": "Read over 20k Hadith from 10 Books with Gradings.",
                    "url": "/hadith",
                    "icons": [{ "src": "/icons/hadith.png", "sizes": "192x192" }]
                },
                {
                    "name": "Listen to Podcasts",
                    "short_name": "Listen to Podcasts",
                    "description": "Listen to Podcasts from Mufti Menk.",
                    "url": "/podcasts",
                    "icons": [{ "src": "/icons/podcasts.png", "sizes": "192x192" }]
                },
                {
                    "name": "Start Quiz",
                    "short_name": "Start Quiz",
                    "description": "Test your Murajah with a Quiz.",
                    "url": "/quran/quiz",
                    "icons": [{ "src": "/icons/quiz.png", "sizes": "192x192" }]
                },
                {
                    "name": "See Duas",
                    "short_name": "See Duas",
                    "description": "See 400+ Duas from verified sources..",
                    "url": "/dua",
                    "icons": [{ "src": "/icons/pray.png", "sizes": "192x192" }]
                },
            ],
            icons: [
                {
                    src: '/pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: '/pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
                {
                    src: '/pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable'
                }
            ]
        },
        workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,webmanifest}'],
            navigateFallback: null,
            cleanupOutdatedCaches: true,
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'google-fonts-cache',
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                        },
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                },
                {
                    urlPattern: /^https:\/\/[^/]+\/?$/,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'root-cache'
                    }
                },
                {
                    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'images-cache'
                    }
                },
                {
                    urlPattern: /\.(?:js|css)$/,
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'assets-cache'
                    }
                }
            ]
        },
        devOptions: {
            enabled: true,
            type: 'module'
        },
        // Add this to ensure proper fallback
        kit: {
            includeVersionFile: true,
            trailingSlash: 'always'
        }
    })]
});