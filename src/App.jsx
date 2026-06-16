import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Translator from './pages/Translator'
import Conversation from './pages/Conversation'
import History from './pages/History'
import Favorites from './pages/Favorites'

export default function App() {
  return (
    <BrowserRouter>
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Translator />} />
          <Route path="/conversation" element={<Conversation />} />
          <Route path="/history" element={<History />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

