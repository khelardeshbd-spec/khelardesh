'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const SPORTS = ['football', 'cricket', 'basketball', 'tennis', 'f1', 'rugby', 'athletics', 'other'];

/**
 * Mobile-First WYSIWYG Inline Editor — Section 11.3 & 10.9
 * Eliminates side-panel layout. The editor is the template itself.
 * All headers, decks, categories, and paragraphs are directly focusable and editable (contentEditable).
 * Media areas are clickable to upload images/videos directly.
 */
export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Editor states
  const [headline, setHeadline] = useState('An exciting sports headline goes here');
  const [headlineBn, setHeadlineBn] = useState('এখানে একটি আকর্ষণীয় খেলার শিরোনাম বসবে');
  const [deck, setDeck] = useState('Provide a brief deck or summary explaining the core scoop of the article here.');
  const [kicker, setKicker] = useState('চ্যাম্পিয়নস লিগ · সেমিফাইনাল');
  const [byline, setByline] = useState('Staff Reporter');
  const [sport, setSport] = useState('football');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaCaption, setMediaCaption] = useState('Photo/Video caption goes here');
  const [isLead, setIsLead] = useState(false);
  const [body, setBody] = useState('This is paragraph one. Write the main content of your story here.\n\nThis is paragraph two. Separate paragraphs with a blank line just like in a text editor to preview spacing.');

  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const displayHeadline = headlineBn || headline;
  const isBn = !!headlineBn;

  // Simple parser to map text blocks back into state from editable div changes
  function updateBodyFromDOM(htmlContent: string) {
    // Replace divs/brs with single/double newlines to parse paragraphs cleanly
    const cleanText = htmlContent
      .replace(/<div><br><\/div>/g, '\n')
      .replace(/<div>/g, '\n')
      .replace(/<\/div>/g, '')
      .replace(/<br>/g, '\n');
    setBody(cleanText);
  }

  async function handleUpload(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json() as any;
    return data.url as string;
  }

  async function handlePublish() {
    setError('');
    setLoading(true);

    try {
      let finalMediaUrl = mediaUrl;

      // Upload file if selected
      const fileInput = fileRef.current;
      if (fileInput?.files?.[0]) {
        finalMediaUrl = await handleUpload(fileInput.files[0]);
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

      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json() as any;
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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', paddingBottom: '120px' }}>
      {/* Floating Action Bar / Controls for Phone/Desktop convenience */}
      <div 
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1.5px solid var(--ink-border)',
          padding: '12px 16px',
        }}
        className="flex items-center justify-between gap-3 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <a href="/admin/articles" className="admin-btn-secondary" style={{ padding: '6px 12px' }}>← Back</a>
          <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: "'Hind Siliguri', sans-serif" }}>
            Drafting in Section:
          </span>
          <select 
            style={{ 
              backgroundColor: 'var(--bg-page)', 
              color: 'var(--ink)', 
              border: '1px solid var(--ink-border)',
              padding: '4px 8px',
              fontSize: '13px',
              borderRadius: '2px'
            }}
            value={sport}
            onChange={(e) => setSport(e.target.value)}
          >
            {SPORTS.map((s) => (
              <option key={s} value={s}>{s.toUpperCase()}</option>
            ))}
          </select>

          {/* Lead Pin status */}
          <label className="flex items-center gap-2 cursor-pointer ml-2">
            <input 
              type="checkbox" 
              checked={isLead} 
              onChange={(e) => setIsLead(e.target.checked)}
            />
            <span style={{ fontSize: '12px', fontFamily: "'Hind Siliguri', sans-serif" }}>Pin as Lead</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handlePublish} 
            className="admin-btn-primary" 
            style={{ padding: '8px 18px', backgroundColor: 'var(--ink)', color: 'var(--bg-page)' }}
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Story'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '24px auto' }} className="px-4">
        {error && (
          <div style={{ color: '#C0392B', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* Hidden File Picker */}
        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.mp4"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setMediaPreview(URL.createObjectURL(file));
            }
          }}
        />

        {/* Media Frame (Click to select/upload file) */}
        <div 
          onClick={() => fileRef.current?.click()}
          style={{ 
            aspectRatio: '16/9', 
            backgroundColor: 'var(--ink-ghost)', 
            position: 'relative',
            cursor: 'pointer',
            overflow: 'hidden',
            borderRadius: '2px',
            border: '1px dashed var(--ink-border)'
          }}
          className="group hover:opacity-95 transition mb-3"
          title="Click to select file to upload"
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
                alt="Brand media preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-[var(--ink-muted)]">
              <span className="font-semibold text-sm mb-1">📷 Tap/Click here to Upload Media</span>
              <span>Accepts JPG, PNG, WEBP, or MP4</span>
            </div>
          )}

          <div className="absolute top-2 left-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
            <select
              style={{
                backgroundColor: 'var(--ink)',
                color: 'var(--bg-page)',
                fontSize: '8px',
                padding: '2px 4px',
                border: 'none',
                borderRadius: '1px',
                cursor: 'pointer'
              }}
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as 'photo' | 'video')}
            >
              <option value="photo">PHOTO</option>
              <option value="video">VIDEO</option>
            </select>
          </div>

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <span className="text-white text-xs font-semibold px-3 py-1.5 bg-black/60 rounded">
              Upload file
            </span>
          </div>
        </div>

        {/* Media URL / Path override input (optional) */}
        <div className="mb-6 flex gap-2 items-center">
          <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Or asset path:</span>
          <input
            type="text"
            placeholder="/media/placeholder-football.jpg (optional URL)"
            style={{
              flex: 1,
              fontSize: '11px',
              padding: '3px 6px',
              background: 'transparent',
              border: '1px solid var(--ink-border)',
              color: 'var(--ink)',
              borderRadius: '2px'
            }}
            value={mediaUrl}
            onChange={(e) => {
              setMediaUrl(e.target.value);
              setMediaPreview(null); // use URL
            }}
          />
        </div>

        {/* Media Caption */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="[Tap to enter caption here]"
            style={{
              width: '100%',
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '11px',
              color: 'var(--ink-muted)',
              border: 'none',
              borderBottom: '1px dashed transparent',
              background: 'transparent',
              padding: '2px 0'
            }}
            className="hover:border-var(--ink-border) focus:border-var(--ink) outline-none"
            value={mediaCaption}
            onChange={(e) => setMediaCaption(e.target.value)}
          />
        </div>

        {/* Kicker Category Line */}
        <div className="mb-2">
          <input
            type="text"
            placeholder="ক্যাটেগরি / কিকার (যেমন: চ্যাম্পিয়নস লিগ · সেমিফাইনাল)"
            style={{
              width: '100%',
              fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              border: 'none',
              borderBottom: '1px dashed transparent',
              background: 'transparent',
              padding: '2px 0'
            }}
            className="hover:border-var(--ink-border) focus:border-var(--ink) outline-none"
            value={kicker}
            onChange={(e) => setKicker(e.target.value)}
          />
        </div>

        {/* Headline (Bengali / Primary) */}
        <div className="mb-3">
          <textarea
            placeholder="প্রধান বাংলা শিরোনাম (এখানে সরাসরি বাংলা টাইপ করুন)"
            rows={2}
            style={{
              width: '100%',
              fontFamily: "'Manowar Murshidabad', 'Noto Serif Bengali', serif",
              fontWeight: 700,
              fontSize: '28px',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
              border: 'none',
              borderBottom: '1px dashed transparent',
              background: 'transparent',
              resize: 'none',
              padding: 0
            }}
            className="hover:border-var(--ink-border) focus:border-var(--ink) outline-none"
            value={headlineBn}
            onChange={(e) => setHeadlineBn(e.target.value)}
          />
        </div>

        {/* Headline (English / Secondary) */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Secondary English Headline (optional)"
            style={{
              width: '100%',
              fontFamily: "Georgia, 'Times New Roman', Times, serif",
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: '17px',
              color: 'var(--ink-muted)',
              border: 'none',
              borderBottom: '1px dashed transparent',
              background: 'transparent',
              padding: '2px 0'
            }}
            className="hover:border-var(--ink-border) focus:border-var(--ink) outline-none"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>

        {/* Deck */}
        <div className="mb-4" style={{ borderBottom: '0.5px solid var(--ink-border)', paddingBottom: '14px' }}>
          <textarea
            placeholder="Enter article deck / brief summary explaining the main hook of this news story..."
            rows={2}
            style={{
              width: '100%',
              fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
              fontWeight: 300,
              fontSize: '15px',
              lineHeight: 1.65,
              color: 'var(--ink-muted)',
              border: 'none',
              borderBottom: '1px dashed transparent',
              background: 'transparent',
              resize: 'none',
              padding: 0
            }}
            className="hover:border-var(--ink-border) focus:border-var(--ink) outline-none"
            value={deck}
            onChange={(e) => setDeck(e.target.value)}
          />
        </div>

        {/* Byline */}
        <div className="mb-6 flex gap-2 items-center">
          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink-ghost)' }}>By:</span>
          <input
            type="text"
            placeholder="Staff Reporter"
            style={{
              fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--ink-ghost)',
              border: 'none',
              borderBottom: '1px dashed transparent',
              background: 'transparent',
              width: '140px',
              padding: '2px 0'
            }}
            className="hover:border-var(--ink-border) focus:border-var(--ink) outline-none"
            value={byline}
            onChange={(e) => setByline(e.target.value)}
          />
        </div>

        {/* Body Paragraph Editor (contentEditable template block) */}
        <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: '10px', color: 'var(--ink-ghost)', marginBottom: '8px' }}>
          ARTICLE CONTENT (PRESS ENTER FOR NEW PARAGRAPHS):
        </div>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateBodyFromDOM(e.currentTarget.innerHTML)}
          style={{
            minHeight: '220px',
            fontFamily: isBn ? "'Abu JM Akkas', 'Hind Siliguri', sans-serif" : "'Source Serif 4', Georgia, serif",
            fontWeight: isBn ? 400 : 300,
            fontSize: isBn ? '17px' : '18px',
            lineHeight: 1.85,
            color: 'var(--ink)',
            outline: 'none',
            border: '1px dashed var(--ink-border)',
            padding: '12px',
            borderRadius: '2px',
            backgroundColor: 'var(--bg-page)'
          }}
          className="prose-field"
        >
          {body.split(/\n\n+/).map((p, i) => (
            <div key={i} style={{ marginBottom: '1.25em' }}>{p}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
