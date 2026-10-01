import { FormEvent, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { publicProgrammes } from '@/content/publicStudies';
import {
  QUALITY_PRACTICES,
  TEACHING_METHODS,
  methodLabel,
  useEducatorStore,
  type GradeStatus,
  type TeachingMethod,
} from '@/store/educatorStore';
import CatalogueEditor from '@/components/campus/CatalogueEditor';
import CampusDesk from '@/components/educator/CampusDesk';
import { useLearnerStore } from '@/store/learnerStore';

const field =
  'w-full rounded-xl bg-primary-dark border border-surface-light px-3 py-3 text-white placeholder:text-muted';

type DeskTab = 'grade' | 'notes' | 'methods' | 'quality' | 'catalogue' | 'campus';

const tabs: { id: DeskTab; label: string }[] = [
  { id: 'campus', label: 'Campus' },
  { id: 'grade', label: 'Grade work' },
  { id: 'notes', label: 'Library notes' },
  { id: 'methods', label: 'Teaching methods' },
  { id: 'catalogue', label: 'PDFs & catalogue' },
  { id: 'quality', label: 'Quality' },
];

function lines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function TeachingDesk() {
  const [params, setParams] = useSearchParams();
  const tab = (['grade', 'notes', 'methods', 'quality', 'catalogue', 'campus'] as const).includes(params.get('tab') as DeskTab)
    ? (params.get('tab') as DeskTab)
    : 'campus';
  const programmeFilter = params.get('programme') ?? '';
  const displayName = useLearnerStore((state) => state.displayName) ?? 'Educator';
  const email = useLearnerStore((state) => state.email) ?? '';
  const notes = useEducatorStore((state) => state.notes);
  const variations = useEducatorStore((state) => state.variations);
  const submissions = useEducatorStore((state) => state.submissions);
  const addNote = useEducatorStore((state) => state.addNote);
  const addVariation = useEducatorStore((state) => state.addVariation);
  const gradeSubmission = useEducatorStore((state) => state.gradeSubmission);

  const [noteForm, setNoteForm] = useState({
    programmeId: programmeFilter || 'plumbing',
    slug: 'plumbing-waste',
    title: '',
    body: '',
    method: 'instructor-led' as TeachingMethod,
    outcomes: '',
  });
  const [methodForm, setMethodForm] = useState({
    programmeId: programmeFilter || 'plumbing',
    title: '',
    method: 'instructor-led' as TeachingMethod,
    durationMinutes: 90,
    sequence: '',
    materials: '',
    checks: '',
  });
  const [gradeDraft, setGradeDraft] = useState<Record<string, { score: string; feedback: string }>>({});
  const [noteSaved, setNoteSaved] = useState('');
  const [methodSaved, setMethodSaved] = useState('');

  const setTab = (next: DeskTab) => {
    const copy = new URLSearchParams(params);
    copy.set('tab', next);
    setParams(copy, { replace: true });
  };

  const visibleSubmissions = useMemo(
    () =>
      submissions.filter((item) => !programmeFilter || item.programmeId === programmeFilter),
    [programmeFilter, submissions]
  );
  const pendingCount = visibleSubmissions.filter((item) => item.status === 'pending').length;

  const saveNote = (event: FormEvent) => {
    event.preventDefault();
    const programme = publicProgrammes.find((item) => item.id === noteForm.programmeId);
    addNote({
      programmeId: noteForm.programmeId,
      programmeTitle: programme?.title ?? noteForm.programmeId,
      slug: noteForm.slug.trim() || undefined,
      title: noteForm.title.trim(),
      body: noteForm.body.trim(),
      method: noteForm.method,
      outcomes: lines(noteForm.outcomes),
      educatorEmail: email,
      educatorName: displayName,
    });
    setNoteForm({ ...noteForm, title: '', body: '', outcomes: '' });
    setNoteSaved('Note is in the study library for that unit.');
  };

  const saveMethod = (event: FormEvent) => {
    event.preventDefault();
    const programme = publicProgrammes.find((item) => item.id === methodForm.programmeId);
    addVariation({
      programmeId: methodForm.programmeId,
      programmeTitle: programme?.title ?? methodForm.programmeId,
      title: methodForm.title.trim(),
      method: methodForm.method,
      durationMinutes: Number(methodForm.durationMinutes) || 60,
      sequence: lines(methodForm.sequence),
      materials: lines(methodForm.materials),
      checks: lines(methodForm.checks),
      educatorEmail: email,
      educatorName: displayName,
    });
    setMethodForm({ ...methodForm, title: '', sequence: '', materials: '', checks: '' });
    setMethodSaved('Teaching variation saved. Learners still sit the course; you run this sequence.');
  };

  const mark = (id: string, status: Exclude<GradeStatus, 'pending'>) => {
    const draft = gradeDraft[id] ?? { score: '', feedback: '' };
    gradeSubmission(id, {
      status,
      score: draft.score ? Number(draft.score) : undefined,
      feedback: draft.feedback || 'See rubric on the job card.',
      gradedBy: displayName,
    });
  };

  return (
    <section className="space-y-6">
      <div className="card border-accent/30">
        <p className="text-success text-xs font-semibold uppercase">Verified educator</p>
        <h2 className="text-xl font-semibold mt-1">Teaching desk</h2>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          You grade assignments and practicals, put curriculum notes in the library, and vary how you run
          instructor-led sessions. You do not sit learner courses or earn learner XP.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              className={tab === item.id ? 'btn-primary !py-2 !px-3 text-xs' : 'btn-secondary !py-2 !px-3 text-xs'}
              onClick={() => setTab(item.id)}
            >
              {item.label}
              {item.id === 'grade' && pendingCount > 0 ? ` (${pendingCount})` : ''}
            </button>
          ))}
        </div>
      </div>

      {tab === 'campus' && <CampusDesk educatorEmail={email} educatorName={displayName} />}

      {tab === 'grade' && (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Sample learner work is included so you can practise a pass, a return, and a fail. Real submissions
            appear here after learners upload evidence.
          </p>
          {visibleSubmissions.map((item) => {
            const draft = gradeDraft[item.id] ?? { score: item.score?.toString() ?? '', feedback: item.feedback ?? '' };
            return (
              <article key={item.id} className="card space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{item.learnerName}</h3>
                    <p className="text-xs text-muted mt-1">
                      {item.programmeTitle} · {item.lessonTitle} · {item.kind}
                      {item.sample ? ' · sample' : ''}
                    </p>
                  </div>
                  <span className="text-xs uppercase text-accent">{item.status}</span>
                </div>
                <p className="text-sm text-muted-light leading-relaxed">{item.evidence}</p>
                {item.status === 'pending' ? (
                  <>
                    <input
                      className={field}
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Score (optional)"
                      value={draft.score}
                      onChange={(event) =>
                        setGradeDraft({ ...gradeDraft, [item.id]: { ...draft, score: event.target.value } })
                      }
                    />
                    <textarea
                      className={`min-h-24 ${field}`}
                      placeholder="Feedback the learner can act on — name the missing photo, fall, or hygiene check"
                      value={draft.feedback}
                      onChange={(event) =>
                        setGradeDraft({ ...gradeDraft, [item.id]: { ...draft, feedback: event.target.value } })
                      }
                    />
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="btn-primary text-xs" onClick={() => mark(item.id, 'passed')}>
                        Pass
                      </button>
                      <button type="button" className="btn-secondary text-xs" onClick={() => mark(item.id, 'returned')}>
                        Return
                      </button>
                      <button type="button" className="btn-secondary text-xs" onClick={() => mark(item.id, 'failed')}>
                        Fail
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted">
                    {item.score != null ? `${item.score} · ` : ''}
                    {item.feedback}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {tab === 'notes' && (
        <div className="space-y-4">
          <form className="card grid md:grid-cols-2 gap-3" onSubmit={saveNote}>
            <h3 className="md:col-span-2 font-semibold">Add curriculum notes to the library</h3>
            <p className="md:col-span-2 text-sm text-muted">
              Notes sit on the study unit. They do not enrol you in the learner course.
            </p>
            <select
              className={field}
              value={noteForm.programmeId}
              onChange={(event) => setNoteForm({ ...noteForm, programmeId: event.target.value })}
            >
              {publicProgrammes.map((programme) => (
                <option key={programme.id} value={programme.id}>
                  {programme.icon} {programme.title}
                </option>
              ))}
            </select>
            <input
              className={field}
              placeholder="Unit slug (e.g. plumbing-waste)"
              value={noteForm.slug}
              onChange={(event) => setNoteForm({ ...noteForm, slug: event.target.value })}
            />
            <input
              className={`md:col-span-2 ${field}`}
              placeholder="Note title"
              value={noteForm.title}
              onChange={(event) => setNoteForm({ ...noteForm, title: event.target.value })}
              required
            />
            <select
              className={field}
              value={noteForm.method}
              onChange={(event) => setNoteForm({ ...noteForm, method: event.target.value as TeachingMethod })}
            >
              {TEACHING_METHODS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <textarea
              className={`min-h-20 ${field}`}
              placeholder="Measurable outcomes, one per line"
              value={noteForm.outcomes}
              onChange={(event) => setNoteForm({ ...noteForm, outcomes: event.target.value })}
            />
            <textarea
              className={`md:col-span-2 min-h-40 ${field}`}
              placeholder="Workshop notes: PPE, local kit, sequence, stop points, common faults, evidence you will grade"
              value={noteForm.body}
              onChange={(event) => setNoteForm({ ...noteForm, body: event.target.value })}
              required
            />
            <button className="btn-primary md:col-span-2" type="submit">
              Publish note to library
            </button>
            {noteSaved && <p className="md:col-span-2 text-sm text-success">{noteSaved}</p>}
          </form>
          {notes.map((note) => (
            <article key={note.id} className="card space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{note.title}</h3>
                  <p className="text-xs text-muted mt-1">
                    {note.programmeTitle} · {methodLabel(note.method)}
                    {note.sample ? ' · sample' : ''}
                  </p>
                </div>
                {note.slug && (
                  <Link to={`/study/${note.slug}`} className="btn-secondary !py-1.5 !px-3 text-xs">
                    Open in library
                  </Link>
                )}
              </div>
              {note.outcomes.length > 0 && (
                <ul className="text-sm text-muted-light list-disc pl-5 space-y-1">
                  {note.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}

      {tab === 'methods' && (
        <div className="space-y-4">
          <form className="card grid md:grid-cols-2 gap-3" onSubmit={saveMethod}>
            <h3 className="md:col-span-2 font-semibold">Vary an instructor-led session</h3>
            <p className="md:col-span-2 text-sm text-muted">
              Change demo time, pair practice, peer critique, or site visit. The catalogue course stays the same.
            </p>
            <select
              className={field}
              value={methodForm.programmeId}
              onChange={(event) => setMethodForm({ ...methodForm, programmeId: event.target.value })}
            >
              {publicProgrammes.map((programme) => (
                <option key={programme.id} value={programme.id}>
                  {programme.icon} {programme.title}
                </option>
              ))}
            </select>
            <select
              className={field}
              value={methodForm.method}
              onChange={(event) => setMethodForm({ ...methodForm, method: event.target.value as TeachingMethod })}
            >
              {TEACHING_METHODS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              className={field}
              placeholder="Session title"
              value={methodForm.title}
              onChange={(event) => setMethodForm({ ...methodForm, title: event.target.value })}
              required
            />
            <input
              className={field}
              type="number"
              min={20}
              placeholder="Minutes"
              value={methodForm.durationMinutes}
              onChange={(event) =>
                setMethodForm({ ...methodForm, durationMinutes: Number(event.target.value) || 60 })
              }
            />
            <textarea
              className={`md:col-span-2 min-h-28 ${field}`}
              placeholder="Sequence, one step per line"
              value={methodForm.sequence}
              onChange={(event) => setMethodForm({ ...methodForm, sequence: event.target.value })}
              required
            />
            <textarea
              className={`min-h-24 ${field}`}
              placeholder="Materials, one per line"
              value={methodForm.materials}
              onChange={(event) => setMethodForm({ ...methodForm, materials: event.target.value })}
            />
            <textarea
              className={`min-h-24 ${field}`}
              placeholder="Pass checks, one per line"
              value={methodForm.checks}
              onChange={(event) => setMethodForm({ ...methodForm, checks: event.target.value })}
            />
            <button className="btn-primary md:col-span-2" type="submit">
              Save teaching variation
            </button>
            {methodSaved && <p className="md:col-span-2 text-sm text-success">{methodSaved}</p>}
          </form>
          {variations.map((item) => (
            <article key={item.id} className="card space-y-2">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-xs text-muted">
                {item.programmeTitle} · {methodLabel(item.method)} · {item.durationMinutes} min
                {item.sample ? ' · sample' : ''}
              </p>
              <ol className="text-sm text-muted-light list-decimal pl-5 space-y-1">
                {item.sequence.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      )}

      {tab === 'catalogue' && (
        <CatalogueEditor actorEmail={email} actorName={displayName} initialPathId={programmeFilter || 'plumbing'} />
      )}

      {tab === 'quality' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold">How to raise quality and detail</h3>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              Open the sample plumbing note in the library. Copy its shape: measurable outcomes, local kit, stop
              points, a timed instructor-led sequence, common faults, evidence, and Kiswahili terms.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/study/plumbing-waste" className="btn-primary text-xs">
                Open sample unit
              </Link>
              <button type="button" className="btn-secondary text-xs" onClick={() => setTab('notes')}>
                Read sample note
              </button>
            </div>
          </div>
          {QUALITY_PRACTICES.map((item) => (
            <article key={item.title} className="card">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">{item.detail}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
