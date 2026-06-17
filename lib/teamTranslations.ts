export const teamTranslations: Record<string, string> = {
  // Countries
  "Qatar": "কাতার",
  "Switzerland": "সুইজারল্যান্ড",
  "Brazil": "ব্রাজিল",
  "Morocco": "মরক্কো",
  "Haiti": "হাইতি",
  "Scotland": "স্কটল্যান্ড",
  "Argentina": "আর্জেন্টিনা",
  "France": "ফ্রান্স",
  "Germany": "জার্মানি",
  "Spain": "স্পেন",
  "Portugal": "পর্তুগাল",
  "England": "ইংল্যান্ড",
  "Italy": "ইতালি",
  "Netherlands": "নেদারল্যান্ডস",
  "Belgium": "বেলজিয়াম",
  "Croatia": "ক্রোয়েশিয়া",
  "Uruguay": "উরুগুয়ে",
  "Colombia": "কলম্বিয়া",
  "USA": "যুক্তরাষ্ট্র",
  "Mexico": "মেক্সিকো",
  "Japan": "জাপান",
  "South Korea": "দক্ষিণ কোরিয়া",
  "Saudi Arabia": "সৌদি আরব",
  "Iran": "ইরান",
  "Australia": "অস্ট্রেলিয়া",
  "Senegal": "সেনেগাল",
  "Ghana": "ঘানা",
  "Nigeria": "নাইজেরিয়া",
  "Cameroon": "ক্যামেরুন",
  "Ivory Coast": "আইভরি কোস্ট",
  "Ivory Coast U23": "আইভরি কোস্ট অ-২৩",
  "Congo DR U20": "কঙ্গো ডিআর অ-২০",
  "Portugal U20": "পর্তুগাল অ-২০",
  "Tunisia U23": "তিউনিসিয়া অ-২৩",
  "Uzbekistan": "উজবেকিস্তান",
  "Panama": "পানামা",
  "Congo DR": "কঙ্গো ডিআর",
  "Congo": "কঙ্গো",
  
  // Famous Clubs & USL / Other Teams in feed
  "Real Madrid": "রিয়াল মাদ্রিদ",
  "Barcelona": "বার্সেলোনা",
  "Manchester City": "ম্যানচেস্টার সিটি",
  "Manchester United": "ম্যানচেস্টার ইউনাইটেড",
  "Arsenal": "আর্সেনাল",
  "Liverpool": "লিভারপুল",
  "Chelsea": "চেলসি",
  "Tottenham Hotspur": "টটেনহাম",
  "Bayern Munich": "বায়ার্ন মিউনিখ",
  "Borussia Dortmund": "বরুশিয়া ডর্টমুন্ড",
  "Paris Saint-Germain": "পিএসজি",
  "Juventus": "জুভেন্টাস",
  "AC Milan": "এসি মিলান",
  "Inter Milan": "ইন্টার মিলান",
  "Napoli": "নাপোলি",
  "Atletico Madrid": "অ্যাটলেটিকো মাদ্রিদ",
  "Ajax": "আয়াক্স",
  "Boca Juniors": "বোকা জুনিয়র্স",
  "River Plate": "রিভার প্লেট",
  "Flamengo": "ফ্ল্যামেঙ্গো",
  "Palmeiras": "পালমেইরাস",
  "Al Nassr": "আল নাসর",
  "Al Hilal": "আল হিলাল",
  "Inter Miami CF": "ইন্টার মিয়ামি",
  "Oakland Roots": "ওকল্যান্ড রুটস",
  "Birmingham Legion": "বার্মিংহাম লিজিয়ন",
  "Indy Eleven": "ইন্ডি ইলেভেন",
  "Brooklyn FC": "ব্রুকলিন এফসি",
  "FC Tulsa": "এফসি টালসা",
  "Monterey Bay": "মনটেরি বে",
  "Forward Madison FC": "ফরওয়ার্ড ম্যাডিসন এফসি",
  "Fort Wayne": "ফোর্ট ওয়েইন"
};

