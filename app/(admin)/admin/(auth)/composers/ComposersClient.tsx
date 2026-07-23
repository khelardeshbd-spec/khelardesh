'use client';

import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Camera, Check } from 'lucide-react';

interface Composer {
  id: number;
  name: string;
  photoUrl?: string | null;
}

interface ComposersClientProps {
  initialComposers: Composer[];
}

export default function ComposersClient({ initialComposers }: ComposersClientProps) {
  const [composers, setComposers] = useState<Composer[]>(initialComposers);
  const [editingComposer, setEditingComposer] = useState<Composer | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  async function loadComposers() {
    try {
      const res = await fetch('/api/admin/composers');
      const data = await res.json() as any;
      setComposers(data.composers ?? []);
    } catch (err) {
      console.error(err);
      setError('Failed to refresh composers list');
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleUpload(file: File): Promise<string> {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json() as any;
    return data.url;
  }

  const resetForm = () => {
    setName('');
    setPhotoUrl('');
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = '';
    setEditingComposer(null);
    setShowForm(false);
    setError('');
  };

  const handleEditClick = (c: Composer) => {
    setEditingComposer(c);
    setName(c.name);
    setPhotoUrl(c.photoUrl || '');
    setPhotoPreview(c.photoUrl || null);
    setShowForm(true);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      let finalPhotoUrl = photoUrl;

      // Upload file if selected
      const fileInput = fileRef.current;
      if (fileInput?.files?.[0]) {
        finalPhotoUrl = await handleUpload(fileInput.files[0]);
      }

      const payload = {
        name: name.trim(),
        photoUrl: finalPhotoUrl || null
      };

      const url = editingComposer ? `/api/admin/composers/${editingComposer.id}` : '/api/admin/composers';
      const method = editingComposer ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json() as any;
        throw new Error(err.error || 'Failed to save composer');
      }

      await loadComposers();
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, compName: string) => {
    if (!confirm(`Are you sure you want to delete composer "${compName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/composers/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const err = await res.json() as any;
        throw new Error(err.error || 'Failed to delete composer');
      }

      await loadComposers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting composer');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--ink-border)]">
        <div>
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif", fontWeight: 800, fontSize: 28, color: 'var(--ink)' }}>
            Composers
          </h1>
          <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
            Manage the list of writers/composers. These will appear in the article composer byline dropdown.
          </p>
        </div>
        
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)} 
            className="admin-btn-primary flex items-center gap-2"
            style={{ height: 42 }}
          >
            <Plus size={16} />
            <span>Add Composer</span>
          </button>
        )}
      </div>

      {error && (
        <div style={{ color: '#C0392B', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, marginBottom: 20, padding: 12, backgroundColor: '#FDEDEC', borderRadius: 4 }}>
          {error}
        </div>
      )}

      {/* Form (Inline / Overlay style) */}
      {showForm && (
        <div 
          className="border p-6 mb-8" 
          style={{ 
            backgroundColor: 'var(--bg-surface)', 
            borderColor: 'var(--ink-border)', 
            borderRadius: 6 
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 16 }}>
              {editingComposer ? 'Edit Composer Profile' : 'Add New Composer'}
            </h3>
            <button onClick={resetForm} style={{ color: 'var(--ink-muted)' }}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* Photo Upload Box */}
              <div className="flex flex-col items-center justify-center">
                <span style={{ alignSelf: 'flex-start', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 600, color: 'var(--ink-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Profile Photo
                </span>
                
                <div 
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: '50%',
                    border: '1.5px dashed var(--ink-border)',
                    backgroundColor: 'var(--bg-page)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-center p-2 text-[var(--ink-ghost)]">
                      <Camera size={24} />
                      <span style={{ fontSize: 9, marginTop: 4, fontFamily: "'Hind Siliguri', sans-serif" }}>Upload Photo</span>
                    </div>
                  )}
                </div>
                
                <input 
                  type="file" 
                  ref={fileRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Name Details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 600, color: 'var(--ink-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                    Composer Name (English / Bengali)
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. সাজিদ রহমান"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--ink-border)' }}>
              <button 
                type="button" 
                onClick={resetForm} 
                className="admin-btn-secondary"
                style={{ height: 42 }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="admin-btn-primary flex items-center gap-1.5"
                style={{ height: 42 }}
                disabled={saving}
              >
                <Check size={16} />
                <span>{saving ? 'Saving...' : editingComposer ? 'Save Changes' : 'Create Composer'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Composers Table/List */}
      <div 
        className="border overflow-hidden" 
        style={{ 
          backgroundColor: 'var(--bg-surface)', 
          borderColor: 'var(--ink-border)', 
          borderRadius: 6 
        }}
      >
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ink-border)', backgroundColor: 'var(--bg-page)' }}>
                <th className="p-4 text-left" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--ink-muted)', width: 64 }}>
                  Photo
                </th>
                <th className="p-4 text-left" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--ink-muted)' }}>
                  Name
                </th>
                <th className="p-4 text-right" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--ink-muted)', width: 100 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {composers.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: 32, color: 'var(--ink-muted)', fontSize: 13 }}>
                    No composers added yet.
                  </td>
                </tr>
              ) : (
                composers.map((c) => (
                  <tr 
                    key={c.id} 
                    style={{ borderBottom: '0.5px solid var(--ink-border)' }} 
                    className="hover:bg-[var(--ink-ghost)] transition-colors"
                  >
                    <td className="p-4">
                      <div 
                        style={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%', 
                          backgroundColor: '#fafafa', 
                          border: '1px solid var(--ink-border)',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {c.photoUrl ? (
                          <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <Camera size={14} className="text-[var(--ink-ghost)]" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[var(--ink)] text-sm" lang="bn">
                      {c.name}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleEditClick(c)}
                          className="p-1 hover:bg-[var(--ink-ghost)] rounded transition-colors text-[var(--ink-muted)] hover:text-[var(--ink)]"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-1 hover:bg-[var(--ink-ghost)] rounded transition-colors text-[var(--ink-muted)] hover:text-[#C0392B]"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
