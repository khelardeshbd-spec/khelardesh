'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Search, ChevronUp, ChevronDown, Plus, ExternalLink, Pencil, MoreVertical } from 'lucide-react';
import ClientFormattedDate from '@/components/frontend/ClientFormattedDate';

interface Article {
  id: number;
  slug: string;
  headline: string;
  headlineBn?: string | null;
  sport: string;
  isLead: boolean;
  publishedAt: string;
  byline: string;
  views: number;
  status?: string;
  mediaUrl?: string;
}

interface ArticlesClientProps {
  initialArticles: Article[];
}

// Fixed-position dropdown menu that escapes overflow:hidden containers
function FixedDropdown({
  anchorRef,
  onClose,
  children,
}: {
  anchorRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [anchorRef]);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 w-36 bg-white border border-[var(--ink-border)] rounded-md shadow-xl py-1 text-left"
        style={{ top: pos.top, right: pos.right }}
      >
        {children}
      </div>
    </>
  );
}

function getSportLabel(sport: string) {
  const maps: Record<string, string> = {
    football: 'ফুটবল',
    'bd-football': 'দেশের ফুটবল',
    'club-football': 'ক্লাব ফুটবল',
    'international-football': 'আন্তর্জাতিক ফুটবল',
    cricket: 'ক্রিকেট',
    'bd-cricket': 'বাংলাদেশের ক্রিকেট',
    basketball: 'বাস্কেটবল',
    tennis: 'টেনিস',
    f1: 'ফর্মুলা ওয়ান',
    interview: 'ইন্টারভিউ',
    feature: 'ফিচার',
    special: 'বিশেষ',
    'guest-column': 'অতিথি কলাম',
    'did-you-know': 'আপনি জানেন কি?',
    'on-this-day': 'এই দিনে',
    other: 'অন্যান্য'
  };
  return maps[sport] || sport.toUpperCase();
}

