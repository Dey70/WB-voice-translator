export const HIDDEN_TOURISM_SPOTS = [
  {
    id: 'kumartuli', region: 'kolkata', name: 'Kumartuli', type: 'Artisan quarter', detailKey: 'standard-public', isHidden: true,
    description: { en: 'A historic potters’ quarter where artisan workshops create clay idols and traditional sculpture.', bn: 'ঐতিহাসিক কুমোরপাড়া, যেখানে শিল্পীদের কর্মশালায় মাটির প্রতিমা ও ঐতিহ্যবাহী ভাস্কর্য তৈরি হয়।', ne: 'ऐतिहासिक कुमाले बस्ती, जहाँ कलाकारका कार्यशालामा माटाका मूर्ति र परम्परागत शिल्प बनाइन्छ।', hi: 'ऐतिहासिक कुम्हार बस्ती, जहाँ कारीगरों की कार्यशालाओं में मिट्टी की प्रतिमाएँ और पारंपरिक मूर्तियाँ बनती हैं।' },
    advisory: 'These are working neighbourhood lanes; ask before photographing artisans or workshops.',
  },
  {
    id: 'south-park-street-cemetery', region: 'kolkata', name: 'South Park Street Cemetery', type: 'Heritage cemetery', detailKey: 'standard-ticket', isHidden: true,
    description: { en: 'A quiet eighteenth-century cemetery known for moss-covered monuments and Indo-European funerary architecture.', bn: 'শ্যাওলা-ঢাকা স্মৃতিসৌধ ও ইন্দো-ইউরোপীয় সমাধি স্থাপত্যের জন্য পরিচিত শান্ত অষ্টাদশ শতকের কবরস্থান।', ne: 'लेउले ढाकिएका स्मारक र इन्डो-युरोपेली समाधि वास्तुकलाका लागि परिचित शान्त अठारौँ शताब्दीको चिहान।', hi: 'काई से ढके स्मारकों और इंडो-यूरोपीय समाधि वास्तुकला के लिए प्रसिद्ध शांत अठारहवीं सदी का कब्रिस्तान।' },
    advisory: 'Treat the grounds respectfully and confirm current visitor hours.',
  },
  {
    id: 'dali-monastery', region: 'darjeeling', name: 'Dali Monastery', type: 'Monastery', detailKey: 'standard-religious', isHidden: true,
    description: { en: 'A colourful hillside monastery with prayer halls, murals, and a calmer atmosphere than central Darjeeling sites.', bn: 'রঙিন প্রার্থনাকক্ষ, দেয়ালচিত্র ও শহরের কেন্দ্রের তুলনায় শান্ত পরিবেশসহ পাহাড়ি মঠ।', ne: 'रङ्गीन प्रार्थना कक्ष, भित्तेचित्र र मध्य दार्जिलिङभन्दा शान्त वातावरण भएको पहाडी गुम्बा।', hi: 'रंगीन प्रार्थना कक्षों, भित्तिचित्रों और केंद्रीय दार्जिलिंग से शांत वातावरण वाला पहाड़ी मठ।' },
    advisory: 'Prayer sessions may limit visitor movement or photography.',
  },
  {
    id: 'lamahatta', region: 'darjeeling', name: 'Lamahatta Eco Park', type: 'Hill garden', detailKey: 'standard-nature', isHidden: true,
    description: { en: 'A landscaped hill garden and forest retreat known for pine walks, prayer flags, and quiet mountain views.', bn: 'পাইনবনের পথ, প্রার্থনার পতাকা ও শান্ত পাহাড়ি দৃশ্যের জন্য পরিচিত সাজানো বাগান ও বনাঞ্চল।', ne: 'सल्लाघारी बाटो, प्रार्थना झण्डा र शान्त पहाडी दृश्यका लागि परिचित सजाइएको बगैँचा र वन विश्रामस्थल।', hi: 'चीड़ के रास्तों, प्रार्थना झंडों और शांत पहाड़ी दृश्यों के लिए प्रसिद्ध सजा हुआ उद्यान और वन विश्राम स्थल।' },
    advisory: 'Road and weather conditions should be checked before leaving Darjeeling.',
  },
  {
    id: 'lepcha-museum', region: 'kalimpong', name: 'Lepcha Museum', type: 'Community museum', detailKey: 'standard-ticket', isHidden: true,
    description: { en: 'A small community museum preserving Lepcha clothing, musical instruments, manuscripts, and everyday heritage.', bn: 'লেপচা পোশাক, বাদ্যযন্ত্র, পাণ্ডুলিপি ও দৈনন্দিন ঐতিহ্য সংরক্ষণকারী ছোট কমিউনিটি জাদুঘর।', ne: 'लेप्चा पोसाक, वाद्ययन्त्र, पाण्डुलिपि र दैनिक सम्पदा संरक्षण गर्ने सानो सामुदायिक सङ्ग्रहालय।', hi: 'लेपचा परिधान, वाद्ययंत्र, पांडुलिपियाँ और दैनिक विरासत सहेजने वाला छोटा सामुदायिक संग्रहालय।' },
    advisory: 'Small museums may have limited or appointment-based opening hours.',
  },
  {
    id: 'charkhole', region: 'kalimpong', name: 'Charkhole', type: 'Mountain village', detailKey: 'standard-nature', isHidden: true,
    description: { en: 'A quiet forested village with Kanchenjunga views, homestays, birdlife, and slow rural travel.', bn: 'কাঞ্চনজঙ্ঘার দৃশ্য, হোমস্টে, পাখি ও ধীর গ্রামীণ ভ্রমণের জন্য পরিচিত শান্ত বনঘেরা গ্রাম।', ne: 'कञ्चनजङ्घा दृश्य, होमस्टे, चराचुरुङ्गी र शान्त ग्रामीण यात्राका लागि परिचित वनले घेरिएको गाउँ।', hi: 'कंचनजंगा के दृश्य, होमस्टे, पक्षियों और धीमी ग्रामीण यात्रा के लिए प्रसिद्ध शांत वनाच्छादित गाँव।' },
    advisory: 'Arrange transport and accommodation ahead; mobile connectivity can be limited.',
  },
  {
    id: 'salugara-monastery', region: 'siliguri', name: 'Salugara Monastery', type: 'Monastery', detailKey: 'standard-religious', isHidden: true,
    description: { en: 'A Tibetan Buddhist monastery and stupa offering a peaceful stop away from Siliguri’s busy transit areas.', bn: 'শিলিগুড়ির ব্যস্ত যাতায়াত এলাকা থেকে দূরে শান্ত তিব্বতি বৌদ্ধ মঠ ও স্তূপ।', ne: 'सिलिगुडीको व्यस्त यातायात क्षेत्रबाट टाढा शान्त तिब्बती बौद्ध गुम्बा र स्तूप।', hi: 'सिलीगुड़ी के व्यस्त यातायात क्षेत्रों से दूर शांत तिब्बती बौद्ध मठ और स्तूप।' },
    advisory: 'Respect worship spaces and confirm visitor access during ceremonies.',
  },
  {
    id: 'madhuban-park', region: 'siliguri', name: 'Madhuban Park', type: 'Forest park', detailKey: 'standard-nature', isHidden: true,
    description: { en: 'A green picnic and walking area near the foothills, suited to a relaxed break from the city.', bn: 'পাহাড়ের পাদদেশের কাছে সবুজ পিকনিক ও হাঁটার জায়গা, শহর থেকে শান্ত বিরতির জন্য উপযুক্ত।', ne: 'पहाडको फेदी नजिकको हरियो पिकनिक र हिँड्ने क्षेत्र, सहरबाट शान्त विश्रामका लागि उपयुक्त।', hi: 'पहाड़ियों की तलहटी के पास हरा-भरा पिकनिक और पैदल क्षेत्र, शहर से शांत विराम के लिए उपयुक्त।' },
    advisory: 'Confirm road access, park condition, and closing time locally.',
  },
  {
    id: 'jayanti', region: 'dooars', name: 'Jayanti', type: 'Riverside forest village', detailKey: 'standard-nature', isHidden: true,
    description: { en: 'A quiet forest village beside the Jayanti River, known for stony riverbeds, hills, and nature stays.', bn: 'জয়ন্তী নদীর ধারের শান্ত বনগ্রাম, পাথুরে নদীখাত, পাহাড় ও প্রকৃতি-বাসের জন্য পরিচিত।', ne: 'जयन्ती नदी किनारको शान्त वन गाउँ, ढुङ्गे नदीबगर, पहाड र प्रकृति बसाइका लागि परिचित।', hi: 'जयन्ती नदी किनारे शांत वन गाँव, पथरीले नदी तल, पहाड़ियों और प्रकृति प्रवास के लिए प्रसिद्ध।' },
    advisory: 'Forest permissions and monsoon river conditions can affect access.',
  },
  {
    id: 'chilapata', region: 'dooars', name: 'Chilapata Forest', type: 'Forest reserve', detailKey: 'standard-wildlife', isHidden: true,
    description: { en: 'A dense forest corridor between major Dooars parks, known for guided safaris, wildlife, and the Nalraja ruins.', bn: 'ডুয়ার্সের প্রধান উদ্যানগুলির মাঝের ঘন বনপথ, গাইডেড সাফারি, বন্যপ্রাণী ও নলরাজার ধ্বংসাবশেষের জন্য পরিচিত।', ne: 'डुवर्सका प्रमुख निकुञ्जबीचको घना वन मार्ग, निर्देशित सफारी, वन्यजन्तु र नलराजा भग्नावशेषका लागि परिचित।', hi: 'डूआर्स के प्रमुख उद्यानों के बीच घना वन गलियारा, निर्देशित सफारी, वन्यजीव और नलराजा खंडहर के लिए प्रसिद्ध।' },
    advisory: 'Use authorised safari services and confirm seasonal forest closures.',
  },
  {
    id: 'burirdabri', region: 'sundarbans', name: 'Burirdabri Watchtower', type: 'Remote mangrove site', detailKey: 'standard-wildlife', isHidden: true,
    description: { en: 'A remote Sundarbans watchtower known for mangrove mudflats, a canopy walk, and quieter wildlife observation.', bn: 'ম্যানগ্রোভ কাদাভূমি, ক্যানোপি ওয়াক ও তুলনামূলক শান্ত বন্যপ্রাণী পর্যবেক্ষণের জন্য পরিচিত দূরবর্তী ওয়াচটাওয়ার।', ne: 'म्यान्ग्रोभ दलदल, क्यानोपी वाक र शान्त वन्यजन्तु अवलोकनका लागि परिचित टाढाको वाचटावर।', hi: 'मैंग्रोव दलदल, कैनोपी वॉक और अपेक्षाकृत शांत वन्यजीव अवलोकन के लिए प्रसिद्ध दूरस्थ वॉचटावर।' },
    advisory: 'Remote access depends on permits, tides, weather, and authorised boat itineraries.',
  },
  {
    id: 'bonnie-camp', region: 'sundarbans', name: 'Bonnie Camp', type: 'Remote forest camp', detailKey: 'standard-wildlife', isHidden: true,
    description: { en: 'A remote forest camp and watchtower reached by longer boat routes through the western Sundarbans.', bn: 'পশ্চিম সুন্দরবনের দীর্ঘ নৌপথে পৌঁছানো দূরবর্তী বন শিবির ও ওয়াচটাওয়ার।', ne: 'पश्चिमी सुन्दरवनको लामो डुङ्गा मार्गबाट पुगिने टाढाको वन शिविर र वाचटावर।', hi: 'पश्चिमी सुंदरबन के लंबे नाव मार्ग से पहुँचा जाने वाला दूरस्थ वन शिविर और वॉचटावर।' },
    advisory: 'Do not travel independently; confirm current forest access with an authorised operator.',
  },
  {
    id: 'shankarpur-beach', region: 'digha', name: 'Shankarpur Beach', type: 'Fishing beach', detailKey: 'standard-public', isHidden: true,
    description: { en: 'A quieter fishing beach east of Digha, known for open shoreline, fishing activity, and fewer crowds.', bn: 'দিঘার পূর্বে অপেক্ষাকৃত শান্ত মৎস্যজীবী সৈকত, খোলা সমুদ্রতট ও কম ভিড়ের জন্য পরিচিত।', ne: 'दिघाको पूर्वमा रहेको शान्त माछा मार्ने समुद्रतट, खुला किनार र कम भीडका लागि परिचित।', hi: 'दीघा के पूर्व में शांत मछुआरा समुद्र तट, खुले तट और कम भीड़ के लिए प्रसिद्ध।' },
    advisory: 'Swimming safety, tides, and fishing-zone restrictions must be checked locally.',
  },
  {
    id: 'udaipur-beach', region: 'digha', name: 'Udaipur Beach', type: 'Quiet beach', detailKey: 'standard-public', isHidden: true,
    description: { en: 'A relatively quiet beach near the West Bengal–Odisha border with casuarina trees and informal beach stalls.', bn: 'পশ্চিমবঙ্গ-ওড়িশা সীমান্তের কাছে ঝাউগাছ ও ছোট সৈকত দোকানসহ অপেক্ষাকৃত শান্ত সমুদ্রতট।', ne: 'पश्चिम बङ्गाल–ओडिशा सीमाना नजिक क्यासुरिना रुख र साना पसल भएको शान्त समुद्रतट।', hi: 'पश्चिम बंगाल–ओडिशा सीमा के पास कैसुरिना पेड़ों और छोटे बीच स्टॉल वाला अपेक्षाकृत शांत समुद्र तट।' },
    advisory: 'Confirm local border access, tides, and safe bathing zones.',
  },
  {
    id: 'fambong-lho', region: 'sikkim', name: 'Fambong Lho Wildlife Sanctuary', type: 'Wildlife sanctuary', detailKey: 'standard-wildlife', isHidden: true,
    description: { en: 'A forested sanctuary near Gangtok with hiking routes, birdlife, orchids, and broad mountain views.', bn: 'গ্যাংটকের কাছে বনাঞ্চল, হাঁটার পথ, পাখি, অর্কিড ও বিস্তৃত পাহাড়ি দৃশ্যসহ অভয়ারণ্য।', ne: 'गान्तोक नजिकको वन्यजन्तु आरक्ष, जहाँ पदमार्ग, चराचुरुङ्गी, सुनाखरी र फराकिलो पहाडी दृश्य छन्।', hi: 'गंगटोक के पास वनाच्छादित अभयारण्य, जहाँ पैदल मार्ग, पक्षी, ऑर्किड और विस्तृत पहाड़ी दृश्य हैं।' },
    advisory: 'A permit or guide may be required; check weather and trail access before departure.',
  },
  {
    id: 'aritar-lake', region: 'sikkim', name: 'Aritar Lampokhari Lake', type: 'Mountain lake', detailKey: 'standard-nature', isHidden: true,
    description: { en: 'A peaceful landscaped mountain lake in East Sikkim, popular for short walks, boating, and village stays.', bn: 'পূর্ব সিকিমের শান্ত সাজানো পাহাড়ি হ্রদ, ছোট হাঁটা, নৌবিহার ও গ্রামীণ থাকার জন্য জনপ্রিয়।', ne: 'पूर्व सिक्किमको शान्त सजाइएको पहाडी ताल, छोटो हिँडाइ, डुङ्गा सयर र गाउँ बसाइका लागि लोकप्रिय।', hi: 'पूर्वी सिक्किम की शांत सजी हुई पहाड़ी झील, छोटी सैर, नौका विहार और गाँव में ठहरने के लिए लोकप्रिय।' },
    advisory: 'Road conditions and boating availability should be confirmed locally.',
  },
]
