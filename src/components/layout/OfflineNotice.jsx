import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'
import { platformServices } from '../../services/platform/platformAdapter'

export default function OfflineNotice() {
  const [isOnline, setIsOnline] = useState(() => platformServices.connectivity.isOnline())

  useEffect(() => {
    return platformServices.connectivity.subscribe(setIsOnline)
  }, [])

  if (isOnline) return null

  return (
    <aside className="offline-notice" role="status">
      <WifiOff size={17} />
      <div><strong>Offline mode</strong><span>Phrasebook, SOS, saved history, places, seasons, and culture remain available. Live translation, maps, and current information need internet.</span></div>
    </aside>
  )
}
