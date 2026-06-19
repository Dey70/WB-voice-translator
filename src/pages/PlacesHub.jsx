import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarRange, HeartHandshake, MapPinned } from 'lucide-react'

const COPY = {
  en:{ eyebrow:'Plan your regional journey', title:'Explore', subtitle:'Discover places, plan around the seasons, and travel with local cultural context.', explore:'Explore Nearby', exploreText:'Browse 124 curated attractions, surrounding road trips, hidden gems, access filters, and Google Maps directions.', season:'Seasonal Guide', seasonText:'Compare normal weather, road, forest, sea, festival, and high-altitude conditions across all eight regions.', culture:'Cultural Guide', cultureText:'Understand regional customs, etiquette, festivals, and respectful visitor behaviour.', open:'Open guide' },
  bn:{ eyebrow:'আঞ্চলিক ভ্রমণ পরিকল্পনা করুন', title:'স্থান', subtitle:'কীভাবে পরিকল্পনা করবেন বেছে নিন—এখনই গন্তব্য খুঁজুন বা আগে সেরা ঋতু তুলনা করুন।', explore:'কাছাকাছি ঘুরুন', exploreText:'১২৪টি বাছাই করা আকর্ষণ, কাছের সড়ক ভ্রমণ, অজানা রত্ন, প্রবেশ ফিল্টার ও Google Maps দিকনির্দেশ দেখুন।', season:'ঋতুভিত্তিক গাইড', seasonText:'আটটি অঞ্চলের সাধারণ আবহাওয়া, রাস্তা, বন, সমুদ্র, উৎসব ও উচ্চতার পরিস্থিতি তুলনা করুন।', open:'গাইড খুলুন' },
  ne:{ eyebrow:'क्षेत्रीय यात्रा योजना बनाउनुहोस्', title:'स्थानहरू', subtitle:'कसरी योजना गर्ने छान्नुहोस्—अहिले गन्तव्य खोज्नुहोस् वा पहिले उत्तम मौसम तुलना गर्नुहोस्।', explore:'नजिकका ठाउँ', exploreText:'१२४ छानिएका आकर्षण, नजिकका सडक यात्रा, लुकेका रत्न, पहुँच फिल्टर र Google Maps दिशा हेर्नुहोस्।', season:'मौसमी गाइड', seasonText:'आठ क्षेत्रका सामान्य मौसम, सडक, वन, समुद्र, चाडपर्व र उचाइ अवस्था तुलना गर्नुहोस्।', open:'गाइड खोल्नुहोस्' },
  hi:{ eyebrow:'क्षेत्रीय यात्रा की योजना बनाएँ', title:'स्थान', subtitle:'योजना का तरीका चुनें—अभी गंतव्य खोजें या पहले सबसे अच्छे मौसम की तुलना करें।', explore:'आसपास घूमें', exploreText:'124 चुने हुए आकर्षण, पास की सड़क यात्राएँ, छिपे रत्न, पहुँच फ़िल्टर और Google Maps दिशा देखें।', season:'मौसमी गाइड', seasonText:'आठ क्षेत्रों के सामान्य मौसम, सड़क, वन, समुद्र, त्योहार और ऊँचाई की स्थितियों की तुलना करें।', open:'गाइड खोलें' },
}

const CULTURE_COPY = {
  en: { title: 'Cultural Guide', text: 'Understand regional customs, etiquette, festivals, and respectful visitor behaviour.' },
  bn: { title: 'সাংস্কৃতিক গাইড', text: 'আঞ্চলিক রীতিনীতি, শিষ্টাচার, উৎসব এবং সম্মানজনক পর্যটক আচরণ বুঝুন।' },
  ne: { title: 'सांस्कृतिक गाइड', text: 'क्षेत्रीय चलन, शिष्टाचार, चाडपर्व र सम्मानजनक पर्यटक व्यवहार बुझ्नुहोस्।' },
  hi: { title: 'सांस्कृतिक गाइड', text: 'क्षेत्रीय रीति-रिवाज, शिष्टाचार, त्योहार और सम्मानजनक पर्यटक व्यवहार समझें।' },
}

export default function PlacesHub() {
  const [language,setLanguage] = useState('en')
  const copy = COPY[language]
  const cultureCopy = CULTURE_COPY[language]
  return (
    <main className="places-hub">
      <div className="places-hub-languages">{['en','bn','ne','hi'].map(item=><button key={item} className={language===item?'active':''} onClick={()=>setLanguage(item)}>{item.toUpperCase()}</button>)}</div>
      <header><span>{copy.eyebrow}</span><h1 className="gradient-text">{copy.title}</h1><p>{copy.subtitle}</p></header>
      <section className="places-hub-grid">
        <Link to="/places/explore" className="places-hub-card glass"><div className="places-hub-icon"><MapPinned /></div><h2>{copy.explore}</h2><p>{copy.exploreText}</p><strong>{copy.open} <ArrowRight size={16}/></strong></Link>
        <Link to="/places/seasons" className="places-hub-card glass"><div className="places-hub-icon season"><CalendarRange /></div><h2>{copy.season}</h2><p>{copy.seasonText}</p><strong>{copy.open} <ArrowRight size={16}/></strong></Link>
        <Link to="/culture" className="places-hub-card glass"><div className="places-hub-icon culture"><HeartHandshake /></div><h2>{cultureCopy.title}</h2><p>{cultureCopy.text}</p><strong>{copy.open} <ArrowRight size={16}/></strong></Link>
      </section>
    </main>
  )
}
