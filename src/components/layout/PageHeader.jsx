import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

function AlpanaBar() {
  return (
    <svg className="bh-alpana" viewBox="0 0 240 18" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="9" x2="88" y2="9" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
      <circle cx="96"  cy="9" r="2"   fill="currentColor" fillOpacity="0.7" />
      <circle cx="108" cy="9" r="4"   fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <circle cx="108" cy="9" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <polygon points="120,4 123,9 120,14 117,9" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.8" />
      <circle cx="132" cy="9" r="4"   fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <circle cx="132" cy="9" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <circle cx="144" cy="9" r="2"   fill="currentColor" fillOpacity="0.7" />
      <line x1="152" y1="9" x2="240" y2="9" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.8" />
    </svg>
  )
}

export default function PageHeader() {
  return (
    <div className="bh-header">
      <Link to="/" className="bh-brand-block" style={{ textDecoration: 'none' }}>
        <span className="bh-brand">কথাসেতু</span>
        <AlpanaBar />
      </Link>
      <Link to="/discover" className="bh-search-btn" aria-label="Search">
        <Search size={19} />
      </Link>
    </div>
  )
}
