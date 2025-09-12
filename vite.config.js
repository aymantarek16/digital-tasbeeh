import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'السبحة الرقمية',
        short_name: 'سبحة',
        start_url: '.',
        display: 'standalone',
        background_color: '#16a34a',
        theme_color: '#16a34a',
        icons: [
          { src: '/bg_sebha.png', sizes: '192x192', type: 'image/png' },
          { src: '/bg_sebha.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
