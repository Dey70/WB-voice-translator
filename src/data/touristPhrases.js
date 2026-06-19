import { PHRASE_EXPANSIONS } from './phraseExpansions.js'

export const PHRASE_CATEGORIES = [
  { id: 'greetings', name: 'Greetings' },
  { id: 'food', name: 'Food' },
  { id: 'transport', name: 'Transport' },
  { id: 'stays', name: 'Hotels' },
  { id: 'sightseeing', name: 'Sightseeing' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'essentials', name: 'Essentials' },
  { id: 'emergency', name: 'Emergency' },
]

const BASE_TOURIST_PHRASES = [
  {
    id: 'hello', category: 'greetings', title: 'Hello',
    translations: { bn: 'নমস্কার', ne: 'नमस्ते', hi: 'नमस्ते' },
  },
  {
    id: 'good-morning', category: 'greetings', title: 'Good morning',
    translations: { bn: 'সুপ্রভাত', ne: 'शुभ प्रभात', hi: 'सुप्रभात' },
  },
  {
    id: 'how-are-you', category: 'greetings', title: 'How are you?',
    translations: { bn: 'আপনি কেমন আছেন?', ne: 'तपाईंलाई कस्तो छ?', hi: 'आप कैसे हैं?' },
  },
  {
    id: 'i-am-fine', category: 'greetings', title: 'I am fine',
    translations: { bn: 'আমি ভালো আছি', ne: 'म ठिक छु', hi: 'मैं ठीक हूँ' },
  },
  {
    id: 'my-name-is', category: 'greetings', title: 'My name is...',
    translations: { bn: 'আমার নাম...', ne: 'मेरो नाम... हो', hi: 'मेरा नाम... है' },
  },
  {
    id: 'thank-you', category: 'greetings', title: 'Thank you',
    translations: { bn: 'ধন্যবাদ', ne: 'धन्यवाद', hi: 'धन्यवाद' },
  },
  {
    id: 'please', category: 'greetings', title: 'Please',
    translations: { bn: 'দয়া করে', ne: 'कृपया', hi: 'कृपया' },
  },
  {
    id: 'goodbye', category: 'greetings', title: 'Goodbye',
    translations: { bn: 'বিদায়', ne: 'फेरि भेटौँला', hi: 'फिर मिलेंगे' },
  },

  {
    id: 'menu', category: 'food', title: 'May I see the menu?',
    translations: { bn: 'আমি কি মেনুটা দেখতে পারি?', ne: 'मेनु हेर्न पाउँछु?', hi: 'क्या मैं मेनू देख सकता हूँ?' },
  },
  {
    id: 'vegetarian', category: 'food', title: 'I need vegetarian food',
    translations: { bn: 'আমার নিরামিষ খাবার চাই', ne: 'मलाई शाकाहारी खाना चाहिन्छ', hi: 'मुझे शाकाहारी खाना चाहिए' },
  },
  {
    id: 'not-spicy', category: 'food', title: 'Please make it less spicy',
    translations: { bn: 'দয়া করে ঝাল কম দিন', ne: 'कृपया कम पिरो बनाउनुहोस्', hi: 'कृपया कम मसालेदार बनाइए' },
  },
  {
    id: 'water', category: 'food', title: 'Please give me drinking water',
    translations: { bn: 'দয়া করে পানীয় জল দিন', ne: 'कृपया पिउने पानी दिनुहोस्', hi: 'कृपया पीने का पानी दीजिए' },
  },
  {
    id: 'allergy', category: 'food', title: 'I have a food allergy',
    translations: { bn: 'আমার খাবারে অ্যালার্জি আছে', ne: 'मलाई खानाको एलर्जी छ', hi: 'मुझे खाने से एलर्जी है' },
  },
  {
    id: 'recommend-food', category: 'food', title: 'What do you recommend?',
    translations: { bn: 'আপনি কোন খাবারটি খেতে বলবেন?', ne: 'तपाईं कुन खाना सिफारिस गर्नुहुन्छ?', hi: 'आप कौन-सा खाना सुझाएँगे?' },
  },
  {
    id: 'bill', category: 'food', title: 'Please bring the bill',
    translations: { bn: 'দয়া করে বিলটা দিন', ne: 'कृपया बिल ल्याउनुहोस्', hi: 'कृपया बिल ले आइए' },
  },
  {
    id: 'delicious', category: 'food', title: 'The food is delicious',
    translations: { bn: 'খাবারটি খুব সুস্বাদু', ne: 'खाना धेरै मिठो छ', hi: 'खाना बहुत स्वादिष्ट है' },
  },

  {
    id: 'station', category: 'transport', title: 'Where is the station?',
    translations: { bn: 'স্টেশন কোথায়?', ne: 'स्टेसन कहाँ छ?', hi: 'स्टेशन कहाँ है?' },
  },
  {
    id: 'bus-stop', category: 'transport', title: 'Where is the bus stop?',
    translations: { bn: 'বাস স্টপ কোথায়?', ne: 'बस बिसौनी कहाँ छ?', hi: 'बस स्टॉप कहाँ है?' },
  },
  {
    id: 'taxi', category: 'transport', title: 'I need a taxi',
    translations: { bn: 'আমার একটি ট্যাক্সি দরকার', ne: 'मलाई ट्याक्सी चाहिन्छ', hi: 'मुझे टैक्सी चाहिए' },
  },
  {
    id: 'fare', category: 'transport', title: 'How much is the fare?',
    translations: { bn: 'ভাড়া কত?', ne: 'भाडा कति हो?', hi: 'किराया कितना है?' },
  },
  {
    id: 'take-me-here', category: 'transport', title: 'Please take me to this address',
    translations: { bn: 'দয়া করে আমাকে এই ঠিকানায় নিয়ে চলুন', ne: 'कृपया मलाई यो ठेगानामा लैजानुहोस्', hi: 'कृपया मुझे इस पते पर ले चलिए' },
  },
  {
    id: 'time-to-reach', category: 'transport', title: 'How long will it take?',
    translations: { bn: 'পৌঁছাতে কত সময় লাগবে?', ne: 'पुग्न कति समय लाग्छ?', hi: 'पहुँचने में कितना समय लगेगा?' },
  },
  {
    id: 'stop-here', category: 'transport', title: 'Please stop here',
    translations: { bn: 'দয়া করে এখানে থামুন', ne: 'कृपया यहाँ रोक्नुहोस्', hi: 'कृपया यहाँ रोकिए' },
  },
  {
    id: 'ticket', category: 'transport', title: 'Where can I buy a ticket?',
    translations: { bn: 'আমি টিকিট কোথায় কিনতে পারি?', ne: 'मैले टिकट कहाँ किन्न सक्छु?', hi: 'मैं टिकट कहाँ खरीद सकता हूँ?' },
  },
  {
    id: 'shared-jeep', category: 'transport', title: 'Where is the shared jeep stand?',
    translations: { bn: 'শেয়ার জিপ স্ট্যান্ড কোথায়?', ne: 'साझा जिप स्ट्यान्ड कहाँ छ?', hi: 'शेयर जीप स्टैंड कहाँ है?' },
  },
  {
    id: 'shared-or-reserved', category: 'transport', title: 'Is this shared or reserved?',
    translations: { bn: 'এটি শেয়ার নাকি রিজার্ভ?', ne: 'यो साझा हो कि रिजर्भ?', hi: 'यह शेयर है या रिज़र्व?' },
  },
  {
    id: 'goes-to', category: 'transport', title: 'Does this vehicle go there?',
    translations: { bn: 'এই গাড়িটি কি সেখানে যাবে?', ne: 'यो गाडी त्यहाँ जान्छ?', hi: 'क्या यह गाड़ी वहाँ जाएगी?' },
  },
  {
    id: 'next-vehicle', category: 'transport', title: 'When does the next vehicle leave?',
    translations: { bn: 'পরের গাড়ি কখন ছাড়বে?', ne: 'अर्को गाडी कहिले छुट्छ?', hi: 'अगली गाड़ी कब चलेगी?' },
  },
  {
    id: 'seat-available', category: 'transport', title: 'Is a seat available?',
    translations: { bn: 'কোনো আসন খালি আছে?', ne: 'सिट खाली छ?', hi: 'क्या कोई सीट खाली है?' },
  },
  {
    id: 'road-open', category: 'transport', title: 'Is the road open today?',
    translations: { bn: 'আজ রাস্তা খোলা আছে?', ne: 'आज बाटो खुला छ?', hi: 'क्या आज रास्ता खुला है?' },
  },
  {
    id: 'luggage-charge', category: 'transport', title: 'Is there an extra luggage charge?',
    translations: { bn: 'লাগেজের জন্য কি অতিরিক্ত ভাড়া লাগবে?', ne: 'सामानको थप शुल्क लाग्छ?', hi: 'क्या सामान का अलग किराया लगेगा?' },
  },
  {
    id: 'hotel-drop', category: 'transport', title: 'Please drop me at my hotel',
    translations: { bn: 'দয়া করে আমাকে আমার হোটেলে নামিয়ে দিন', ne: 'कृपया मलाई मेरो होटलमा छोडिदिनुहोस्', hi: 'कृपया मुझे मेरे होटल पर उतार दीजिए' },
  },

  {
    id: 'room-available', category: 'stays', title: 'Do you have a room available?',
    translations: { bn: 'আপনাদের কি কোনো ঘর খালি আছে?', ne: 'तपाईंहरूसँग कोठा खाली छ?', hi: 'क्या आपके यहाँ कमरा खाली है?' },
  },
  {
    id: 'have-booking', category: 'stays', title: 'I have a booking',
    translations: { bn: 'আমার একটি বুকিং আছে', ne: 'मेरो बुकिङ छ', hi: 'मेरी बुकिंग है' },
  },
  {
    id: 'price-per-night', category: 'stays', title: 'How much is it per night?',
    translations: { bn: 'প্রতি রাতের ভাড়া কত?', ne: 'एक रातको कति पर्छ?', hi: 'एक रात का किराया कितना है?' },
  },
  {
    id: 'breakfast-included', category: 'stays', title: 'Is breakfast included?',
    translations: { bn: 'সকালের খাবার কি ভাড়ার মধ্যে আছে?', ne: 'बिहानको खाना मूल्यमा समावेश छ?', hi: 'क्या नाश्ता किराए में शामिल है?' },
  },
  {
    id: 'see-room', category: 'stays', title: 'May I see the room first?',
    translations: { bn: 'আমি কি আগে ঘরটি দেখতে পারি?', ne: 'म पहिले कोठा हेर्न सक्छु?', hi: 'क्या मैं पहले कमरा देख सकता हूँ?' },
  },
  {
    id: 'hot-water', category: 'stays', title: 'Is hot water available?',
    translations: { bn: 'গরম জল পাওয়া যাবে?', ne: 'तातो पानी उपलब्ध छ?', hi: 'क्या गर्म पानी मिलेगा?' },
  },
  {
    id: 'clean-room', category: 'stays', title: 'Please clean the room',
    translations: { bn: 'দয়া করে ঘরটি পরিষ্কার করে দিন', ne: 'कृपया कोठा सफा गरिदिनुहोस्', hi: 'कृपया कमरा साफ कर दीजिए' },
  },
  {
    id: 'checkout-time', category: 'stays', title: 'What time is checkout?',
    translations: { bn: 'চেকআউটের সময় কখন?', ne: 'चेकआउट गर्ने समय कति बजे हो?', hi: 'चेकआउट का समय क्या है?' },
  },

  {
    id: 'distance', category: 'sightseeing', title: 'How far is this place?',
    translations: { bn: 'এই জায়গাটি কত দূরে?', ne: 'यो ठाउँ कति टाढा छ?', hi: 'यह जगह कितनी दूर है?' },
  },
  {
    id: 'directions-viewpoint', category: 'sightseeing', title: 'Which way is the viewpoint?',
    translations: { bn: 'ভিউপয়েন্ট কোন দিকে?', ne: 'भ्युपोइन्ट जाने बाटो कुन हो?', hi: 'व्यू पॉइंट किस तरफ है?' },
  },
  {
    id: 'permit-needed', category: 'sightseeing', title: 'Do I need a permit to visit?',
    translations: { bn: 'এখানে যেতে কি পারমিট লাগবে?', ne: 'यहाँ जान अनुमति पत्र चाहिन्छ?', hi: 'क्या यहाँ जाने के लिए परमिट चाहिए?' },
  },
  {
    id: 'permit-office', category: 'sightseeing', title: 'Where can I get the permit?',
    translations: { bn: 'আমি পারমিট কোথায় পাব?', ne: 'अनुमति पत्र कहाँ पाइन्छ?', hi: 'परमिट कहाँ मिलेगा?' },
  },
  {
    id: 'guide-available', category: 'sightseeing', title: 'Is a local guide available?',
    translations: { bn: 'কোনো স্থানীয় গাইড পাওয়া যাবে?', ne: 'स्थानीय गाइड उपलब्ध छ?', hi: 'क्या कोई स्थानीय गाइड मिलेगा?' },
  },
  {
    id: 'closing-time', category: 'sightseeing', title: 'What time does this place close?',
    translations: { bn: 'এই জায়গাটি কখন বন্ধ হয়?', ne: 'यो ठाउँ कति बजे बन्द हुन्छ?', hi: 'यह जगह कितने बजे बंद होती है?' },
  },
  {
    id: 'safe-today', category: 'sightseeing', title: 'Is it safe to go today?',
    translations: { bn: 'আজ সেখানে যাওয়া কি নিরাপদ?', ne: 'आज त्यहाँ जान सुरक्षित छ?', hi: 'क्या आज वहाँ जाना सुरक्षित है?' },
  },
  {
    id: 'take-photo', category: 'sightseeing', title: 'Could you take a photo of us?',
    translations: { bn: 'আপনি কি আমাদের একটি ছবি তুলে দেবেন?', ne: 'हाम्रो एउटा फोटो खिचिदिनुहुन्छ?', hi: 'क्या आप हमारी एक तस्वीर खींच देंगे?' },
  },

  {
    id: 'how-much', category: 'shopping', title: 'How much does this cost?',
    translations: { bn: 'এটির দাম কত?', ne: 'यसको मूल्य कति हो?', hi: 'यह कितने का है?' },
  },
  {
    id: 'too-expensive', category: 'shopping', title: 'This is too expensive',
    translations: { bn: 'এটির দাম খুব বেশি', ne: 'यो धेरै महँगो भयो', hi: 'यह बहुत महँगा है' },
  },
  {
    id: 'lower-price', category: 'shopping', title: 'Can you lower the price?',
    translations: { bn: 'দামটা একটু কম করবেন?', ne: 'मूल्य अलि घटाइदिनुहुन्छ?', hi: 'दाम थोड़ा कम करेंगे?' },
  },
  {
    id: 'fixed-price', category: 'shopping', title: 'Is this the fixed price?',
    translations: { bn: 'এটি কি নির্দিষ্ট দাম?', ne: 'यो निश्चित मूल्य हो?', hi: 'क्या यह तय कीमत है?' },
  },
  {
    id: 'upi-card', category: 'shopping', title: 'Can I pay by UPI or card?',
    translations: { bn: 'আমি কি ইউপিআই বা কার্ডে টাকা দিতে পারি?', ne: 'यूपीआई वा कार्डबाट तिर्न मिल्छ?', hi: 'क्या मैं यूपीआई या कार्ड से भुगतान कर सकता हूँ?' },
  },
  {
    id: 'receipt', category: 'shopping', title: 'Please give me a receipt',
    translations: { bn: 'দয়া করে আমাকে একটি রসিদ দিন', ne: 'कृपया मलाई रसिद दिनुहोस्', hi: 'कृपया मुझे रसीद दीजिए' },
  },
  {
    id: 'local-product', category: 'shopping', title: 'Is this made locally?',
    translations: { bn: 'এটি কি স্থানীয়ভাবে তৈরি?', ne: 'यो स्थानीय रूपमा बनेको हो?', hi: 'क्या यह स्थानीय रूप से बना है?' },
  },
  {
    id: 'another-size', category: 'shopping', title: 'Do you have another size?',
    translations: { bn: 'এটির অন্য মাপ আছে?', ne: 'अर्को साइज छ?', hi: 'क्या इसका दूसरा साइज़ है?' },
  },

  {
    id: 'toilet', category: 'essentials', title: 'Where is the toilet?',
    translations: { bn: 'শৌচাগার কোথায়?', ne: 'शौचालय कहाँ छ?', hi: 'शौचालय कहाँ है?' },
  },
  {
    id: 'atm', category: 'essentials', title: 'Where is the nearest ATM?',
    translations: { bn: 'সবচেয়ে কাছের এটিএম কোথায়?', ne: 'नजिकको एटीएम कहाँ छ?', hi: 'सबसे नज़दीकी एटीएम कहाँ है?' },
  },
  {
    id: 'mobile-signal', category: 'essentials', title: 'Where can I get a mobile signal?',
    translations: { bn: 'মোবাইল নেটওয়ার্ক কোথায় পাওয়া যাবে?', ne: 'मोबाइल नेटवर्क कहाँ पाइन्छ?', hi: 'मोबाइल नेटवर्क कहाँ मिलेगा?' },
  },
  {
    id: 'wifi-password', category: 'essentials', title: 'What is the Wi-Fi password?',
    translations: { bn: 'ওয়াই-ফাইয়ের পাসওয়ার্ড কী?', ne: 'वाई-फाईको पासवर्ड के हो?', hi: 'वाई-फाई का पासवर्ड क्या है?' },
  },
  {
    id: 'charge-phone', category: 'essentials', title: 'May I charge my phone here?',
    translations: { bn: 'আমি কি এখানে ফোন চার্জ করতে পারি?', ne: 'म यहाँ फोन चार्ज गर्न सक्छु?', hi: 'क्या मैं यहाँ फोन चार्ज कर सकता हूँ?' },
  },
  {
    id: 'do-not-understand', category: 'essentials', title: 'I do not understand',
    translations: { bn: 'আমি বুঝতে পারছি না', ne: 'मैले बुझिनँ', hi: 'मुझे समझ नहीं आया' },
  },
  {
    id: 'speak-slowly', category: 'essentials', title: 'Please speak slowly',
    translations: { bn: 'দয়া করে আস্তে কথা বলুন', ne: 'कृपया बिस्तारै बोल्नुहोस्', hi: 'कृपया धीरे बोलिए' },
  },
  {
    id: 'write-it', category: 'essentials', title: 'Please write it down',
    translations: { bn: 'দয়া করে এটি লিখে দিন', ne: 'कृपया यो लेखिदिनुहोस्', hi: 'कृपया इसे लिख दीजिए' },
  },

  {
    id: 'help', category: 'emergency', title: 'Help me, please!',
    translations: { bn: 'দয়া করে আমাকে সাহায্য করুন!', ne: 'कृपया मलाई मद्दत गर्नुहोस्!', hi: 'कृपया मेरी मदद कीजिए!' },
  },
  {
    id: 'police', category: 'emergency', title: 'Call the police',
    translations: { bn: 'পুলিশকে ডাকুন', ne: 'प्रहरीलाई बोलाउनुहोस्', hi: 'पुलिस को बुलाइए' },
  },
  {
    id: 'ambulance', category: 'emergency', title: 'Call an ambulance',
    translations: { bn: 'অ্যাম্বুলেন্স ডাকুন', ne: 'एम्बुलेन्स बोलाउनुहोस्', hi: 'एम्बुलेंस बुलाइए' },
  },
  {
    id: 'doctor', category: 'emergency', title: 'I need a doctor',
    translations: { bn: 'আমার একজন ডাক্তার দরকার', ne: 'मलाई डाक्टर चाहिन्छ', hi: 'मुझे डॉक्टर चाहिए' },
  },
  {
    id: 'hospital', category: 'emergency', title: 'Where is the nearest hospital?',
    translations: { bn: 'সবচেয়ে কাছের হাসপাতাল কোথায়?', ne: 'नजिकको अस्पताल कहाँ छ?', hi: 'सबसे नज़दीकी अस्पताल कहाँ है?' },
  },
  {
    id: 'lost', category: 'emergency', title: 'I am lost',
    translations: { bn: 'আমি পথ হারিয়ে ফেলেছি', ne: 'म बाटो बिराएँ', hi: 'मैं रास्ता भटक गया हूँ' },
  },
  {
    id: 'passport', category: 'emergency', title: 'I lost my passport',
    translations: { bn: 'আমার পাসপোর্ট হারিয়ে গেছে', ne: 'मेरो राहदानी हरायो', hi: 'मेरा पासपोर्ट खो गया है' },
  },
  {
    id: 'pain', category: 'emergency', title: 'I am in pain',
    translations: { bn: 'আমার খুব ব্যথা হচ্ছে', ne: 'मलाई दुखिरहेको छ', hi: 'मुझे दर्द हो रहा है' },
  },
]

export const TOURIST_PHRASES = PHRASE_CATEGORIES.flatMap((category) => [
  ...BASE_TOURIST_PHRASES.filter((phrase) => phrase.category === category.id),
  ...PHRASE_EXPANSIONS.filter((phrase) => phrase.category === category.id),
].slice(0, 50)).map((phrase) => ({
  ...phrase,
  translations: { en: phrase.translations.en || phrase.title, ...phrase.translations },
}))
