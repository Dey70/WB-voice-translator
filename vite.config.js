import { defineConfig, loadEnv } from 'vite'
import process from 'node:process'
import { createHash } from 'node:crypto'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import translateHandler from './api/translate.js'
import flightsHandler from './api/flights.js'

const secureTranslationDevPlugin = () => ({
  name: 'secure-translation-dev-api',
  configureServer(server) {
    server.middlewares.use('/api/flights', (req, res) => {
      const url = new URL(req.url, 'http://localhost')
      req.query = Object.fromEntries(url.searchParams)
      flightsHandler(req, res)
    })

    server.middlewares.use('/api/translate', (req, res, next) => {
      // Allow Capacitor WebView origins (capacitor://localhost, http://localhost)
      // during local development so the Android APK can reach this dev server.
      const origin = req.headers.origin || ''
      const isCapacitorOrigin = /^(capacitor:\/\/localhost|http:\/\/localhost(:\d+)?|null)$/.test(origin)
      if (isCapacitorOrigin || !origin) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*')
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      }
      if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end() }
      translateHandler(req, res, next)
    })
  },
})

const createServiceWorker = (assets, version) => `
const CACHE_NAME = 'kothasetu-${version}'
const APP_SHELL = ${JSON.stringify(assets)}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('kothasetu-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request).catch(() => new Response(
      JSON.stringify({ error: 'Live translation is unavailable offline. Use the Phrasebook or SOS phrases.' }),
      { status: 503, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    )))
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('offline timeout')), 3000))
        return await Promise.race([fetch(request), timeout])
      } catch {
        return (await caches.match('/index.html')) || Response.error()
      }
    })())
    return
  }

  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request)))
  }
})
`

const offlineBundlePlugin = () => ({
  name: 'kothasetu-offline-bundle',
  apply: 'build',
  generateBundle(_options, bundle) {
    const generatedAssets = Object.values(bundle).map((item) => `/${item.fileName}`)
    const assets = [...new Set(['/index.html', '/favicon.svg', '/icons.svg', '/manifest.webmanifest', ...generatedAssets])]
    const version = createHash('sha256').update(assets.join('|')).digest('hex').slice(0, 12)
    this.emitFile({ type: 'asset', fileName: 'sw.js', source: createServiceWorker(assets, version) })
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.AZURE_TRANSLATOR_KEY ||= env.AZURE_TRANSLATOR_KEY
  process.env.AZURE_TRANSLATOR_REGION ||= env.AZURE_TRANSLATOR_REGION
  process.env.VITE_SERPAPI_KEY ||= env.VITE_SERPAPI_KEY

  return {
    server: {
      proxy: {
        '/route-api': {
          target: 'http://localhost:3001',
          rewrite: () => '/api/route',
        },
        '/geocode-api': {
          target: 'http://localhost:3001',
          rewrite: path => path.replace(/^\/geocode-api/, '/api/geocode'),
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      secureTranslationDevPlugin(),
      offlineBundlePlugin(),
    ],
  }
})
