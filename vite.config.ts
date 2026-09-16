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

const useCustomDomain = process.env.SBRE_CUSTOM_DOMAIN === 'true'

export default defineConfig({
  // Keep the repository-prefixed URL for local development and CI previews.
  // The production Pages workflow explicitly enables the custom-domain root.
  base: useCustomDomain ? '/' : '/CreateSBREIngenierieWebsite/',
  plugins: [figmaAssetResolver(), react(), tailwindcss()],
  resolve: {
    alias: [
      // Two old WebP derivatives in src/media are empty. Their original JPEGs
      // are valid and only used on lazily-loaded project gallery pages.
      {
        find: /IMG_0259\.webp$/,
        replacement: path.resolve(__dirname, 'src/imports/IMG_0259.jpeg'),
      },
      {
        find: /IMG_1260\.webp$/,
        replacement: path.resolve(__dirname, 'src/imports/IMG_1260.jpeg'),
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    sourcemap: false,
    target: 'es2020',
  },
})
