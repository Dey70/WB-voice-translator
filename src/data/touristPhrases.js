export const PHRASE_CATEGORIES = [
  { id: 'greetings', name: 'Greetings' },
  { id: 'food', name: 'Food' },
  { id: 'transport', name: 'Transport' },
  { id: 'emergency', name: 'Emergency' },
]

export const TOURIST_PHRASES = [
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
