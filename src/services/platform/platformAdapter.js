const memoryStorage = new Map()

const getWindow = () => typeof window === 'undefined' ? null : window
const getNavigator = () => typeof navigator === 'undefined' ? null : navigator
const getNativeBridge = () => getWindow()?.KothaSetuNative || null

const safeHttpsUrl = (url) => {
  const parsed = new URL(url)
  if (parsed.protocol !== 'https:') throw new Error('Only secure external links are allowed.')
  return parsed.toString()
}

const writeClipboardFallback = (text) => {
  const win = getWindow()
  if (!win?.document?.body) throw new Error('Clipboard is unavailable on this device.')
  const textarea = win.document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  win.document.body.appendChild(textarea)
  textarea.select()
  const copied = win.document.execCommand('copy')
  textarea.remove()
  if (!copied) throw new Error('Clipboard permission was denied.')
}

export const platformServices = {
  runtime: {
    getPlatform() {
      const bridge = getNativeBridge()
      if (bridge?.platform) return bridge.platform
      return /Android/i.test(getNavigator()?.userAgent || '') ? 'android-web' : 'web'
    },
    getUserAgent() {
      return getNavigator()?.userAgent || ''
    },
    isNative() {
      return Boolean(getNativeBridge())
    },
    getCapabilities() {
      const nav = getNavigator()
      return {
        native: Boolean(getNativeBridge()),
        clipboard: Boolean(getNativeBridge()?.clipboard || nav?.clipboard || getWindow()?.document?.execCommand),
        geolocation: Boolean(getNativeBridge()?.location || nav?.geolocation),
        connectivity: Boolean(getNativeBridge()?.connectivity || nav),
        speechRecognition: Boolean(getNativeBridge()?.speechRecognition || getWindow()?.SpeechRecognition || getWindow()?.webkitSpeechRecognition),
        speechSynthesis: Boolean(getNativeBridge()?.speechSynthesis || getWindow()?.speechSynthesis),
      }
    },
  },

  clipboard: {
    async writeText(text) {
      const bridge = getNativeBridge()
      if (bridge?.clipboard?.writeText) return bridge.clipboard.writeText(text)
      const nav = getNavigator()
      if (nav?.clipboard?.writeText) return nav.clipboard.writeText(text)
      return writeClipboardFallback(text)
    },
  },

  location: {
    isAvailable() {
      return Boolean(getNativeBridge()?.location?.getCurrentPosition || getNavigator()?.geolocation)
    },
    async getCurrentPosition(options = {}) {
      const bridge = getNativeBridge()
      if (bridge?.location?.getCurrentPosition) return bridge.location.getCurrentPosition(options)
      const geolocation = getNavigator()?.geolocation
      if (!geolocation) throw new Error('Location is unavailable on this device.')
      return new Promise((resolve, reject) => geolocation.getCurrentPosition(resolve, reject, options))
    },
  },

  connectivity: {
    isOnline() {
      const bridge = getNativeBridge()
      if (bridge?.connectivity?.isOnline) return bridge.connectivity.isOnline()
      return getNavigator()?.onLine ?? true
    },
    subscribe(callback) {
      const bridge = getNativeBridge()
      if (bridge?.connectivity?.subscribe) return bridge.connectivity.subscribe(callback)
      const win = getWindow()
      if (!win) return () => {}
      const online = () => callback(true)
      const offline = () => callback(false)
      win.addEventListener('online', online)
      win.addEventListener('offline', offline)
      return () => {
        win.removeEventListener('online', online)
        win.removeEventListener('offline', offline)
      }
    },
  },

  links: {
    callPhone(number) {
      if (!/^\+?[\d-]+$/.test(number)) throw new Error('Invalid phone number.')
      const bridge = getNativeBridge()
      if (bridge?.links?.callPhone) return bridge.links.callPhone(number)
      const win = getWindow()
      if (win) win.location.href = `tel:${number}`
    },
    openMap(destination) {
      const bridge = getNativeBridge()
      if (bridge?.links?.openMap) return bridge.links.openMap(destination)
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
      getWindow()?.open(url, '_blank', 'noopener,noreferrer')
    },
    openExternal(url) {
      const secureUrl = safeHttpsUrl(url)
      const bridge = getNativeBridge()
      if (bridge?.links?.openExternal) return bridge.links.openExternal(secureUrl)
      getWindow()?.open(secureUrl, '_blank', 'noopener,noreferrer')
    },
  },

  lifecycle: {
    subscribe(callback) {
      const bridge = getNativeBridge()
      if (bridge?.lifecycle?.subscribe) return bridge.lifecycle.subscribe(callback)
      const win = getWindow()
      if (!win?.document) return () => {}
      const handleVisibility = () => callback({ active: win.document.visibilityState === 'visible' })
      win.document.addEventListener('visibilitychange', handleVisibility)
      return () => win.document.removeEventListener('visibilitychange', handleVisibility)
    },
  },

  speechRecognition: {
    getConstructor() {
      const bridge = getNativeBridge()
      return bridge?.speechRecognition?.Recognition || getWindow()?.SpeechRecognition || getWindow()?.webkitSpeechRecognition || null
    },
  },

  speechSynthesis: {
    getEngine() {
      return getNativeBridge()?.speechSynthesis?.engine || getWindow()?.speechSynthesis || null
    },
    createUtterance(text) {
      const bridge = getNativeBridge()
      if (bridge?.speechSynthesis?.createUtterance) return bridge.speechSynthesis.createUtterance(text)
      const Utterance = getWindow()?.SpeechSynthesisUtterance
      return Utterance ? new Utterance(text) : null
    },
  },

  storage: {
    getItem(key) {
      const bridge = getNativeBridge()
      if (bridge?.storage?.getItem) return bridge.storage.getItem(key)
      try { return getWindow()?.localStorage?.getItem(key) ?? memoryStorage.get(key) ?? null } catch { return memoryStorage.get(key) ?? null }
    },
    setItem(key, value) {
      const bridge = getNativeBridge()
      if (bridge?.storage?.setItem) return bridge.storage.setItem(key, value)
      const storage = getWindow()?.localStorage
      if (!storage) return memoryStorage.set(key, value)
      try { storage.setItem(key, value) } catch { memoryStorage.set(key, value) }
    },
    removeItem(key) {
      const bridge = getNativeBridge()
      if (bridge?.storage?.removeItem) return bridge.storage.removeItem(key)
      const storage = getWindow()?.localStorage
      if (!storage) return memoryStorage.delete(key)
      try { storage.removeItem(key) } catch { memoryStorage.delete(key) }
    },
  },
}
