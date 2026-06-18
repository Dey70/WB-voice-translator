const langs = ['bn', 'ne', 'hi']

const entities = (rows) => rows.map(([id, en, bn, ne, hi]) => ({ id, en, bn, ne, hi }))
const templates = (rows) => rows.map(([id, en, bn, ne, hi]) => ({ id, en, bn, ne, hi }))

const expand = (category, patterns, items) => patterns.flatMap((pattern) => items.map((item) => ({
  id: `${category}-${pattern.id}-${item.id}`,
  category,
  title: pattern.en.replace('{x}', item.en),
  translations: Object.fromEntries(langs.map((lang) => [lang, pattern[lang].replace('{x}', item[lang])])),
})))

const direct = (category, rows) => rows.map(([id, en, bn, ne, hi]) => ({
  id: `${category}-${id}`,
  category,
  title: en,
  translations: { bn, ne, hi },
}))

const greetingExtras = [
  ...expand('greetings', templates([
    ['speak', 'Do you speak {x}?', 'আপনি কি {x} বলতে পারেন?', 'तपाईं {x} बोल्नुहुन्छ?', 'क्या आप {x} बोलते हैं?'],
    ['i-speak', 'I speak {x}', 'আমি {x} বলতে পারি', 'म {x} बोल्छु', 'मैं {x} बोलता हूँ'],
    ['no-speak', 'I do not speak {x}', 'আমি {x} বলতে পারি না', 'म {x} बोल्दिनँ', 'मैं {x} नहीं बोलता हूँ'],
  ]), entities([
    ['bengali', 'Bengali', 'বাংলা', 'बङ्गाली', 'बंगाली'],
    ['nepali', 'Nepali', 'নেপালি', 'नेपाली', 'नेपाली'],
    ['hindi', 'Hindi', 'হিন্দি', 'हिन्दी', 'हिंदी'],
  ])),
  ...expand('greetings', templates([
    ['from', 'I am from {x}', 'আমি {x} থেকে এসেছি', 'म {x}बाट आएको हुँ', 'मैं {x} से आया हूँ'],
  ]), entities([
    ['kolkata', 'Kolkata', 'কলকাতা', 'कोलकाता', 'कोलकाता'],
    ['delhi', 'Delhi', 'দিল্লি', 'दिल्ली', 'दिल्ली'],
    ['mumbai', 'Mumbai', 'মুম্বাই', 'मुम्बई', 'मुंबई'],
    ['bangladesh', 'Bangladesh', 'বাংলাদেশ', 'बङ्गलादेश', 'बांग्लादेश'],
    ['nepal', 'Nepal', 'নেপাল', 'नेपाल', 'नेपाल'],
    ['india', 'India', 'ভারত', 'भारत', 'भारत'],
    ['abroad', 'another country', 'অন্য দেশ', 'अर्को देश', 'दूसरे देश'],
    ['nearby', 'a nearby town', 'কাছের শহর', 'नजिकैको सहर', 'पास के शहर'],
  ])),
  ...expand('greetings', templates([
    ['first', 'This is my first {x}', 'এটি আমার প্রথম {x}', 'यो मेरो पहिलो {x} हो', 'यह मेरी पहली {x} है'],
    ['enjoying', 'I am enjoying the {x}', 'আমি {x} উপভোগ করছি', 'म {x}को आनन्द लिइरहेको छु', 'मैं {x} का आनंद ले रहा हूँ'],
  ]), entities([
    ['visit', 'visit here', 'এখানে ভ্রমণ', 'यहाँको भ्रमण', 'यहाँ की यात्रा'],
    ['trip', 'trip to the hills', 'পাহাড় ভ্রমণ', 'पहाडको यात्रा', 'पहाड़ों की यात्रा'],
    ['holiday', 'holiday in this region', 'এই অঞ্চলে ছুটি', 'यस क्षेत्रमा बिदा', 'इस क्षेत्र में छुट्टी'],
    ['day', 'day here', 'এখানে দিন', 'यहाँको दिन', 'यहाँ का दिन'],
    ['festival', 'local festival', 'স্থানীয় উৎসব', 'स्थानीय चाड', 'स्थानीय त्योहार'],
    ['weather', 'cool weather', 'ঠান্ডা আবহাওয়া', 'चिसो मौसम', 'ठंडे मौसम'],
  ])),
  ...direct('greetings', [
    ['nice-meet', 'Nice to meet you', 'আপনার সঙ্গে পরিচিত হয়ে ভালো লাগল', 'तपाईंलाई भेटेर खुसी लाग्यो', 'आपसे मिलकर खुशी हुई'],
    ['is-first-time', 'Is this your first visit here?', 'এখানে কি আপনার প্রথম ভ্রমণ?', 'के यो तपाईंको पहिलो भ्रमण हो?', 'क्या आप यहाँ पहली बार आए हैं?'],
    ['tourist', 'I am a tourist', 'আমি একজন পর্যটক', 'म पर्यटक हुँ', 'मैं एक पर्यटक हूँ'],
    ['few-days', 'I will stay for a few days', 'আমি কয়েক দিন থাকব', 'म केही दिन बस्छु', 'मैं कुछ दिन रुकूँगा'],
    ['love-place', 'I love this place', 'এই জায়গাটি আমার খুব ভালো লেগেছে', 'मलाई यो ठाउँ धेरै मन पर्यो', 'मुझे यह जगह बहुत पसंद आई'],
    ['beautiful', 'This place is beautiful', 'এই জায়গাটি খুব সুন্দর', 'यो ठाउँ धेरै सुन्दर छ', 'यह जगह बहुत सुंदर है'],
    ['welcome', 'You are welcome', 'আপনাকে স্বাগতম', 'तपाईंलाई स्वागत छ', 'आपका स्वागत है'],
    ['excuse', 'Excuse me', 'মাফ করবেন', 'माफ गर्नुहोस्', 'माफ कीजिए'],
    ['sorry', 'I am sorry', 'আমি দুঃখিত', 'माफ गर्नुहोस्', 'मुझे माफ कीजिए'],
    ['yes', 'Yes', 'হ্যাঁ', 'हो', 'हाँ'],
    ['no', 'No', 'না', 'होइन', 'नहीं'],
    ['maybe', 'Maybe', 'হয়তো', 'सायद', 'शायद'],
    ['see-again', 'See you again', 'আবার দেখা হবে', 'फेरि भेटौँला', 'फिर मिलेंगे'],
  ]),
]