function transliterateWord(word: string): string {
  let w = word.toLowerCase().trim();
  if (!w) return '';
  w = w.replace(/[^a-z0-9]/g, '');
  if (!w) return '';

  const wordMap: Record<string, string> = {
    fc: 'এফসি',
    cf: 'সিএফ',
    dr: 'ডিআর',
    us: 'ইউএস',
    usa: 'ইউএসএ',
    uk: 'ইউকে',
    u20: 'অ-২০',
    u23: 'অ-২৩',
    u17: 'অ-১৭',
    u19: 'অ-১৯',
  };
  if (wordMap[w]) return wordMap[w];

  const rules = [
    { p: /tion/g, r: 'শন' },
    { p: /sion/g, r: 'শন' },
    { p: /kh/g, r: 'খ' },
    { p: /gh/g, r: 'ঘ' },
    { p: /ch/g, r: 'চ' },
    { p: /sh/g, r: 'শ' },
    { p: /th/g, r: 'থ' },
    { p: /ph/g, r: 'ফ' },
    { p: /bh/g, r: 'ভ' },
    { p: /dh/g, r: 'ধ' },
    { p: /ee/g, r: 'ই' },
    { p: /oo/g, r: 'উ' },
    { p: /ay/g, r: 'ে' },
    { p: /ai/g, r: 'ৈ' },
    { p: /ou/g, r: 'ৌ' },
    { p: /ck/g, r: 'ক' },
    { p: /ng/g, r: 'ং' },
    { p: /a/g, r: 'া' },
    { p: /e/g, r: 'ে' },
    { p: /i/g, r: 'ি' },
    { p: /o/g, r: 'ো' },
    { p: /u/g, r: 'ু' },
    { p: /y/g, r: 'ি' },
    { p: /b/g, r: 'ব' },
    { p: /c/g, r: 'ক' },
    { p: /d/g, r: 'ড' },
    { p: /f/g, r: 'ফ' },
    { p: /g/g, r: 'গ' },
    { p: /h/g, r: 'হ' },
    { p: /j/g, r: 'জ' },
    { p: /k/g, r: 'ক' },
    { p: /l/g, r: 'ল' },
    { p: /m/g, r: 'ম' },
    { p: /n/g, r: 'ন' },
    { p: /p/g, r: 'প' },
    { p: /q/g, r: 'ক' },
    { p: /r/g, r: 'র' },
    { p: /s/g, r: 'স' },
    { p: /t/g, r: 'ট' },
    { p: /v/g, r: 'ভ' },
    { p: /w/g, r: 'ও' },
    { p: /x/g, r: 'ক্স' },
    { p: /z/g, r: 'জ' },
  ];

  let res = w;
  for (const rule of rules) {
    res = res.replace(rule.p, rule.r);
  }

  // Vowel cleaning
  if (res.startsWith('া')) res = 'আ' + res.slice(1);
  if (res.startsWith('ে')) res = 'এ' + res.slice(1);
  if (res.startsWith('ি')) res = 'ই' + res.slice(1);
  if (res.startsWith('ো')) res = 'ও' + res.slice(1);
  if (res.startsWith('ু')) res = 'উ' + res.slice(1);

  return res;
}

export function translateTeamName(name: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  if (teamTranslations[trimmed]) {
    return teamTranslations[trimmed];
  }

  // Split into words, translate individually
  const words = trimmed.split(/\s+/);
  const translatedWords = words.map(word => {
    // Check Case-insensitive direct match
    const foundKey = Object.keys(teamTranslations).find(k => k.toLowerCase() === word.toLowerCase());
    if (foundKey) return teamTranslations[foundKey];

    // Check specific subwords case-insensitively
    const low = word.toLowerCase();
    if (low === 'fc') return 'এফসি';
    if (low === 'cf') return 'সিএফ';
    if (low === 'dr') return 'ডিআর';
    if (low === 'roots') return 'রুটস';
    if (low === 'legion') return 'লিজিয়ন';
    if (low === 'eleven') return 'ইলেভেন';
    if (low === 'tulsa') return 'টালসা';
    if (low === 'monterey') return 'মনটেরি';
    if (low === 'bay') return 'বে';
    if (low === 'forward') return 'ফরওয়ার্ড';
    if (low === 'madison') return 'ম্যাডিসন';
    if (low === 'fort') return 'ফোর্ট';
    if (low === 'wayne') return 'ওয়েইন';
    if (low === 'oakland') return 'ওকল্যান্ড';
    if (low === 'indy') return 'ইন্ডি';
    if (low === 'brooklyn') return 'ব্রুকলিন';
    if (low === 'uzbekistan') return 'উজবেকিস্তান';
    if (low === 'panama') return 'পানামা';

    return transliterateWord(word);
  });

  return translatedWords.filter(Boolean).join(' ');
}
