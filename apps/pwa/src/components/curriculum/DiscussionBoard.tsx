import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ThumbsUp, CornerDownRight, Send, Loader2, AlertCircle } from 'lucide-react';
import { useLearnerStore } from '@/store/learnerStore';

interface Post {
  id: string;
  lessonId: string;
  learnerId: string;
  authorName: string;
  body: string;
  parentId: string | null;
  createdAt: string;
  upvotes: number;
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = useLearnerStore.getState().token;
  const res = await fetch(`http://127.0.0.1:8000${url}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json() as Promise<T>;
}

export default function DiscussionBoard({ lessonId }: { lessonId: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [replyTo, setReplyTo] = useState<Post | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch<Post[]>(`/api/v1/lessons/${lessonId}/posts`);
      setPosts(data);
    } catch {
      setError('Could not load discussion — you may be offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const submit = async () => {
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      const post = await apiFetch<Post>(`/api/v1/lessons/${lessonId}/posts`, {
        method: 'POST',
        body: JSON.stringify({ body: body.trim(), parentId: replyTo?.id ?? null }),
      });
      setPosts((prev) => [...prev, post]);
      setBody('');
      setReplyTo(null);
    } catch {
      setError('Failed to post — try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const upvote = async (postId: string) => {
    try {
      const res = await apiFetch<{ postId: string; upvotes: number }>(
        `/api/v1/posts/${postId}/upvote`,
        { method: 'POST' },
      );
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, upvotes: res.upvotes } : p)),
      );
    } catch {
      /* ignore */
    }
  };

  const topLevel = posts.filter((p) => !p.parentId);
  const replies = (parentId: string) => posts.filter((p) => p.parentId === parentId);

  const fmt = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch {
      return iso;
    }
  };

  return (
    <section className="mt-8 space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
        <MessageCircle className="w-4 h-4" />
        <h2>Discussion Board</h2>
        {posts.length > 0 && <span className="ml-auto badge-accent">{posts.length}</span>}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-xl px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-muted animate-spin" />
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {topLevel.length === 0 && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted text-center py-6"
            >
              No questions yet — be the first to ask!
            </motion.p>
          )}
          {topLevel.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="card border-white/[0.08] space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-sm font-semibold text-white">{post.authorName}</span>
                  <span className="text-[11px] text-muted ml-2">{fmt(post.createdAt)}</span>
                </div>
                <button
                  onClick={() => void upvote(post.id)}
                  className="flex items-center gap-1 text-[11px] text-muted hover:text-accent transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {post.upvotes}
                </button>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">{post.body}</p>

              {replies(post.id).map((reply) => (
                <div
                  key={reply.id}
                  className="ml-4 pl-3 border-l border-white/[0.12] space-y-1"
                >
                  <div className="flex items-center gap-1">
                    <CornerDownRight className="w-3 h-3 text-muted" />
                    <span className="text-xs font-semibold text-white/80">{reply.authorName}</span>
                    <span className="text-[10px] text-muted ml-1">{fmt(reply.createdAt)}</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed pl-4">{reply.body}</p>
                </div>
              ))}

              <button
                onClick={() => {
                  setReplyTo(post);
                  textareaRef.current?.focus();
                }}
                className="text-[11px] text-muted hover:text-accent transition-colors flex items-center gap-1"
              >
                <CornerDownRight className="w-3 h-3" /> Reply
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* Compose */}
      <div className="card border-white/[0.08] space-y-3">
        {replyTo && (
          <div className="flex items-center gap-2 text-[11px] text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-2 py-1">
            <CornerDownRight className="w-3 h-3" />
            Replying to <strong>{replyTo.authorName}</strong>
            <button
              onClick={() => setReplyTo(null)}
              className="ml-auto text-muted hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
        <textarea
          ref={textareaRef}
          className="w-full rounded-xl bg-primary-dark border border-surface-light px-3 py-2.5 text-sm text-white placeholder:text-muted resize-none min-h-[80px] focus:outline-none focus:border-accent/60"
          placeholder={
            replyTo ? `Reply to ${replyTo.authorName}…` : 'Ask a question or share a tip…'
          }
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) void submit();
          }}
        />
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted">Ctrl+Enter to post</span>
          <button
            onClick={() => void submit()}
            disabled={submitting || !body.trim()}
            className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Post
          </button>
        </div>
      </div>
    </section>
  );
}