const foodExtras = [
  ...expand('food', templates([
    ['want', 'I would like {x}', 'আমি {x} চাই', 'मलाई {x} चाहिन्छ', 'मुझे {x} चाहिए'],
    ['contain', 'Does this contain {x}?', 'এতে কি {x} আছে?', 'यसमा {x} छ?', 'क्या इसमें {x} है?'],
  ]), entities([
    ['rice', 'rice', 'ভাত', 'भात', 'चावल'], ['roti', 'roti', 'রুটি', 'रोटी', 'रोटी'],
    ['dal', 'dal', 'ডাল', 'दाल', 'दाल'], ['vegetables', 'vegetables', 'সবজি', 'तरकारी', 'सब्ज़ी'],
    ['chicken', 'chicken', 'মুরগির মাংস', 'कुखुराको मासु', 'चिकन'], ['fish', 'fish', 'মাছ', 'माछा', 'मछली'],
    ['momo', 'momos', 'মোমো', 'मम', 'मोमोज़'], ['noodles', 'noodles', 'নুডলস', 'चाउमिन', 'नूडल्स'],
    ['tea', 'tea', 'চা', 'चिया', 'चाय'], ['coffee', 'coffee', 'কফি', 'कफी', 'कॉफी'],
    ['breakfast', 'breakfast', 'সকালের খাবার', 'बिहानको खाना', 'नाश्ता'], ['snack', 'a light snack', 'হালকা খাবার', 'हल्का खाजा', 'हल्का नाश्ता'],
  ])),
  ...expand('food', templates([
    ['cannot', 'I cannot eat {x}', 'আমি {x} খেতে পারি না', 'म {x} खान सक्दिनँ', 'मैं {x} नहीं खा सकता हूँ'],
    ['without', 'Please make it without {x}', 'দয়া করে {x} ছাড়া তৈরি করুন', 'कृपया {x} बिना बनाउनुहोस्', 'कृपया इसे {x} के बिना बनाइए'],
  ]), entities([
    ['egg', 'egg', 'ডিম', 'अण्डा', 'अंडा'], ['milk', 'milk', 'দুধ', 'दूध', 'दूध'],
    ['nuts', 'nuts', 'বাদাম', 'बदाम', 'मेवे'], ['gluten', 'gluten', 'গ্লুটেন', 'ग्लुटेन', 'ग्लूटेन'],
    ['sugar', 'sugar', 'চিনি', 'चिनी', 'चीनी'], ['onion', 'onion', 'পেঁয়াজ', 'प्याज', 'प्याज़'],
    ['garlic', 'garlic', 'রসুন', 'लसुन', 'लहसुन'], ['oil', 'too much oil', 'বেশি তেল', 'धेरै तेल', 'ज़्यादा तेल'],
    ['chilli', 'chilli', 'লঙ্কা', 'खुर्सानी', 'मिर्च'],
  ])),
]

