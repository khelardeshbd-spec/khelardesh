'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import ClientFormattedDate from './ClientFormattedDate';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface Comment {
  id: number;
  articleSlug: string;
  userEmail: string;
  userName: string | null;
  userImage: string | null;
  body: string;
  parentId: number | null;
  isReporter: boolean;
  createdAt: string;
  likes?: number;
  dislikes?: number;
  userReaction?: 'LIKE' | 'DISLIKE' | null;
}

export default function CommentSection({ articleSlug }: { articleSlug: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [articleSlug]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/articles/${articleSlug}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setFetching(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent, parentId: number | null = null) => {
    e.preventDefault();
    const text = parentId ? replyText : commentText;
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/articles/${articleSlug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text, parentId })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'মন্তব্য পোস্ট করতে ব্যর্থ হয়েছে।');
      }

      const data = await res.json();
      setComments((prev) => [...prev, data.comment]);
      
      if (parentId) {
        setReplyText('');
        setActiveReplyId(null);
      } else {
        setCommentText('');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReact = async (commentId: number, type: 'LIKE' | 'DISLIKE') => {
    if (!session) {
      signIn('google');
      return;
    }

    try {
      // Optimistic update
      setComments(prev => prev.map(c => {
        if (c.id === commentId) {
          let newLikes = c.likes || 0;
          let newDislikes = c.dislikes || 0;
          let newReaction = type;

          if (c.userReaction === type) {
            // Remove reaction
            if (type === 'LIKE') newLikes = Math.max(0, newLikes - 1);
            if (type === 'DISLIKE') newDislikes = Math.max(0, newDislikes - 1);
            newReaction = null as any;
          } else {
            // Switch or Add
            if (c.userReaction === 'LIKE') newLikes = Math.max(0, newLikes - 1);
            if (c.userReaction === 'DISLIKE') newDislikes = Math.max(0, newDislikes - 1);
            if (type === 'LIKE') newLikes++;
            if (type === 'DISLIKE') newDislikes++;
          }
          return { ...c, likes: newLikes, dislikes: newDislikes, userReaction: newReaction };
        }
        return c;
      }));

      await fetch(`/api/articles/${articleSlug}/comments/${commentId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
    } catch (err) {
      console.error('Reaction failed', err);
    }
  };

  // Group comments: top-level comments vs replies
  const rootComments = comments.filter((c) => c.parentId === null);
  const getReplies = (parentId: number) => comments.filter((c) => c.parentId === parentId);

  return (
    <div className="mt-12 pt-8 border-t border-[var(--ink-border)]">
      <h3 className="text-lg font-bold mb-6 text-[var(--ink)]" style={{ fontFamily: 'var(--font-body)' }}>
        মন্তব্যসমূহ ({comments.length})
      </h3>

      {/* Comment Form */}
      {session ? (
        <form onSubmit={(e) => handlePostComment(e, null)} className="mb-8">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--ink-border)] flex-shrink-0">
              {session.user?.image ? (
                <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold">
                  {(session.user?.name || 'U').slice(0, 1)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="একটি মন্তব্য লিখুন..."
                rows={3}
                className="w-full p-3 text-sm rounded-lg border border-[var(--ink-border)] bg-[var(--bg-surface)] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[#d33f3f] focus:border-[#d33f3f] transition-all resize-none"
                style={{ fontFamily: 'var(--font-body)' }}
              />
              {error && <p className="text-xs text-red-500 mt-1 font-semibold">{error}</p>}
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={loading || !commentText.trim()}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#d33f3f] hover:bg-[#b83232] rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'পাঠানো হচ্ছে...' : 'মন্তব্য করুন'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-5 border border-dashed border-[var(--ink-border)] rounded-lg text-center bg-[var(--bg-surface)] mb-8">
          <p className="text-sm text-[var(--ink-muted)] mb-3" style={{ fontFamily: 'var(--font-body)' }}>
            মন্তব্য করতে এবং আলোচনায় অংশ নিতে আপনার গুগল অ্যাকাউন্ট দিয়ে লগইন করুন।
          </p>
          <button
            onClick={() => signIn('google')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--ink-border)] text-xs font-bold text-[var(--ink)] rounded-full hover:bg-[var(--ink-ghost)] transition-colors cursor-pointer bg-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" width="16" height="16">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            গুগল দিয়ে লগইন করুন
          </button>
        </div>
      )}

      {/* Comments List */}
      {fetching ? (
        <div className="space-y-4">
          <div className="h-10 bg-gray-100 rounded animate-pulse" />
          <div className="h-16 bg-gray-100 rounded animate-pulse" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-[var(--ink-muted)] italic text-center py-6">কোনো মন্তব্য পাওয়া যায়নি। প্রথম মন্তব্যটি করুন!</p>
      ) : (
        <div className="space-y-6">
          {rootComments.map((comment) => {
            const replies = getReplies(comment.id);
            const showReplyForm = activeReplyId === comment.id;

            return (
              <div id={`comment-${comment.id}`} key={comment.id} className="group border-b border-[var(--ink-border)] pb-5 last:border-0">
                {/* Main Comment */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--ink-border)] flex-shrink-0">
                    {comment.userImage ? (
                      <img src={comment.userImage} alt={comment.userName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold">
                        {(comment.userName || 'U').slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[var(--ink)]">{comment.userName || 'ব্যবহারকারী'}</span>
                      {comment.isReporter && (
                        <span className="text-[9px] font-bold text-white bg-[#1a5c2e] px-1.5 py-0.5 rounded uppercase tracking-wider">
                          রিপোর্টার
                        </span>
                      )}
                      <span className="text-[10px] text-[var(--ink-muted)]">· <ClientFormattedDate date={comment.createdAt} mode="relative" lang="bn" /></span>
                    </div>
                    <p className="text-sm text-[var(--ink)] mt-1.5 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                      {comment.body}
                    </p>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={() => handleReact(comment.id, 'LIKE')}
                        className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${comment.userReaction === 'LIKE' ? 'text-[#d33f3f]' : 'text-[var(--ink-muted)] hover:text-[#d33f3f]'}`}
                      >
                        <ThumbsUp size={14} className={comment.userReaction === 'LIKE' ? 'fill-current' : ''} />
                        {comment.likes || 0}
                      </button>
                      <button
                        onClick={() => handleReact(comment.id, 'DISLIKE')}
                        className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${comment.userReaction === 'DISLIKE' ? 'text-[var(--ink)]' : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}`}
                      >
                        <ThumbsDown size={14} className={comment.userReaction === 'DISLIKE' ? 'fill-current' : ''} />
                        {comment.dislikes || 0}
                      </button>
                      <button
                        onClick={() => {
                          if (!session) {
                            signIn('google');
                          } else {
                            setActiveReplyId(showReplyForm ? null : comment.id);
                          }
                        }}
                        className="text-xs text-[var(--ink-muted)] hover:text-[#d33f3f] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                        উত্তর দিন
                      </button>
                    </div>

                    {/* Inline Reply Form */}
                    {showReplyForm && (
                      <form onSubmit={(e) => handlePostComment(e, comment.id)} className="mt-4 pl-4 border-l-2 border-[var(--ink-border)]">
                        <div className="flex gap-2 items-start">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`${comment.userName} কে উত্তর দিন...`}
                            rows={2}
                            className="w-full p-2.5 text-xs rounded-lg border border-[var(--ink-border)] bg-[var(--bg-surface)] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[#d33f3f] focus:border-[#d33f3f] transition-all resize-none"
                          />
                          <div className="flex flex-col gap-1.5">
                            <button
                              type="submit"
                              disabled={loading || !replyText.trim()}
                              className="px-3 py-1.5 text-[10px] font-bold text-white bg-[#d33f3f] hover:bg-[#b83232] rounded-full transition-colors cursor-pointer disabled:opacity-50"
                            >
                              পাঠান
                            </button>
                            <button
                              type="button"
                              onClick={() => { setActiveReplyId(null); setReplyText(''); }}
                              className="px-3 py-1.5 text-[10px] font-bold text-[var(--ink-muted)] hover:bg-[var(--ink-ghost)] border border-[var(--ink-border)] rounded-full transition-colors cursor-pointer"
                            >
                              বাতিল
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Nested Replies */}
                    {replies.length > 0 && (
                      <div className="mt-4 space-y-4 pl-4 border-l border-[var(--ink-border)]">
                        {replies.map((reply) => (
                          <div id={`comment-${reply.id}`} key={reply.id} className="flex gap-2.5 items-start">
                            <div className="w-6 h-6 rounded-full overflow-hidden border border-[var(--ink-border)] flex-shrink-0">
                              {reply.userImage ? (
                                <img src={reply.userImage} alt={reply.userName || 'User'} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                                  {(reply.userName || 'U').slice(0, 1)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[11px] font-bold text-[var(--ink)]">{reply.userName}</span>
                                {reply.isReporter && (
                                  <span className="text-[8px] font-bold text-white bg-[#1a5c2e] px-1 py-0.2 rounded uppercase tracking-wider">
                                    রিপোর্টার
                                  </span>
                                )}
                                <span className="text-[9px] text-[var(--ink-muted)]">· <ClientFormattedDate date={reply.createdAt} mode="relative" lang="bn" /></span>
                              </div>
                              <p className="text-xs text-[var(--ink)] mt-1 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                                {reply.body}
                              </p>
                              <div className="flex items-center gap-4 mt-1.5">
                                <button
                                  onClick={() => handleReact(reply.id, 'LIKE')}
                                  className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors ${reply.userReaction === 'LIKE' ? 'text-[#d33f3f]' : 'text-[var(--ink-muted)] hover:text-[#d33f3f]'}`}
                                >
                                  <ThumbsUp size={12} className={reply.userReaction === 'LIKE' ? 'fill-current' : ''} />
                                  {reply.likes || 0}
                                </button>
                                <button
                                  onClick={() => handleReact(reply.id, 'DISLIKE')}
                                  className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors ${reply.userReaction === 'DISLIKE' ? 'text-[var(--ink)]' : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}`}
                                >
                                  <ThumbsDown size={12} className={reply.userReaction === 'DISLIKE' ? 'fill-current' : ''} />
                                  {reply.dislikes || 0}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
