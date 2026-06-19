import { defineConfig, loadEnv } from 'vite'
import process from 'node:process'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import translateHandler from './api/translate.js'

const secureTranslationDevPlugin = () => ({
  name: 'secure-translation-dev-api',
  configureServer(server) {
    server.middlewares.use('/api/translate', translateHandler)
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.AZURE_TRANSLATOR_KEY ||= env.AZURE_TRANSLATOR_KEY
  process.env.AZURE_TRANSLATOR_REGION ||= env.AZURE_TRANSLATOR_REGION

  return {
    plugins: [
      react(),
      tailwindcss(),
      secureTranslationDevPlugin(),
    ],
  }
})
