import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import OfflineNotice from './components/layout/OfflineNotice'
import Onboarding from './components/layout/Onboarding'
import { useAppStore } from './store/appStore'
import './styles/page-header-consistency.css'

const Translator    = lazy(() => import('./pages/Translator'))
const Home          = lazy(() => import('./pages/Home'))
const Conversation  = lazy(() => import('./pages/Conversation'))
const History       = lazy(() => import('./pages/History'))
const PhraseBank    = lazy(() => import('./pages/PhraseBank'))
const EmergencyMode = lazy(() => import('./pages/EmergencyMode'))
const TourismSpots  = lazy(() => import('./pages/TourismSpots'))
const PlacesHub     = lazy(() => import('./pages/PlacesHub'))
const SeasonalGuide = lazy(() => import('./pages/SeasonalGuide'))
const CulturalGuide = lazy(() => import('./pages/CulturalGuide'))
const Collections   = lazy(() => import('./pages/Collections'))
const Guide         = lazy(() => import('./pages/Guide'))
const TravelInfo    = lazy(() => import('./pages/TravelInfo'))
const FoodGuide     = lazy(() => import('./pages/FoodGuide'))
const RouteMap      = lazy(() => import('./pages/RouteMap'))

function RouteAwareNavbar() {
  const { pathname } = useLocation()
  return pathname === '/places/routes' ? null : <Navbar />
}

function AnimatedRoutes() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div key={location.pathname} className="route-transition-frame">
      <Routes location={location}>
        <Route path="/"              element={<Home />} />
        <Route path="/translate"     element={<Translator />} />
        <Route path="/conversation"  element={<Conversation />} />
        <Route path="/history"       element={<History />} />
        <Route path="/phrases"       element={<PhraseBank />} />
        <Route path="/emergency"     element={<EmergencyMode />} />
        <Route path="/places"        element={<PlacesHub />} />
        <Route path="/places/explore"element={<TourismSpots />} />
        <Route path="/places/seasons"element={<SeasonalGuide />} />
        <Route path="/places/food"   element={<FoodGuide />} />
        <Route path="/places/routes" element={<RouteMap />} />
        <Route path="/culture"       element={<CulturalGuide />} />
        <Route path="/collections"   element={<Collections />} />
        <Route path="/guide"         element={<Guide />} />
        <Route path="/travel-info"   element={<TravelInfo />} />
      </Routes>
    </div>
  )
}

// Howrah Bridge silhouette — iconic cantilever bridge of Kolkata
function HowrahBridge({ color }) {
  return (
    <svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'fixed', right: -30, bottom: 0, width: 'clamp(280px,40vw,480px)', pointerEvents: 'none', zIndex: 0 }}
      aria-hidden="true">
      <g fill={color} opacity="0.07">
        {/* Left main tower */}
        <rect x="118" y="10" width="22" height="260"/>
        <rect x="104" y="10" width="50" height="22"/>
        <rect x="108" y="36" width="42" height="10"/>
        {/* Right main tower */}
        <rect x="300" y="10" width="22" height="260"/>
        <rect x="286" y="10" width="50" height="22"/>
        <rect x="290" y="36" width="42" height="10"/>
        {/* Left cantilever arm — diagonals going outward */}
        <polygon points="129,32 129,230 0,280 0,295 10,295 140,244 140,32"/>
        {/* Right cantilever arm */}
        <polygon points="311,32 311,230 440,280 440,295 430,295 300,244 300,32"/>
        {/* Horizontal struts on towers (cross bracing) */}
        <rect x="104" y="80"  width="50" height="6"/>
        <rect x="104" y="140" width="50" height="6"/>
        <rect x="104" y="200" width="50" height="6"/>
        <rect x="286" y="80"  width="50" height="6"/>
        <rect x="286" y="140" width="50" height="6"/>
        <rect x="286" y="200" width="50" height="6"/>
        {/* Suspended central span */}
        <rect x="140" y="265" width="160" height="10"/>
        {/* Road deck */}
        <rect x="0" y="275" width="440" height="12"/>
        {/* Under-bridge arch */}
        <path d="M0,275 Q220,240 440,275" fill="none" stroke={color} strokeWidth="6" opacity="0.07"/>
      </g>
    </svg>
  )
}