const transportExtras = [
  ...expand('transport', templates([
    ['route', 'How do I get to {x}?', 'আমি কীভাবে {x} যাব?', '{x} कसरी जाने?', 'मैं {x} कैसे जाऊँ?'],
    ['ticket-to', 'I need one ticket to {x}', 'আমার {x} যাওয়ার একটি টিকিট চাই', 'मलाई {x} जाने एउटा टिकट चाहिन्छ', 'मुझे {x} का एक टिकट चाहिए'],
  ]), entities([
    ['airport', 'the airport', 'বিমানবন্দর', 'विमानस्थल', 'हवाई अड्डे'], ['railway', 'the railway station', 'রেল স্টেশন', 'रेलवे स्टेसन', 'रेलवे स्टेशन'],
    ['bus', 'the bus stand', 'বাস স্ট্যান্ড', 'बसपार्क', 'बस अड्डे'], ['taxi', 'the taxi stand', 'ট্যাক্সি স্ট্যান্ড', 'ट्याक्सी स्ट्यान्ड', 'टैक्सी स्टैंड'],
    ['hotel', 'my hotel', 'আমার হোটেল', 'मेरो होटल', 'अपने होटल'], ['market', 'the main market', 'প্রধান বাজার', 'मुख्य बजार', 'मुख्य बाज़ार'],
    ['hospital', 'the hospital', 'হাসপাতাল', 'अस्पताल', 'अस्पताल'], ['mall', 'the town centre', 'শহরের কেন্দ্র', 'सहरको केन्द्र', 'शहर के केंद्र'],
    ['darjeeling', 'Darjeeling', 'দার্জিলিং', 'दार्जिलिङ', 'दार्जिलिंग'], ['kalimpong', 'Kalimpong', 'কালিম্পং', 'कालिम्पोङ', 'कालिम्पोंग'],
    ['siliguri', 'Siliguri', 'শিলিগুড়ি', 'सिलिगुडी', 'सिलीगुड़ी'], ['gangtok', 'Gangtok', 'গ্যাংটক', 'गान्तोक', 'गंगटोक'],
  ])),
  ...direct('transport', [
    ['platform', 'Which platform does the train leave from?', 'ট্রেনটি কোন প্ল্যাটফর্ম থেকে ছাড়বে?', 'रेल कुन प्लेटफर्मबाट छुट्छ?', 'ट्रेन किस प्लेटफॉर्म से जाएगी?'],
    ['late', 'Is the train or bus late?', 'ট্রেন বা বাস কি দেরি করছে?', 'रेल वा बस ढिलो छ?', 'क्या ट्रेन या बस देर से है?'],
    ['return', 'I need a return ticket', 'আমার যাওয়া-আসার টিকিট চাই', 'मलाई आउने-जाने टिकट चाहिन्छ', 'मुझे आने-जाने का टिकट चाहिए'],
    ['window-seat', 'May I have a window seat?', 'আমি কি জানালার পাশের আসন পেতে পারি?', 'झ्यालपट्टिको सिट पाउँछु?', 'क्या मुझे खिड़की वाली सीट मिल सकती है?'],
    ['slow', 'Please drive slowly', 'দয়া করে ধীরে গাড়ি চালান', 'कृपया बिस्तारै चलाउनुहोस्', 'कृपया धीरे चलाइए'],
    ['motion-sick', 'I feel sick on winding roads', 'আঁকাবাঁকা রাস্তায় আমার বমি পায়', 'घुमाउरो बाटोमा मलाई वाकवाकी लाग्छ', 'घुमावदार रास्ते पर मुझे उल्टी आती है'],
    ['break', 'Can we stop for a short break?', 'আমরা কি একটু বিরতি নিতে পারি?', 'के हामी केही बेर रोक्न सक्छौँ?', 'क्या हम थोड़ी देर रुक सकते हैं?'],
    ['arrival', 'What time will we arrive?', 'আমরা কখন পৌঁছাব?', 'हामी कति बजे पुग्छौँ?', 'हम कितने बजे पहुँचेंगे?'],
    ['wrong-way', 'Are we going the right way?', 'আমরা কি ঠিক পথে যাচ্ছি?', 'के हामी सही बाटोमा जाँदैछौँ?', 'क्या हम सही रास्ते पर जा रहे हैं?'],
    ['map', 'Please show me the route on the map', 'দয়া করে মানচিত্রে পথটি দেখান', 'कृपया नक्सामा बाटो देखाउनुहोस्', 'कृपया नक्शे पर रास्ता दिखाइए'],
  ]),
]

