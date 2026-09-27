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
        skipWaiting: true,
        clientsClaim: true,
        navigateFallbackDenylist: [/^\/api\//, /^\/health/, /^\/ready/, /^\/office/],
        runtimeCaching: [
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
