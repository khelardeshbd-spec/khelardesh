/**
 * Prisma Seed — Section 16
 * 8 articles (1 lead), 4 score cards (2 BPL local), 2 sponsors
 * All Bengali Unicode directly in source
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding FIELD database...');

  // Clear existing data
  await prisma.sponsor.deleteMany();
  await prisma.scoreCard.deleteMany();
  await prisma.article.deleteMany();

  // ── ARTICLES ──────────────────────────────────────────────────────────────

  // 1. LEAD — Football — Video
  await prisma.article.create({
    data: {
      slug: 'madrid-unravel-final-ten',
      headline: 'Madrid Unravel in the Final Ten',
      headlineBn: 'মাদ্রিদের পতন শেষ দশ মিনিটে',
      deck: 'রিয়াল মাদ্রিদ চ্যাম্পিয়নস লিগ সেমিফাইনালে শেষ দশ মিনিটে তিন গোল হজম করে ৩-১ ব্যবধানে হেরে যায়।',
      body: `রিয়াল মাদ্রিদের এই পরাজয় কেউ আশা করেনি। ম্যাচের ৮০ মিনিট পর্যন্ত দলটি এগিয়ে ছিল ১-০ ব্যবধানে।

শেষ দশ মিনিটে যা হলো তা ছিল পুরোপুরি অবিশ্বাস্য। ৮১ মিনিটে প্রথম গোল, তারপর ৮৭ ও ৯০+৩ মিনিটে আরও দুটি।

মাদ্রিদের ডিফেন্সিভ ব্লক সম্পূর্ণভাবে ভেঙে পড়েছিল। কার্লো আনচেলোত্তি ম্যাচ শেষে বলেন, "এটা আমার কোচিং ক্যারিয়ারের সবচেয়ে বেদনাদায়ক রাত।"

Madrid had dominated large portions of the match, with Bellingham orchestrating play from midfield. But a tactical switch from the opposing bench in the 78th minute completely changed the game's complexion.

The three late goals came in rapid succession, leaving the Santiago Bernabéu crowd stunned into silence. This result ends Madrid's European dream for another season.`,
      kicker: 'চ্যাম্পিয়নস লিগ · সেমিফাইনাল',
      sport: 'football',
      mediaType: 'video',
      mediaUrl: '/media/placeholder-football.mp4',
      mediaCaption: 'রিয়াল মাদ্রিদের লকার রুমে শোকের পরিবেশ — ম্যাচের পর।',
      byline: 'Staff Reporter',
      isLead: true,
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hrs ago
    },
  });

  // 2. Tennis — Photo
  await prisma.article.create({
    data: {
      slug: 'alcaraz-five-set-thriller',
      headline: 'আলকারাজের পাঁচ সেটের রোমাঞ্চকর জয়',
      headlineBn: 'আলকারাজের পাঁচ সেটের রোমাঞ্চকর জয়',
      deck: 'রোলাঁ গ্যারোতে পাঁচ সেটের এক অবিশ্বাস্য ম্যাচে কার্লোস আলকারাজ ফাইনালে জায়গা করে নিলেন।',
      body: `পাঁচ সেটের এই ম্যাচটি শেষ হতে পাঁচ ঘণ্টার বেশি সময় লেগেছে। আলকারাজ বারবার পিছিয়ে পড়েও হাল ছাড়েননি।

তৃতীয় সেটে ৩-৫ পিছিয়ে পড়ার পরও তিনি ঘুরে দাঁড়ান এবং ৭-৫ সেটটি জিতে নেন।

Alcaraz's performance was a masterclass in mental resilience. His first-serve percentage climbed to 78% in the deciding fifth set, a remarkable statistic under such pressure.

The crowd at Court Philippe-Chatrier was treated to one of the great Grand Slam battles of the modern era.`,
      kicker: 'রোলাঁ গ্যারো · কোয়ার্টার ফাইনাল',
      sport: 'tennis',
      mediaType: 'photo',
      mediaUrl: '/media/placeholder-tennis.jpg',
      byline: 'Staff Reporter',
      isLead: false,
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
  });

  // 3. Cricket — Video
  await prisma.article.create({
    data: {
      slug: 'root-double-century-england',
      headline: 'রুটের ডাবল সেঞ্চুরিতে ইংল্যান্ড বেঁচে গেল',
      headlineBn: 'রুটের ডাবল সেঞ্চুরিতে ইংল্যান্ড বেঁচে গেল',
      deck: 'জো রুটের অপরাজিত ২১৮ রানের ইনিংসে ইংল্যান্ড পাঁচ দিনের টেস্টে ড্র ছিনিয়ে নিল।',
      body: `চতুর্থ দিন শেষে ইংল্যান্ড ৬ উইকেটে ১৮৭ রান। মনে হচ্ছিল হার অবধারিত।

কিন্তু পঞ্চম দিনে জো রুট অবিশ্বাস্য এক ইনিংস খেললেন। পুরো দিন ব্যাট করে তিনি ২১৮ রান করলেন।

Root's innings contained 24 boundaries and 3 sixes. He faced 411 deliveries in an exhibition of concentration and technique rarely seen in the modern era.

The draw secured England's position in the series, keeping them alive for the final Test.`,
      kicker: 'টেস্ট ক্রিকেট · চতুর্থ টেস্ট',
      sport: 'cricket',
      mediaType: 'video',
      mediaUrl: '/media/placeholder-cricket.mp4',
      byline: 'Sports Desk',
      isLead: false,
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
  });

  // 4. Football — BPL Local — Photo
  await prisma.article.create({
    data: {
      slug: 'abahani-mohammedan-bpl-derby',
      headline: 'আবাহনী vs মোহামেডান: বাংলাদেশের সেরা ডার্বি ফিরে এলো',
      headlineBn: 'আবাহনী vs মোহামেডান: বাংলাদেশের সেরা ডার্বি ফিরে এলো',
      deck: 'বাংলাদেশ প্রিমিয়ার লিগের সবচেয়ে উত্তেজনাপূর্ণ ম্যাচে আবাহনী ২-১ গোলে মোহামেডানকে হারিয়েছে।',
      body: `ঢাকার বশুন্ধরা স্টেডিয়ামে এদিন ছিল ঠাসা দর্শক। লিমিটেড আসনের বিপরীতে হাজার হাজার সমর্থক মাঠের বাইরে অপেক্ষা করছিলেন।

আবাহনীর হয়ে সানজার নাফিসভ দুটি এবং মোহামেডানের হয়ে হাসান মাহমুদ একটি গোল করেন।

মোহামেডানের কোচ বলেন, "আমরা প্রথম গোলটার পর ম্যাচে ফিরে এসেছিলাম। কিন্তু শেষ মিনিটে আবার পিছিয়ে পড়লাম।"

The rivalry between these two Dhaka clubs stretches back decades. Today's attendance of over 25,000 was the highest in BPL history this season.`,
      kicker: 'বাংলাদেশ প্রিমিয়ার লিগ · ডার্বি',
      sport: 'football',
      mediaType: 'photo',
      mediaUrl: '/media/placeholder-bpl.jpg',
      byline: 'ঢাকা প্রতিনিধি',
      isLead: false,
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
  });

  // 5. Basketball — English — Photo
  await prisma.article.create({
    data: {
      slug: 'lebron-files-one-last-dance',
      headline: 'LeBron Files — One Last Dance or a New Chapter?',
      deck: 'As the NBA Finals approach, LeBron James remains the focal point of every conversation about this Lakers squad.',
      body: `LeBron James at 41 is defying every expectation of what a professional athlete can achieve. His statistics this season rank among his best ever — 27.2 points, 8.3 rebounds, and 7.1 assists per game.

The question that hangs over every game is whether this is his final championship push or the beginning of yet another chapter.

His son Bronny's presence on the roster adds a dimension no one anticipated. Father and son, in the NBA, on the same team. It is either the perfect story or an impossible distraction.

The Lakers have beaten expectations all season. Now comes the hardest part.`,
      kicker: 'NBA · প্লেঅফ',
      sport: 'basketball',
      mediaType: 'photo',
      mediaUrl: '/media/placeholder-basketball.jpg',
      byline: 'Staff Reporter',
      isLead: false,
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  });

  // 6. F1 — English — Photo
  await prisma.article.create({
    data: {
      slug: 'red-bull-first-cracks-2026',
      headline: 'Red Bull Showing First Cracks of 2026',
      deck: 'A double DNF at Monaco has opened the door for Ferrari and McLaren in what is now a three-way championship fight.',
      body: `The Monaco Grand Prix weekend will haunt Red Bull for months. Both cars retired — Verstappen with a power unit failure on lap 41 and Pérez with a hydraulic issue just four laps later.

Ferrari capitalised ruthlessly. Leclerc won on his home circuit for the first time in his career, with Sainz finishing second to complete a perfect weekend for the Scuderia.

The championship gap has narrowed to just 12 points with nine races remaining. McLaren, despite finishing off the podium, now trails by only 28 points in the constructors' standings.

Red Bull's technical chief acknowledged the issues were "serious and systemic." The next race at Silverstone will be a critical indicator of their recovery.`,
      kicker: 'Formula 1 · মোনাকো গ্র্যান্ড প্রি',
      sport: 'f1',
      mediaType: 'photo',
      mediaUrl: '/media/placeholder-f1.jpg',
      byline: 'Staff Reporter',
      isLead: false,
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    },
  });

  // 7. Rugby — English — Photo
  await prisma.article.create({
    data: {
      slug: 'ireland-retain-six-nations',
      headline: 'Ireland Retain Six Nations with Last-Gasp Penalty',
      deck: 'Jonathan Sexton\'s successor slotted a penalty in the 84th minute to seal Ireland\'s second successive Six Nations Grand Slam.',
      body: `Twickenham fell silent as Ireland's young out-half lined up the conversion that would seal the Grand Slam. The 22-year-old had replaced the retired Jonathan Sexton and faced enormous pressure all tournament.

He did not miss. The ball sailed through the posts to wild celebrations from the large Irish travelling support.

Ireland's defence throughout the tournament had been exceptional — conceding only three tries in five matches. But it was their ability to win the close games that defined this championship.

Defeating England at Twickenham to complete a Grand Slam is the ultimate Irish rugby achievement. They have now done it twice in succession.`,
      kicker: 'সিক্স নেশন্স · গ্র্যান্ড স্ল্যাম',
      sport: 'rugby',
      mediaType: 'photo',
      mediaUrl: '/media/placeholder-rugby.jpg',
      byline: 'Staff Reporter',
      isLead: false,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  // 8. Cricket — Bengali — Photo
  await prisma.article.create({
    data: {
      slug: 'rohit-sharma-test-retirement',
      headline: 'Rohit Sharma Announces Test Retirement',
      headlineBn: 'রোহিত শর্মার টেস্ট অবসর ঘোষণা',
      deck: 'ভারতীয় ক্রিকেটের এক যুগের সমাপ্তি — রোহিত শর্মা টেস্ট ক্রিকেট থেকে অবসর নিলেন।',
      body: `রোহিত শর্মা আজ মুম্বাইতে একটি সংবাদ সম্মেলনে তাঁর টেস্ট অবসরের কথা ঘোষণা করলেন। তাঁর কণ্ঠে ছিল আবেগ।

"টেস্ট ক্রিকেট আমার কাছে সবচেয়ে পবিত্র। এই ফরম্যাট থেকে বিদায় নেওয়া সহজ নয়," — বললেন হিটম্যান।

৫৯টি টেস্ট ম্যাচে তিনি ৪,৩০১ রান করেছেন। টেস্টে তাঁর সর্বোচ্চ স্কোর ২১২।

He leaves the format as one of India's most successful Test captains, having overseen a series win in Australia last year.

ভারতীয় ক্রিকেট বোর্ড তাঁর অবদানের প্রশংসা করে বিবৃতি দিয়েছে।`,
      kicker: 'টেস্ট ক্রিকেট · অবসর',
      sport: 'cricket',
      mediaType: 'photo',
      mediaUrl: '/media/placeholder-cricket2.jpg',
      byline: 'ক্রিকেট ডেস্ক',
      isLead: false,
      publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Articles seeded (8)');

  // ── SCORE CARDS ───────────────────────────────────────────────────────────

  // 1. BPL — Abahani vs Mohammedan — Full Time
  await prisma.scoreCard.create({
    data: {
      league: 'বাংলাদেশ প্রিমিয়ার লিগ',
      teamA: 'আবাহনী',
      scoreA: '2',
      teamB: 'মোহামেডান',
      scoreB: '1',
      winnerTeam: 'A',
      status: 'Full Time',
      isLive: false,
      displayOrder: 0,
    },
  });

  // 2. BPL — Sheikh Russel vs Bashundhara Kings — LIVE
  await prisma.scoreCard.create({
    data: {
      league: 'BPL',
      teamA: 'Sheikh Russel',
      scoreA: '0',
      teamB: 'Bashundhara Kings',
      scoreB: '0',
      winnerTeam: null,
      status: "৩৪'",
      isLive: true,
      displayOrder: 1,
    },
  });

  // 3. EPL — Arsenal vs Chelsea — Full Time
  await prisma.scoreCard.create({
    data: {
      league: 'EPL',
      teamA: 'Arsenal',
      scoreA: '3',
      teamB: 'Chelsea',
      scoreB: '1',
      winnerTeam: 'A',
      status: 'Full Time',
      isLive: false,
      displayOrder: 2,
    },
  });

  // 4. NBA Finals — Celtics vs Lakers — LIVE
  await prisma.scoreCard.create({
    data: {
      league: 'NBA Finals',
      teamA: 'Celtics',
      scoreA: '88',
      teamB: 'Lakers',
      scoreB: '91',
      winnerTeam: null,
      status: 'Q4 · 2:14',
      isLive: true,
      displayOrder: 3,
    },
  });

  console.log('✅ Score cards seeded (4)');

  // ── SPONSORS ──────────────────────────────────────────────────────────────

  // 1. Inline — Nike Bangladesh
  await prisma.sponsor.create({
    data: {
      label: 'পার্টনার',
      title: 'নাইকি বাংলাদেশ',
      subtitle: 'সেরা খেলোয়াড়দের পছন্দ।',
      ctaText: 'দেখুন',
      ctaUrl: 'https://www.nike.com/bd',
      placement: 'inline',
      isActive: true,
      displayOrder: 0,
    },
  });

  // 2. Sidebar — BetSmart Analytics
  await prisma.sponsor.create({
    data: {
      label: 'Sponsor',
      title: 'BetSmart Analytics',
      subtitle: 'Data-driven insights for the modern sports fan.',
      ctaText: 'Explore',
      ctaUrl: 'https://betsmart.example.com',
      placement: 'sidebar',
      isActive: true,
      displayOrder: 0,
    },
  });

  console.log('✅ Sponsors seeded (2)');
  console.log('');
  console.log('🎉 FIELD database seeded successfully!');
  console.log('   Admin login: admin / field2026');
  console.log('   Run: npm run dev');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