const hotelExtras = [
  ...expand('stays', templates([
    ['has', 'Does the room have {x}?', 'ঘরে কি {x} আছে?', 'कोठामा {x} छ?', 'क्या कमरे में {x} है?'],
    ['need', 'I need {x} in the room', 'ঘরে আমার {x} দরকার', 'मलाई कोठामा {x} चाहिन्छ', 'मुझे कमरे में {x} चाहिए'],
  ]), entities([
    ['heater', 'a heater', 'হিটার', 'हिटर', 'हीटर'], ['blanket', 'an extra blanket', 'একটি অতিরিক্ত কম্বল', 'एउटा थप कम्बल', 'एक अतिरिक्त कंबल'],
    ['wifi', 'Wi-Fi', 'ওয়াই-ফাই', 'वाई-फाई', 'वाई-फाई'], ['bathroom', 'a private bathroom', 'নিজস্ব স্নানঘর', 'निजी स्नानघर', 'निजी बाथरूम'],
    ['view', 'a mountain view', 'পাহাড়ের দৃশ্য', 'हिमालको दृश्य', 'पहाड़ का नज़ारा'], ['balcony', 'a balcony', 'বারান্দা', 'बालकनी', 'बालकनी'],
    ['kettle', 'an electric kettle', 'ইলেকট্রিক কেটলি', 'बिजुलीको कित्ली', 'इलेक्ट्रिक केतली'], ['towels', 'clean towels', 'পরিষ্কার তোয়ালে', 'सफा तौलिया', 'साफ तौलिए'],
    ['power', 'power backup', 'বিদ্যুতের বিকল্প ব্যবস্থা', 'बिजुली ब्याकअप', 'पावर बैकअप'], ['parking', 'parking', 'পার্কিং', 'पार्किङ', 'पार्किंग'],
    ['lift', 'a lift', 'লিফট', 'लिफ्ट', 'लिफ्ट'], ['locker', 'a safe locker', 'নিরাপদ লকার', 'सुरक्षित लकर', 'सुरक्षित लॉकर'],
  ])),
  ...expand('stays', templates([
    ['broken', '{x} is not working', '{x} কাজ করছে না', '{x}ले काम गरिरहेको छैन', '{x} काम नहीं कर रहा है'],
    ['fix', 'Please fix the {x}', 'দয়া করে {x} ঠিক করে দিন', 'कृपया {x} बनाइदिनुहोस्', 'कृपया {x} ठीक कर दीजिए'],
  ]), entities([
    ['tap', 'water tap', 'জলের কল', 'पानीको धारा', 'पानी का नल'], ['light', 'room light', 'ঘরের আলো', 'कोठाको बत्ती', 'कमरे की लाइट'],
    ['heater', 'room heater', 'ঘরের হিটার', 'कोठाको हिटर', 'कमरे का हीटर'], ['geyser', 'water heater', 'গিজার', 'गिजर', 'गीज़र'],
    ['lock', 'door lock', 'দরজার তালা', 'ढोकाको चुकुल', 'दरवाज़े का ताला'], ['toilet', 'toilet', 'শৌচাগার', 'शौचालय', 'शौचालय'],
    ['wifi', 'Wi-Fi', 'ওয়াই-ফাই', 'वाई-फाई', 'वाई-फाई'], ['socket', 'charging socket', 'চার্জিং সকেট', 'चार्जिङ सकेट', 'चार्जिंग सॉकेट'],
    ['television', 'television', 'টেলিভিশন', 'टेलिभिजन', 'टेलीविज़न'],
  ])),
]

