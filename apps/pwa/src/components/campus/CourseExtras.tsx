import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { SkillPath } from '@cyberlearn/types';
import { getAsset } from '@/lib/assetStore';
import { useIsEducator } from '@/lib/roles';
import {
  overlayFor,
  ratingSummary,
  relatedProgrammeIds,
  useCampusCatalogue,
} from '@/store/campusCatalogue';
import { useLearnerStore } from '@/store/learnerStore';

export default function CourseExtras({ path, catalogue }: { path: SkillPath; catalogue: SkillPath[] }) {
  const teaching = useIsEducator();
  const email = useLearnerStore((state) => state.email) ?? '';
  const displayName = useLearnerStore((state) => state.displayName) ?? 'Learner';
  const signedIn = Boolean(useLearnerStore((state) => state.token) && !useLearnerStore((state) => state.isGuest));
  const overlays = useCampusCatalogue((state) => state.overlays);
  const reviews = useCampusCatalogue((state) => state.reviews);
  const addReview = useCampusCatalogue((state) => state.addReview);
  const overlay = overlays[path.id] ?? overlayFor(path.id);
  const summary = useMemo(() => ratingSummary(path.id), [path.id, reviews]);
  const related = relatedProgrammeIds(path, catalogue)
    .map((id) => catalogue.find((item) => item.id === id))
    .filter((item): item is SkillPath => Boolean(item));
  const [stars, setStars] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!signedIn || teaching) return;
    addReview({
      pathId: path.id,
      stars,
      comment,
      learnerName: displayName,
      learnerEmail: email,
    });
    setComment('');
    setSaved('Review saved on this device.');
  };

  const openPdf = async (assetId?: string, url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener');
      return;
    }
    if (!assetId) return;
    const asset = await getAsset(assetId);
    if (!asset) return;
    const href = URL.createObjectURL(asset.blob);
    window.open(href, '_blank', 'noopener');
  };

  return (
    <div className="space-y-4">
      <section className="card space-y-2">
        <p className="text-xs uppercase tracking-wider text-accent font-semibold">Taught by</p>
        <p className="font-semibold">{overlay?.educatorName || 'Campus trainer'}</p>
        <p className="text-sm text-muted">{overlay?.school || 'Institution copy — add school from the teaching desk'}</p>
        {summary.count > 0 && (
          <p className="text-sm text-accent">
            {'★'.repeat(Math.round(summary.average))}
            {'☆'.repeat(5 - Math.round(summary.average))} {summary.average.toFixed(1)} ({summary.count})
          </p>
        )}
      </section>

      {overlay?.pdfs.length ? (
        <section className="card space-y-2">
          <h2 className="font-semibold">Scannable handouts</h2>
          {overlay.pdfs.map((pdf) => (
            <button
              key={pdf.id}
              type="button"
              className="btn-secondary w-full text-left text-sm"
              onClick={() => void openPdf(pdf.assetId, pdf.url)}
            >
              {pdf.title}
              {pdf.scannable ? ' · searchable text' : ''}
            </button>
          ))}
        </section>
      ) : null}

      {related.length > 0 && (
        <section className="card space-y-2">
          <h2 className="font-semibold">Related programmes</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {related.map((item) => (
              <li key={item.id}>
                <Link to={`/learn/course/${item.id}`} className="btn-secondary w-full text-sm text-left">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!teaching && signedIn && (
        <form className="card space-y-3" onSubmit={submit}>
          <h2 className="font-semibold">Rate this programme</h2>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as const).map((value) => (
              <button
                key={value}
                type="button"
                className={stars >= value ? 'text-accent text-xl' : 'text-muted text-xl'}
                onClick={() => setStars(value)}
                aria-label={`${value} stars`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            className="w-full rounded-xl bg-primary-dark border border-surface-light px-3 py-3 min-h-20"
            placeholder="What should the next class keep or change?"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <button className="btn-primary" type="submit">
            Save review
          </button>
          {saved && <p className="text-sm text-success">{saved}</p>}
        </form>
      )}

      {summary.reviews.slice(0, 3).map((item) => (
        <article key={item.id} className="card">
          <p className="text-accent text-sm">{'★'.repeat(item.stars)}</p>
          <p className="text-sm text-muted mt-1">{item.comment || 'No written comment.'}</p>
          <p className="text-xs text-muted mt-2">{item.learnerName}</p>
        </article>
      ))}
    </div>
  );
}
