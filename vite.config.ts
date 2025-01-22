import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'AI Model Management',
        short_name: 'AI Models',
        description: 'Manage your AI models and agents',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server:{
    proxy: {
      '/realms': {
        target: 'https://keycloak.tpcloud.tech',
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'https://keycloak.tpcloud.tech',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://keycloak.tpcloud.tech',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, '')
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});