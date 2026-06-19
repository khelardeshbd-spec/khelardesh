const { Client } = require('pg');

const directUrl = process.env.DIRECT_URL || "postgresql://postgres.uvuqxixoncdbjupupxow:ShahMdEliausKomol@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

async function run() {
  const client = new Client({
    connectionString: directUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database.");

    const query = `
      INSERT INTO "Article" (
        "slug", "headline", "headlineBn", "deck", "body", "kicker", "sport", "mediaType", "mediaUrl", "byline", "isLead", "publishedAt", "updatedAt"
      ) VALUES 
      (
        'shakib-exclusive-interview',
        'Exclusive Interview with Shakib Al Hasan',
        'সাকিব আল হাসানের এক্সক্লুসিভ সাক্ষাৎকার: মনের সব না-বলা কথা',
        'বাংলাদেশ ক্রিকেট দলের অলরাউন্ডার সাকিব আল হাসানের মুখোমুখি খেলারদেশ। ভবিষ্যতের পরিকল্পনা এবং দলের বর্তমান অবস্থা নিয়ে খোলামেলা আলোচনা।',
        'খেলাধুলার সব খবর ও বিশ্লেষণ সবার আগে পেতে চোখ রাখুন খেলারদেশে। বিস্তারিত সাক্ষাৎকার নিচে পড়ুন। সাকিব আল হাসান জানিয়েছেন, তিনি আরও কয়েক বছর আন্তর্জাতিক ক্রিকেট চালিয়ে যেতে চান। দলের তরুণ খেলোয়াড়দের প্রতি তিনি আশাবাদী। মাঠের লড়াইয়ে নিজেদের সেরাটা দেওয়ার জন্য প্রস্তুতি নেওয়া হচ্ছে।',
        'ইন্টারভিউ',
        'interview',
        'image',
        'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop',
        'সাজিদ রহমান',
        false,
        NOW(),
        NOW()
      ),
      (
        'evolution-of-bangladesh-football',
        'The Rise and Evolution of Bangladesh Football',
        'বাংলাদেশের ফুটবলের রূপান্তর এবং নতুন সম্ভাবনা',
        'গত এক দশকে বাংলাদেশের ঘরোয়া ও আন্তর্জাতিক ফুটবলের বিবর্তন। যুব ফুটবল একাডেমি থেকে উঠে আসা তরুণদের নিয়ে বিশেষ প্রতিবেদন।',
        'খেলারদেশ বিশেষ প্রতিবেদন। ফুটবলের রূপান্তর এবং সম্ভাবনার নানা দিক নিয়ে আলোচনা। বাংলাদেশের ফুটবলে দর্শক সংখ্যা দিন দিন বৃদ্ধি পাচ্ছে। নতুন নতুন স্পন্সর এগিয়ে আসছে এবং পাইপলাইনে তরুণ প্রতিভাবান ফুটবলারদের সংখ্যা বেশ সন্তোষজনক।',
        'ফিচার',
        'feature',
        'image',
        'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=600&auto=format&fit=crop',
        'ফুটবল ডেস্ক',
        false,
        NOW() - INTERVAL '1 hour',
        NOW() - INTERVAL '1 hour'
      )
      ON CONFLICT ("slug") DO UPDATE SET
        "headlineBn" = EXCLUDED."headlineBn",
        "deck" = EXCLUDED."deck",
        "publishedAt" = EXCLUDED."publishedAt";
    `;

    await client.query(query);
    console.log("Demo articles for 'interview' and 'feature' successfully inserted.");

  } catch (err) {
    console.error("Database operation failed:", err);
  } finally {
    await client.end();
  }
}

run();
