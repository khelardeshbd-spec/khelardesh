'use client';

import { useState, useEffect } from 'react';

interface Sponsor {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  placement: string;
  isActive: boolean;
  displayOrder: number;
  imageUrl?: string | null;
}

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Simplified states for Banner 1 and Banner 2
  const [banner1, setBanner1] = useState({ id: null as number | null, imageUrl: '', ctaUrl: '' });
  const [banner2, setBanner2] = useState({ id: null as number | null, imageUrl: '', ctaUrl: '' });

  useEffect(() => {
    loadSponsors();
  }, []);

  async function loadSponsors() {
    try {
      const res = await fetch('/api/admin/sponsors');
      const data = await res.json() as any;
      const list = data.sponsors ?? [];
      setSponsors(list);

      // Find the existing banners
      const b1 = list.find((s: Sponsor) => s.placement === 'header-left');
      if (b1) {
        setBanner1({ id: b1.id, imageUrl: b1.imageUrl || '', ctaUrl: b1.ctaUrl || '' });
      } else {
        setBanner1({ id: null, imageUrl: '', ctaUrl: '' });
      }

      const b2 = list.find((s: Sponsor) => s.placement === 'header-right');
      if (b2) {
        setBanner2({ id: b2.id, imageUrl: b2.imageUrl || '', ctaUrl: b2.ctaUrl || '' });
      } else {
        setBanner2({ id: null, imageUrl: '', ctaUrl: '' });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load sponsors');
    } finally {
      setLoading(false);
    }
  }

  async function saveBanner(bannerNum: 1 | 2) {
    const banner = bannerNum === 1 ? banner1 : banner2;
    const placement = bannerNum === 1 ? 'header-left' : 'header-right';
    const label = bannerNum === 1 ? 'Desktop Banner 1' : 'Desktop Banner 2';

    setSaving(bannerNum);
    setError('');
    try {
      const url = banner.id ? `/api/admin/sponsors/${banner.id}` : '/api/admin/sponsors';
      const method = banner.id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: banner.id,
          label,
          placement,
          imageUrl: banner.imageUrl,
          ctaUrl: banner.ctaUrl,
          title: '',
          subtitle: '',
          ctaText: '',
          isActive: true,
          displayOrder: bannerNum
        })
      });

      if (!res.ok) {
        const err = await res.json() as any;
        throw new Error(err.error);
      }

      await loadSponsors();
      alert(`${label} saved successfully!`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error saving banner');
    } finally {
      setSaving(null);
    }
  }

  const labelStyle = { 
    fontFamily: "'Hind Siliguri', sans-serif", 
    fontSize: 11, 
    fontWeight: 600, 
    textTransform: 'uppercase' as const, 
    color: 'var(--ink-muted)', 
    display: 'block', 
    marginBottom: 6 
  };

  const inputStyle = { 
    width: '100%', 
    padding: '10px 12px', 
    border: '1px solid var(--ink-border)', 
    background: 'var(--bg-surface)', 
    color: 'var(--ink)', 
    fontFamily: "'Hind Siliguri', sans-serif", 
    fontSize: 13, 
    borderRadius: 4,
    marginBottom: 16
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--ink-border)]">
          <div>
            <h1 style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif", fontWeight: 800, fontSize: 28, color: 'var(--ink)' }}>
              Sponsor Manager
            </h1>
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
              Manage the 2 desktop header banner ads that sit beside the logo.
            </p>
          </div>
          <a href="/admin/dashboard" className="admin-btn-secondary">← Dashboard</a>
        </div>

        {error && (
          <div style={{ color: '#C0392B', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, marginBottom: 20, padding: 12, backgroundColor: '#FDEDEC', borderRadius: 4 }}>
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ color: 'var(--ink-muted)', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13 }}>Loading banners...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            
            {/* Desktop Banner 1 */}
            <section style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--ink-border)', borderRadius: 6, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
                  Desktop Banner 1 (Left Side)
                </h2>
                <span style={{ fontSize: 10, color: 'var(--ink-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Placement: header-left
                </span>
              </div>

              <div style={{ 
                height: 75, 
                width: '100%', 
                backgroundColor: 'var(--bg-page)', 
                border: '1.5px dashed var(--ink-border)', 
                borderRadius: 4, 
                overflow: 'hidden', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: 20 
              }}>
                {banner1.imageUrl ? (
                  <img 
                    src={banner1.imageUrl} 
                    alt="Desktop Banner 1 Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'var(--ink-ghost)', fontSize: 11, fontFamily: "'Hind Siliguri', sans-serif" }}>
                    <span>NO IMAGE</span>
                    <span style={{ fontSize: 9, marginTop: 2 }}>Crops to 75px height automatically</span>
                  </div>
                )}
              </div>

              {/* Form Controls */}
              <div>
                <label style={labelStyle}>Banner Image URL</label>
                <input 
                  type="url" 
                  style={inputStyle} 
                  value={banner1.imageUrl} 
                  onChange={(e) => setBanner1({ ...banner1, imageUrl: e.target.value })} 
                  placeholder="https://example.com/banner-left.jpg" 
                />

                <label style={labelStyle}>Redirection Link (Background Link)</label>
                <input 
                  type="url" 
                  style={inputStyle} 
                  value={banner1.ctaUrl} 
                  onChange={(e) => setBanner1({ ...banner1, ctaUrl: e.target.value })} 
                  placeholder="https://target-advertiser.com" 
                />

                <button 
                  onClick={() => saveBanner(1)} 
                  className="admin-btn-primary" 
                  style={{ width: '100%', height: 42, fontSize: 13, fontWeight: 600 }}
                  disabled={saving !== null}
                >
                  {saving === 1 ? 'Saving Banner 1...' : 'Save Desktop Banner 1'}
                </button>
              </div>
            </section>

            {/* Desktop Banner 2 */}
            <section style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--ink-border)', borderRadius: 6, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
                  Desktop Banner 2 (Right Side)
                </h2>
                <span style={{ fontSize: 10, color: 'var(--ink-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Placement: header-right
                </span>
              </div>

              <div style={{ 
                height: 75, 
                width: '100%', 
                backgroundColor: 'var(--bg-page)', 
                border: '1.5px dashed var(--ink-border)', 
                borderRadius: 4, 
                overflow: 'hidden', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: 20 
              }}>
                {banner2.imageUrl ? (
                  <img 
                    src={banner2.imageUrl} 
                    alt="Desktop Banner 2 Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'var(--ink-ghost)', fontSize: 11, fontFamily: "'Hind Siliguri', sans-serif" }}>
                    <span>NO IMAGE</span>
                    <span style={{ fontSize: 9, marginTop: 2 }}>Crops to 75px height automatically</span>
                  </div>
                )}
              </div>

              {/* Form Controls */}
              <div>
                <label style={labelStyle}>Banner Image URL</label>
                <input 
                  type="url" 
                  style={inputStyle} 
                  value={banner2.imageUrl} 
                  onChange={(e) => setBanner2({ ...banner2, imageUrl: e.target.value })} 
                  placeholder="https://example.com/banner-right.jpg" 
                />

                <label style={labelStyle}>Redirection Link (Background Link)</label>
                <input 
                  type="url" 
                  style={inputStyle} 
                  value={banner2.ctaUrl} 
                  onChange={(e) => setBanner2({ ...banner2, ctaUrl: e.target.value })} 
                  placeholder="https://target-advertiser.com" 
                />

                <button 
                  onClick={() => saveBanner(2)} 
                  className="admin-btn-primary" 
                  style={{ width: '100%', height: 42, fontSize: 13, fontWeight: 600 }}
                  disabled={saving !== null}
                >
                  {saving === 2 ? 'Saving Banner 2...' : 'Save Desktop Banner 2'}
                </button>
              </div>
            </section>

          </div>
        )}

      </div>
    </div>
  );
}
