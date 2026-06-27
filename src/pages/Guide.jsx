import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPinned, HeartHandshake, Lightbulb, Train } from 'lucide-react'
import bolpurBg from '../assets/Bolpur.jpg'
import PageHeader from '../components/layout/PageHeader'

/* Places card illustration */
function PlacesIllustration() {
  return (
    <svg viewBox="0 0 260 110" aria-hidden="true" style={{ width: '100%', height: 110 }}>
      {/* Sky */}
      <rect width="260" height="110" fill="rgba(13,115,119,0.08)" />
      {/* Left tower */}
      <rect x="40" y="30" width="28" height="70" rx="2" fill="rgba(13,115,119,0.35)" />
      <rect x="36" y="22" width="36" height="12" rx="2" fill="rgba(13,115,119,0.45)" />
      <rect x="48" y="14" width="12" height="10" rx="1" fill="rgba(13,115,119,0.55)" />
      {/* Centre dome */}
      <ellipse cx="130" cy="42" rx="38" ry="30" fill="rgba(13,115,119,0.28)" />
      <rect x="94" y="58" width="72" height="42" rx="3" fill="rgba(13,115,119,0.35)" />
      <rect x="112" y="72" width="36" height="28" rx="2" fill="rgba(13,115,119,0.2)" />
      {/* Right tower */}
      <rect x="192" y="38" width="24" height="62" rx="2" fill="rgba(13,115,119,0.35)" />
      <rect x="188" y="30" width="32" height="10" rx="2" fill="rgba(13,115,119,0.45)" />
      <rect x="198" y="20" width="12" height="12" rx="1" fill="rgba(13,115,119,0.55)" />
      {/* Ground */}
      <rect x="0" y="98" width="260" height="12" fill="rgba(13,115,119,0.2)" />
      {/* Stars */}
      <circle cx="20"  cy="15" r="1.2" fill="rgba(255,255,255,0.4)" />
      <circle cx="220" cy="12" r="1"   fill="rgba(255,255,255,0.35)" />
      <circle cx="245" cy="28" r="0.8" fill="rgba(255,255,255,0.3)" />
    </svg>
  )
}

/* Cultural card illustration */
function CultureIllustration() {
  return (
    <svg viewBox="0 0 260 110" aria-hidden="true" style={{ width: '100%', height: 110 }}>
      <rect width="260" height="110" fill="rgba(200,86,10,0.07)" />
      {/* Compass rose */}
      <circle cx="130" cy="55" r="38" fill="none" stroke="rgba(200,86,10,0.25)" strokeWidth="1.5" />
      <circle cx="130" cy="55" r="26" fill="none" stroke="rgba(200,86,10,0.18)" strokeWidth="1" />
      <circle cx="130" cy="55" r="10" fill="rgba(200,86,10,0.22)" />
      <circle cx="130" cy="55" r="5"  fill="rgba(200,86,10,0.55)" />
      {/* Cardinal lines */}
      <line x1="130" y1="17" x2="130" y2="93" stroke="rgba(200,86,10,0.3)" strokeWidth="1" />
      <line x1="92"  y1="55" x2="168" y2="55" stroke="rgba(200,86,10,0.3)" strokeWidth="1" />
      {/* Diagonal ticks */}
      <line x1="103" y1="28" x2="157" y2="82" stroke="rgba(200,86,10,0.15)" strokeWidth="0.8" />
      <line x1="157" y1="28" x2="103" y2="82" stroke="rgba(200,86,10,0.15)" strokeWidth="0.8" />
      {/* Side orbs */}
      <circle cx="42"  cy="55" r="14" fill="none" stroke="rgba(200,86,10,0.2)" strokeWidth="1.2" />
      <circle cx="42"  cy="55" r="6"  fill="rgba(200,86,10,0.18)" />
      <circle cx="218" cy="55" r="14" fill="none" stroke="rgba(200,86,10,0.2)" strokeWidth="1.2" />
      <circle cx="218" cy="55" r="6"  fill="rgba(200,86,10,0.18)" />
    </svg>
  )
}

