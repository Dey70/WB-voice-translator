# Android Service Adapter Contract

UI components must use `platformServices` rather than browser globals. The current Web adapter is the default. A future Capacitor or native Android shell can expose `window.KothaSetuNative` with any subset of the interfaces below; missing services fall back to the Web implementation.

```js
window.KothaSetuNative = {
  platform: 'android',
  clipboard: { writeText(text) },
  location: { getCurrentPosition(options) },
  connectivity: { isOnline(), subscribe(callback) },
  links: { callPhone(number), openMap(destination), openExternal(url) },
  lifecycle: { subscribe(({ active }) => {}) },
  storage: { getItem(key), setItem(key, value), removeItem(key) },
  speechRecognition: { Recognition },
  speechSynthesis: { engine, createUtterance(text) },
}
```

Subscriptions return an unsubscribe function. Storage methods may return values or promises; Zustand persistence supports asynchronous native storage. Speech objects intentionally follow the browser speech interfaces so the reliability hooks remain platform-neutral.

## Migrated Capabilities

- Clipboard: Translator and SOS
- Location: Phrasebook location context
- Connectivity: offline notice and live translation guard
- Deep links: emergency dialing and Google Maps directions
- Persistence: history, favourites, and theme
- Lifecycle: microphone and speech playback stop when the app backgrounds
- Speech: recognition constructor and synthesis engine are replaceable

## Security Rules

- Phone numbers are validated before opening the dialer.
- External URLs must use HTTPS.
- Translation credentials remain server-side and are not part of the native bridge.
- Location is returned to the requesting screen and is not persisted by the adapter.
