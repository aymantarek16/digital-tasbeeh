import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // يحدث الـ SW تلقائيًا لما تنزل نسخة جديدة
      includeAssets: [
        'favicon.ico',
        'sounds/click.mp3',
        'sounds/celebrate.mp3',
        'sebha-icon.png',
        'bg_sebha.png'
      ],
      manifest: {
        name: 'السبحة الرقمية | Digital Tasbeeh',
        short_name: 'سبحة',
        description: 'تطبيق سبحة إلكترونية بسيط واحترافي لتسهيل ذكر الله في أي وقت وأي مكان.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#16a34a',
        icons: [
          {
            src: '/bg_sebha.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/bg_sebha.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/sebha-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/digital-tasbeeh-flax\.vercel\.app\/.*$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'digital-tasbeeh-assets',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 يوم
              }
            }
          }
        ]
      }
    })
  ]
})
