/**
 * timeAgo — relative time strings in English and Bengali
 * Section 13 rule 11: timestamps show relative ("২ ঘণ্টা আগে" / "2 hrs ago")
 * with exact datetime on hover
 */

const BN_DIGITS: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
};

function toBengaliDigits(n: number): string {
  return String(n).replace(/[0-9]/g, (d) => BN_DIGITS[d] || d);
}

export function timeAgo(date: Date | string, lang: 'en' | 'bn' = 'en'): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (lang === 'bn') {
    if (diffSec < 60)  return 'এইমাত্র';
    if (diffMin < 60)  return `${toBengaliDigits(diffMin)} মিনিট আগে`;
    if (diffHrs < 24)  return `${toBengaliDigits(diffHrs)} ঘণ্টা আগে`;
    if (diffDays < 7)  return `${toBengaliDigits(diffDays)} দিন আগে`;
    if (diffDays < 30) return `${toBengaliDigits(Math.floor(diffDays / 7))} সপ্তাহ আগে`;
    return `${toBengaliDigits(Math.floor(diffDays / 30))} মাস আগে`;
  }

  // English
  if (diffSec < 60)  return 'just now';
  if (diffMin < 60)  return `${diffMin} min ago`;
  if (diffHrs < 24)  return `${diffHrs} hr${diffHrs !== 1 ? 's' : ''} ago`;
  if (diffDays < 7)  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} wk ago`;
  return `${Math.floor(diffDays / 30)} mo ago`;
}

export function formatDatetime(date: Date | string): string {
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
