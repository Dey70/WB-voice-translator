export const TOURISM_REGIONS = [
  { id: 'darjeeling', name: 'Darjeeling' },
  { id: 'sundarbans', name: 'Sundarbans' },
  { id: 'sikkim', name: 'Sikkim' },
]

export const TOURISM_SPOTS = [
  {
    id: 'tiger-hill', region: 'darjeeling', name: 'Tiger Hill', type: 'Viewpoint',
    description: {
      bn: 'কাঞ্চনজঙ্ঘার উপর সূর্যোদয় দেখার জন্য বিখ্যাত পাহাড়ি ভিউপয়েন্ট। ভোরের যাত্রা আগে থেকে পরিকল্পনা করা ভালো।',
      ne: 'कञ्चनजङ्घामाथिको सूर्योदयका लागि प्रसिद्ध पहाडी दृश्यस्थल। बिहानको यात्रा अगाडि नै योजना बनाउनु राम्रो हुन्छ।',
      hi: 'कंचनजंगा पर सूर्योदय देखने के लिए प्रसिद्ध पहाड़ी व्यू पॉइंट। सुबह की यात्रा पहले से तय करना बेहतर है।',
    },
    timing: 'Sunrise visits; access hours vary by season',
    fee: 'Viewing and vehicle charges may apply',
    advisory: 'Confirm sunrise access and road conditions locally the previous evening.',
  },
  {
    id: 'darjeeling-zoo-hmi', region: 'darjeeling', name: 'Darjeeling Zoo & HMI', type: 'Museum and wildlife',
    description: {
      bn: 'পদ্মজা নাইডু চিড়িয়াখানা এবং হিমালয়ান মাউন্টেনিয়ারিং ইনস্টিটিউট একই এলাকায় জনপ্রিয় দুটি আকর্ষণ।',
      ne: 'पद्मजा नायडू चिडियाखाना र हिमालयन माउन्टेनियरिङ इन्स्टिच्युट एउटै क्षेत्रमा रहेका लोकप्रिय आकर्षण हुन्।',
      hi: 'पद्मजा नायडू चिड़ियाघर और हिमालयन माउंटेनियरिंग इंस्टीट्यूट एक ही परिसर के लोकप्रिय आकर्षण हैं।',
    },
    timing: 'Daytime opening; weekly closure may apply',
    fee: 'Combined entry ticket applies; confirm current rate',
    advisory: 'Check the weekly closing day before travelling.',
  },
  {
    id: 'batasia-loop', region: 'darjeeling', name: 'Batasia Loop', type: 'Railway heritage',
    description: {
      bn: 'দার্জিলিং হিমালয়ান রেলের সর্পিল রেলপথ, বাগান এবং পাহাড়ের দৃশ্যের জন্য পরিচিত।',
      ne: 'दार्जिलिङ हिमालयन रेलवेको घुमाउरो रेलमार्ग, बगैँचा र हिमाली दृश्यका लागि परिचित स्थान।',
      hi: 'दार्जिलिंग हिमालयन रेलवे के घुमावदार रेलमार्ग, उद्यान और पहाड़ी दृश्यों के लिए प्रसिद्ध स्थान।',
    },
    timing: 'Best visited during daylight hours',
    fee: 'Entry ticket may apply; confirm at entrance',
    advisory: 'Toy-train schedules and garden access can change.',
  },
  {
    id: 'peace-pagoda', region: 'darjeeling', name: 'Japanese Peace Pagoda', type: 'Spiritual site',
    description: {
      bn: 'শান্ত পরিবেশ, বৌদ্ধ স্থাপত্য এবং দার্জিলিং শহরের বিস্তৃত দৃশ্যের জন্য পরিচিত প্যাগোডা।',
      ne: 'शान्त वातावरण, बौद्ध वास्तुकला र दार्जिलिङ सहरको फराकिलो दृश्यका लागि परिचित प्यागोडा।',
      hi: 'शांत वातावरण, बौद्ध वास्तुकला और दार्जिलिंग शहर के विस्तृत दृश्य के लिए प्रसिद्ध पैगोडा।',
    },
    timing: 'Daytime visiting; prayer hours may differ',
    fee: 'No standard entry fee; donations may be accepted',
    advisory: 'Maintain silence and follow worship-area instructions.',
  },

  {
    id: 'sajnekhali', region: 'sundarbans', name: 'Sajnekhali Watchtower', type: 'Wildlife watchtower',
    description: {
      bn: 'সুন্দরবন ভ্রমণের একটি প্রধান প্রবেশকেন্দ্র, যেখানে ব্যাখ্যাকেন্দ্র এবং বন্যপ্রাণী দেখার সুযোগ রয়েছে।',
      ne: 'सुन्दरवन यात्राको प्रमुख प्रवेश केन्द्र, जहाँ जानकारी केन्द्र र वन्यजन्तु अवलोकनको अवसर छ।',
      hi: 'सुंदरबन यात्रा का प्रमुख प्रवेश केंद्र, जहाँ व्याख्या केंद्र और वन्यजीव देखने के अवसर मिलते हैं।',
    },
    timing: 'Forest and tide-dependent daytime visits',
    fee: 'Forest permit, guide, boat and camera charges may apply',
    advisory: 'Entry must follow current forest-department permit and guide rules.',
  },
  {
    id: 'sudhanyakhali', region: 'sundarbans', name: 'Sudhanyakhali Watchtower', type: 'Wildlife watchtower',
    description: {
      bn: 'ম্যানগ্রোভ, জলাশয় এবং বন্যপ্রাণী পর্যবেক্ষণের জন্য জনপ্রিয় বনাঞ্চলের ওয়াচটাওয়ার।',
      ne: 'म्यान्ग्रोभ, जलाशय र वन्यजन्तु अवलोकनका लागि लोकप्रिय वन क्षेत्रको वाचटावर।',
      hi: 'मैंग्रोव, जलाशय और वन्यजीव अवलोकन के लिए लोकप्रिय वन क्षेत्र का वॉचटावर।',
    },
    timing: 'Daytime visits subject to tide and forest clearance',
    fee: 'Covered by applicable forest, guide and boat charges',
    advisory: 'Wildlife sightings are never guaranteed; follow the guide at all times.',
  },
  {
    id: 'dobanki', region: 'sundarbans', name: 'Dobanki Canopy Walk', type: 'Mangrove experience',
    description: {
      bn: 'জাল-ঘেরা উঁচু পথে ম্যানগ্রোভ অরণ্যের ভেতর দিয়ে হাঁটার একটি বিশেষ অভিজ্ঞতা।',
      ne: 'जालीले सुरक्षित अग्लो मार्गबाट म्यान्ग्रोभ वनभित्र हिँड्ने विशेष अनुभव।',
      hi: 'जाली से सुरक्षित ऊँचे रास्ते पर मैंग्रोव वन के भीतर चलने का विशेष अनुभव।',
    },
    timing: 'Daytime access subject to forest and tide conditions',
    fee: 'Permit, guide and boat charges apply as notified',
    advisory: 'Access may be suspended for weather, maintenance, or wildlife movement.',
  },
  {
    id: 'netidhopani', region: 'sundarbans', name: 'Netidhopani Watchtower', type: 'Remote watchtower',
    description: {
      bn: 'সুন্দরবনের গভীর অংশে অবস্থিত দূরবর্তী ওয়াচটাওয়ার, যা সাধারণত দীর্ঘ নৌভ্রমণের অংশ।',
      ne: 'सुन्दरवनको भित्री भागमा रहेको टाढाको वाचटावर, जुन प्रायः लामो डुङ्गा यात्रामा समावेश हुन्छ।',
      hi: 'सुंदरबन के भीतरी क्षेत्र में स्थित दूरस्थ वॉचटावर, जो आम तौर पर लंबी नाव यात्रा का हिस्सा होता है।',
    },
    timing: 'Permit-controlled daytime access only',
    fee: 'Additional route, permit and boat costs may apply',
    advisory: 'Access is restricted and must be confirmed with an authorised operator.',
  },

  {
    id: 'tsomgo-lake', region: 'sikkim', name: 'Tsomgo Lake', type: 'High-altitude lake',
    description: {
      bn: 'গ্যাংটকের কাছে উচ্চতায় অবস্থিত হিমবাহ-উৎপন্ন হ্রদ, যা আবহাওয়া ও রাস্তার অবস্থার উপর নির্ভরশীল।',
      ne: 'गान्तोक नजिकै उचाइमा रहेको हिमताल, जहाँको यात्रा मौसम र सडक अवस्थामाथि निर्भर हुन्छ।',
      hi: 'गंगटोक के पास ऊँचाई पर स्थित हिमानी झील, जिसकी यात्रा मौसम और सड़क की स्थिति पर निर्भर करती है।',
    },
    timing: 'Permit-controlled daytime trips; weather dependent',
    fee: 'Permit and vehicle charges vary by operator and season',
    advisory: 'Carry valid identification and check altitude, permit, and road advice.',
  },
  {
    id: 'nathula-pass', region: 'sikkim', name: 'Nathula Pass', type: 'Mountain pass',
    description: {
      bn: 'ভারত-চীন সীমান্তের কাছে উচ্চ পার্বত্য গিরিপথ; দর্শনার্থীর সংখ্যা, জাতীয়তা এবং আবহাওয়া অনুযায়ী প্রবেশ নিয়ন্ত্রিত।',
      ne: 'भारत-चीन सीमाना नजिकको उच्च पहाडी नाका; आगन्तुक संख्या, राष्ट्रियता र मौसमअनुसार प्रवेश नियन्त्रित हुन्छ।',
      hi: 'भारत-चीन सीमा के पास ऊँचा पर्वतीय दर्रा; प्रवेश संख्या, राष्ट्रीयता और मौसम के अनुसार नियंत्रित होता है।',
    },
    timing: 'Permit-controlled visit days and hours vary',
    fee: 'Permit and authorised vehicle package charges apply',
    advisory: 'Not all visitors are eligible. Confirm current permit rules before booking.',
  },
  {
    id: 'rumtek-monastery', region: 'sikkim', name: 'Rumtek Monastery', type: 'Monastery',
    description: {
      bn: 'সিকিমের গুরুত্বপূর্ণ বৌদ্ধ মঠ, যা ধর্মীয় শিল্প, স্থাপত্য এবং শান্ত পরিবেশের জন্য পরিচিত।',
      ne: 'सिक्किमको महत्वपूर्ण बौद्ध गुम्बा, धार्मिक कला, वास्तुकला र शान्त वातावरणका लागि परिचित।',
      hi: 'सिक्किम का महत्वपूर्ण बौद्ध मठ, जो धार्मिक कला, वास्तुकला और शांत वातावरण के लिए जाना जाता है।',
    },
    timing: 'Daytime visiting; religious events may affect access',
    fee: 'Entry or donation rules should be confirmed on arrival',
    advisory: 'Carry identification and respect photography and prayer restrictions.',
  },
  {
    id: 'namgyal-institute', region: 'sikkim', name: 'Namgyal Institute of Tibetology', type: 'Museum and research institute',
    description: {
      bn: 'তিব্বতি ও বৌদ্ধ ইতিহাস, পাণ্ডুলিপি, শিল্পকর্ম এবং সংস্কৃতি নিয়ে গুরুত্বপূর্ণ সংগ্রহশালা।',
      ne: 'तिब्बती तथा बौद्ध इतिहास, पाण्डुलिपि, कला र संस्कृतिको महत्वपूर्ण सङ्ग्रहालय।',
      hi: 'तिब्बती और बौद्ध इतिहास, पांडुलिपियों, कला और संस्कृति का महत्वपूर्ण संग्रहालय।',
    },
    timing: 'Institutional daytime hours; weekly and public-holiday closures may apply',
    fee: 'Museum entry ticket applies; confirm current rate',
    advisory: 'Check the official schedule before visiting on weekends or holidays.',
  },
]

