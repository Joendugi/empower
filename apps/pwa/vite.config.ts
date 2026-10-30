/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const buildId = process.env.VITE_BUILD_ID || process.env.npm_package_version || String(Date.now());

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Empower',
        short_name: 'Empower',
        description: 'Polytechnic trades, TVET, and cybersecurity for Kenya.',
        theme_color: '#111111',
        background_color: '#111111',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        cacheId: `empower-${buildId}`,
        cleanupOutdatedCaches: true,
        // Headroom over Workbox's 2 MiB default so a large chunk never silently drops out of the precache.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallbackDenylist: [/^\/api\//, /^\/health/, /^\/ready/, /^\/office/],
        runtimeCaching: [
          // Course packs (content/packs.ts). Names carry a content hash, so a cached pack never goes
          // stale, and the cache name has no build id so packs survive app updates.
          {
            urlPattern: /\/packs\/manifest\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'course-pack-manifest',
              networkTimeoutSeconds: 4,
            },
          },
          {
            urlPattern: /\/packs\/[^/]+\.[0-9a-f]{12}\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'course-packs',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: /\/api\/v1\/lessons\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: `lesson-content-${buildId}`,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 4,
            },
          },
          {
            urlPattern: /\/api\/v1\/(skill-paths|badges|leaderboard)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: `api-data-${buildId}`,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 12 },
              networkTimeoutSeconds: 5,
            },
          },
          // Images
          {
            urlPattern: /\.(png|jpg|jpeg|webp|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /\.(mp4|webm|mp3|ogg|wav|m4a)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'programme-media',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
              rangeRequests: true,
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@cyberlearn/ui': fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
});
