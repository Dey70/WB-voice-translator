import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageMenuButton from './PageMenuButton'

export default function VaultGuideHeader({ backTo = '/guide', onSearch, searchLabel }) {
  return (
    <header className="vg-topbar">
      <Link to={backTo} className="vg-header-action" aria-label="Go back"><ArrowLeft size={19} /></Link>
      <Link to="/" className="vg-brand" aria-label="KothaSetu home">
        <strong>কথাসেতু</strong>
        <span>Speak. Be understood.</span>
      </Link>
      <PageMenuButton className="vg-header-action" onSearch={onSearch} searchLabel={searchLabel} />
    </header>
  )
}
