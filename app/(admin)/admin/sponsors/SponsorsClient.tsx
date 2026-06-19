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

  async function handleSaveBanner(placement: 'header-left' | 'header-right', newImageUrl: string, newCtaUrl: string) {
    const existing = sponsors.find((s) => s.placement === placement);
    const label = placement === 'header-left' ? 'Desktop Banner 1' : 'Desktop Banner 2';
    const displayOrder = placement === 'header-left' ? 1 : 2;

    if (!newCtaUrl || !newCtaUrl.trim()) {
      setError('Redirection link is required.');
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
          imageUrl: newImageUrl,
          ctaUrl: newCtaUrl,
          title: '',
          subtitle: '',
          ctaText: '',
          isActive: true,
          displayOrder
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

  async function handleDeleteBanner(placement: 'header-left' | 'header-right') {
    const existing = sponsors.find((s) => s.placement === placement);
    const label = placement === 'header-left' ? 'Desktop Banner 1' : 'Desktop Banner 2';
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

  const leftBanner = sponsors.find((s) => s.placement === 'header-left');
  const rightBanner = sponsors.find((s) => s.placement === 'header-right');

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
              Upload and crop the 2 desktop header banner ads that sit beside the logo.
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
              onSave={(img, link) => handleSaveBanner('header-left', img, link)}
              onDelete={() => handleDeleteBanner('header-left')}
              saving={savingId === 'header-left'}
            />

            {/* Banner 2 */}
            <BannerCropper 
              label="Desktop Banner 2 (Right Side)"
              placement="header-right"
              initialImageUrl={rightBanner?.imageUrl || ''}
              initialCtaUrl={rightBanner?.ctaUrl || ''}
              onSave={(img, link) => handleSaveBanner('header-right', img, link)}
              onDelete={() => handleDeleteBanner('header-right')}
              saving={savingId === 'header-right'}
            />

          </div>
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
  onSave: (imageUrl: string, ctaUrl: string) => Promise<void>;
  onDelete: () => Promise<void>;
  saving: boolean;
}

function BannerCropper({ label, placement, initialImageUrl, initialCtaUrl, onSave, onDelete, saving }: BannerCropperProps) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [ctaUrl, setCtaUrl] = useState(initialCtaUrl);
  const [fileSrc, setFileSrc] = useState<string | null>(null);
  const [imageRatio, setImageRatio] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setImageUrl(initialImageUrl);
    setCtaUrl(initialCtaUrl);
  }, [initialImageUrl, initialCtaUrl]);

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
    if (!ctaUrl || !ctaUrl.trim()) {
      alert('Redirection link is required.');
      return;
    }

    if (!fileSrc) {
      // Just save link/existing URL
      await onSave(imageUrl, ctaUrl);
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

            await onSave(uploadData.url, ctaUrl);
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

  const isSaveDisabled = saving || !ctaUrl || !ctaUrl.trim();

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
          Upload Banner Image
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
      <div>
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
            borderRadius: 4,
            marginBottom: 20
          }}
          required
        />

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

          {initialImageUrl && !fileSrc && (
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
