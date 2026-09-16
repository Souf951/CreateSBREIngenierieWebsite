import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function brokenMediaResolver() {
  return {
    name: 'sbre-broken-media-resolver',
    enforce: 'pre' as const,
    resolveId(id: string) {
      const normalized = id.replace(/\\/g, '/')
      if (normalized.endsWith('/IMG_0259.webp')) {
        return path.resolve(__dirname, 'src/imports/IMG_0259.jpeg')
      }
      if (normalized.endsWith('/IMG_1260.webp')) {
        return path.resolve(__dirname, 'src/imports/IMG_1260.jpeg')
      }
    },
  }
}

const useCustomDomain = process.env.SBRE_CUSTOM_DOMAIN === 'true'

export default defineConfig({
  // Keep the repository-prefixed URL for local development and CI previews.
  // The production Pages workflow explicitly enables the custom-domain root.
  base: useCustomDomain ? '/' : '/CreateSBREIngenierieWebsite/',
  plugins: [brokenMediaResolver(), figmaAssetResolver(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    sourcemap: false,
    target: 'es2020',
  },
})
