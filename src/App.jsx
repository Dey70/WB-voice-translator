import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Translator from './pages/Translator'
import Conversation from './pages/Conversation'
import History from './pages/History'
import PhraseBank from './pages/PhraseBank'
import EmergencyMode from './pages/EmergencyMode'
import { useAppStore } from './store/appStore'

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
        <Routes>
          <Route path="/" element={<Translator />} />
          <Route path="/conversation" element={<Conversation />} />
          <Route path="/history" element={<History />} />
          <Route path="/phrases" element={<PhraseBank />} />
          <Route path="/emergency" element={<EmergencyMode />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