const sightseeingExtras = [
  ...expand('sightseeing', templates([
    ['way', 'Which way is {x}?', '{x} কোন দিকে?', '{x} जाने बाटो कुन हो?', '{x} किस तरफ है?'],
    ['fee', 'What is the entry fee for {x}?', '{x} প্রবেশের মূল্য কত?', '{x}को प्रवेश शुल्क कति हो?', '{x} का प्रवेश शुल्क कितना है?'],
  ]), entities([
    ['monastery', 'the monastery', 'মঠ', 'गुम्बा', 'मठ'], ['tea-garden', 'the tea garden', 'চা বাগান', 'चिया बगान', 'चाय बागान'],
    ['viewpoint', 'the viewpoint', 'ভিউপয়েন্ট', 'भ्युपोइन्ट', 'व्यू पॉइंट'], ['museum', 'the museum', 'জাদুঘর', 'सङ्ग्रहालय', 'संग्रहालय'],
    ['park', 'the national park', 'জাতীয় উদ্যান', 'राष्ट्रिय निकुञ्ज', 'राष्ट्रीय उद्यान'], ['lake', 'the lake', 'হ্রদ', 'ताल', 'झील'],
    ['waterfall', 'the waterfall', 'জলপ্রপাত', 'झरना', 'झरना'], ['temple', 'the temple', 'মন্দির', 'मन्दिर', 'मंदिर'],
    ['market', 'the local market', 'স্থানীয় বাজার', 'स्थानीय बजार', 'स्थानीय बाज़ार'], ['ropeway', 'the ropeway', 'রোপওয়ে', 'केबलकार', 'रोपवे'],
    ['trail', 'the walking trail', 'হাঁটার পথ', 'पैदल मार्ग', 'पैदल रास्ता'], ['sunrise', 'the sunrise point', 'সূর্যোদয় দেখার স্থান', 'सूर्योदय स्थल', 'सूर्योदय स्थल'],
  ])),
  ...expand('sightseeing', templates([
    ['allowed', 'Is {x} allowed here?', 'এখানে কি {x} করার অনুমতি আছে?', 'यहाँ {x} गर्न पाइन्छ?', 'क्या यहाँ {x} की अनुमति है?'],
    ['where', 'Where can I do {x}?', 'আমি কোথায় {x} করতে পারি?', 'म कहाँ {x} गर्न सक्छु?', 'मैं {x} कहाँ कर सकता हूँ?'],
  ]), entities([
    ['photo', 'photography', 'ছবি তোলা', 'फोटो खिच्न', 'फोटोग्राफी'], ['video', 'video recording', 'ভিডিও করা', 'भिडियो खिच्न', 'वीडियो रिकॉर्डिंग'],
    ['trekking', 'trekking', 'ট্রেকিং', 'पदयात्रा', 'ट्रेकिंग'], ['camping', 'camping', 'ক্যাম্পিং', 'क्याम्पिङ', 'कैंपिंग'],
    ['birding', 'bird watching', 'পাখি দেখা', 'चरा अवलोकन', 'पक्षी दर्शन'], ['boating', 'boating', 'নৌকাবিহার', 'डुङ्गा सयर', 'नौका विहार'],
    ['cycling', 'cycling', 'সাইকেল চালানো', 'साइकल चलाउन', 'साइकिल चलाना'], ['picnic', 'a picnic', 'পিকনিক', 'पिकनिक', 'पिकनिक'],
    ['drone', 'drone photography', 'ড্রোনে ছবি তোলা', 'ड्रोनबाट फोटो खिच्न', 'ड्रोन फोटोग्राफी'],
  ])),
]

