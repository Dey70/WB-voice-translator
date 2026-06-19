# কথাসেতু — KothaSetu

> **Kotha** (কথা) = Words/Talk &nbsp;•&nbsp; **Setu** (সেতু) = Bridge
>
> *Bridging words across Bengali, Nepali, and Hindi.*

---

## What is KothaSetu?

KothaSetu is a free, open-source voice and text translation app built specifically for the South Asian community. It supports three languages that share millions of speakers across Bangladesh, Nepal, India, and the diaspora worldwide — yet rarely have a dedicated tool built just for them.

Speak in Bengali. Hear it in Hindi. Reply in Nepali. KothaSetu handles it all in real time.

---

## Features

### Voice Translation
- One-tap microphone — speak naturally, hear the translation automatically
- Live speech recognition powered by the Web Speech API
- Auto-speaks the translated result aloud
- Voice waveform animation while listening

### Conversation Mode
The flagship feature. Two people, two languages, one screen.
- Person A taps their mic and speaks Bengali
- The app translates and speaks it in Hindi (or Nepali)
- Person B taps their mic and replies
- Full bilingual conversation displayed in a chat-style interface
- Replay any message with one tap

### Translation Modes
| Mode | Description |
|------|-------------|
| Voice to Voice | Speak and hear the translation |
| Text to Text | Type and read the translation |
| Voice to Text | Speak and read the translation |
| Text to Speak | Type and hear the translation |

### History & Favorites
- Every translation saved automatically
- Search through past translations
- Star your favorites for quick access
- Export your history as JSON

---

## Supported Languages

| Language | Script | Region |
|----------|--------|--------|
| Bengali (বাংলা) | Bengali | Bangladesh, West Bengal |
| Nepali (नेपाली) | Devanagari | Nepal, Sikkim, Darjeeling |
| Hindi (हिन्दी) | Devanagari | India |

All 6 language pairs supported:
Bengali to Nepali, Bengali to Hindi, Nepali to Hindi, and all reverse pairs.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| State | Zustand (with localStorage persistence) |
| Speech Recognition | Web Speech API on web; Capacitor speech plugin on Android |
| Speech Synthesis | Web Speech Synthesis on web; Capacitor TTS plugin on Android |
| Translation | Azure AI Translator through a server-side API route |
| Deployment | Vercel |

Azure credentials stay on the server and are never bundled into browser JavaScript. Translation requests pass through a validated, rate-limited `/api/translate` route.

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- Google Chrome (required for voice features)

### Installation

```bash
# Clone the repo
git clone https://github.com/Dey70/WB-voice-translator.git
cd WB-voice-translator

# Install dependencies
npm install

# Create local server credentials
Copy-Item .env.example .env
# Fill in AZURE_TRANSLATOR_KEY and AZURE_TRANSLATOR_REGION

# Start the development server
npm run dev
```

Open http://localhost:5173 in Chrome.

### Build for Production

```bash
npm run build
```

### Android

The Android project uses Capacitor. Set `VITE_API_BASE_URL` to the HTTPS origin
that hosts `/api/translate`, then sync the web bundle and open Android Studio:

```bash
npm run android:sync
npm run android:open
```

Azure credentials remain server-side. Do not place them in a `VITE_` variable.

---

## Deployment

This project is configured for one-click deployment on Vercel.

1. Fork this repository
2. Go to vercel.com and import the repo
3. Add `AZURE_TRANSLATOR_KEY` and `AZURE_TRANSLATOR_REGION` in the Vercel project environment settings
4. Deploy

A `vercel.json` is included for SPA routing and baseline security headers. Never use a `VITE_` prefix for the Azure key because Vite exposes such values to the browser bundle.

---

## Browser Support

| Browser | Voice Features | Translation |
|---------|---------------|-------------|
| Chrome | Full support | Yes |
| Edge | Full support | Yes |
| Firefox | Not supported | Yes |
| Safari | Partial | Yes |

Recommended: Google Chrome

---

## Offline Support

After one complete online load, the service worker stores the app shell and essential travel content on the device. The Phrasebook, SOS phrases and saved numbers, History, Places, Seasonal Guide, and Cultural Guide can then open without a connection.

Live translation, Google Maps, current conditions, external links, and device speech services that depend on a network remain online-only. The app displays an offline notice instead of presenting cached information as live data.

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Navbar.jsx
│   └── translation/
│       ├── LanguageSelector.jsx
│       └── Waveform.jsx
├── hooks/
│   ├── useSpeechRecognition.js
│   └── useSpeechSynthesis.js
├── pages/
│   ├── Translator.jsx      # Main translation page
│   ├── Conversation.jsx    # Bilingual conversation mode
│   ├── History.jsx         # Translation history
│   └── Favorites.jsx       # Saved translations
├── services/
│   └── translation.js      # Secure translation API client
├── store/
│   └── appStore.js         # Zustand global state
└── utils/
    └── constants.js        # Language definitions
```

---

## Roadmap

- [ ] Offline translation support
- [ ] Mobile PWA
- [ ] More South Asian languages (Odia, Assamese, Maithili)
- [ ] Shareable conversation links

---

## Contributing

Contributions are welcome. If you speak Bengali, Nepali, or Hindi and want to help improve translation quality or add features, please open an issue or pull request.

---

## License

MIT License — free to use, modify, and distribute.

---

Built with love for the South Asian community.

Speak words. Build bridges.
