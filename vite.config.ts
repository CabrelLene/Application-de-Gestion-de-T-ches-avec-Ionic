/// <reference types="vitest" />

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import path from 'node:path'

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    legacy(), // fallback anciens navigateurs si nécessaire
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 🔧 Build optimisé
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 900, // évite les faux positifs avec Firebase/Ionic
    rollupOptions: {
      output: {
        // Chunks stables et facilement cacheables
        manualChunks: {
          vendor: ['vue', '@ionic/vue'],
          firebase: [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'firebase/analytics',
            'firebase/storage',
          ],
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
    minify: 'esbuild',
  },

  // 🧹 Nettoyage léger en prod
  esbuild: mode === 'production' ? { drop: ['console', 'debugger'] } : {},

  // ⚡️ Démarrage dev plus rapide (pré-bundle)
  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/analytics',
      'firebase/storage',
      '@ionic/vue',
      'ionicons/icons',
    ],
  },

  // ✅ Vitest
  test: {
    globals: true,
    environment: 'jsdom',
  },
}))
