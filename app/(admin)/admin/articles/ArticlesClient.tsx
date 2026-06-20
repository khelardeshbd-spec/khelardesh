'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronUp, ChevronDown, Plus, ExternalLink, Pencil, MoreVertical } from 'lucide-react';

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
}

interface ArticlesClientProps {
  initialArticles: Article[];
}

export default function ArticlesClient({ initialArticles }: ArticlesClientProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'publishedAt' | 'headline' | 'sport' | 'views'>('publishedAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [showOnlyDrafts, setShowOnlyDrafts] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  const handleToggleStatus = async (article: Article) => {
    const newStatus = article.status === 'draft' ? 'published' : 'draft';
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
    if (!confirm('নিবন্ধটি চিরতরে মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete article');
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting article');
    }
  };

  // Sort and filter logic
  const sortedAndFilteredArticles = useMemo(() => {
    let result = [...articles];

    if (showOnlyDrafts) {
      result = result.filter(a => a.status === 'draft');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.headline.toLowerCase().includes(q) ||
        (a.headlineBn || '').toLowerCase().includes(q) ||
        a.sport.toLowerCase().includes(q) ||
        (a.byline || '').toLowerCase().includes(q)
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
  }, [articles, searchQuery, sortField, sortAsc, showOnlyDrafts]);

  const handleSort = (field: 'publishedAt' | 'headline' | 'sport' | 'views') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getSportLabel = (sport: string) => {
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
      other: 'অন্যান্য'
    };
    return maps[sport] || sport.toUpperCase();
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
          <button
            onClick={() => setShowOnlyDrafts(!showOnlyDrafts)}
            className={showOnlyDrafts ? "admin-btn-primary" : "admin-btn-secondary"}
            style={{ height: 42, fontSize: 13, fontWeight: 600, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {showOnlyDrafts ? 'Show All' : 'Drafts'}
          </button>
          <Link href="/admin/articles/new" className="admin-btn-primary flex items-center gap-2" style={{ height: 42 }}>
            <Plus size={16} />
            <span>New Article</span>
          </Link>
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
                {/* Sortable headers */}
                <th className="p-4 text-left cursor-pointer hover:text-[var(--ink)]" onClick={() => handleSort('headline')}>
                  <div className="flex items-center gap-1.5" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: sortField === 'headline' ? 'var(--ink)' : 'var(--ink-muted)' }}>
                    Headline
                    {sortField === 'headline' ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>

                <th className="p-4 text-left cursor-pointer hover:text-[var(--ink)]" onClick={() => handleSort('sport')}>
                  <div className="flex items-center gap-1.5" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: sortField === 'sport' ? 'var(--ink)' : 'var(--ink-muted)' }}>
                    Sport Category
                    {sortField === 'sport' ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>

                <th className="p-4 text-left" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--ink-muted)' }}>
                  Byline
                </th>

                <th className="p-4 text-right cursor-pointer hover:text-[var(--ink)]" onClick={() => handleSort('views')}>
                  <div className="flex items-center justify-end gap-1.5" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: sortField === 'views' ? 'var(--ink)' : 'var(--ink-muted)' }}>
                    Views
                    {sortField === 'views' ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>

                <th className="p-4 text-right cursor-pointer hover:text-[var(--ink)]" onClick={() => handleSort('publishedAt')}>
                  <div className="flex items-center justify-end gap-1.5" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: sortField === 'publishedAt' ? 'var(--ink)' : 'var(--ink-muted)' }}>
                    Published Date
                    {sortField === 'publishedAt' ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>

                <th className="p-4 text-right" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--ink-muted)' }}>
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
                  <tr 
                    key={art.id} 
                    style={{ borderBottom: '0.5px solid var(--ink-border)' }} 
                    className="hover:bg-[var(--ink-ghost)] transition-colors"
                  >
                    <td className="p-4 max-w-sm">
                      <div className="flex flex-col">
                        <Link 
                          href={`/admin/articles/${art.id}`}
                          className="font-bold text-[var(--ink)] hover:underline leading-snug text-sm"
                          lang="bn"
                        >
                          {art.headlineBn || art.headline}
                        </Link>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {art.status === 'draft' ? (
                            <span 
                              className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#7F8C8D] text-white uppercase tracking-wider"
                              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                            >
                              Draft
                            </span>
                          ) : (
                            <span 
                              className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#27AE60] text-white uppercase tracking-wider"
                              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                            >
                              Live
                            </span>
                          )}
                          {art.isLead && (
                            <span 
                              className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#E74C3C] text-white uppercase tracking-wider"
                              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                            >
                              Lead Story
                            </span>
                          )}
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
                      {new Date(art.publishedAt).toLocaleDateString('bn-BD', { dateStyle: 'medium' })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3 relative">
                        <Link 
                          href={`/admin/articles/${art.id}`}
                          className="p-1 hover:bg-[var(--ink-ghost)] rounded transition-colors text-[var(--ink-muted)] hover:text-[var(--ink)]"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </Link>
                        <Link 
                          href={`/article/${art.slug}`}
                          target="_blank"
                          className="p-1 hover:bg-[var(--ink-ghost)] rounded transition-colors text-[var(--ink-muted)] hover:text-[var(--ink)]"
                          title="View Live"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === art.id ? null : art.id);
                            }}
                            className="p-1 hover:bg-[var(--ink-ghost)] rounded transition-colors text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
                            title="More Actions"
                          >
                            <MoreVertical size={14} />
                          </button>
                          
                          {activeMenuId === art.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setActiveMenuId(null)}
                              />
                              <div 
                                className="absolute right-0 mt-1 w-36 bg-white border border-[var(--ink-border)] rounded-md shadow-lg py-1 z-50 text-left"
                                style={{ transform: 'translateY(2px)' }}
                              >
                                <button
                                  onClick={() => {
                                    handleToggleStatus(art);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 text-xs text-left hover:bg-[var(--ink-ghost)] flex items-center gap-2 text-slate-700 border-none bg-transparent cursor-pointer font-semibold"
                                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                                >
                                  {art.status === 'draft' ? 'Publish (প্রকাশ)' : 'Archive (খসড়া)'}
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(art.id);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 text-xs text-left hover:bg-red-50 flex items-center gap-2 text-red-600 border-none bg-transparent cursor-pointer font-semibold"
                                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                                >
                                  Delete (মুছুন)
                                </button>
                              </div>
                            </>
                          )}
                        </div>
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