const shoppingExtras = [
  ...expand('shopping', templates([
    ['have', 'Do you have {x}?', 'আপনাদের কি {x} আছে?', 'तपाईंसँग {x} छ?', 'क्या आपके पास {x} है?'],
    ['show', 'Please show me {x}', 'দয়া করে আমাকে {x} দেখান', 'कृपया मलाई {x} देखाउनुहोस्', 'कृपया मुझे {x} दिखाइए'],
  ]), entities([
    ['tea', 'local tea', 'স্থানীয় চা', 'स्थानीय चिया', 'स्थानीय चाय'], ['handicraft', 'local handicrafts', 'স্থানীয় হস্তশিল্প', 'स्थानीय हस्तकला', 'स्थानीय हस्तशिल्प'],
    ['shawl', 'a woollen shawl', 'পশমের শাল', 'ऊनी सल', 'ऊनी शॉल'], ['souvenir', 'a small souvenir', 'ছোট স্মারক', 'सानो चिनो', 'छोटी स्मारिका'],
    ['spices', 'local spices', 'স্থানীয় মশলা', 'स्थानीय मसला', 'स्थानीय मसाले'], ['honey', 'local honey', 'স্থানীয় মধু', 'स्थानीय मह', 'स्थानीय शहद'],
    ['card', 'a postcard', 'পোস্টকার্ড', 'पोस्टकार्ड', 'पोस्टकार्ड'], ['umbrella', 'an umbrella', 'ছাতা', 'छाता', 'छाता'],
    ['raincoat', 'a raincoat', 'বর্ষাতি', 'रेनकोट', 'रेनकोट'], ['medicine', 'basic medicine', 'সাধারণ ওষুধ', 'सामान्य औषधि', 'सामान्य दवा'],
    ['charger', 'a phone charger', 'ফোন চার্জার', 'फोन चार्जर', 'फोन चार्जर'], ['map', 'a local map', 'স্থানীয় মানচিত্র', 'स्थानीय नक्सा', 'स्थानीय नक्शा'],
  ])),
  ...expand('shopping', templates([
    ['in-option', 'Do you have this in {x}?', 'এটি কি {x} পাওয়া যাবে?', 'यो {x}मा पाइन्छ?', 'क्या यह {x} में मिलेगा?'],
    ['prefer', 'I would prefer {x}', 'আমি {x} চাই', 'मलाई {x} मन पर्छ', 'मुझे {x} पसंद होगा'],
  ]), entities([
    ['small', 'a smaller size', 'ছোট মাপে', 'सानो साइज', 'छोटे साइज़'], ['large', 'a larger size', 'বড় মাপে', 'ठूलो साइज', 'बड़े साइज़'],
    ['red', 'red', 'লাল রঙে', 'रातो रङमा', 'लाल रंग'], ['blue', 'blue', 'নীল রঙে', 'निलो रङमा', 'नीले रंग'],
    ['black', 'black', 'কালো রঙে', 'कालो रङमा', 'काले रंग'], ['natural', 'a natural colour', 'প্রাকৃতিক রঙে', 'प्राकृतिक रङमा', 'प्राकृतिक रंग'],
    ['cheaper', 'a cheaper option', 'কম দামের কিছু', 'सस्तो विकल्प', 'सस्ता विकल्प'], ['quality', 'better quality', 'ভালো মানের কিছু', 'राम्रो गुणस्तर', 'बेहतर गुणवत्ता'],
    ['packed', 'gift packing', 'উপহার প্যাকিং', 'उपहार प्याकिङ', 'गिफ्ट पैकिंग'],
  ])),
]