export const TOURISM_DETAIL_TRANSLATIONS = {
  'tiger-hill': {
    timing: { bn: 'সূর্যোদয়ের সময় ভ্রমণ; ঋতু অনুযায়ী প্রবেশের সময় বদলায়', ne: 'सूर्योदयको समयमा भ्रमण; मौसमअनुसार प्रवेश समय बदलिन्छ', hi: 'सूर्योदय के समय भ्रमण; मौसम के अनुसार प्रवेश समय बदलता है' },
    fee: { bn: 'ভিউয়িং এবং গাড়ির চার্জ লাগতে পারে', ne: 'दृश्यस्थल र सवारी शुल्क लाग्न सक्छ', hi: 'व्यूइंग और वाहन शुल्क लग सकता है' },
  },
  'darjeeling-zoo-hmi': {
    timing: { bn: 'দিনের বেলা খোলা; সাপ্তাহিক ছুটি থাকতে পারে', ne: 'दिनको समयमा खुला; साप्ताहिक बिदा हुन सक्छ', hi: 'दिन में खुला; साप्ताहिक बंदी हो सकती है' },
    fee: { bn: 'সম্মিলিত প্রবেশ টিকিট লাগে; বর্তমান মূল্য যাচাই করুন', ne: 'संयुक्त प्रवेश टिकट लाग्छ; हालको दर पुष्टि गर्नुहोस्', hi: 'संयुक्त प्रवेश टिकट लगता है; वर्तमान दर की पुष्टि करें' },
  },
  'batasia-loop': {
    timing: { bn: 'দিনের আলোতে ভ্রমণ করা সবচেয়ে ভালো', ne: 'दिनको उज्यालोमा भ्रमण गर्नु उत्तम', hi: 'दिन के उजाले में जाना सबसे अच्छा है' },
    fee: { bn: 'প্রবেশ টিকিট লাগতে পারে; প্রবেশপথে যাচাই করুন', ne: 'प्रवेश टिकट लाग्न सक्छ; प्रवेशद्वारमा पुष्टि गर्नुहोस्', hi: 'प्रवेश टिकट लग सकता है; प्रवेश द्वार पर पुष्टि करें' },
  },
  'peace-pagoda': {
    timing: { bn: 'দিনের বেলা ভ্রমণ; প্রার্থনার সময় আলাদা হতে পারে', ne: 'दिनको समयमा भ्रमण; प्रार्थना समय फरक हुन सक्छ', hi: 'दिन में भ्रमण; प्रार्थना का समय अलग हो सकता है' },
    fee: { bn: 'নির্দিষ্ট প্রবেশ মূল্য নেই; অনুদান গ্রহণ করা হতে পারে', ne: 'निश्चित प्रवेश शुल्क छैन; दान स्वीकार हुन सक्छ', hi: 'मानक प्रवेश शुल्क नहीं; दान स्वीकार किया जा सकता है' },
  },
  'sajnekhali': {
    timing: { bn: 'বন ও জোয়ারের উপর নির্ভর করে দিনের বেলা ভ্রমণ', ne: 'वन र ज्वारभाटामा निर्भर दिनको भ्रमण', hi: 'वन और ज्वार पर निर्भर दिन का भ्रमण' },
    fee: { bn: 'বন পারমিট, গাইড, নৌকা ও ক্যামেরার চার্জ লাগতে পারে', ne: 'वन अनुमति, गाइड, डुङ्गा र क्यामेरा शुल्क लाग्न सक्छ', hi: 'वन परमिट, गाइड, नाव और कैमरा शुल्क लग सकता है' },
  },
  'sudhanyakhali': {
    timing: { bn: 'জোয়ার ও বন বিভাগের অনুমতি সাপেক্ষে দিনের বেলা ভ্রমণ', ne: 'ज्वारभाटा र वन स्वीकृतिअनुसार दिनको भ्रमण', hi: 'ज्वार और वन अनुमति के अनुसार दिन का भ्रमण' },
    fee: { bn: 'প্রযোজ্য বন, গাইড ও নৌকার চার্জের অন্তর্ভুক্ত', ne: 'लागू वन, गाइड र डुङ्गा शुल्कमा समावेश', hi: 'लागू वन, गाइड और नाव शुल्क में शामिल' },
  },
  'dobanki': {
    timing: { bn: 'বন ও জোয়ারের পরিস্থিতি অনুযায়ী দিনের বেলা প্রবেশ', ne: 'वन र ज्वारभाटाको अवस्थाअनुसार दिनको प्रवेश', hi: 'वन और ज्वार की स्थिति के अनुसार दिन में प्रवेश' },
    fee: { bn: 'বিজ্ঞপ্তি অনুযায়ী পারমিট, গাইড ও নৌকার চার্জ লাগে', ne: 'सूचनाअनुसार अनुमति, गाइड र डुङ्गा शुल्क लाग्छ', hi: 'सूचना के अनुसार परमिट, गाइड और नाव शुल्क लगता है' },
  },
  'netidhopani': {
    timing: { bn: 'শুধুমাত্র পারমিট-নিয়ন্ত্রিত দিনের বেলা প্রবেশ', ne: 'अनुमति नियन्त्रित दिनको समयमा मात्र प्रवेश', hi: 'केवल परमिट-नियंत्रित दिन के समय प्रवेश' },
    fee: { bn: 'অতিরিক্ত রুট, পারমিট ও নৌকার খরচ লাগতে পারে', ne: 'थप मार्ग, अनुमति र डुङ्गा खर्च लाग्न सक्छ', hi: 'अतिरिक्त मार्ग, परमिट और नाव खर्च लग सकता है' },
  },
  'tsomgo-lake': {
    timing: { bn: 'পারমিট-নিয়ন্ত্রিত দিনের ভ্রমণ; আবহাওয়ার উপর নির্ভরশীল', ne: 'अनुमति नियन्त्रित दिनको यात्रा; मौसममा निर्भर', hi: 'परमिट-नियंत्रित दिन की यात्रा; मौसम पर निर्भर' },
    fee: { bn: 'অপারেটর ও ঋতু অনুযায়ী পারমিট ও গাড়ির চার্জ বদলায়', ne: 'सञ्चालक र मौसमअनुसार अनुमति र सवारी शुल्क फरक हुन्छ', hi: 'ऑपरेटर और मौसम के अनुसार परमिट और वाहन शुल्क बदलता है' },
  },
  'nathula-pass': {
    timing: { bn: 'পারমিট-নিয়ন্ত্রিত দিন ও সময় পরিবর্তিত হয়', ne: 'अनुमति नियन्त्रित भ्रमण दिन र समय बदलिन्छ', hi: 'परमिट-नियंत्रित यात्रा के दिन और समय बदलते हैं' },
    fee: { bn: 'পারমিট ও অনুমোদিত গাড়ির প্যাকেজ চার্জ লাগে', ne: 'अनुमति र अधिकृत सवारी प्याकेज शुल्क लाग्छ', hi: 'परमिट और अधिकृत वाहन पैकेज शुल्क लगता है' },
  },
  'rumtek-monastery': {
    timing: { bn: 'দিনের বেলা ভ্রমণ; ধর্মীয় অনুষ্ঠানে প্রবেশ বদলাতে পারে', ne: 'दिनको भ्रमण; धार्मिक कार्यक्रमले प्रवेश बदल्न सक्छ', hi: 'दिन में भ्रमण; धार्मिक आयोजनों से प्रवेश बदल सकता है' },
    fee: { bn: 'প্রবেশ বা অনুদানের নিয়ম পৌঁছে যাচাই করুন', ne: 'प्रवेश वा दान नियम पुगेपछि पुष्टि गर्नुहोस्', hi: 'प्रवेश या दान नियम पहुँचकर पुष्टि करें' },
  },
  'namgyal-institute': {
    timing: { bn: 'প্রতিষ্ঠানের দিনের সময়; সাপ্তাহিক ও সরকারি ছুটি থাকতে পারে', ne: 'संस्थाको दिनको समय; साप्ताहिक र सार्वजनिक बिदा हुन सक्छ', hi: 'संस्थान के दिन के घंटे; साप्ताहिक और सार्वजनिक अवकाश हो सकते हैं' },
    fee: { bn: 'জাদুঘরের প্রবেশ টিকিট লাগে; বর্তমান মূল্য যাচাই করুন', ne: 'सङ्ग्रहालय प्रवेश टिकट लाग्छ; हालको दर पुष्टि गर्नुहोस्', hi: 'संग्रहालय प्रवेश टिकट लगता है; वर्तमान दर की पुष्टि करें' },
  },
}
