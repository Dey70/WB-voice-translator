import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarRange, MapPinned } from 'lucide-react'
import templeImg from '../assets/temple.jpg'
import PageHeader from '../components/layout/PageHeader'

const COPY = {
  en: {
    eyebrow: 'Plan your regional journey',
    title: 'Explore',
    subtitle: '124 curated places across West Bengal',
    nearby: 'Destination Vault',
    nearbyBn: 'গন্তব্য ভল্ট',
    nearbyDesc: 'Curated attractions, hidden gems, road trips, and directions built around where you are.',
    nearbyCount: '124 attractions',
    season: 'Seasonal Guide',
    seasonBn: 'ঋতু গাইড',
    seasonDesc: 'Compare weather, road, forest, sea, and festival conditions across all eight regions of West Bengal.',
    seasonCount: '8 regions',
  },
  bn: {
    eyebrow: 'আঞ্চলিক ভ্রমণ পরিকল্পনা করুন',
    title: 'অন্বেষণ',
    subtitle: 'পশ্চিমবঙ্গ জুড়ে ১২৪টি বাছাই করা স্থান',
    nearby: 'গন্তব্য ভল্ট',
    nearbyBn: 'গন্তব্য ভল্ট',
    nearbyDesc: '১২৪টি বাছাই করা আকর্ষণ, অজানা রত্ন, সড়ক ভ্রমণ ও দিকনির্দেশ।',
    nearbyCount: '১২৪টি আকর্ষণ',
    season: 'ঋতুভিত্তিক গাইড',
    seasonBn: 'ঋতু গাইড',
    seasonDesc: 'আটটি অঞ্চলের আবহাওয়া, রাস্তা, বন, সমুদ্র ও উৎসবের পরিস্থিতি তুলনা করুন।',
    seasonCount: '৮টি অঞ্চল',
  },
  ne: {
    eyebrow: 'क्षेत्रीय यात्रा योजना बनाउनुहोस्',
    title: 'अन्वेषण',
    subtitle: 'पश्चिम बंगालभर १२४ छानिएका ठाउँहरू',
    nearby: 'Destination Vault',
    nearbyBn: 'गन्तव्य भल्ट',
    nearbyDesc: '१२४ छानिएका आकर्षण, लुकेका रत्न, सडक यात्रा र दिशानिर्देश।',
    nearbyCount: '१२४ आकर्षणहरू',
    season: 'मौसमी गाइड',
    seasonBn: 'मौसम गाइड',
    seasonDesc: 'आठ क्षेत्रका मौसम, सडक, वन, समुद्र र चाडपर्वको अवस्था तुलना गर्नुहोस्।',
    seasonCount: '८ क्षेत्रहरू',
  },
  hi: {
    eyebrow: 'क्षेत्रीय यात्रा की योजना बनाएँ',
    title: 'अन्वेषण',
    subtitle: 'पश्चिम बंगाल में 124 क्यूरेटेड स्थान',
    nearby: 'Destination Vault',
    nearbyBn: 'गंतव्य वॉल्ट',
    nearbyDesc: '124 चुने हुए आकर्षण, छिपे रत्न, सड़क यात्राएँ और दिशा-निर्देश।',
    nearbyCount: '124 आकर्षण',
    season: 'मौसमी गाइड',
    seasonBn: 'मौसम गाइड',
    seasonDesc: 'आठ क्षेत्रों के मौसम, सड़क, वन, समुद्र और त्योहार की स्थितियों की तुलना करें।',
    seasonCount: '8 क्षेत्र',
  },
}

export default function PlacesHub() {
  const [language, setLanguage] = useState('en')
  const copy = COPY[language]

  return (
    <main className="places-hub-v2">

      {/* Full-page temple background with overcast overlay */}
      <div className="pb-bg" aria-hidden="true">
        <img src={templeImg} alt="" />
        <div className="pb-bg-overlay pb-bg-overlay--overcast" />
      </div>

      {/* Content */}
      <div className="phv2-content">
        <PageHeader />

        {/* Hero */}
        <header className="phv2-hero">
          <span className="phv2-eyebrow">{copy.eyebrow}</span>
          <h1 className="phv2-title">{copy.title}</h1>
          <p className="phv2-subtitle">{copy.subtitle}</p>
          <div className="phv2-lang-row">
            {['en', 'bn', 'ne', 'hi'].map(l => (
              <button key={l} className={language === l ? 'active' : ''} onClick={() => setLanguage(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        {/* Cards */}
        <section className="phv2-cards" aria-label="Explore sections">

          <Link to="/places/explore" className="phv2-card">
            <div className="phv2-card-top">
              <span className="phv2-badge phv2-badge--orange">
                <MapPinned size={11} /> Vault
              </span>
              <span className="phv2-count">{copy.nearbyCount}</span>
            </div>
            <h2>{copy.nearby}</h2>
            <p className="phv2-card-bn">{copy.nearbyBn}</p>
            <p className="phv2-card-desc">{copy.nearbyDesc}</p>
            <div className="phv2-tags">
              <span>Road trips</span>
              <span>Hidden gems</span>
              <span>Filters</span>
            </div>
          </Link>

          <Link to="/places/seasons" className="phv2-card">
            <div className="phv2-card-top">
              <span className="phv2-badge phv2-badge--gold">
                <CalendarRange size={11} /> Seasonal
              </span>
              <span className="phv2-count">{copy.seasonCount}</span>
            </div>
            <h2>{copy.season}</h2>
            <p className="phv2-card-bn">{copy.seasonBn}</p>
            <p className="phv2-card-desc">{copy.seasonDesc}</p>
            <div className="phv2-tags">
              <span>Weather</span>
              <span>Festivals</span>
              <span>Best time</span>
            </div>
          </Link>

        </section>
      </div>
    </main>
  )
}
