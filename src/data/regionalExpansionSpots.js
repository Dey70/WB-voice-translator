const DESCRIPTION_TEMPLATES = {
  heritage: {
    en: 'A culturally important heritage stop in {locality}, suited to visitors interested in regional history and architecture.',
    bn: '{locality}-এর একটি গুরুত্বপূর্ণ ঐতিহ্যবাহী স্থান, আঞ্চলিক ইতিহাস ও স্থাপত্যে আগ্রহী পর্যটকদের জন্য উপযুক্ত।',
    ne: '{locality}को महत्वपूर्ण सम्पदा स्थल, क्षेत्रीय इतिहास र वास्तुकलामा रुचि राख्ने यात्रुका लागि उपयुक्त।',
    hi: '{locality} का महत्वपूर्ण विरासत स्थल, क्षेत्रीय इतिहास और वास्तुकला में रुचि रखने वाले यात्रियों के लिए उपयुक्त।',
  },
  nature: {
    en: 'A scenic nature stop around {locality}, offering a quieter outdoor experience away from the busiest tourist routes.',
    bn: '{locality}-এর কাছের মনোরম প্রাকৃতিক স্থান, ব্যস্ত পর্যটন পথের বাইরে শান্ত পরিবেশ উপভোগ করা যায়।',
    ne: '{locality} वरपरको रमणीय प्राकृतिक स्थल, व्यस्त पर्यटक मार्गभन्दा टाढा शान्त बाहिरी अनुभव प्रदान गर्छ।',
    hi: '{locality} के आसपास का सुंदर प्राकृतिक स्थल, व्यस्त पर्यटन मार्गों से दूर शांत बाहरी अनुभव देता है।',
  },
  religious: {
    en: 'A notable spiritual and architectural site in {locality}, best visited respectfully outside busy worship periods.',
    bn: '{locality}-এর উল্লেখযোগ্য ধর্মীয় ও স্থাপত্য স্থান, ব্যস্ত উপাসনার সময়ের বাইরে সম্মানের সঙ্গে দেখা উচিত।',
    ne: '{locality}को उल्लेखनीय धार्मिक तथा वास्तुकला स्थल, व्यस्त पूजा समयबाहेक सम्मानपूर्वक भ्रमण गर्नु राम्रो।',
    hi: '{locality} का उल्लेखनीय धार्मिक और स्थापत्य स्थल, व्यस्त पूजा समय से बाहर सम्मानपूर्वक देखना बेहतर है।',
  },
  museum: {
    en: 'An educational cultural attraction in {locality} with collections or exhibits that add context to the region.',
    bn: '{locality}-এর শিক্ষামূলক সাংস্কৃতিক আকর্ষণ, যার সংগ্রহ বা প্রদর্শনী অঞ্চলটিকে বুঝতে সাহায্য করে।',
    ne: '{locality}को शैक्षिक सांस्कृतिक आकर्षण, जसका सङ्ग्रह वा प्रदर्शनीले क्षेत्र बुझ्न मद्दत गर्छ।',
    hi: '{locality} का शैक्षिक सांस्कृतिक आकर्षण, जिसके संग्रह या प्रदर्शन क्षेत्र को समझने में मदद करते हैं।',
  },
  viewpoint: {
    en: 'A viewpoint near {locality} known for broad landscape views, with visibility dependent on weather and season.',
    bn: '{locality}-এর কাছের বিস্তৃত দৃশ্যের ভিউপয়েন্ট, যেখানে দৃশ্যমানতা আবহাওয়া ও ঋতুর উপর নির্ভর করে।',
    ne: '{locality} नजिकको फराकिलो दृश्यस्थल, जहाँ दृश्यता मौसम र ऋतुमाथि निर्भर हुन्छ।',
    hi: '{locality} के पास विस्तृत दृश्य वाला व्यू पॉइंट, जहाँ दृश्यता मौसम और ऋतु पर निर्भर करती है।',
  },
  recreation: {
    en: 'A relaxed recreation stop in {locality}, suitable for families, short walks, and an unhurried local outing.',
    bn: '{locality}-এর আরামদায়ক বিনোদন স্থান, পরিবার, ছোট হাঁটা ও ধীর স্থানীয় ভ্রমণের জন্য উপযুক্ত।',
    ne: '{locality}को आरामदायी मनोरञ्जन स्थल, परिवार, छोटो हिँडाइ र शान्त स्थानीय घुमाइका लागि उपयुक्त।',
    hi: '{locality} का आरामदायक मनोरंजन स्थल, परिवार, छोटी सैर और शांत स्थानीय भ्रमण के लिए उपयुक्त।',
  },
  wildlife: {
    en: 'A wildlife and forest destination near {locality} where entry, routes, and activities depend on current permits and conditions.',
    bn: '{locality}-এর কাছের বন ও বন্যপ্রাণী গন্তব্য, যেখানে প্রবেশ, পথ ও কার্যকলাপ বর্তমান অনুমতি ও পরিস্থিতির উপর নির্ভরশীল।',
    ne: '{locality} नजिकको वन्यजन्तु तथा वन गन्तव्य, जहाँ प्रवेश, मार्ग र गतिविधि हालको अनुमति र अवस्थामाथि निर्भर हुन्छ।',
    hi: '{locality} के पास वन्यजीव और वन गंतव्य, जहाँ प्रवेश, मार्ग और गतिविधियाँ वर्तमान परमिट और परिस्थितियों पर निर्भर हैं।',
  },
  beach: {
    en: 'A coastal outing near {locality} with a distinct shoreline atmosphere; tide and bathing safety should be checked locally.',
    bn: '{locality}-এর কাছের স্বতন্ত্র সমুদ্রতট; জোয়ার ও স্নানের নিরাপত্তা স্থানীয়ভাবে যাচাই করা উচিত।',
    ne: '{locality} नजिकको फरक समुद्री किनार; ज्वारभाटा र पौडी सुरक्षा स्थानीय रूपमा पुष्टि गर्नुपर्छ।',
    hi: '{locality} के पास अलग समुद्री तट; ज्वार और स्नान सुरक्षा स्थानीय रूप से जाँचनी चाहिए।',
  },
}

