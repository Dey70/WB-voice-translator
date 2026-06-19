import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

export default function OfflineNotice() {
  const [isOnline, setIsOnline] = useState(() => typeof navigator === 'undefined' || navigator.onLine)

  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <aside className="offline-notice" role="status">
      <WifiOff size={17} />
      <div><strong>Offline mode</strong><span>Phrasebook, SOS, saved history, places, seasons, and culture remain available. Live translation, maps, and current information need internet.</span></div>
    </aside>
  )
}
