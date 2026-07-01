import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, CalendarRange, ChevronRight, Landmark, Map, MapPinned,
  Mountain, PawPrint, Search, Sparkles, UtensilsCrossed,
} from 'lucide-react'
import templeImg from '../assets/temple.jpg'

const QUICK_LINKS = [
  { label:'Heritage', Icon:Landmark, to:'/places/explore' },
  { label:'Wildlife', Icon:PawPrint, to:'/places/explore' },
  { label:'Food', Icon:UtensilsCrossed, to:'/places/food' },
  { label:'Hills', Icon:Mountain, to:'/places/explore' },
  { label:'Offbeat', Icon:Sparkles, to:'/places/explore' },
]

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
    food: 'Local Food', foodBn: 'স্থানীয় খাবার', foodDesc: 'Everyday plates, must-try specialties, and rare traditions—guided by where and how they are respectfully found.', foodCount: '15 food stories',
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
    food: 'স্থানীয় খাবার', foodBn: 'খাবারের গল্প', foodDesc: 'রোজকার খাবার থেকে বিশেষ ঐতিহ্য—কোথায় এবং কীভাবে সম্মানের সঙ্গে খুঁজে পাবেন।', foodCount: '১৫টি খাবারের গল্প',
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
    food: 'स्थानीय खाना', foodBn: 'खानाका कथा', foodDesc: 'दैनिक थालीदेखि विशेष परम्परासम्म—कहाँ र कसरी सम्मानपूर्वक पाउने।', foodCount: '१५ खाद्य कथाहरू',
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
    food: 'स्थानीय भोजन', foodBn: 'खाने की कहानियाँ', foodDesc: 'रोज़मर्रा की थाली से दुर्लभ परंपराओं तक—उन्हें सम्मान से कहाँ और कैसे पाएँ।', foodCount: '15 भोजन कथाएँ',
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
        <div className="phv2-topbar">
          <Link to="/" className="phv2-header-action" aria-label="Back to home"><ArrowLeft size={19} /></Link>
          <Link to="/" className="phv2-brand" aria-label="KothaSetu home">
            <strong>কথাসেতু</strong>
            <span>Speak. Be understood.</span>
          </Link>
          <Link to="/places/explore" className="phv2-header-action" aria-label="Search places"><Search size={18} /></Link>
        </div>

        {/* Hero */}
        <header className="phv2-hero">
          <h1 className="phv2-title">{copy.title}</h1>
          <p className="phv2-subtitle">Curated by locals, not algorithms · {copy.subtitle}</p>
          <div className="phv2-lang-row">
            {['en', 'bn', 'ne', 'hi'].map(l => (
              <button key={l} className={language === l ? 'active' : ''} onClick={() => setLanguage(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        <nav className="phv2-quick-links" aria-label="Explore by interest">
          {QUICK_LINKS.map(({ label, Icon, to }) => (
            <Link key={label} to={to}><span><Icon size={18} /></span><small>{label}</small></Link>
          ))}
        </nav>

        {/* Cards */}
        <section className="phv2-cards" aria-label="Explore sections">
          <h2 className="phv2-section-title">Browse sections</h2>

          <Link to="/places/explore" className="phv2-card">
            <span className="phv2-card-icon phv2-card-icon--teal"><MapPinned size={21} /></span>
            <div><h2>{copy.nearby}</h2><p>{copy.nearbyCount} · Curated places, hidden gems and practical access notes</p></div>
            <ChevronRight size={17} />
          </Link>

          <Link to="/places/routes" className="phv2-card">
            <span className="phv2-card-icon phv2-card-icon--orange"><Map size={21} /></span>
            <div><h2>Route Map</h2><p>Live road routes · manual origins · honest trek guidance</p></div>
            <ChevronRight size={17} />
          </Link>

          <Link to="/places/food" className="phv2-card phv2-card--food">
            <span className="phv2-card-icon phv2-card-icon--gold"><UtensilsCrossed size={21} /></span>
            <div><h2>{copy.food}</h2><p>{copy.foodCount} · Everyday plates, must-try dishes and rare traditions</p></div>
            <ChevronRight size={17} />
          </Link>

          <Link to="/places/seasons" className="phv2-card">
            <span className="phv2-card-icon phv2-card-icon--purple"><CalendarRange size={21} /></span>
            <div><h2>{copy.season}</h2><p>{copy.seasonCount} · Weather, road, festival and best-time guidance</p></div>
            <ChevronRight size={17} />
          </Link>

        </section>
      </div>
    </main>
  )
}
