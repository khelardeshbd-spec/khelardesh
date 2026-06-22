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
  useAdsterra?: boolean;
  adsterraCode?: string | null;
}

export default function SponsorsClient() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSponsors();
  }, []);

  async function loadSponsors() {
    try {
      const res = await fetch('/api/admin/sponsors');
      const data = await res.json() as any;
      setSponsors(data.sponsors ?? []);
    } catch (err) {
      console.error(err);
      setError('Failed to load sponsors');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveBanner(
    placement: 'header-left' | 'header-right' | 'homepage-banner-1' | 'homepage-banner-2' | 'homepage-banner-3' | 'homepage-banner-4' | 'homepage-banner-5' | 'homepage-banner-6',
    newImageUrl: string,
    newCtaUrl: string,
    newIsActive: boolean = true,
    useAdsterra: boolean = false
  ) {
    const existing = sponsors.find((s) => s.placement === placement);
    const labelMap: Record<string, string> = {
      'header-left': 'Desktop Banner 1',
      'header-right': 'Desktop Banner 2',
      'homepage-banner-1': 'Homepage Banner 1',
      'homepage-banner-2': 'Homepage Banner 2',
      'homepage-banner-3': 'Homepage Banner 3',
      'homepage-banner-4': 'Homepage Banner 4',
      'homepage-banner-5': 'Homepage Banner 5',
      'homepage-banner-6': 'Homepage Banner 6',
    };
    const orderMap: Record<string, number> = {
      'header-left': 1,
      'header-right': 2,
      'homepage-banner-1': 10,
      'homepage-banner-2': 11,
      'homepage-banner-3': 12,
      'homepage-banner-4': 13,
      'homepage-banner-5': 14,
      'homepage-banner-6': 15,
    };
    const label = labelMap[placement];
    const displayOrder = orderMap[placement];

    if (!useAdsterra && newImageUrl && (!newCtaUrl || !newCtaUrl.trim())) {
      setError('Redirection link is required for banner images.');
      return;
    }


    setSavingId(placement);
    setError('');
    try {
      const url = existing?.id ? `/api/admin/sponsors/${existing.id}` : '/api/admin/sponsors';
      const method = existing?.id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existing?.id,
          label,
          placement,
          imageUrl: useAdsterra ? '' : newImageUrl,
          ctaUrl: useAdsterra ? '' : newCtaUrl,
          title: '',
          subtitle: '',
          ctaText: '',
          isActive: newIsActive,
          displayOrder,
          useAdsterra,
          adsterraCode: ''
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
      setSavingId(null);
    }
  }

  async function handleDeleteBanner(
    placement: 'header-left' | 'header-right' | 'homepage-banner-1' | 'homepage-banner-2' | 'homepage-banner-3' | 'homepage-banner-4' | 'homepage-banner-5' | 'homepage-banner-6'
  ) {
    const existing = sponsors.find((s) => s.placement === placement);
    const label = {
      'header-left': 'Desktop Banner 1',
      'header-right': 'Desktop Banner 2',
      'homepage-banner-1': 'Homepage Banner 1',
      'homepage-banner-2': 'Homepage Banner 2',
      'homepage-banner-3': 'Homepage Banner 3',
      'homepage-banner-4': 'Homepage Banner 4',
      'homepage-banner-5': 'Homepage Banner 5',
      'homepage-banner-6': 'Homepage Banner 6',
    }[placement] ?? placement;
    if (!existing || !existing.id) {
      alert('Banner is already empty!');
      return;
    }

    if (!confirm(`Are you sure you want to empty ${label}? This will remove the image and redirection link.`)) {
      return;
    }

    setSavingId(placement);
    setError('');
    try {
      const res = await fetch(`/api/admin/sponsors/${existing.id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const err = await res.json() as any;
        throw new Error(err.error);
      }

      await loadSponsors();
      alert(`${label} emptied successfully!`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error emptying banner');
    } finally {
      setSavingId(null);
    }
  }

  async function handleToggleBanner(
    placement: 'homepage-banner-1' | 'homepage-banner-2' | 'homepage-banner-3' | 'homepage-banner-4' | 'homepage-banner-5' | 'homepage-banner-6',
    newIsActive: boolean
  ) {
    const existing = sponsors.find((s) => s.placement === placement);
    const labelMap: Record<string, string> = {
      'homepage-banner-1': 'Homepage Banner 1', 'homepage-banner-2': 'Homepage Banner 2',
      'homepage-banner-3': 'Homepage Banner 3', 'homepage-banner-4': 'Homepage Banner 4',
      'homepage-banner-5': 'Homepage Banner 5', 'homepage-banner-6': 'Homepage Banner 6',
    };
    const orderMap: Record<string, number> = {
      'homepage-banner-1': 10, 'homepage-banner-2': 11, 'homepage-banner-3': 12,
      'homepage-banner-4': 13, 'homepage-banner-5': 14, 'homepage-banner-6': 15,
    };
    setSavingId(placement);
    try {
      const url = existing?.id ? `/api/admin/sponsors/${existing.id}` : '/api/admin/sponsors';
      const method = existing?.id ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existing?.id,
          label: labelMap[placement],
          placement,
          imageUrl: existing?.imageUrl || '',
          ctaUrl: existing?.ctaUrl || '',
          title: '', subtitle: '', ctaText: '',
          isActive: newIsActive,
          displayOrder: orderMap[placement],
          useAdsterra: existing?.useAdsterra || false,
          adsterraCode: ''
        })
      });
      await loadSponsors();
    } catch (err) {
      console.error('Toggle failed:', err);
    } finally {
      setSavingId(null);
    }
  }

  const leftBanner = sponsors.find((s) => s.placement === 'header-left');
  const rightBanner = sponsors.find((s) => s.placement === 'header-right');
  const hpBanner1 = sponsors.find((s) => s.placement === 'homepage-banner-1');
  const hpBanner2 = sponsors.find((s) => s.placement === 'homepage-banner-2');
  const hpBanner3 = sponsors.find((s) => s.placement === 'homepage-banner-3');
  const hpBanner4 = sponsors.find((s) => s.placement === 'homepage-banner-4');
  const hpBanner5 = sponsors.find((s) => s.placement === 'homepage-banner-5');
  const hpBanner6 = sponsors.find((s) => s.placement === 'homepage-banner-6');

  return (
    <div style={{ padding: '8px 4px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--ink-border)]">
          <div>
            <h1 style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif", fontWeight: 800, fontSize: 28, color: 'var(--ink)' }}>
              Sponsor Manager
            </h1>
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
              Upload and crop desktop logo banners or toggle Adsterra script ads.
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
            
            {/* Banner 1 */}
            <BannerCropper 
              label="Desktop Banner 1 (Left Side)"
              placement="header-left"
              initialImageUrl={leftBanner?.imageUrl || ''}
              initialCtaUrl={leftBanner?.ctaUrl || ''}
              initialUseAdsterra={leftBanner?.useAdsterra || false}
              onSave={(img, link, useAdsterra) => handleSaveBanner('header-left', img, link, true, useAdsterra)}
              onDelete={() => handleDeleteBanner('header-left')}
              saving={savingId === 'header-left'}
            />

            {/* Banner 2 */}
            <BannerCropper 
              label="Desktop Banner 2 (Right Side)"
              placement="header-right"
              initialImageUrl={rightBanner?.imageUrl || ''}
              initialCtaUrl={rightBanner?.ctaUrl || ''}
              initialUseAdsterra={rightBanner?.useAdsterra || false}
              onSave={(img, link, useAdsterra) => handleSaveBanner('header-right', img, link, true, useAdsterra)}
              onDelete={() => handleDeleteBanner('header-right')}
              saving={savingId === 'header-right'}
            />

          </div>
        )}

        {/* ───── Homepage Ad Banners ───── */}
        {!loading && (
          <>
            <div className="mt-12 mb-6 pb-4 border-b border-[var(--ink-border)]">
              <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 20, color: 'var(--ink)' }}>
                Homepage Ad Banners
              </h2>
              <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
                These leaderboard banners (728×90) appear above each content section on the homepage.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <HomepageBannerManager
                label="Homepage Banner 1 (ফুটবল section)"
                placement="homepage-banner-1"
                initialImageUrl={hpBanner1?.imageUrl || ''}
                initialCtaUrl={hpBanner1?.ctaUrl || ''}
                initialIsActive={hpBanner1?.isActive ?? true}
                initialUseAdsterra={hpBanner1?.useAdsterra || false}
                onSave={(img, link, active, useAdsterra) => handleSaveBanner('homepage-banner-1', img, link, active, useAdsterra)}
                onToggle={(active) => handleToggleBanner('homepage-banner-1', active)}
                onDelete={() => handleDeleteBanner('homepage-banner-1')}
                saving={savingId === 'homepage-banner-1'}
              />
              <HomepageBannerManager
                label="Homepage Banner 2 (ক্রিকেট section)"
                placement="homepage-banner-2"
                initialImageUrl={hpBanner2?.imageUrl || ''}
                initialCtaUrl={hpBanner2?.ctaUrl || ''}
                initialIsActive={hpBanner2?.isActive ?? true}
                initialUseAdsterra={hpBanner2?.useAdsterra || false}
                onSave={(img, link, active, useAdsterra) => handleSaveBanner('homepage-banner-2', img, link, active, useAdsterra)}
                onToggle={(active) => handleToggleBanner('homepage-banner-2', active)}
                onDelete={() => handleDeleteBanner('homepage-banner-2')}
                saving={savingId === 'homepage-banner-2'}
              />
              <HomepageBannerManager
                label="Homepage Banner 3 (ইন্টারভিউ section)"
                placement="homepage-banner-3"
                initialImageUrl={hpBanner3?.imageUrl || ''}
                initialCtaUrl={hpBanner3?.ctaUrl || ''}
                initialIsActive={hpBanner3?.isActive ?? true}
                initialUseAdsterra={hpBanner3?.useAdsterra || false}
                onSave={(img, link, active, useAdsterra) => handleSaveBanner('homepage-banner-3', img, link, active, useAdsterra)}
                onToggle={(active) => handleToggleBanner('homepage-banner-3', active)}
                onDelete={() => handleDeleteBanner('homepage-banner-3')}
                saving={savingId === 'homepage-banner-3'}
              />
              <HomepageBannerManager
                label="Homepage Banner 4 (ফিচার section)"
                placement="homepage-banner-4"
                initialImageUrl={hpBanner4?.imageUrl || ''}
                initialCtaUrl={hpBanner4?.ctaUrl || ''}
                initialIsActive={hpBanner4?.isActive ?? true}
                initialUseAdsterra={hpBanner4?.useAdsterra || false}
                onSave={(img, link, active, useAdsterra) => handleSaveBanner('homepage-banner-4', img, link, active, useAdsterra)}
                onToggle={(active) => handleToggleBanner('homepage-banner-4', active)}
                onDelete={() => handleDeleteBanner('homepage-banner-4')}
                saving={savingId === 'homepage-banner-4'}
              />
              <HomepageBannerManager
                label="Homepage Banner 5 (খেলার দেশ বিশেষ section)"
                placement="homepage-banner-5"
                initialImageUrl={hpBanner5?.imageUrl || ''}
                initialCtaUrl={hpBanner5?.ctaUrl || ''}
                initialIsActive={hpBanner5?.isActive ?? true}
                initialUseAdsterra={hpBanner5?.useAdsterra || false}
                onSave={(img, link, active, useAdsterra) => handleSaveBanner('homepage-banner-5', img, link, active, useAdsterra)}
                onToggle={(active) => handleToggleBanner('homepage-banner-5', active)}
                onDelete={() => handleDeleteBanner('homepage-banner-5')}
                saving={savingId === 'homepage-banner-5'}
              />
              <HomepageBannerManager
                label="Homepage Banner 6 (অতিথি কলাম section)"
                placement="homepage-banner-6"
                initialImageUrl={hpBanner6?.imageUrl || ''}
                initialCtaUrl={hpBanner6?.ctaUrl || ''}
                initialIsActive={hpBanner6?.isActive ?? true}
                initialUseAdsterra={hpBanner6?.useAdsterra || false}
                onSave={(img, link, active, useAdsterra) => handleSaveBanner('homepage-banner-6', img, link, active, useAdsterra)}
                onToggle={(active) => handleToggleBanner('homepage-banner-6', active)}
                onDelete={() => handleDeleteBanner('homepage-banner-6')}
                saving={savingId === 'homepage-banner-6'}
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
}

interface BannerCropperProps {
  label: string;
  placement: 'header-left' | 'header-right';
  initialImageUrl: string;
  initialCtaUrl: string;
  initialUseAdsterra: boolean;
    onSave: (imageUrl: string, ctaUrl: string, useAdsterra: boolean) => Promise<void>;
  onDelete: () => Promise<void>;
  saving: boolean;
}

function BannerCropper({ label, placement, initialImageUrl, initialCtaUrl, initialUseAdsterra, onSave, onDelete, saving }: BannerCropperProps) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [ctaUrl, setCtaUrl] = useState(initialCtaUrl);
  const [useAdsterra, setUseAdsterra] = useState(initialUseAdsterra);
    const [fileSrc, setFileSrc] = useState<string | null>(null);
  const [imageRatio, setImageRatio] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setImageUrl(initialImageUrl);
    setCtaUrl(initialCtaUrl);
    setUseAdsterra(initialUseAdsterra);
      }, [initialImageUrl, initialCtaUrl, initialUseAdsterra]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          setImageRatio(img.width / img.height);
          setFileSrc(reader.result as string);
          setZoom(1);
          setOffset({ x: 0, y: 0 });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!fileSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !fileSrc) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleUploadAndSave = async () => {
    if (useAdsterra) {
      await onSave('', '', true);
      return;
    }

    if (!ctaUrl || !ctaUrl.trim()) {
      alert('Redirection link is required.');
      return;
    }

    if (!fileSrc) {
      // Just save link/existing URL
      await onSave(imageUrl, ctaUrl, false);
      return;
    }

    const img = new Image();
    img.src = fileSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Exact aspect ratio matches 290x75 on frontend (at 2x resolution = 580x150)
      canvas.width = 580;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const imgRatio = img.width / img.height;
        let drawWidth = 580;
        let drawHeight = 150;

        // Calculate COVER size
        if (imgRatio > (580 / 150)) {
          drawWidth = 150 * imgRatio;
        } else {
          drawHeight = 580 / imgRatio;
        }

        const finalWidth = drawWidth * zoom;
        const finalHeight = drawHeight * zoom;

        // Visual preview box is 290px wide, 75px tall. Canvas is 2x resolution (580x150).
        const x = (580 - finalWidth) / 2 + (offset.x * 2);
        const y = (150 - finalHeight) / 2 + (offset.y * 2);

        ctx.drawImage(img, x, y, finalWidth, finalHeight);

        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const formData = new FormData();
          formData.append('file', blob, `${placement}-cropped.jpg`);

          try {
            const uploadRes = await fetch('/api/admin/upload', {
              method: 'POST',
              body: formData
            });
            const uploadData = await uploadRes.json();
            if (uploadData.error) throw new Error(uploadData.error);

            await onSave(uploadData.url, ctaUrl, false);
            setFileSrc(null); // Clear cropper after save
          } catch (err) {
            alert('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
          }
        }, 'image/jpeg', 0.9);
      }
    };
  };

  // Determine cover dimensions for the preview box (290x75)
  let previewImgWidth = 290;
  let previewImgHeight = 75;
  if (imageRatio) {
    if (imageRatio > (290 / 75)) {
      previewImgWidth = 75 * imageRatio;
    } else {
      previewImgHeight = 290 / imageRatio;
    }
  }

  const isSaveDisabled = saving || (!useAdsterra && (fileSrc || imageUrl) && (!ctaUrl || !ctaUrl.trim())) ? true : false;

  return (
    <section style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--ink-border)', borderRadius: 6, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
          {label}
        </h2>
        <span style={{ fontSize: 10, color: 'var(--ink-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
          {placement}
        </span>
      </div>

      {/* Adsterra Toggle */}
      <div className="mb-6 flex items-center justify-between p-3 bg-amber-50/50 border border-amber-200/50 rounded-md">
        <div>
          <span className="block text-xs font-bold text-amber-800">Use Adsterra ad</span>
          <span className="block text-[10px] text-amber-600">Automatically loads the Adsterra banner for this slot</span>
        </div>
        <div
          role="switch"
          aria-checked={useAdsterra}
          onClick={async () => {
            if (saving) return;
            const next = !useAdsterra;
            setUseAdsterra(next);
            await onSave(initialImageUrl, initialCtaUrl, next);
          }}
          style={{
            width: 42, height: 24, borderRadius: 12,
            backgroundColor: useAdsterra ? '#f59e0b' : '#ccc',
            position: 'relative', cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            flexShrink: 0
          }}
        >
          <div style={{
            width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff',
            position: 'absolute', top: 3,
            left: useAdsterra ? 21 : 3,
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
          }} />
        </div>
      </div>

      {!useAdsterra && (
        <>
          {/* Interactive Cropping Preview Area (matches exact 290px x 75px banner aspect ratio) */}
          <div 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            style={{ 
              height: 75, 
              width: 290, 
              backgroundColor: '#fafafa', 
              border: '1.5px dashed var(--ink-border)', 
              borderRadius: 3, 
              overflow: 'hidden', 
              position: 'relative',
              cursor: fileSrc ? (isDragging ? 'grabbing' : 'grab') : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              marginBottom: 20,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            {fileSrc ? (
              <img 
                src={fileSrc} 
                alt="Cropping in progress" 
                draggable={false}
                style={{ 
                  position: 'absolute',
                  width: previewImgWidth,
                  height: previewImgHeight,
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  maxWidth: 'none',
                  maxHeight: 'none'
                }} 
              />
            ) : imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Current Banner" 
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <div style={{ color: 'var(--ink-ghost)', fontSize: 10, textAlign: 'center', fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 600 }}>
                <span>বিজ্ঞাপন দিন (290x75)</span>
              </div>
            )}

            {/* Overlay indicator */}
            {fileSrc && (
              <div style={{ position: 'absolute', bottom: 4, right: 6, backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 8, padding: '2px 4px', borderRadius: 2, pointerEvents: 'none' }}>
                DRAG TO ADJUST
              </div>
            )}
          </div>

          {/* Image selector */}
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 6 }}>
              Upload Banner Image <span style={{ color: 'var(--ink-ghost)', textTransform: 'none' }}>(Recommended 290×75 px)</span>
            </span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, width: '100%' }}
            />
          </div>

          {/* Zoom controls */}
          {fileSrc && (
            <div style={{ marginBottom: 16 }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 4 }}>
                <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Zoom Scale</span>
                <span style={{ fontSize: 11, fontWeight: 600 }}>{zoom.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="0.02" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))} 
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          )}

          {/* Redirect link */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 6 }}>
              Redirection Link (Background Link)
            </span>
            <input 
              type="url" 
              value={ctaUrl} 
              onChange={(e) => setCtaUrl(e.target.value)} 
              placeholder="https://target-advertiser.com" 
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                border: '1px solid var(--ink-border)', 
                background: 'var(--bg-surface)', 
                color: 'var(--ink)', 
                fontFamily: "'Hind Siliguri', sans-serif", 
                fontSize: 13, 
                borderRadius: 4
              }}
              required
            />
          </div>
        </>
      )}

      <div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button 
              onClick={handleUploadAndSave} 
              className="admin-btn-primary" 
              style={{ 
                flex: 1, 
                height: 42, 
                fontSize: 13, 
                fontWeight: 600,
                opacity: isSaveDisabled ? 0.5 : 1,
                cursor: isSaveDisabled ? 'not-allowed' : 'pointer'
              }}
              disabled={isSaveDisabled}
            >
              {saving ? 'Saving...' : fileSrc ? 'Crop & Save Banner' : 'Update Redirect Link'}
            </button>
            {fileSrc && (
              <button 
                onClick={() => { setFileSrc(null); setImageRatio(null); }} 
                className="admin-btn-secondary"
                style={{ height: 42 }}
              >
                Cancel Crop
              </button>
            )}
          </div>

          {(initialImageUrl || initialUseAdsterra) && !fileSrc && (
            <button 
              type="button"
              onClick={onDelete}
              className="admin-btn-secondary"
              style={{ 
                width: '100%', 
                height: 42, 
                fontSize: 13, 
                fontWeight: 600, 
                color: '#C0392B', 
                borderColor: '#C0392B',
                opacity: saving ? 0.5 : 1,
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
              disabled={saving}
            >
              {saving ? 'Please wait...' : 'Empty Banner'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

interface HomepageBannerManagerProps {
  label: string;
  placement: string;
  initialImageUrl: string;
  initialCtaUrl: string;
  initialIsActive: boolean;
  initialUseAdsterra: boolean;
    onSave: (imageUrl: string, ctaUrl: string, isActive: boolean, useAdsterra: boolean) => Promise<void>;
  onToggle: (isActive: boolean) => Promise<void>;
  onDelete: () => Promise<void>;
  saving: boolean;
}

function HomepageBannerManager({ label, placement, initialImageUrl, initialCtaUrl, initialIsActive, initialUseAdsterra, onSave, onToggle, onDelete, saving }: HomepageBannerManagerProps) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [ctaUrl, setCtaUrl] = useState(initialCtaUrl);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [useAdsterra, setUseAdsterra] = useState(initialUseAdsterra);
    const [fileSrc, setFileSrc] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  // Cropping states
  const [imageRatio, setImageRatio] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setImageUrl(initialImageUrl);
    setCtaUrl(initialCtaUrl);
    setIsActive(initialIsActive);
    setUseAdsterra(initialUseAdsterra);
      }, [initialImageUrl, initialCtaUrl, initialIsActive, initialUseAdsterra]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          setImageRatio(img.width / img.height);
          setFileSrc(reader.result as string);
          setZoom(1);
          setOffset({ x: 0, y: 0 });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!fileSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !fileSrc) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleToggleClick = async () => {
    if (toggling || saving) return;
    const next = !isActive;
    setIsActive(next); // optimistic update
    setToggling(true);
    try {
      await onToggle(next);
    } catch {
      setIsActive(!next); // revert on failure
    } finally {
      setToggling(false);
    }
  };

  const handleSave = async () => {
    if (useAdsterra) {
      await onSave('', '', isActive, true);
      return;
    }

    if (!ctaUrl || !ctaUrl.trim()) { alert('Redirection link is required.'); return; }

    if (!fileSrc) {
      await onSave(imageUrl, ctaUrl, isActive, false);
      return;
    }

    const img = new Image();
    img.src = fileSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1456;
      canvas.height = 180;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const imgRatio = img.width / img.height;
        let drawWidth = 1456;
        let drawHeight = 180;

        if (imgRatio > (1456 / 180)) {
          drawWidth = 180 * imgRatio;
        } else {
          drawHeight = 1456 / imgRatio;
        }

        const finalWidth = drawWidth * zoom;
        const finalHeight = drawHeight * zoom;

        // Visual preview box is 728px wide, 90px tall. Canvas is 2x resolution (1456x180).
        const x = (1456 - finalWidth) / 2 + (offset.x * 2);
        const y = (180 - finalHeight) / 2 + (offset.y * 2);

        ctx.drawImage(img, x, y, finalWidth, finalHeight);

        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const formData = new FormData();
          formData.append('file', blob, `${placement}-banner.jpg`);
          try {
            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            await onSave(data.url, ctaUrl, isActive, false);
            setFileSrc(null);
          } catch (err) { alert('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown')); }
        }, 'image/jpeg', 0.92);
      }
    };
  };

  const isBusy = saving || toggling;

  // Determine cover dimensions for the preview box (728x90)
  let previewImgWidth = 728;
  let previewImgHeight = 90;
  if (imageRatio) {
    if (imageRatio > (728 / 90)) {
      previewImgWidth = 90 * imageRatio;
    } else {
      previewImgHeight = 728 / imageRatio;
    }
  }

  const isSaveDisabled = saving || (!useAdsterra && (fileSrc || imageUrl) && (!ctaUrl || !ctaUrl.trim())) ? true : false;

  return (
    <section style={{
      backgroundColor: 'var(--bg-surface)',
      border: `1.5px solid ${isActive ? 'var(--ink-border)' : '#e0a800'}`,
      borderRadius: 6,
      padding: '24px',
      opacity: isBusy ? 0.85 : 1,
      transition: 'border-color 0.2s, opacity 0.2s'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: 'var(--ink)', margin: 0 }}>{label}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Visibility Toggle — auto-saves on click */}
          <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 600, color: isActive ? '#27AE60' : '#999', textTransform: 'uppercase' }}>
            {toggling ? '...' : isActive ? 'Visible' : 'Hidden'}
          </span>
          <div
            role="switch"
            aria-checked={isActive}
            onClick={handleToggleClick}
            style={{
              width: 42, height: 24, borderRadius: 12,
              backgroundColor: isActive ? '#27AE60' : '#ccc',
              position: 'relative', cursor: isBusy ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              flexShrink: 0
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff',
              position: 'absolute', top: 3,
              left: isActive ? 21 : 3,
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
            }} />
          </div>
          <span style={{ fontSize: 10, color: 'var(--ink-muted)', fontWeight: 600, textTransform: 'uppercase', marginLeft: 4 }}>{placement}</span>
        </div>
      </div>

      {/* Adsterra Toggle */}
      <div className="mb-6 flex items-center justify-between p-3 bg-amber-50/50 border border-amber-200/50 rounded-md">
        <div>
          <span className="block text-xs font-bold text-amber-800">Use Adsterra ad</span>
          <span className="block text-[10px] text-amber-600">Automatically loads the Adsterra banner for this slot</span>
        </div>
        <div
          role="switch"
          aria-checked={useAdsterra}
          onClick={async () => {
            if (saving) return;
            const next = !useAdsterra;
            setUseAdsterra(next);
            await onSave(initialImageUrl, initialCtaUrl, isActive, next);
          }}
          style={{
            width: 42, height: 24, borderRadius: 12,
            backgroundColor: useAdsterra ? '#f59e0b' : '#ccc',
            position: 'relative', cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            flexShrink: 0
          }}
        >
          <div style={{
            width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff',
            position: 'absolute', top: 3,
            left: useAdsterra ? 21 : 3,
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
          }} />
        </div>
      </div>

      {!useAdsterra && (
        <>
          {/* Interactive Cropping Preview Area (matches exact 728px x 90px banner aspect ratio) */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            style={{
              width: '100%',
              maxWidth: 728,
              height: 90,
              backgroundColor: '#f5f5f5',
              border: '1.5px dashed var(--ink-border)',
              borderRadius: 3,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: fileSrc ? (isDragging ? 'grabbing' : 'grab') : 'default',
              userSelect: 'none',
              marginBottom: 20
            }}
          >
            {fileSrc ? (
              <img
                src={fileSrc}
                alt="Cropping in progress"
                draggable={false}
                style={{
                  position: 'absolute',
                  width: previewImgWidth,
                  height: previewImgHeight,
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  maxWidth: 'none',
                  maxHeight: 'none'
                }}
              />
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="Current Banner"
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ color: 'var(--ink-ghost)', fontSize: 11, fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 600 }}>
                বিজ্ঞাপন প্রিভিউ (728×90)
              </span>
            )}

            {/* Overlay indicator */}
            {fileSrc && (
              <div style={{ position: 'absolute', bottom: 4, right: 6, backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 8, padding: '2px 4px', borderRadius: 2, pointerEvents: 'none' }}>
                DRAG TO ADJUST
              </div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 6 }}>
              Upload Banner Image <span style={{ color: 'var(--ink-ghost)', textTransform: 'none' }}>(Recommended 728×90 px)</span>
            </span>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, width: '100%' }} />
          </div>

          {/* Zoom controls */}
          {fileSrc && (
            <div style={{ marginBottom: 16 }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 4 }}>
                <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Zoom Scale</span>
                <span style={{ fontSize: 11, fontWeight: 600 }}>{zoom.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.02"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 6 }}>
              Redirection Link
            </span>
            <input
              type="url"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="https://target-advertiser.com"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--ink-border)', background: 'var(--bg-surface)', color: 'var(--ink)', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, borderRadius: 4 }}
            />
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleSave}
          className="admin-btn-primary"
          disabled={isSaveDisabled}
          style={{ flex: 1, height: 42, fontSize: 13, fontWeight: 600, opacity: isSaveDisabled ? 0.5 : 1, cursor: isSaveDisabled ? 'not-allowed' : 'pointer' }}
        >
          {saving ? 'Saving...' : fileSrc ? 'Upload & Save' : 'Update Redirect Link'}
        </button>
        {fileSrc && (
          <button onClick={() => setFileSrc(null)} className="admin-btn-secondary" style={{ height: 42 }}>Cancel</button>
        )}
        {(initialImageUrl || initialUseAdsterra) && !fileSrc && (
          <button onClick={onDelete} className="admin-btn-secondary" disabled={saving} style={{ height: 42, color: '#C0392B', borderColor: '#C0392B', opacity: saving ? 0.5 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? '...' : 'Empty'}
          </button>
        )}
      </div>
    </section>
  );
}


