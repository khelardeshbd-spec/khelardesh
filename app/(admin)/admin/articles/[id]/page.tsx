'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Trash2, Image as ImageIcon } from 'lucide-react';

const SPORTS = [
  { value: 'football', label: 'ফুটবল' },
  { value: 'bd-football', label: 'দেশের ফুটবল' },
  { value: 'club-football', label: 'ক্লাব ফুটবল' },
  { value: 'international-football', label: 'আন্তর্জাতিক ফুটবল' },
  { value: 'cricket', label: 'ক্রিকেট' },
  { value: 'bd-cricket', label: 'বাংলাদেশের ক্রিকেট' },
  { value: 'basketball', label: 'বাস্কেটবল' },
  { value: 'tennis', label: 'টেনিস' },
  { value: 'f1', label: 'ফর্মুলা ওয়ান' },
  { value: 'interview', label: 'ইন্টারভিউ' },
  { value: 'feature', label: 'ফিচার' },
  { value: 'special', label: 'খেলার দেশ বিশেষ' },
  { value: 'guest-column', label: 'অতিথি কলাম' },
  { value: 'other', label: 'অন্যান্য' },
];

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Article state values
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
  const [status, setStatus] = useState('published');

  const [composers, setComposers] = useState<{ id: number; name: string; photoUrl?: string | null }[]>([]);

  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const sportLabel = SPORTS.find(s => s.value === sport)?.label || 'খেলাধুলা';

  useEffect(() => {
    fetch('/api/admin/composers')
      .then(res => res.json())
      .then(data => {
        setComposers(data.composers ?? []);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/admin/articles/${params.id}`)
      .then((r) => r.json())
      .then((data: any) => {
        const found = data.article;
        if (found) {
          setHeadline(found.headline || '');
          setHeadlineBn(found.headlineBn ?? '');
          setDeck(found.deck || '');
          setKicker(found.kicker || '');
          setByline(found.byline || '');
          setSport(found.sport || 'football');
          setMediaType((found.mediaType as 'photo' | 'video') || 'photo');
          setMediaUrl(found.mediaUrl || '');
          setMediaCaption(found.mediaCaption ?? '');
          setIsLead(!!found.isLead);
          setBody(found.body || '');
          setStatus(found.status || 'published');
        }
        setLoading(false);
      });
  }, [params.id]);

  // Parser to capture text blocks from editable div
  const updateBodyFromDOM = (htmlContent: string) => {
    const cleanText = htmlContent
      .replace(/<div><br><\/div>/g, '\n')
      .replace(/<div>/g, '\n')
      .replace(/<\/div>/g, '')
      .replace(/<br>/g, '\n')
      .replace(/<[^>]*>/g, '');
    setBody(cleanText);
  };

  async function handleUpload(file: File): Promise<string> {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json() as any;
    return data.url;
  }

  async function handleSave(newStatus?: 'published' | 'draft') {
    if (!headlineBn && !headline) {
      setError('দয়া করে অন্তত একটি শিরোনাম প্রদান করুন।');
      return;
    }
    if (!body || body.trim().length < 5) {
      setError('দয়া করে নিবন্ধের বিস্তারিত বিবরণ লিখুন।');
      return;
    }

    setError('');
    setSaving(true);
    const finalStatus = newStatus || status;

    try {
      let finalMediaUrl = mediaUrl;

      // Handle media upload
      const fileInput = fileRef.current;
      if (fileInput?.files?.[0]) {
        finalMediaUrl = await handleUpload(fileInput.files[0]);
      }

      const payload = {
        headline: headline || headlineBn,
        headlineBn: headlineBn || null,
        deck: deck || '',
        body: body.trim(),
        kicker: kicker || sportLabel,
        byline: byline || 'খেলারদেশ প্রতিনিধি',
        sport,
        mediaType,
        mediaUrl: finalMediaUrl || '/media/placeholder-football.jpg',
        mediaCaption: mediaCaption || null,
        isLead,
        status: finalStatus,
      };

      const res = await fetch(`/api/admin/articles/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json() as any;
        throw new Error(err.error || 'Failed to update article');
      }

      router.push('/admin/articles');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this article permanently?')) return;
    await fetch(`/api/admin/articles/${params.id}`, { method: 'DELETE' });
    router.push('/admin/articles');
  }

  if (loading) {
    return (
      <div style={{ padding: 24, color: 'var(--ink-muted)', fontFamily: "'Hind Siliguri', sans-serif" }}>
        Loading article composer...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', paddingBottom: '160px' }}>
      
      {/* Top Floating Control Bar */}
      <div 
        style={{
          position: 'sticky', 
          top: 0, 
          zIndex: 100,
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1.5px solid var(--ink-border)',
          padding: '12px 16px',
        }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/admin/articles" className="admin-btn-secondary flex items-center gap-1.5" style={{ padding: '6px 12px' }}>
              <ArrowLeft size={14} />
              <span>Articles</span>
            </Link>
            
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-muted)', fontFamily: "'Hind Siliguri', sans-serif" }} className="ml-2">
              Section:
            </span>
            <select 
              style={{ 
                backgroundColor: 'var(--bg-page)', 
                color: 'var(--ink)', 
                border: '1px solid var(--ink-border)',
                padding: '5px 10px',
                fontSize: '12px',
                borderRadius: '4px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
              value={sport}
              onChange={(e) => setSport(e.target.value)}
            >
              {SPORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif" }}>
            <input 
              type="checkbox" 
              checked={isLead} 
              onChange={(e) => setIsLead(e.target.checked)}
              style={{ width: '15px', height: '15px', cursor: 'pointer' }}
            />
            <span>Hero News</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <span style={{ color: '#C0392B', fontSize: '11px', fontFamily: "'Hind Siliguri', sans-serif", marginRight: '8px' }}>
              ⚠️ {error}
            </span>
          )}

          <button 
            onClick={handleDelete} 
            className="admin-btn-danger flex items-center gap-1.5" 
            style={{ padding: '8px 18px', backgroundColor: '#C0392B', color: '#fff' }}
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>

          {status !== 'published' && (
            <button 
              onClick={() => handleSave('draft')} 
              className="admin-btn-secondary flex items-center gap-1.5" 
              style={{ padding: '8px 18px', border: '1.5px solid var(--ink-border)' }}
              disabled={saving}
            >
              <span>{saving ? 'Saving...' : 'Save as Draft'}</span>
            </button>
          )}

          <button 
            onClick={() => handleSave('published')} 
            className="admin-btn-primary flex items-center gap-1.5" 
            style={{ padding: '8px 18px', backgroundColor: 'var(--ink)', color: 'var(--bg-page)' }}
            disabled={saving}
          >
            <Check size={14} />
            <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Editor Main Canvas (Matches exact frontend article page layout) */}
      <div className="w-full max-w-[680px] mx-auto px-4 pt-8">
        
        {/* Back link & breadcrumbs simulator */}
        <div className="flex items-center gap-3 pb-6 border-b border-[var(--ink-border)] mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink-muted)] bg-[var(--ink-ghost)] px-3 py-1 rounded-full pointer-events-none">
            ← ফিরে যান
          </div>
          
          <div 
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[var(--ink-muted)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span>মাঠ</span>
            <span>/</span>
            <span className="text-[#1a5c2e]">
              {sportLabel}
            </span>
          </div>
        </div>

        {/* Article Headline Input (Bengali / Primary) */}
        <div className="mb-4">
          <textarea
            placeholder="শিরোনাম"
            rows={2}
            style={{
              width: '100%',
              fontFamily: "var(--font-headline)",
              fontWeight: 800,
              fontSize: 'clamp(28px, 4.5vw, 42px)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              border: 'none',
              borderBottom: '1px dashed var(--ink-border)',
              background: 'transparent',
              resize: 'none',
              padding: '6px 0',
              outline: 'none',
            }}
            className="focus:border-[var(--ink)] placeholder:text-[var(--ink-muted)] placeholder:font-normal"
            value={headlineBn}
            onChange={(e) => setHeadlineBn(e.target.value)}
          />
        </div>

        {/* Hidden File Input */}
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
        <div className="mb-4">
          <div 
            onClick={() => fileRef.current?.click()}
            style={{ 
              aspectRatio: '16/9', 
              backgroundColor: 'var(--bg-surface)', 
              position: 'relative',
              cursor: 'pointer',
              overflow: 'hidden',
              borderRadius: '6px',
              border: '1.5px dashed var(--ink-border)'
            }}
            className="group hover:opacity-95 transition flex items-center justify-center"
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
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={mediaPreview || mediaUrl}
                  alt="Media preview"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-[var(--ink-muted)] p-6 text-center">
                <div className="p-3 bg-[var(--ink-ghost)] rounded-full mb-3 text-[var(--ink-muted)]">
                  <ImageIcon size={24} />
                </div>
                <span className="font-bold text-sm mb-1 text-[var(--ink)]">📷 ছবির ফ্রেমে ক্লিক করে মিডিয়া ফাইল যুক্ত করুন</span>
                <span>(Accepts JPG, PNG, WEBP, or MP4)</span>
              </div>
            )}

            <div className="absolute top-3 left-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
              <select
                style={{
                  backgroundColor: 'var(--ink)',
                  color: 'var(--bg-page)',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '3px',
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
                Upload new media file
              </span>
            </div>
          </div>
        </div>

        {/* Media Caption */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="ছবির ক্যাপশন লিখুন..."
            style={{
              width: '100%',
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '12px',
              color: 'var(--ink-muted)',
              border: 'none',
              borderBottom: '1px dashed var(--ink-border)',
              background: 'transparent',
              padding: '4px 0',
              outline: 'none',
            }}
            className="focus:border-[var(--ink)] placeholder:text-[var(--ink-muted)] placeholder:font-normal"
            value={mediaCaption}
            onChange={(e) => setMediaCaption(e.target.value)}
          />
        </div>

        {/* Article Summary / Deck */}
        <div className="mb-6">
          <textarea
            placeholder="নিবন্ধের সংক্ষেপ বা সারসংক্ষেপ লিখুন..."
            rows={2}
            style={{
              width: '100%',
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: '15px',
              lineHeight: 1.65,
              color: 'var(--ink)',
              border: 'none',
              borderBottom: '1px dashed var(--ink-border)',
              background: 'transparent',
              resize: 'none',
              padding: '6px 0',
              outline: 'none',
            }}
            className="focus:border-[var(--ink)] placeholder:text-[var(--ink-muted)]"
            value={deck}
            onChange={(e) => setDeck(e.target.value)}
          />
        </div>

        {/* Kicker Category Line */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="কিকার বা উপশ্রেণী (যেমন: চ্যাম্পিয়নস লিগ · সেমিফাইনাল)..."
            style={{
              width: '100%',
              fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              border: 'none',
              borderBottom: '1px dashed var(--ink-border)',
              background: 'transparent',
              padding: '4px 0',
              outline: 'none',
            }}
            className="focus:border-[var(--ink)] placeholder:text-[var(--ink-muted)] placeholder:font-normal"
            value={kicker}
            onChange={(e) => setKicker(e.target.value)}
          />
        </div>

        {/* Byline / Writer Name & Metadata row */}
        <div className="flex items-center justify-between border-t border-b border-[var(--ink-border)] py-3 mb-8 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            {/* Writer Avatar */}
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center border overflow-hidden text-xs font-bold bg-[var(--bg-surface)] border-[var(--ink-border)] text-[var(--ink)]"
            >
              {(() => {
                const matched = composers.find(c => c.name === byline);
                return matched?.photoUrl ? (
                  <img src={matched.photoUrl} alt={byline} className="w-full h-full object-cover" />
                ) : (
                  byline ? byline.slice(0, 2).toUpperCase() : 'KD'
                );
              })()}
            </div>
            
            {/* Byline Dropdown Select */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xs text-[var(--ink-muted)]">By:</span>
                <select
                  style={{
                    fontFamily: "'Hind Siliguri', sans-serif",
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'var(--ink)',
                    border: 'none',
                    borderBottom: '1px dashed var(--ink-border)',
                    background: 'transparent',
                    padding: '2px 0',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  value={byline}
                  onChange={(e) => setByline(e.target.value)}
                >
                  <option value="Staff Reporter">Staff Reporter</option>
                  <option value="খেলারদেশ প্রতিনিধি">খেলারদেশ প্রতিনিধি</option>
                  {composers.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  {byline && !['Staff Reporter', 'খেলারদেশ প্রতিনিধি', ...composers.map(c => c.name)].includes(byline) && (
                    <option value={byline}>{byline}</option>
                  )}
                </select>
              </div>
              <span className="text-[10px] text-[var(--ink-muted)] mt-1">আজ · এইমাত্র</span>
            </div>
          </div>

          <div className="text-[10px] text-[var(--ink-muted)] font-semibold uppercase" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {status === 'draft' ? 'Draft Mode' : 'Published'}
          </div>
        </div>

        {/* Paragraphs body contentEditable editor */}
        <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: '11px', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '8px' }}>
          নিবন্ধের মূল বিষয়বস্তু (ENTER প্রেস করে নতুন অনুচ্ছেদ শুরু করুন):
        </div>
        
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateBodyFromDOM(e.currentTarget.innerHTML)}
          style={{
            minHeight: '280px',
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: '19px',
            lineHeight: '1.75',
            color: 'var(--ink)',
            outline: 'none',
            border: '1.5px dashed var(--ink-border)',
            padding: '16px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-surface)'
          }}
          className="prose-field placeholder-editable"
          data-placeholder="এখন থেকে শুরু করুন"
        >
          {body ? (
            body.split(/\n\n+/).map((p, i) => (
              <div key={i} style={{ marginBottom: '1.6em' }}>{p}</div>
            ))
          ) : null}
        </div>

      </div>
    </div>
  );
}
