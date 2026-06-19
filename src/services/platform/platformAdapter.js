/**
 * Platform adapter — single import surface for all device APIs.
 *
 * Resolution order for every capability:
 *   1. Capacitor native plugin  (Android / iOS app)
 *   2. Browser Web API          (Chrome on Android, desktop)
 *   3. Memory / no-op fallback  (SSR, restricted environments)
 *
 * Nothing outside this file should import from @capacitor/* directly.
 */

import { Capacitor } from '@capacitor/core'
import { App }          from '@capacitor/app'
import { Clipboard }    from '@capacitor/clipboard'
import { Geolocation }  from '@capacitor/geolocation'
import { Network }      from '@capacitor/network'

const isNative = () => Capacitor.isNativePlatform()

const getWindow    = () => (typeof window    === 'undefined' ? null : window)
const getNavigator = () => (typeof navigator === 'undefined' ? null : navigator)

// ── Clipboard fallback for ancient browsers ──────────────────────────────────
const writeClipboardFallback = (text) => {
  const win = getWindow()
  if (!win?.document?.body) throw new Error('Clipboard is unavailable on this device.')
  const ta = win.document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.cssText = 'position:fixed;opacity:0'
  win.document.body.appendChild(ta)
  ta.select()
  const ok = win.document.execCommand('copy')
  ta.remove()
  if (!ok) throw new Error('Clipboard permission was denied.')
}

// ── External URL guard ───────────────────────────────────────────────────────
const safeHttpsUrl = (url) => {
  const parsed = new URL(url)
  if (parsed.protocol !== 'https:') throw new Error('Only secure external links are allowed.')
  return parsed.toString()
}

// ── Network listener cache ───────────────────────────────────────────────────
let _networkListenerHandle = null

export const platformServices = {

  // ── Runtime ───────────────────────────────────────────────────────────────
  runtime: {
    getPlatform() {
      if (isNative()) return Capacitor.getPlatform()   // 'android' | 'ios'
      return /Android/i.test(getNavigator()?.userAgent || '') ? 'android-web' : 'web'
    },
    getUserAgent() {
      return getNavigator()?.userAgent || ''
    },
    isNative,
    getCapabilities() {
      const nav = getNavigator()
      return {
        native:            isNative(),
        clipboard:         isNative() || Boolean(nav?.clipboard || getWindow()?.document?.execCommand),
        geolocation:       isNative() || Boolean(nav?.geolocation),
        connectivity:      true,
        speechRecognition: isNative() || Boolean(getWindow()?.SpeechRecognition || getWindow()?.webkitSpeechRecognition),
        speechSynthesis:   isNative() || Boolean(getWindow()?.speechSynthesis),
      }
    },
  },

  // ── Clipboard ─────────────────────────────────────────────────────────────
  clipboard: {
    async writeText(text) {
      if (isNative()) {
        await Clipboard.write({ string: text })
        return
      }
      const nav = getNavigator()
      if (nav?.clipboard?.writeText) return nav.clipboard.writeText(text)
      return writeClipboardFallback(text)
    },
  },

  // ── Location ──────────────────────────────────────────────────────────────
  location: {
    isAvailable() {
      return isNative() || Boolean(getNavigator()?.geolocation)
    },
    async getCurrentPosition(options = {}) {
      if (isNative()) {
        // Capacitor Geolocation returns { coords, timestamp } — same shape as browser API
        return Geolocation.getCurrentPosition({
          enableHighAccuracy: options.enableHighAccuracy ?? false,
          timeout:            options.timeout            ?? 10000,
          maximumAge:         options.maximumAge         ?? 0,
        })
      }
      const geo = getNavigator()?.geolocation
      if (!geo) throw new Error('Location is unavailable on this device.')
      return new Promise((resolve, reject) => geo.getCurrentPosition(resolve, reject, options))
    },
  },

  // ── Connectivity ──────────────────────────────────────────────────────────
  connectivity: {
    async isOnline() {
      if (isNative()) {
        const { connected } = await Network.getStatus()
        return connected
      }
      return getNavigator()?.onLine ?? true
    },
    subscribe(callback) {
      if (isNative()) {
        // Remove any previous listener before adding a new one
        _networkListenerHandle?.remove()
        const handle = Network.addListener('networkStatusChange', ({ connected }) => callback(connected))
        _networkListenerHandle = handle
        return () => handle.remove()
      }
      const win = getWindow()
      if (!win) return () => {}
      const online  = () => callback(true)
      const offline = () => callback(false)
      win.addEventListener('online',  online)
      win.addEventListener('offline', offline)
      return () => {
        win.removeEventListener('online',  online)
        win.removeEventListener('offline', offline)
      }
    },
  },

  // ── Links ─────────────────────────────────────────────────────────────────
  links: {
    callPhone(number) {
      if (!/^\+?[\d\s\-().]+$/.test(number)) throw new Error('Invalid phone number.')
      getWindow().location.href = `tel:${number.replace(/\s/g, '')}`
    },
    openMap(destination) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
      getWindow()?.open(url, '_blank', 'noopener,noreferrer')
    },
    openExternal(url) {
      const secureUrl = safeHttpsUrl(url)
      getWindow()?.open(secureUrl, '_blank', 'noopener,noreferrer')
    },
  },

  // ── App lifecycle ─────────────────────────────────────────────────────────
  lifecycle: {
    subscribe(callback) {
      if (isNative()) {
        const handle = App.addListener('appStateChange', ({ isActive }) => callback({ active: isActive }))
        return () => handle.remove()
      }
      const win = getWindow()
      if (!win?.document) return () => {}
      const handleVisibility = () => callback({ active: win.document.visibilityState === 'visible' })
      win.document.addEventListener('visibilitychange', handleVisibility)
      return () => win.document.removeEventListener('visibilitychange', handleVisibility)
    },
  },

  // ── Speech recognition — hook-level; see useSpeechRecognition.js ─────────
  speechRecognition: {
    getConstructor() {
      // On native, useSpeechRecognition uses @capacitor-community/speech-recognition directly
      if (isNative()) return null
      return getWindow()?.SpeechRecognition || getWindow()?.webkitSpeechRecognition || null
    },
  },

  // ── Speech synthesis — hook-level; see useSpeechSynthesis.js ─────────────
  speechSynthesis: {
    getEngine() {
      // On native, useSpeechSynthesis uses @capacitor-community/text-to-speech directly
      if (isNative()) return null
      return getWindow()?.speechSynthesis || null
    },
    createUtterance(text) {
      if (isNative()) return null
      const Utterance = getWindow()?.SpeechSynthesisUtterance
      return Utterance ? new Utterance(text) : null
    },
  },

  // ── Storage ───────────────────────────────────────────────────────────────
  storage: {
    getItem(key) {
      try { return getWindow()?.localStorage?.getItem(key) ?? null } catch { return null }
    },
    setItem(key, value) {
      try { getWindow()?.localStorage?.setItem(key, value) } catch { /* storage full or blocked */ }
    },
    removeItem(key) {
      try { getWindow()?.localStorage?.removeItem(key) } catch { /* blocked */ }
    },
  },
}