const essentialExtras = [
  ...expand('essentials', templates([
    ['nearest', 'Where is the nearest {x}?', 'সবচেয়ে কাছের {x} কোথায়?', 'नजिकको {x} कहाँ छ?', 'सबसे नज़दीकी {x} कहाँ है?'],
    ['open', 'Is the {x} open now?', '{x} কি এখন খোলা আছে?', 'के {x} अहिले खुला छ?', 'क्या {x} अभी खुला है?'],
  ]), entities([
    ['pharmacy', 'pharmacy', 'ওষুধের দোকান', 'औषधि पसल', 'दवा की दुकान'], ['bank', 'bank', 'ব্যাংক', 'बैङ्क', 'बैंक'],
    ['exchange', 'money exchange', 'টাকা বদলের দোকান', 'मुद्रा सटही', 'मुद्रा विनिमय'], ['police', 'police station', 'থানা', 'प्रहरी चौकी', 'पुलिस स्टेशन'],
    ['post', 'post office', 'ডাকঘর', 'हुलाक कार्यालय', 'डाकघर'], ['tourism', 'tourist information centre', 'পর্যটন তথ্যকেন্দ্র', 'पर्यटक सूचना केन्द्र', 'पर्यटक सूचना केंद्र'],
    ['laundry', 'laundry', 'লন্ড্রি', 'लुगा धुने ठाउँ', 'लॉन्ड्री'], ['shop', 'general store', 'সাধারণ দোকান', 'किराना पसल', 'सामान्य दुकान'],
    ['cafe', 'internet cafe', 'ইন্টারনেট ক্যাফে', 'इन्टरनेट क्याफे', 'इंटरनेट कैफ़े'], ['fuel', 'petrol station', 'পেট্রোল পাম্প', 'पेट्रोल पम्प', 'पेट्रोल पंप'],
    ['water', 'drinking-water point', 'পানীয় জলের স্থান', 'पिउने पानीको धारा', 'पीने के पानी की जगह'], ['helpdesk', 'help desk', 'সহায়তা কেন্দ্র', 'सहायता कक्ष', 'सहायता केंद्र'],
  ])),
  ...expand('essentials', templates([
    ['need', 'I need {x}', 'আমার {x} দরকার', 'मलाई {x} चाहिन्छ', 'मुझे {x} चाहिए'],
    ['available', 'Where is {x} available?', '{x} কোথায় পাওয়া যাবে?', '{x} कहाँ पाइन्छ?', '{x} कहाँ मिलेगा?'],
  ]), entities([
    ['sim', 'a local SIM card', 'স্থানীয় সিম কার্ড', 'स्थानीय सिम कार्ड', 'स्थानीय सिम कार्ड'], ['internet', 'internet access', 'ইন্টারনেট সংযোগ', 'इन्टरनेट', 'इंटरनेट'],
    ['cash', 'some cash', 'কিছু নগদ টাকা', 'नगद पैसा', 'कुछ नकद पैसे'], ['water', 'safe drinking water', 'নিরাপদ পানীয় জল', 'सुरक्षित पिउने पानी', 'सुरक्षित पीने का पानी'],
    ['battery', 'a power bank', 'পাওয়ার ব্যাংক', 'पावर बैङ्क', 'पावर बैंक'], ['adapter', 'a plug adapter', 'প্লাগ অ্যাডাপ্টার', 'प्लग एडाप्टर', 'प्लग अडैप्टर'],
    ['umbrella', 'an umbrella', 'ছাতা', 'छाता', 'छाता'], ['toiletries', 'basic toiletries', 'প্রয়োজনীয় প্রসাধন সামগ্রী', 'सरसफाइका सामान', 'ज़रूरी प्रसाधन सामग्री'],
    ['help', 'tourist assistance', 'পর্যটক সহায়তা', 'पर्यटक सहायता', 'पर्यटक सहायता'],
  ])),
]