function ArticleRow({
  art,
  canEditDrafts,
  canEditPublished,
  canEditArchives,
  canDeleteDrafts,
  canDeletePublished,
  canDeleteArchives,
  onUpdateStatus,
  onDelete
}: {
  art: Article;
  canEditDrafts: boolean;
  canEditPublished: boolean;
  canEditArchives: boolean;
  canDeleteDrafts: boolean;
  canDeletePublished: boolean;
  canDeleteArchives: boolean;
  onUpdateStatus: (art: Article, status: string) => void;
  onDelete: (id: number) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  const isDraft = art.status === 'draft';
  const isArchived = art.status === 'archived';
  const canEdit = isDraft ? canEditDrafts : isArchived ? canEditArchives : canEditPublished;
  const canDelete = isDraft ? canDeleteDrafts : isArchived ? canDeleteArchives : canDeletePublished;

  return (
    <tr style={{ borderBottom: '0.5px solid var(--ink-border)' }} className="hover:bg-[var(--ink-ghost)] transition-colors">
      <td className="p-4 max-w-sm">
        <div className="flex gap-4 items-start">
          {art.mediaUrl ? (
            <div className="w-16 h-12 flex-shrink-0 bg-[var(--ink-ghost)] rounded overflow-hidden mt-0.5">
              <img src={art.mediaUrl} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-12 flex-shrink-0 bg-[var(--ink-ghost)] rounded overflow-hidden mt-0.5 flex items-center justify-center">
              <span className="text-[10px] text-[var(--ink-muted)]">No Image</span>
            </div>
          )}
          <div className="flex flex-col">
            <Link href={`/admin/articles/${art.id}`} className="font-bold text-[var(--ink)] hover:underline leading-snug text-sm" lang="bn">
            {art.headlineBn || art.headline}
          </Link>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {art.status === 'draft' ? (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#7F8C8D] text-white uppercase tracking-wider" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                Draft
              </span>
            ) : art.status === 'archived' ? (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#9B59B6] text-white uppercase tracking-wider" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                Archived
              </span>
            ) : art.status === 'deleted' ? (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-red-600 text-white uppercase tracking-wider" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                Deleted
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#27AE60] text-white uppercase tracking-wider" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                Live
              </span>
            )}
            {art.isLead && (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#E74C3C] text-white uppercase tracking-wider" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                Lead Story
              </span>
            )}
          </div>
        </div>
        </div>
      </td>
      <td className="p-4 text-xs font-semibold text-[var(--ink-muted)]">
        {getSportLabel(art.sport)}
      </td>
      <td className="p-4 text-xs text-[var(--ink-muted)]">
        {art.byline}
      </td>
      <td className="p-4 text-right text-xs font-bold text-[var(--ink)]">
        {(art.views ?? 0).toLocaleString()}
      </td>
      <td className="p-4 text-right text-xs text-[var(--ink-muted)] whitespace-nowrap">
        <ClientFormattedDate date={art.publishedAt} mode="both" lang="bn" options={{ dateStyle: 'medium', timeStyle: 'short' }} />
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-3 relative">
          {canEdit && (
            <Link href={`/admin/articles/${art.id}`} className="p-1 hover:bg-[var(--ink-ghost)] rounded transition-colors text-[var(--ink-muted)] hover:text-[var(--ink)]" title="Edit">
              <Pencil size={14} />
            </Link>
          )}
          <Link href={`/article/${art.slug}`} target="_blank" className="p-1 hover:bg-[var(--ink-ghost)] rounded transition-colors text-[var(--ink-muted)] hover:text-[var(--ink)]" title="View Live">
            <ExternalLink size={14} />
          </Link>
          
          {(canEdit || canDelete) && (
            <div className="relative">
              <button
                ref={btn}
                onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                className="p-1 hover:bg-[var(--ink-ghost)] rounded transition-colors text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
                title="More Actions"
              >
                <MoreVertical size={14} />
              </button>
              
              {menuOpen && (
                <FixedDropdown anchorRef={btn} onClose={() => setMenuOpen(false)}>
                  {canEdit && (
                    <>
                      {art.status === 'draft' && (
                        <>
                          <button onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await onUpdateStatus(art, 'published'); setMenuOpen(false); }} className="w-full px-3 py-2 text-xs text-left hover:bg-[var(--ink-ghost)] flex items-center gap-2 text-slate-700 border-none bg-transparent cursor-pointer font-semibold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>Publish</button>
                          <button onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await onUpdateStatus(art, 'archived'); setMenuOpen(false); }} className="w-full px-3 py-2 text-xs text-left hover:bg-[var(--ink-ghost)] flex items-center gap-2 text-slate-700 border-none bg-transparent cursor-pointer font-semibold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>Archive</button>
                        </>
                      )}
                      {(art.status === 'published' || !art.status) && (
                        <>
                          <button onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await onUpdateStatus(art, 'draft'); setMenuOpen(false); }} className="w-full px-3 py-2 text-xs text-left hover:bg-[var(--ink-ghost)] flex items-center gap-2 text-slate-700 border-none bg-transparent cursor-pointer font-semibold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>Revert to Draft</button>
                          <button onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await onUpdateStatus(art, 'archived'); setMenuOpen(false); }} className="w-full px-3 py-2 text-xs text-left hover:bg-[var(--ink-ghost)] flex items-center gap-2 text-slate-700 border-none bg-transparent cursor-pointer font-semibold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>Archive</button>
                        </>
                      )}
                      {art.status === 'archived' && (
                        <>
                          <button onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await onUpdateStatus(art, 'published'); setMenuOpen(false); }} className="w-full px-3 py-2 text-xs text-left hover:bg-[var(--ink-ghost)] flex items-center gap-2 text-slate-700 border-none bg-transparent cursor-pointer font-semibold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>Publish</button>
                          <button onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await onUpdateStatus(art, 'draft'); setMenuOpen(false); }} className="w-full px-3 py-2 text-xs text-left hover:bg-[var(--ink-ghost)] flex items-center gap-2 text-slate-700 border-none bg-transparent cursor-pointer font-semibold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>Restore to Draft</button>
                        </>
                      )}
                      {art.status === 'deleted' && (
                        <>
                          <button onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await onUpdateStatus(art, 'draft'); setMenuOpen(false); }} className="w-full px-3 py-2 text-xs text-left hover:bg-[var(--ink-ghost)] flex items-center gap-2 text-green-700 border-none bg-transparent cursor-pointer font-semibold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>Restore to Draft</button>
                          <button onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await onUpdateStatus(art, 'published'); setMenuOpen(false); }} className="w-full px-3 py-2 text-xs text-left hover:bg-[var(--ink-ghost)] flex items-center gap-2 text-green-700 border-none bg-transparent cursor-pointer font-semibold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>Restore & Publish</button>
                        </>
                      )}
                    </>
                  )}
                  {canDelete && (
                    <button
                      onClick={async (e) => { 
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        const msg = art.status === 'deleted' 
                          ? 'নিবন্ধটি চিরতরে মুছে ফেলতে চান? এটি আর পুনরুদ্ধার করা যাবে না।' 
                          : 'নিবন্ধটি মুছে ফেলতে চান? এটি সাময়িকভাবে "Recently Deleted" ট্যাবে জমা থাকবে।';
                        if (window.confirm(msg)) {
                          await onDelete(art.id); 
                          setMenuOpen(false);
                        }
                      }}
                      className="w-full px-3 py-2 text-xs text-left hover:bg-red-50 flex items-center gap-2 text-red-600 border-none bg-transparent cursor-pointer font-semibold"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      {art.status === 'deleted' ? 'Delete Permanently' : 'Delete'}
                    </button>
                  )}
                </FixedDropdown>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function ArticlesClient({ initialArticles }: ArticlesClientProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'publishedAt' | 'headline' | 'sport' | 'views'>('publishedAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived' | 'deleted'>('all');

  const { data: session } = useSession();
  const user = session?.user as any;
  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  const perms = user?.permissions || {};

  const canWriteArticles = isSuperAdmin || !!perms.write_articles;
  const canEditPublished = isSuperAdmin || !!perms.edit_published_articles;
  const canEditDrafts = isSuperAdmin || !!perms.edit_drafts;
  const canEditArchives = isSuperAdmin || !!perms.edit_archives;
  const canDeletePublished = isSuperAdmin || !!perms.delete_articles;
  const canDeleteDrafts = isSuperAdmin || !!perms.delete_drafts;
  const canDeleteArchives = isSuperAdmin || !!perms.delete_archives;

  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  const handleUpdateStatus = async (article: Article, newStatus: string) => {
    try {
      const resGet = await fetch(`/api/admin/articles/${article.id}`);
      if (!resGet.ok) throw new Error('Failed to fetch article details');
      const { article: fullArticle } = await resGet.json();
      
      const payload = {
        ...fullArticle,
        status: newStatus,
      };
      
      const resPut = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resPut.ok) throw new Error('Failed to update article status');
      
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const handleDelete = async (id: number) => {
    const article = articles.find(a => a.id === id);
    const isAlreadyDeleted = article?.status === 'deleted';

    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete article');
      
      if (isAlreadyDeleted) {
        setArticles(prev => prev.filter(a => a.id !== id));
      } else {
        setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'deleted' } : a));
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting article');
    }
  };

  // Sort and filter logic
  const sortedAndFilteredArticles = useMemo(() => {
    let result = [...articles];

    if (statusFilter !== 'all') {
      result = result.filter(a => (a.status || 'published') === statusFilter);
    } else {
      result = result.filter(a => (a.status || 'published') !== 'deleted');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.headline.toLowerCase().includes(q) ||
        (a.headlineBn || '').toLowerCase().includes(q) ||
        a.sport.toLowerCase().includes(q) ||
        (a.byline || '').toLowerCase().includes(q) ||
        (a.slug || '').toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      if (sortField === 'publishedAt') {
        valA = new Date(a.publishedAt).getTime();
        valB = new Date(b.publishedAt).getTime();
      } else if (sortField === 'headline') {
        valA = (a.headlineBn || a.headline).toLowerCase();
        valB = (b.headlineBn || b.headline).toLowerCase();
      } else if (sortField === 'sport') {
        valA = a.sport.toLowerCase();
        valB = b.sport.toLowerCase();
      } else if (sortField === 'views') {
        valA = a.views;
        valB = b.views;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [articles, searchQuery, sortField, sortAsc, statusFilter]);

  const handleSort = (field: 'publishedAt' | 'headline' | 'sport' | 'views') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: 24 }}>
      {/* Header section with search and New Article */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 24, color: 'var(--ink)' }}>
            আর্টিকেল সমূহ
          </h1>
          <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink-muted)' }}>
            Manage, edit, search and filter all sports stories
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[var(--ink-ghost)] p-1 rounded-md" style={{ height: 42 }}>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${statusFilter === 'all' ? 'bg-white shadow-sm text-[var(--ink)]' : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}`}
            >All</button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${statusFilter === 'published' ? 'bg-white shadow-sm text-[var(--ink)]' : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}`}
            >Live</button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${statusFilter === 'draft' ? 'bg-white shadow-sm text-[var(--ink)]' : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}`}
            >Drafts</button>
            <button
              onClick={() => setStatusFilter('archived')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${statusFilter === 'archived' ? 'bg-white shadow-sm text-[var(--ink)]' : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}`}
            >Archives</button>
            <button
              onClick={() => setStatusFilter('deleted')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${statusFilter === 'deleted' ? 'bg-white shadow-sm text-red-600' : 'text-[var(--ink-muted)] hover:text-red-500'}`}
            >Recently Deleted</button>
          </div>
          {canWriteArticles && (
            <Link href="/admin/articles/new" className="admin-btn-primary flex items-center gap-2" style={{ height: 42 }}>
              <Plus size={16} />
              <span>New Article</span>
            </Link>
          )}
        </div>
      </div>

      {/* Control bar: Search and Filters */}
      <div 
        className="p-4 border mb-6 flex flex-col md:flex-row gap-4 items-center justify-between"
        style={{ 
          backgroundColor: 'var(--bg-surface)', 
          borderColor: 'var(--ink-border)', 
          borderRadius: 6 
        }}
      >
        <div className="relative w-full md:max-w-md flex items-center">
          <Search size={16} className="absolute left-3 text-[var(--ink-ghost)] pointer-events-none" />
          <input
            type="text"
            placeholder="খুঁজুন"
            className="admin-input"
            style={{ paddingLeft: '36px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="text-[11px] text-[var(--ink-muted)] font-semibold" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
          Showing {sortedAndFilteredArticles.length} of {articles.length} articles
        </div>
      </div>

      {/* Articles table grid */}
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
              <tr style={{ borderBottom: '1px solid var(--ink-border)' }}>
                {/* Sortable headers with explicit widths for proper row alignment */}
                <th className="p-4 text-left cursor-pointer hover:text-[var(--ink)]" style={{ width: '45%' }} onClick={() => handleSort('headline')}>
                  <div className="flex items-center gap-1.5" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: sortField === 'headline' ? 'var(--ink)' : 'var(--ink-muted)' }}>
                    Headline
                    {sortField === 'headline' ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>

                <th className="p-4 text-left cursor-pointer hover:text-[var(--ink)]" style={{ width: '15%' }} onClick={() => handleSort('sport')}>
                  <div className="flex items-center gap-1.5" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: sortField === 'sport' ? 'var(--ink)' : 'var(--ink-muted)' }}>
                    Sport Category
                    {sortField === 'sport' ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>

                <th className="p-4 text-left" style={{ width: '15%', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--ink-muted)' }}>
                  Byline
                </th>

                <th className="p-4 text-right cursor-pointer hover:text-[var(--ink)]" style={{ width: '8%' }} onClick={() => handleSort('views')}>
                  <div className="flex items-center justify-end gap-1.5" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: sortField === 'views' ? 'var(--ink)' : 'var(--ink-muted)' }}>
                    Views
                    {sortField === 'views' ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>

                <th className="p-4 text-right cursor-pointer hover:text-[var(--ink)]" style={{ width: '12%' }} onClick={() => handleSort('publishedAt')}>
                  <div className="flex items-center justify-end gap-1.5" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: sortField === 'publishedAt' ? 'var(--ink)' : 'var(--ink-muted)' }}>
                    Published Date
                    {sortField === 'publishedAt' ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>

                <th className="p-4 text-right" style={{ width: '5%', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--ink-muted)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--ink-muted)', fontSize: 13 }}>
                    No matching articles found.
                  </td>
                </tr>
              ) : (
                sortedAndFilteredArticles.map((art) => (
                  <ArticleRow 
                    key={art.id} 
                    art={art} 
                    canEditDrafts={canEditDrafts}
                    canEditPublished={canEditPublished}
                    canEditArchives={canEditArchives}
                    canDeleteDrafts={canDeleteDrafts}
                    canDeletePublished={canDeletePublished}
                    canDeleteArchives={canDeleteArchives}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
