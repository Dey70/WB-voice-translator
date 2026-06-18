import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import { useAppStore } from './store/appStore'

const Translator = lazy(() => import('./pages/Translator'))
const Conversation = lazy(() => import('./pages/Conversation'))
const History = lazy(() => import('./pages/History'))
const PhraseBank = lazy(() => import('./pages/PhraseBank'))
const EmergencyMode = lazy(() => import('./pages/EmergencyMode'))
const TourismSpots = lazy(() => import('./pages/TourismSpots'))
const PlacesHub = lazy(() => import('./pages/PlacesHub'))
const SeasonalGuide = lazy(() => import('./pages/SeasonalGuide'))
const CulturalGuide = lazy(() => import('./pages/CulturalGuide'))
const LensScanner = lazy(() => import('./pages/LensScanner'))

export default function App() {
  const { darkMode } = useAppStore()

  // Fix 1: Apply theme to document so CSS variables work
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    document.body.style.backgroundColor = darkMode ? '#0a0a0f' : '#f4f4f8'
  }, [darkMode])

  return (
    <BrowserRouter>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Suspense fallback={<div className="route-loader">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Translator />} />
            <Route path="/conversation" element={<Conversation />} />
            <Route path="/history" element={<History />} />
            <Route path="/phrases" element={<PhraseBank />} />
            <Route path="/emergency" element={<EmergencyMode />} />
            <Route path="/places" element={<PlacesHub />} />
            <Route path="/places/explore" element={<TourismSpots />} />
            <Route path="/places/seasons" element={<SeasonalGuide />} />
            <Route path="/culture" element={<CulturalGuide />} />
            <Route path="/lens" element={<LensScanner />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}