function TravelIllustration() {
  return (
    <svg viewBox="0 0 260 110" aria-hidden="true" style={{ width: '100%', height: 110 }}>
      <rect width="260" height="110" fill="rgba(31,37,71,0.5)" />
      {/* Train */}
      <rect x="30" y="55" width="80" height="28" rx="3" fill="rgba(224,101,46,0.35)" />
      <rect x="32" y="46" width="30" height="14" rx="2" fill="rgba(224,101,46,0.4)" />
      <rect x="36" y="49" width="8" height="7" rx="1" fill="rgba(217,164,65,0.6)" />
      <circle cx="48" cy="85" r="6" fill="rgba(224,101,46,0.5)" /><circle cx="48" cy="85" r="2.5" fill="rgba(22,27,48,0.8)" />
      <circle cx="94" cy="85" r="6" fill="rgba(224,101,46,0.5)" /><circle cx="94" cy="85" r="2.5" fill="rgba(22,27,48,0.8)" />
      <line x1="0" y1="91" x2="260" y2="91" stroke="rgba(53,60,102,0.8)" strokeWidth="2" />
      {/* Plane */}
      <path d="M150 32 L200 18 L208 24 L178 32 L208 40 L200 46 Z" fill="rgba(79,168,160,0.35)" />
      <line x1="150" y1="32" x2="210" y2="20" stroke="rgba(79,168,160,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Stars */}
      <circle cx="20" cy="16" r="1" fill="rgba(255,255,255,0.4)" />
      <circle cx="230" cy="10" r="0.9" fill="rgba(217,164,65,0.5)" />
      <circle cx="245" cy="30" r="0.8" fill="rgba(255,255,255,0.35)" />
    </svg>
  )
}

const guideItems = [
  {
    to: '/travel-info',
    label: 'TRAVEL INFORMATION',
    labelFull: 'Travel Information',
    nativeLabel: 'ভ্রমণ তথ্য',
    description: 'Search trains, buses, flights and hotels in one place — schedule reference and curated estimates, no booking required.',
    tags: ['Trains', 'Buses', 'Flights', 'Hotels'],
    accentColor: '#E0652E',
    badgeBg: 'rgba(224,101,46,0.18)',
    badgeBorder: 'rgba(224,101,46,0.35)',
    tagBorder: 'rgba(224,101,46,0.35)',
    Illustration: TravelIllustration,
  },
  {
    to: '/places',
    label: 'PLACES & SEASONS',
    labelFull: 'Places & Seasons',
    nativeLabel: 'স্থান ও ঋতু',
    description: 'Explore sightseeing spots, plan trips by season, and discover the best of West Bengal.',
    tags: ['Sundarbans', 'Darjeeling', 'Bishnupur', '+12 more'],
    accentColor: '#5ecfcf',
    badgeBg: 'rgba(94,207,207,0.18)',
    badgeBorder: 'rgba(94,207,207,0.35)',
    tagBorder: 'rgba(94,207,207,0.35)',
    Illustration: PlacesIllustration,
  },
  {
    to: '/culture',
    label: 'CULTURAL GUIDE',
    labelFull: 'Cultural Guide',
    nativeLabel: 'সাংস্কৃতিক গাইড',
    description: 'Understand local customs, etiquette, festivals, and traditions for a respectful visit.',
    tags: ['Durga Puja', 'Etiquette', 'Dress code'],
    accentColor: '#f4a76b',
    badgeBg: 'rgba(244,167,107,0.18)',
    badgeBorder: 'rgba(244,167,107,0.35)',
    tagBorder: 'rgba(244,167,107,0.35)',
    Illustration: CultureIllustration,
  },
]

