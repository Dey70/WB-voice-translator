# Android Service Adapter Contract

UI components use `platformServices` rather than browser globals. The adapter selects Capacitor plugins in the packaged Android app and browser APIs on the web.

```js
platformServices = {
  runtime, clipboard, location, connectivity, links,
  lifecycle, storage, speechRecognition, speechSynthesis,
}
```

Subscriptions return a synchronous unsubscribe function even though Capacitor listener registration is asynchronous. Speech hooks use the community Capacitor plugins on Android and browser speech APIs on the web.

Packaged Android builds must set `VITE_API_BASE_URL` to the HTTPS origin that hosts `/api/translate`. Translation credentials remain only on that server.

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
