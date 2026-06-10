'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

const SPORTS = [
  'football', 'international-football', 'club-football', 'world-cup-2026',
  'bd-football', 'cricket', 'bd-cricket', 'basketball', 'tennis',
  'f1', 'rugby', 'table-tennis', 'golf', 'athletics',
  'interview', 'feature', 'special', 'guest-column', 'other',
];

interface Article {
  id: number;
  slug: string;
  headline: string;
  headlineBn?: string | null;
  deck: string;
  body: string;
  kicker: string;
  sport: string;
  mediaType: string;
  mediaUrl: string;
  mediaCaption?: string | null;
  byline: string;
  isLead: boolean;
}

/**
 * Edit Article Editor Console & Interactive Real-Time Live Preview — Section 11.3 & 10.9
 * Same layout as new, keeping visual parity.
 */
export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Live editable state
  const [headline, setHeadline] = useState('');
  const [headlineBn, setHeadlineBn] = useState('');
  const [deck, setDeck] = useState('');
  const [kicker, setKicker] = useState('');
  const [byline, setByline] = useState('');
  const [sport, setSport] = useState('football');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [isLead, setIsLead] = useState(false);
  const [body, setBody] = useState('');

  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/admin/articles`)
      .then((r) => r.json())
      .then((data: any) => {
        const found = data.articles?.find((a: Article) => a.id === parseInt(params.id, 10));
        if (found) {
          setHeadline(found.headline);
          setHeadlineBn(found.headlineBn ?? '');
          setDeck(found.deck);
          setKicker(found.kicker);
          setByline(found.byline);
          setSport(found.sport);
          setMediaType(found.mediaType as 'photo' | 'video');
          setMediaUrl(found.mediaUrl);
          setMediaCaption(found.mediaCaption ?? '');
          setIsLead(found.isLead);
          setBody(found.body);
        }
        setLoading(false);
      });
  }, [params.id]);

  const displayHeadline = headlineBn || headline;
  const isBn = !!headlineBn;
  const paragraphs = body.split(/\n\n+/).map(p => p.trim()).filter(Boolean);

  async function handleUpload(file: File): Promise<string> {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json() as any;
    return data.url;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      let finalMediaUrl = mediaUrl;

      if (fileRef.current?.files?.[0]) {
        finalMediaUrl = await handleUpload(fileRef.current.files[0]);
      }

      const payload = {
        headline,
        headlineBn: headlineBn || null,
        deck,
        body,
        kicker,
        byline: byline || 'Staff Reporter',
        sport,
        mediaType,
        mediaUrl: finalMediaUrl,
        mediaCaption: mediaCaption || null,
        isLead,
      };

      const res = await fetch(`/api/admin/articles/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json() as any;
        throw new Error(errorData.error || 'Save failed');
      }
      router.push('/admin/articles');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error saving');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this article permanently?')) return;
    await fetch(`/api/admin/articles/${params.id}`, { method: 'DELETE' });
    router.push('/admin/articles');
  }

  if (loading) return (
    <div style={{ padding: 24, color: 'var(--ink-muted)', fontFamily: "'Hind Siliguri', sans-serif" }}>Loading article composer...</div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }} className="flex flex-col lg:flex-row">
      {/* LEFT: Editor Console */}
      <div 
        style={{ 
          borderRight: '1px solid var(--ink-border)',
          backgroundColor: 'var(--bg-surface)',
        }}
        className="w-full lg:w-[450px] p-6 lg:overflow-y-auto lg:h-screen flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif", fontWeight: 700, fontSize: 20, color: 'var(--ink)' }}>
            Edit Story
          </h1>
          <a href="/admin/articles" className="admin-btn-secondary" style={{ padding: '4px 10px', fontSize: 10 }}>← Back</a>
        </div>

        {error && (
          <div style={{ color: '#C0392B', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          {/* Headline (EN) */}
          <div>
            <label htmlFor="headline" className="admin-label">Headline (EN)</label>
            <input 
              id="headline" 
              type="text" 
              required 
              className="admin-input" 
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>

          {/* Headline (BN) */}
          <div>
            <label htmlFor="headlineBn" className="admin-label">Headline (BN)</label>
            <input 
              id="headlineBn" 
              type="text" 
              className="admin-input" 
              value={headlineBn}
              onChange={(e) => setHeadlineBn(e.target.value)}
            />
          </div>

          {/* Deck */}
          <div>
            <label htmlFor="deck" className="admin-label">Deck / Summary</label>
            <input 
              id="deck" 
              type="text" 
              required 
              className="admin-input" 
              value={deck}
              onChange={(e) => setDeck(e.target.value)}
            />
          </div>

          {/* Kicker */}
          <div>
            <label htmlFor="kicker" className="admin-label">Kicker (Category Line)</label>
            <input 
              id="kicker" 
              type="text" 
              required 
              className="admin-input" 
              value={kicker}
              onChange={(e) => setKicker(e.target.value)}
            />
          </div>

          {/* Byline */}
          <div>
            <label htmlFor="byline" className="admin-label">Byline</label>
            <input 
              id="byline" 
              type="text" 
              className="admin-input" 
              value={byline}
              onChange={(e) => setByline(e.target.value)}
            />
          </div>

          {/* Sport */}
          <div>
            <label htmlFor="sport" className="admin-label">Sport Section</label>
            <select 
              id="sport" 
              required 
              className="admin-input"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
            >
              {SPORTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Media Type */}
          <div>
            <label className="admin-label">Media Type</label>
            <div className="flex gap-4">
              {(['photo', 'video'] as const).map((mt) => (
                <label key={mt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mediaType"
                    value={mt}
                    checked={mediaType === mt}
                    onChange={() => setMediaType(mt)}
                  />
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink)' }}>
                    {mt.charAt(0).toUpperCase() + mt.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Upload Media */}
          <div>
            <label htmlFor="mediaFile" className="admin-label">Replace Media File</label>
            <input
              id="mediaFile"
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.mp4"
              className="admin-input"
              style={{ paddingTop: 6 }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setMediaPreview(URL.createObjectURL(file));
                }
              }}
            />
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 9, color: 'var(--ink-muted)', marginTop: 4 }}>
              Current URL: {mediaUrl || 'None'}
            </p>
            <input
              id="mediaUrl"
              type="text"
              placeholder="Or paste media URL"
              className="admin-input mt-1"
              value={mediaUrl}
              onChange={(e) => {
                setMediaUrl(e.target.value);
                setMediaPreview(null);
              }}
            />
          </div>

          {/* Media Caption */}
          <div>
            <label htmlFor="mediaCaption" className="admin-label">Media Caption</label>
            <input 
              id="mediaCaption" 
              type="text" 
              className="admin-input" 
              value={mediaCaption}
              onChange={(e) => setMediaCaption(e.target.value)}
            />
          </div>

          {/* Pin as Lead */}
          <div className="py-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isLead} 
                onChange={(e) => setIsLead(e.target.checked)}
              />
              <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: 'var(--ink)' }}>
                Pin as Lead Story
              </span>
            </label>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col min-h-[180px]">
            <label htmlFor="body" className="admin-label">Body Paragraphs</label>
            <textarea
              id="body"
              required
              className="admin-textarea flex-1 min-h-[140px] text-sm"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 pb-6">
            <button type="submit" className="admin-btn-primary flex-1" disabled={saving}>
              {saving ? 'Saving...' : 'Save Story'}
            </button>
            <button type="button" onClick={handleDelete} className="admin-btn-danger">
              Delete
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT: Live Visual Interactive Preview Panel */}
      <div className="flex-1 lg:h-screen lg:overflow-y-auto p-4 lg:p-8 flex flex-col items-center">
        {/* Simulator Device Header */}
        <div 
          style={{ 
            fontFamily: "'Hind Siliguri', sans-serif",
            fontSize: 10,
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            letterSpacing: '0.12em',
            marginBottom: 12,
            borderBottom: '1px dashed var(--ink-border)',
            paddingBottom: 4,
            width: '100%',
            maxWidth: '680px',
            textAlign: 'center'
          }}
        >
          📰 Live Preview Simulator (Exact Render)
        </div>

        {/* Simulator Frame */}
        <div 
          style={{ 
            backgroundColor: 'var(--bg-page)', 
            border: '1.5px solid var(--ink-border)',
            borderRadius: '4px',
            width: '100%',
            maxWidth: '680px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
            minHeight: '80vh',
            paddingBottom: '48px',
            position: 'relative'
          }}
        >
          {/* Sim Media container */}
          <div
            className="w-full relative"
            style={{ aspectRatio: '16/9', backgroundColor: 'var(--ink-ghost)', overflow: 'hidden' }}
          >
            {mediaPreview || mediaUrl ? (
              mediaType === 'video' ? (
                <video
                  src={mediaPreview || mediaUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={mediaPreview || mediaUrl}
                  alt={displayHeadline}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-[var(--ink-muted)]">
                <span>[No Media Attached]</span>
                <span>Select a file or enter URL to preview</span>
              </div>
            )}
            <span
              style={{
                position: 'absolute', top: 10, left: 10,
                backgroundColor: 'var(--ink)', color: 'var(--bg-page)',
                fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
                fontSize: 7, fontWeight: 500, letterSpacing: '0.1em',
                textTransform: 'uppercase', padding: '2px 5px', borderRadius: 1,
              }}
            >
              {mediaType === 'video' ? '▶ Video' : 'Photo'}
            </span>
          </div>

          {/* Sim Caption */}
          {mediaCaption && (
            <div className="px-6">
              <p
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontStyle: 'italic', fontSize: 11,
                  color: 'var(--ink-muted)', marginTop: 8,
                }}
              >
                {mediaCaption}
              </p>
            </div>
          )}

          {/* Sim Content body */}
          <div className="px-6 mt-6">
            {/* Kicker · Sport */}
            <p
              style={{
                fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
                fontSize: 11, fontWeight: 500,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--ink-muted)', marginBottom: 8,
              }}
              lang="bn"
            >
              {kicker}
            </p>

            {/* Headline */}
            <h1
              lang={isBn ? 'bn' : 'en'}
              style={{
                fontFamily: isBn
                  ? "'Manowar Murshidabad', 'Noto Serif Bengali', serif"
                  : "Georgia, 'Times New Roman', Times, serif",
                fontWeight: 700,
                fontStyle: !isBn ? 'italic' : 'normal',
                fontSize: 'clamp(24px, 3.5vw, 34px)',
                lineHeight: 1.15, letterSpacing: '-0.01em',
                color: 'var(--ink)', marginBottom: 10,
              }}
            >
              {displayHeadline}
            </h1>

            {/* English title if bilingual */}
            {headlineBn && headline !== headlineBn && (
              <h2
                lang="en"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', Times, serif",
                  fontWeight: 700, fontStyle: 'italic',
                  fontSize: 'clamp(15px, 2vw, 18px)',
                  color: 'var(--ink-muted)', marginBottom: 10, lineHeight: 1.2,
                }}
              >
                {headline}
              </h2>
            )}

            {/* Deck */}
            <p
              lang={isBn ? 'bn' : 'en'}
              style={{
                fontFamily: isBn ? "'Abu JM Akkas', 'Hind Siliguri', sans-serif" : "'Source Serif 4', Georgia, serif",
                fontWeight: 300, fontSize: '15px',
                color: 'var(--ink-muted)', lineHeight: 1.65,
                marginBottom: 14, borderBottom: '0.5px solid var(--ink-border)', paddingBottom: 12,
              }}
            >
              {deck}
            </p>

            {/* Byline + Timestamp */}
            <div className="flex items-center gap-2 mb-6">
              <span
                style={{
                  fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
                  fontSize: 10, fontWeight: 400,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--ink-ghost)',
                }}
              >
                {byline}
              </span>
              <span style={{ color: 'var(--ink-ghost)', fontSize: 10 }}>·</span>
              <span
                style={{
                  fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
                  fontSize: 10, color: 'var(--ink-ghost)',
                }}
              >
                Just now
              </span>
            </div>

            {/* Body paragraphs */}
            <div>
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  lang={isBn ? 'bn' : 'en'}
                  style={{
                    fontFamily: isBn
                      ? "'Abu JM Akkas', 'Hind Siliguri', sans-serif"
                      : "'Source Serif 4', Georgia, serif",
                    fontWeight: isBn ? 400 : 300,
                    fontSize: isBn ? 17 : '18px',
                    lineHeight: 1.85,
                    color: 'var(--ink)',
                    marginBottom: '1.25em',
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
