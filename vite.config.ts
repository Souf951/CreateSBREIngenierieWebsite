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

const isGitHubProjectPages = process.env.GITHUB_ACTIONS === 'true' && !process.env.SBRE_CUSTOM_DOMAIN

export default defineConfig({
  // Local dev and the final custom domain use root-relative URLs. GitHub's
  // project-pages preview keeps the repository prefix automatically.
  base: isGitHubProjectPages ? '/CreateSBREIngenierieWebsite/' : '/',
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
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
