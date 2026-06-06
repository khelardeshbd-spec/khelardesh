'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const SPORTS = ['football', 'cricket', 'basketball', 'tennis', 'f1', 'rugby', 'athletics', 'other'];

/**
 * New Article Editor — Section 11.3
 * All fields on single page — no tabs, no multi-step
 */
export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url as string;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      let finalMediaUrl = mediaUrl;

      // Upload file if selected
      const fileInput = fileRef.current;
      if (fileInput?.files?.[0]) {
        finalMediaUrl = await handleUpload(fileInput.files[0]);
      }

      const payload = {
        headline: formData.get('headline'),
        headlineBn: formData.get('headlineBn') || null,
        deck: formData.get('deck'),
        body: formData.get('body'),
        kicker: formData.get('kicker'),
        byline: formData.get('byline') || 'Staff Reporter',
        sport: formData.get('sport'),
        mediaType: formData.get('mediaType'),
        mediaUrl: finalMediaUrl,
        mediaCaption: formData.get('mediaCaption') || null,
        isLead: formData.get('isLead') === 'on',
      };

      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create article');
      }

      router.push('/admin/articles');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className="flex items-center justify-between mb-8">
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif", fontWeight: 700, fontSize: 24, color: 'var(--ink)' }}>
            New Article
          </h1>
          <a href="/admin/articles" className="admin-btn-secondary">← Back</a>
        </div>

        {error && (
          <div style={{ color: '#C0392B', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Headline (EN) */}
          <div>
            <label htmlFor="headline" className="admin-label">Headline (EN)</label>
            {/* Bengali keyboard note: accepts Unicode Bengali directly via Probhat/Avro */}
            <input id="headline" name="headline" type="text" required className="admin-input" lang="en" />
          </div>

          {/* Headline (BN) */}
          <div>
            <label htmlFor="headlineBn" className="admin-label">Headline (BN) — optional Bangla headline</label>
            {/* The headline field accepts Unicode Bengali directly. No transliteration needed.
                The browser's native input handles Bangla keyboard layouts (Probhat / Avro). */}
            <input id="headlineBn" name="headlineBn" type="text" className="admin-input" lang="bn" />
          </div>

          {/* Deck */}
          <div>
            <label htmlFor="deck" className="admin-label">Deck — 1–2 sentences</label>
            <input id="deck" name="deck" type="text" required className="admin-input" />
          </div>

          {/* Kicker */}
          <div>
            <label htmlFor="kicker" className="admin-label">Kicker — e.g. "চ্যাম্পিয়নস লিগ · সেমিফাইনাল"</label>
            <input id="kicker" name="kicker" type="text" required className="admin-input" lang="bn" />
          </div>

          {/* Byline */}
          <div>
            <label htmlFor="byline" className="admin-label">Byline</label>
            <input id="byline" name="byline" type="text" className="admin-input" defaultValue="Staff Reporter" />
          </div>

          {/* Sport */}
          <div>
            <label htmlFor="sport" className="admin-label">Sport</label>
            <select id="sport" name="sport" required className="admin-input">
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
            <label htmlFor="mediaFile" className="admin-label">
              Upload Media — jpg/png/webp/mp4
            </label>
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
            {mediaPreview && (
              <div className="mt-2" style={{ maxWidth: 240 }}>
                {mediaType === 'video' ? (
                  <video src={mediaPreview} controls style={{ width: '100%', borderRadius: 1 }} />
                ) : (
                  <img src={mediaPreview} alt="Preview" style={{ width: '100%', borderRadius: 1 }} />
                )}
              </div>
            )}
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, color: 'var(--ink-ghost)', marginTop: 4 }}>
              Or paste a URL below
            </p>
            <input
              id="mediaUrl"
              type="text"
              placeholder="/media/example.jpg"
              className="admin-input mt-2"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
            />
          </div>

          {/* Media Caption */}
          <div>
            <label htmlFor="mediaCaption" className="admin-label">Media Caption — optional</label>
            <input id="mediaCaption" name="mediaCaption" type="text" className="admin-input" />
          </div>

          {/* Pin as Lead */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isLead" id="isLead" />
              <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink)' }}>
                Pin as Lead Story — auto-unpins any existing lead
              </span>
            </label>
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="admin-label">
              Body — separate paragraphs with a blank line
            </label>
            {/* Accepts Unicode Bengali directly via Probhat/Avro keyboard */}
            <textarea
              id="body"
              name="body"
              required
              className="admin-textarea"
              placeholder="Write your article here...&#10;&#10;Each blank line creates a new paragraph."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="admin-btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Publish Now'}
            </button>
            <a href="/admin/articles" className="admin-btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  );
}