export default function Guide() {
  useEffect(() => {
    document.body.classList.add('guide-page-active')
    return () => document.body.classList.remove('guide-page-active')
  }, [])

  return (
    <main className="gd-page">

      {/* Background */}
      <div className="pb-bg" aria-hidden="true">
        <img src={bolpurBg} alt="" />
        <div className="pb-bg-overlay pb-bg-overlay--overcast" />
      </div>

      <div className="gd-content">

        <PageHeader />

        {/* Title */}
        <h1 className="tr-heading" style={{ marginBottom: 6 }}>
          <em>Travel</em> guide
        </h1>
        <p className="tr-sub" style={{ marginBottom: 28 }}>
          Places, seasons, customs and insights for a meaningful journey.
        </p>

        {/* Guide cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {guideItems.map(({ to, label, nativeLabel, description, tags, accentColor, badgeBg, badgeBorder, tagBorder, Illustration }) => (
            <Link key={to} to={to} className="gd-card" style={{ textDecoration: 'none' }}>

              {/* Illustration area */}
              <div className="gd-card-visual">
                <div className="gd-card-badge" style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: accentColor }}>
                  {label}
                </div>
                <Illustration />
                <div className="gd-card-native" style={{ color: accentColor }}>{nativeLabel}</div>
              </div>

              {/* Content */}
              <div className="gd-card-body">
                <p className="gd-card-desc">{description}</p>
                <div className="gd-card-tags">
                  {tags.map(tag => (
                    <span key={tag} className="gd-tag" style={{ borderColor: tagBorder, color: 'rgba(255,255,255,.7)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tip card */}
        <div className="gd-tip">
          <div className="gd-tip-icon">
            <Lightbulb size={20} color="#C8960C" />
          </div>
          <div>
            <div className="gd-tip-label">Tip for travelers</div>
            <div className="gd-tip-text">
              October to March is the best time to visit West Bengal — pleasant weather, vibrant festivals, and lush landscapes.
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .guide-page-active .app-navbar { display:none!important; }

        .gd-page { min-height:100dvh; position:relative; color:#E8EAF6; }
        .gd-content {
          position:relative; z-index:1;
          padding:0 20px calc(104px + env(safe-area-inset-bottom,0px));
          max-width:680px; margin:0 auto;
        }
        .gd-content .bh-header { padding-top:20px; margin-bottom:16px; }

        .gd-card {
          display:block; border-radius:18px; overflow:hidden;
          background:rgba(18,10,40,.65); border:1px solid rgba(255,255,255,.1);
          backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
          transition:border-color .2s, transform .2s;
        }
        .gd-card:hover { border-color:rgba(255,255,255,.22); transform:translateY(-2px); }

        .gd-card-visual {
          position:relative; overflow:hidden;
          border-bottom:1px solid rgba(255,255,255,.08);
        }
        .gd-card-badge {
          position:absolute; top:14px; left:14px; z-index:2;
          padding:5px 14px; border-radius:20px;
          font-size:11px; font-weight:800; letter-spacing:.06em;
          text-transform:uppercase;
        }
        .gd-card-native {
          position:absolute; bottom:12px; left:16px; z-index:2;
          font-family:'Baloo Da 2','Hind Siliguri',sans-serif;
          font-size:13px; font-weight:700; line-height:1.3;
        }

        .gd-card-body { padding:18px 20px 20px; }
        .gd-card-desc {
          font-size:14px; color:rgba(255,255,255,.82); line-height:1.65;
          margin:0 0 14px;
        }
        .gd-card-tags { display:flex; flex-wrap:wrap; gap:8px; }
        .gd-tag {
          padding:5px 14px; border-radius:20px; font-size:12px; font-weight:500;
          border:1px solid; background:rgba(255,255,255,.05);
        }

        .gd-tip {
          display:flex; align-items:flex-start; gap:16px;
          margin-top:20px; padding:20px;
          border-radius:16px;
          background:rgba(18,10,40,.6); border:1px solid rgba(200,150,12,.25);
          backdrop-filter:blur(14px);
        }
        .gd-tip-icon {
          width:44px; height:44px; flex-shrink:0; border-radius:12px;
          background:rgba(200,150,12,.15); border:1px solid rgba(200,150,12,.3);
          display:flex; align-items:center; justify-content:center;
        }
        .gd-tip-label {
          font-size:11px; font-weight:800; letter-spacing:.08em;
          color:#C8960C; margin-bottom:6px; text-transform:uppercase;
        }
        .gd-tip-text { font-size:14px; color:rgba(255,255,255,.75); line-height:1.6; }
      `}</style>
    </main>
  )
}
