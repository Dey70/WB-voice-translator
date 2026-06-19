import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'
import { platformServices } from '../../services/platform/platformAdapter'

export default function OfflineNotice() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    let active = true
    platformServices.connectivity.isOnline().then((online) => {
      if (active) setIsOnline(online)
    })
    const unsubscribe = platformServices.connectivity.subscribe(setIsOnline)
    return () => {
      active = false
      unsubscribe()
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