const emergencyExtras = [
  ...expand('emergency', templates([
    ['have', 'I have {x}', 'আমার {x} হচ্ছে', 'मलाई {x} भएको छ', 'मुझे {x} है'],
    ['medicine', 'I need medicine for {x}', 'আমার {x} জন্য ওষুধ দরকার', 'मलाई {x}को औषधि चाहिन्छ', 'मुझे {x} की दवा चाहिए'],
  ]), entities([
    ['fever', 'a fever', 'জ্বর', 'ज्वरो', 'बुखार'], ['headache', 'a headache', 'মাথাব্যথা', 'टाउको दुखाइ', 'सिरदर्द'],
    ['stomach', 'a stomach ache', 'পেটব্যথা', 'पेट दुखाइ', 'पेट दर्द'], ['dizziness', 'dizziness', 'মাথা ঘোরা', 'चक्कर', 'चक्कर'],
    ['nausea', 'nausea', 'বমি বমি ভাব', 'वाकवाकी', 'मतली'], ['diarrhoea', 'diarrhoea', 'পেট খারাপ', 'पखाला', 'दस्त'],
    ['cold', 'a bad cold', 'সর্দি', 'रुघा', 'ज़ुकाम'], ['cough', 'a cough', 'কাশি', 'खोकी', 'खाँसी'],
    ['breathing', 'difficulty breathing', 'শ্বাসকষ্ট', 'सास फेर्न गाह्रो', 'साँस लेने में तकलीफ़'], ['allergy', 'an allergic reaction', 'অ্যালার্জি', 'एलर्जी', 'एलर्जी'],
    ['injury', 'an injury', 'চোট', 'चोट', 'चोट'], ['altitude', 'altitude sickness', 'উচ্চতাজনিত অসুস্থতা', 'लेक लाग्ने समस्या', 'ऊँचाई की बीमारी'],
  ])),
  ...expand('emergency', templates([
    ['lost', 'I have lost my {x}', 'আমার {x} হারিয়ে গেছে', 'मेरो {x} हरायो', 'मेरा {x} खो गया है'],
    ['find', 'Please help me find my {x}', 'দয়া করে আমার {x} খুঁজতে সাহায্য করুন', 'कृपया मेरो {x} खोज्न मद्दत गर्नुहोस्', 'कृपया मेरा {x} ढूँढने में मदद कीजिए'],
  ]), entities([
    ['phone', 'phone', 'ফোন', 'फोन', 'फोन'], ['wallet', 'wallet', 'মানিব্যাগ', 'पर्स', 'बटुआ'],
    ['bag', 'bag', 'ব্যাগ', 'झोला', 'बैग'], ['id', 'identity card', 'পরিচয়পত্র', 'परिचयपत्र', 'पहचान पत्र'],
    ['ticket', 'ticket', 'টিকিট', 'टिकट', 'टिकट'], ['camera', 'camera', 'ক্যামেরা', 'क्यामेरा', 'कैमरा'],
    ['keys', 'keys', 'চাবি', 'चाबी', 'चाबियाँ'], ['medicine', 'medicine', 'ওষুধ', 'औषधि', 'दवा'],
    ['companion', 'travel companion', 'ভ্রমণসঙ্গী', 'यात्रा साथी', 'यात्रा साथी'],
  ])),
]

export const PHRASE_EXPANSIONS = [
  ...greetingExtras,
  ...foodExtras,
  ...transportExtras,
  ...hotelExtras,
  ...sightseeingExtras,
  ...shoppingExtras,
  ...essentialExtras,
  ...emergencyExtras,
]
