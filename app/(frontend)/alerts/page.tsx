import Masthead from '@/components/frontend/Masthead';

export const metadata = {
  title: 'সতর্কতা — খেলারদেশ',
  description: 'খেলার সর্বশেষ আপডেট এবং সতর্কতা।',
};

const STATIC_ALERTS = [
  {
    id: 1,
    type: 'ব্রেকিং',
    color: 'var(--live-red)',
    text: 'বাংলাদেশ বনাম ভারত: দ্বিতীয় টেস্টে বাংলাদেশ দল ঘোষণা।',
    time: '১০ মিনিট আগে'
  },
  {
    id: 2,
    type: 'স্কোর আপডেট',
    color: '#27ae60',
    text: 'মেসি ম্যাজিক: ইন্টার মিয়ামির হয়ে আরও এক গোল।',
    time: '১ ঘণ্টা আগে'
  },
  {
    id: 3,
    type: 'সাধারণ',
    color: '#2980b9',
    text: 'আগামীকাল থেকে শুরু হচ্ছে ফ্রেঞ্চ ওপেন।',
    time: '২ ঘণ্টা আগে'
  }
];

export default function AlertsPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="max-w-[800px] mx-auto px-4 lg:px-6 py-8 pb-12">
        <div className="hidden lg:block mb-8">
          <Masthead />
        </div>
        <h1
          lang="bn"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 900,
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: 'var(--ink)',
            borderBottom: '1.5px solid var(--ink)',
            paddingBottom: 8,
            marginBottom: 24,
          }}
        >
          সতর্কতা
        </h1>

        {STATIC_ALERTS.length > 0 ? (
          <div className="flex flex-col gap-4">
            {STATIC_ALERTS.map((alert) => (
              <div 
                key={alert.id}
                className="p-4 bg-[var(--bg-surface)] border border-[var(--ink-border)]"
                style={{ borderRadius: 2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    lang="bn"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      fontWeight: 600,
                      color: alert.color,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      border: `1px solid ${alert.color}`,
                      padding: '2px 6px',
                      borderRadius: 1,
                    }}
                  >
                    {alert.type}
                  </span>
                  <span
                    lang="bn"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      color: 'var(--ink-ghost)',
                    }}
                  >
                    {alert.time}
                  </span>
                </div>
                <p
                  lang="bn"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    fontWeight: 500,
                    color: 'var(--ink)',
                    lineHeight: 1.5,
                  }}
                >
                  {alert.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-[var(--ink-muted)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p
              lang="bn"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 16,
              }}
            >
              কোনো সতর্কতা নেই।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
