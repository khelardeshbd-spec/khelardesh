'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const SPORTS = ['football', 'cricket', 'basketball', 'tennis', 'f1', 'rugby', 'athletics', 'other'];

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
 * Edit Article — Section 11.3
 * Same layout as new, pre-populated with existing data
 * Save Draft / Publish Now / Delete buttons
 */
export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/admin/articles`)
      .then((r) => r.json())
      .then((data: any) => {
        const found = data.articles?.find((a: Article) => a.id === parseInt(params.id, 10));
        if (found) {
          setArticle(found);
          setMediaUrl(found.mediaUrl);
          setMediaType(found.mediaType as 'photo' | 'video');
        }
        setLoading(false);
      });
  }, [params.id]);

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
      const formData = new FormData(e.currentTarget);
      let finalMediaUrl = mediaUrl;

      if (fileRef.current?.files?.[0]) {
        finalMediaUrl = await handleUpload(fileRef.current.files[0]);
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
    <div style={{ padding: 24, color: 'var(--ink-muted)', fontFamily: "'Hind Siliguri', sans-serif" }}>Loading...</div>
  );
  if (!article) return (
    <div style={{ padding: 24, color: '#C0392B', fontFamily: "'Hind Siliguri', sans-serif" }}>Article not found.</div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className="flex items-center justify-between mb-8">
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif", fontWeight: 700, fontSize: 24, color: 'var(--ink)' }}>
            Edit Article
          </h1>
          <a href="/admin/articles" className="admin-btn-secondary">← Back</a>
        </div>

        {error && (
          <div style={{ color: '#C0392B', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="headline" className="admin-label">Headline (EN)</label>
            <input id="headline" name="headline" type="text" required className="admin-input" defaultValue={article.headline} lang="en" />
          </div>
          <div>
            <label htmlFor="headlineBn" className="admin-label">Headline (BN) — optional</label>
            {/* Accepts Unicode Bengali directly — Probhat/Avro keyboard supported */}
            <input id="headlineBn" name="headlineBn" type="text" className="admin-input" defaultValue={article.headlineBn ?? ''} lang="bn" />
          </div>
          <div>
            <label htmlFor="deck" className="admin-label">Deck</label>
            <input id="deck" name="deck" type="text" required className="admin-input" defaultValue={article.deck} />
          </div>
          <div>
            <label htmlFor="kicker" className="admin-label">Kicker</label>
            <input id="kicker" name="kicker" type="text" required className="admin-input" defaultValue={article.kicker} lang="bn" />
          </div>
          <div>
            <label htmlFor="byline" className="admin-label">Byline</label>
            <input id="byline" name="byline" type="text" className="admin-input" defaultValue={article.byline} />
          </div>
          <div>
            <label htmlFor="sport" className="admin-label">Sport</label>
            <select id="sport" name="sport" required className="admin-input" defaultValue={article.sport}>
              {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-label">Media Type</label>
            <div className="flex gap-4">
              {(['photo', 'video'] as const).map((mt) => (
                <label key={mt} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="mediaType" value={mt} checked={mediaType === mt} onChange={() => setMediaType(mt)} />
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink)' }}>
                    {mt.charAt(0).toUpperCase() + mt.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="admin-label">Upload New Media</label>
            <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.mp4" className="admin-input" style={{ paddingTop: 6 }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setMediaPreview(URL.createObjectURL(f)); }} />
            {mediaPreview && (
              <div className="mt-2" style={{ maxWidth: 240 }}>
                {mediaType === 'video' ? <video src={mediaPreview} controls style={{ width: '100%' }} /> : <img src={mediaPreview} alt="Preview" style={{ width: '100%' }} />}
              </div>
            )}
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, color: 'var(--ink-ghost)', marginTop: 4 }}>
              Current: {article.mediaUrl}
            </p>
            <input type="text" placeholder="Or paste URL" className="admin-input mt-1" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} />
          </div>
          <div>
            <label htmlFor="mediaCaption" className="admin-label">Media Caption — optional</label>
            <input id="mediaCaption" name="mediaCaption" type="text" className="admin-input" defaultValue={article.mediaCaption ?? ''} />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isLead" id="isLead" defaultChecked={article.isLead} />
              <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink)' }}>
                Pin as Lead Story
              </span>
            </label>
          </div>
          <div>
            <label htmlFor="body" className="admin-label">Body</label>
            <textarea id="body" name="body" required className="admin-textarea" defaultValue={article.body} />
          </div>
          <div className="flex gap-3 pt-2 flex-wrap">
            <button type="submit" className="admin-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <a href="/admin/articles" className="admin-btn-secondary">Cancel</a>
            <button type="button" onClick={handleDelete} className="admin-btn-danger">
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