const ACCESS_ADVISORY = {
  local: 'This is within the main destination area; confirm current opening conditions before leaving.',
  drive: 'This is a nearby road trip. Check travel time, road conditions, and return transport locally.',
  restricted: 'Access can require permits, guides, bookings, or seasonal clearance. Confirm before travelling.',
}

const rows = [
  // Kolkata cluster: city plus easy Hooghly/Howrah day trips
  ['st-pauls-cathedral','kolkata','St. Paul’s Cathedral','Cathedral','Kolkata','local',false,'standard-religious','religious'],
  ['marble-palace','kolkata','Marble Palace','Heritage mansion','North Kolkata','local',true,'standard-ticket','heritage'],
  ['jorasanko','kolkata','Jorasanko Thakur Bari','Museum','North Kolkata','local',false,'standard-ticket','museum'],
  ['science-city-kolkata','kolkata','Science City','Science centre','Kolkata','local',false,'standard-ticket','museum'],
  ['eco-park-kolkata','kolkata','Eco Park','Urban park','New Town','local',false,'standard-ticket','recreation'],
  ['mother-house','kolkata','Mother House','Spiritual heritage','Kolkata','local',false,'standard-religious','religious'],
  ['birla-planetarium','kolkata','Birla Planetarium','Planetarium','Kolkata','local',false,'standard-ticket','museum'],
  ['belur-math','kolkata','Belur Math','Temple complex','Howrah','drive',false,'standard-religious','religious'],
  ['dakshineswar','kolkata','Dakshineswar Kali Temple','Temple','North Kolkata','drive',false,'standard-religious','religious'],
  ['botanical-garden-howrah','kolkata','Acharya Jagadish Chandra Bose Botanical Garden','Botanical garden','Howrah','drive',false,'standard-ticket','nature'],
  ['rabindra-sarobar','kolkata','Rabindra Sarobar','Urban lake','South Kolkata','local',true,'standard-public','nature'],
  ['bow-barracks','kolkata','Bow Barracks','Historic neighbourhood','Central Kolkata','local',true,'standard-public','heritage'],
  ['chandannagar-strand','kolkata','Chandannagar Strand','Riverside heritage','Chandannagar','drive',true,'standard-public','heritage'],
  ['serampore-heritage','kolkata','Serampore Heritage Precinct','Colonial heritage','Serampore','drive',true,'standard-public','heritage'],

  // Darjeeling cluster: nearby tea country and hill villages
  ['rock-garden-darjeeling','darjeeling','Rock Garden','Hill garden','Darjeeling','drive',false,'standard-ticket','nature'],
  ['ganga-maya-park','darjeeling','Ganga Maya Park','Valley park','Darjeeling','drive',false,'standard-ticket','recreation'],
  ['happy-valley-tea','darjeeling','Happy Valley Tea Estate','Tea estate','Darjeeling','local',false,'standard-ticket','heritage'],
  ['observatory-hill','darjeeling','Observatory Hill','Sacred viewpoint','Darjeeling','local',false,'standard-public','viewpoint'],
  ['tibetan-refugee-centre','darjeeling','Tibetan Refugee Self Help Centre','Craft centre','Darjeeling','local',false,'standard-ticket','heritage'],
  ['nightingale-park','darjeeling','Shrubbery Nightingale Park','Hill park','Darjeeling','local',false,'standard-ticket','recreation'],
  ['tinchuley','darjeeling','Tinchuley','Mountain village','Tinchuley','drive',true,'standard-nature','nature'],
  ['takdah','darjeeling','Takdah Cantonment','Heritage hill settlement','Takdah','drive',true,'standard-public','heritage'],
  ['lepchajagat','darjeeling','Lepchajagat','Forest village','Lepchajagat','drive',true,'standard-nature','nature'],
  ['chatakpur','darjeeling','Chatakpur Eco Village','Eco village','Senchal Forest','restricted',true,'standard-nature','nature'],
  ['eagles-crag','darjeeling,siliguri','Eagle’s Crag','Viewpoint','Kurseong','drive',false,'standard-public','viewpoint'],
  ['makaibari','darjeeling,siliguri','Makaibari Tea Estate','Tea estate','Kurseong','drive',true,'standard-ticket','heritage'],
  ['mirik-lake','darjeeling,siliguri','Mirik Lake','Mountain lake','Mirik','drive',false,'standard-ticket','recreation'],
  ['bokar-monastery','darjeeling,siliguri','Bokar Monastery','Monastery','Mirik','drive',true,'standard-religious','religious'],

  // Siliguri cluster: plains, Sevoke, Mirik, Kurseong and nearby drives
  ['mahananda-sanctuary','siliguri','Mahananda Wildlife Sanctuary','Wildlife sanctuary','Sukna','restricted',false,'standard-wildlife','wildlife'],
  ['coronation-bridge','siliguri','Coronation Bridge','Heritage bridge','Sevoke','drive',false,'standard-public','heritage'],
  ['sevoke-kali-mandir','siliguri','Sevoke Kali Mandir','Temple','Sevoke','drive',false,'standard-religious','religious'],
  ['dudhia','siliguri','Dudhia','Riverside picnic area','Dudhia','drive',true,'standard-nature','nature'],
  ['rohini','siliguri','Rohini Viewpoint and Tea Gardens','Tea-country drive','Rohini','drive',true,'standard-nature','viewpoint'],
  ['kurseong-town','siliguri','Kurseong','Hill town','Kurseong','drive',false,'standard-public','heritage'],
  ['sepoy-dhura','siliguri','Sepoy Dhura Tea Garden','Tea garden','Kurseong','drive',true,'standard-nature','nature'],
  ['gajoldoba','siliguri','Gajoldoba and Teesta Barrage','Wetland and birding','Gajoldoba','drive',true,'standard-nature','nature'],
  ['hong-kong-market','siliguri','Hong Kong Market','Local market','Siliguri','local',false,'standard-public','heritage'],
  ['savin-kingdom','siliguri','Savin Kingdom','Recreation park','Siliguri','local',false,'standard-ticket','recreation'],
  ['dreamland-siliguri','siliguri','Dreamland Amusement Park','Amusement park','Siliguri outskirts','drive',false,'standard-ticket','recreation'],

  // Gangtok/Sikkim cluster: city circuit plus practical day trips
  ['mg-marg','sikkim','MG Marg','Pedestrian promenade','Gangtok','local',false,'standard-public','heritage'],
  ['hanuman-tok','sikkim','Hanuman Tok','Temple viewpoint','Gangtok','drive',false,'standard-religious','viewpoint'],
  ['ganesh-tok','sikkim','Ganesh Tok','Temple viewpoint','Gangtok','drive',false,'standard-ticket','viewpoint'],
  ['tashi-viewpoint','sikkim','Tashi View Point','Viewpoint','Gangtok','drive',false,'standard-public','viewpoint'],
  ['enchey-monastery','sikkim','Enchey Monastery','Monastery','Gangtok','local',false,'standard-religious','religious'],
  ['bakthang-falls','sikkim','Bakthang Waterfall','Waterfall','Gangtok','drive',false,'standard-public','nature'],
  ['banjhakri-falls','sikkim','Banjhakri Falls and Energy Park','Waterfall park','Gangtok','drive',false,'standard-ticket','recreation'],
  ['gangtok-zoo','sikkim','Himalayan Zoological Park','Wildlife park','Bulbuley','drive',false,'standard-wildlife','wildlife'],
  ['ranka-monastery','sikkim','Ranka Monastery','Monastery','Ranka','drive',true,'standard-religious','religious'],
  ['temi-tea-garden','sikkim','Temi Tea Garden','Tea estate','South Sikkim','drive',true,'standard-ticket','nature'],
  ['buddha-park-ravangla','sikkim','Buddha Park of Ravangla','Buddhist park','Ravangla','drive',false,'standard-ticket','religious'],
  ['namchi-char-dham','sikkim','Siddhesvara Dham','Pilgrimage complex','Namchi','drive',false,'standard-ticket','religious'],
  ['khecheopalri','sikkim','Khecheopalri Lake','Sacred lake','West Sikkim','drive',true,'standard-nature','nature'],
  ['zuluk','sikkim','Zuluk and Old Silk Route','Mountain route','East Sikkim','restricted',true,'standard-nature','viewpoint'],

  // Kalimpong cluster including Lava, Loleygaon and eastern hill villages
  ['lava','kalimpong','Lava','Mountain village','Lava','drive',false,'standard-nature','nature'],
  ['loleygaon','kalimpong','Loleygaon','Forest village','Loleygaon','drive',false,'standard-nature','nature'],
  ['rishop','kalimpong','Rishop','Mountain hamlet','Rishop','drive',true,'standard-nature','viewpoint'],
  ['neora-valley','kalimpong','Neora Valley National Park','National park','Lava','restricted',false,'standard-wildlife','wildlife'],
  ['pedong','kalimpong','Pedong','Historic hill town','Pedong','drive',false,'standard-public','heritage'],
  ['sillery-gaon','kalimpong','Sillery Gaon','Mountain village','Sillery Gaon','drive',true,'standard-nature','viewpoint'],
  ['dr-grahams-homes','kalimpong','Dr. Graham’s Homes','Heritage campus','Kalimpong','local',false,'standard-public','heritage'],

  // Dooars cluster: forest villages, rivers and safari gateways
  ['samsing','dooars','Samsing','Foothill village','Samsing','drive',false,'standard-nature','nature'],
  ['suntalekhola','dooars','Suntalekhola','Forest village','Suntalekhola','drive',true,'standard-nature','nature'],
  ['rocky-island','dooars','Rocky Island','Riverside nature spot','Murti Valley','drive',true,'standard-nature','nature'],
  ['murti','dooars','Murti River','Riverside destination','Murti','drive',false,'standard-public','nature'],
  ['bindu','dooars','Bindu','Border valley','Bindu','drive',false,'standard-nature','viewpoint'],
  ['jhalong','dooars','Jhalong','River valley','Jhalong','drive',false,'standard-nature','nature'],
  ['chapramari','dooars','Chapramari Wildlife Sanctuary','Wildlife sanctuary','Dooars','restricted',false,'standard-wildlife','wildlife'],

  // Sundarbans cluster: inhabited islands plus authorised forest routes
  ['pakhiralay','sundarbans','Pakhiralay','Island village','Gosaba block','drive',false,'standard-public','nature'],
  ['dayapur','sundarbans','Dayapur Island','Island settlement','Dayapur','drive',false,'standard-public','heritage'],
  ['hamilton-bungalow','sundarbans','Hamilton Bungalow','Colonial heritage','Gosaba','drive',true,'standard-public','heritage'],
  ['beacon-bungalow','sundarbans','Beacon Bungalow','Riverside heritage','Gosaba','drive',true,'standard-public','heritage'],
  ['jharkhali','sundarbans','Jharkhali','Mangrove gateway','Jharkhali','drive',false,'standard-ticket','nature'],
  ['bhagabatpur','sundarbans','Bhagabatpur Crocodile Project','Wildlife project','Lothian Island','restricted',true,'standard-wildlife','wildlife'],

  // Digha coastal cluster including nearby beaches and heritage
  ['old-digha','digha','Old Digha Beach','Beach promenade','Digha','local',false,'standard-public','beach'],
  ['talsari','digha','Talsari Beach','Coastal day trip','Talsari','drive',true,'standard-public','beach'],
  ['mandarmani','digha','Mandarmani Beach','Beach destination','Mandarmani','drive',false,'standard-public','beach'],
  ['tajpur','digha','Tajpur Beach','Quiet beach','Tajpur','drive',true,'standard-public','beach'],
  ['junput','digha','Junput','Coastal village','Junput','drive',true,'standard-public','beach'],
  ['chandaneswar','digha','Chandaneswar Temple','Temple','Chandaneswar','drive',false,'standard-religious','religious'],
  ['digha-gate','digha','Digha Welcome Gate','Roadside landmark','Digha approach','local',false,'standard-public','heritage'],
]

export const REGIONAL_EXPANSION_SPOTS = rows.map(([id, clusters, name, type, locality, access, isHidden, detailKey, descriptionKey]) => {
  const template = DESCRIPTION_TEMPLATES[descriptionKey]
  return {
    id,
    region: clusters.split(',')[0],
    regions: clusters.split(','),
    name,
    type,
    locality,
    access,
    isHidden,
    detailKey,
    description: Object.fromEntries(Object.entries(template).map(([language, text]) => [language, text.replace('{locality}', locality)])),
    advisory: ACCESS_ADVISORY[access],
  }
})