// Victoria Memorial silhouette — iconic domed monument of Kolkata
function VictoriaMemorial({ color }) {
  return (
    <svg viewBox="0 0 420 280" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'fixed', left: -20, bottom: 0, width: 'clamp(220px,32vw,380px)', pointerEvents: 'none', zIndex: 0 }}
      aria-hidden="true">
      <g fill={color} opacity="0.065">
        {/* Central dome */}
        <ellipse cx="210" cy="108" rx="62" ry="56"/>
        {/* Dome drum */}
        <rect x="172" y="130" width="76" height="22"/>
        {/* Central spire */}
        <polygon points="205,52 210,22 215,52"/>
        {/* Upper building */}
        <rect x="110" y="148" width="200" height="38"/>
        {/* Corner turrets left */}
        <ellipse cx="90" cy="148" rx="22" ry="26"/>
        <rect x="70" y="148" width="42" height="40"/>
        <polygon points="84,122 90,100 96,122"/>
        {/* Corner turrets right */}
        <ellipse cx="330" cy="148" rx="22" ry="26"/>
        <rect x="308" y="148" width="42" height="40"/>
        <polygon points="324,122 330,100 336,122"/>
        {/* Wings */}
        <rect x="30" y="175" width="80" height="48"/>
        <rect x="310" y="175" width="80" height="48"/>
        {/* Main building base */}
        <rect x="60" y="188" width="300" height="40"/>
        {/* Colonnaded front steps */}
        <rect x="80" y="228" width="260" height="10"/>
        <rect x="60" y="236" width="300" height="8"/>
        {/* Ground */}
        <rect x="0" y="244" width="420" height="10"/>
      </g>
    </svg>
  )
}

// Sundarbans mangrove silhouette — bottom right accent
function SundarbansTree({ color }) {
  return (
    <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'fixed', right: 20, bottom: 0, width: 'clamp(80px,12vw,160px)', pointerEvents: 'none', zIndex: 0 }}
      aria-hidden="true">
      <g fill={color} opacity="0.09">
        <rect x="92" y="40" width="12" height="140"/>
        <ellipse cx="98" cy="55" rx="46" ry="38"/>
        <ellipse cx="70" cy="75" rx="32" ry="26"/>
        <ellipse cx="126" cy="72" rx="32" ry="26"/>
        {/* prop roots */}
        <line x1="92" y1="130" x2="60" y2="180" stroke={color} strokeWidth="5"/>
        <line x1="104" y1="130" x2="136" y2="180" stroke={color} strokeWidth="5"/>
        <line x1="92" y1="150" x2="72" y2="180" stroke={color} strokeWidth="4"/>
        <line x1="104" y1="150" x2="124" y2="180" stroke={color} strokeWidth="4"/>
      </g>
    </svg>
  )
}

export default function App() {
  const { darkMode, onboardingComplete } = useAppStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    document.body.style.backgroundColor = darkMode ? '#1C0F05' : '#FDF6E9'
  }, [darkMode])

  const landmarkColor = darkMode ? '#F4A040' : '#8B4513'

  return (
    <BrowserRouter>
      {!onboardingComplete && <Onboarding />}
      {/* Warm gradient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Bengal landmark silhouettes — decorative, isolated from layout */}
      <div aria-hidden="true" style={{ contain: 'strict', position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <VictoriaMemorial color={landmarkColor} />
        <HowrahBridge color={landmarkColor} />
        <SundarbansTree color={landmarkColor} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <RouteAwareNavbar />
        <OfflineNotice />
        <div id="main-content">
        <Suspense fallback={<div className="route-loader" role="status" aria-live="polite" aria-label="Loading page">Loading…</div>}>
          <AnimatedRoutes />
        </Suspense>
        </div>
      </div>
    </BrowserRouter>
  )
}
