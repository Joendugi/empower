import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandMark from '@/components/ui/BrandMark';
import BottomNav from '@/components/ui/BottomNav';
import { getAsset } from '@/lib/assetStore';
import { findLocalAccount } from '@/lib/localAccounts';
import { classesForLearner, useCampusHub } from '@/store/campusHub';
import { noticesFor, useNoticeStore } from '@/store/noticeStore';
import { useLearnerStore } from '@/store/learnerStore';

const field =
  'w-full rounded-xl bg-primary-dark border border-surface-light px-3 py-3 text-white placeholder:text-muted';

export default function CampusPage() {
  const token = useLearnerStore((state) => state.token);
  const isGuest = useLearnerStore((state) => state.isGuest);
  const signedIn = Boolean(token && !isGuest);
  const email = useLearnerStore((state) => state.email) ?? '';
  const displayName = useLearnerStore((state) => state.displayName) ?? 'Learner';
  const classes = useCampusHub((state) => state.classes);
  const materials = useCampusHub((state) => state.materials);
  const exams = useCampusHub((state) => state.exams);
  const results = useCampusHub((state) => state.results);
  const attempts = useCampusHub((state) => state.attempts);
  const roster = useCampusHub((state) => state.roster);
  const campuses = useCampusHub((state) => state.campuses);
  const joinClass = useCampusHub((state) => state.joinClass);
  const submitExam = useCampusHub((state) => state.submitExam);
  const notices = useNoticeStore((state) => state.notices);
  const mine = useMemo(() => classesForLearner(email), [classes, roster, email]);
  const inbox = useMemo(
    () => noticesFor(email, mine.map((item) => item.id)),
    [email, mine, notices]
  );
  const [code, setCode] = useState('');
  const [classId, setClassId] = useState(mine[0]?.id ?? '');
  const [answers, setAnswers] = useState<Record<string, 'a' | 'b' | 'c' | 'd'>>({});
  const [note, setNote] = useState('');
  const room = mine.find((item) => item.id === classId) ?? mine[0];
  const campus = campuses.find((item) => item.id === room?.campusId);

  const join = (event: FormEvent) => {
    event.preventDefault();
    const next = joinClass(code, { name: displayName, email, phone: findLocalAccount(email)?.phone });
    if (!next) {
      setNote('No class uses that code. Ask your trainer.');
      return;
    }
    setClassId(next.id);
    setCode('');
    setNote(`Joined ${next.title}.`);
  };

  const sit = (examId: string) => {
    if (!room) return;
    const exam = exams.find((item) => item.id === examId);
    if (!exam) return;
    const attempt = submitExam({
      examId,
      classId: room.id,
      learnerEmail: email,
      learnerName: displayName,
      answers,
    });
    setNote(`Submitted ${exam.title}: ${attempt.score}/${attempt.max}.`);
  };

  const openFile = async (assetId?: string) => {
    if (!assetId) return;
    const asset = await getAsset(assetId);
    if (!asset) return;
    window.open(URL.createObjectURL(asset.blob), '_blank', 'noopener');
  };

  if (!signedIn) {
    return (
      <div className="min-h-dvh bg-primary-dark text-white grid place-items-center px-6">
        <div className="card text-center max-w-md space-y-3">
          <h1 className="text-2xl font-bold">Campus</h1>
          <p className="text-sm text-muted">Sign in to join a class, open materials, sit CATs, and see results.</p>
          <Link to="/login?next=/campus" className="btn-primary inline-flex">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-primary-dark pb-24 text-white">
      <header className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between border-b border-surface-light">
        <Link to="/" className="flex items-center gap-2">
          <BrandMark size="sm" />
          <span className="font-semibold">Empower</span>
        </Link>
        <Link to="/learn/skill-tree" className="text-sm text-muted hover:text-white">Catalogue</Link>
      </header>
      <main className="max-w-5xl mx-auto px-5 py-8 space-y-6">
        <section>
          <p className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">Campus</p>
          <h1 className="text-3xl font-bold mt-2">{campus?.name ?? 'Join your class'}</h1>
          <p className="text-muted mt-2 max-w-2xl">
            Your trainer’s class stream — notes, images, videos, links, exams, and results. Same idea as eMasomo, on
            this device.
          </p>
        </section>

        <form className="card flex flex-col sm:flex-row gap-3" onSubmit={join}>
          <input className={field} placeholder="Class code (e.g. PLB501)" value={code} onChange={(event) => setCode(event.target.value)} />
          <button className="btn-primary shrink-0" type="submit">Join class</button>
        </form>
        {note && <p className="text-sm text-success">{note}</p>}

        {mine.length > 1 && (
          <select className={field} value={room?.id} onChange={(event) => setClassId(event.target.value)}>
            {mine.map((item) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
        )}

        {!room ? (
          <p className="card text-sm text-muted">Ask your educator for the class code. Sample plumbing stream uses PLB501.</p>
        ) : (
          <>
            <section className="card">
              <h2 className="font-semibold">{room.title}</h2>
              <p className="text-sm text-muted mt-1">{room.programmeTitle} · trainer posts materials and marks here</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Notices & reminders</h2>
              {inbox.length === 0 ? (
                <p className="text-sm text-muted">No class notices yet. Trainers send these by free email, SMS, or inbox.</p>
              ) : (
                inbox.map((item) => (
                  <article key={item.id} className="card">
                    <p className="text-xs uppercase text-accent">{item.channel}</p>
                    <h3 className="font-semibold mt-1">{item.title}</h3>
                    <p className="text-sm text-muted mt-1">{item.body}</p>
                    {item.due && <p className="text-xs text-muted mt-2">When {item.due}</p>}
                  </article>
                ))
              )}
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Study materials</h2>
              {materials.filter((item) => item.classId === room.id).map((item) => (
                <article key={item.id} className="card space-y-2">
                  <p className="text-xs uppercase text-accent">{item.kind}</p>
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.body && <p className="text-sm text-muted">{item.body}</p>}
                  {item.kind === 'image' && item.url && (
                    <img src={item.url} alt={item.title} className="rounded-xl max-h-64 object-contain bg-black/30" />
                  )}
                  {item.url && item.kind !== 'image' && (
                    <a className="btn-secondary inline-flex text-sm" href={item.url} target="_blank" rel="noreferrer">
                      Open {item.kind}
                    </a>
                  )}
                  {item.assetId && (
                    <button type="button" className="btn-secondary text-sm" onClick={() => void openFile(item.assetId)}>
                      Open uploaded file
                    </button>
                  )}
                </article>
              ))}
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Exams</h2>
              {exams.filter((item) => item.classId === room.id && item.published).map((exam) => {
                const done = attempts.find((item) => item.examId === exam.id && item.learnerEmail.toLowerCase() === email.toLowerCase());
                return (
                  <article key={exam.id} className="card space-y-3">
                    <div className="flex justify-between gap-3">
                      <h3 className="font-semibold">{exam.title}</h3>
                      <span className="text-xs text-muted">Due {exam.due}</span>
                    </div>
                    {done ? (
                      <p className="text-sm text-accent">Submitted · {done.score}/{done.max}</p>
                    ) : (
                      <>
                        {exam.questions.map((question, index) => (
                          <fieldset key={question.id} className="space-y-2">
                            <legend className="text-sm">{index + 1}. {question.prompt}</legend>
                            {question.options.map((option, optionIndex) => {
                              const key = String.fromCharCode(97 + optionIndex) as 'a' | 'b' | 'c' | 'd';
                              return (
                                <label key={option} className="flex gap-2 text-sm text-muted">
                                  <input
                                    type="radio"
                                    name={question.id}
                                    checked={answers[question.id] === key}
                                    onChange={() => setAnswers({ ...answers, [question.id]: key })}
                                  />
                                  {option}
                                </label>
                              );
                            })}
                          </fieldset>
                        ))}
                        <button type="button" className="btn-primary text-sm" onClick={() => sit(exam.id)}>
                          Submit exam
                        </button>
                      </>
                    )}
                  </article>
                );
              })}
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">My results</h2>
              {results
                .filter((item) => item.classId === room.id && item.learnerEmail.toLowerCase() === email.toLowerCase())
                .map((item) => (
                  <article key={item.id} className="card flex justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted">{item.remark}</p>
                    </div>
                    <span className="text-accent font-semibold">{item.score}/{item.max}</span>
                  </article>
                ))}
              {results.filter((item) => item.classId === room.id && item.learnerEmail.toLowerCase() === email.toLowerCase()).length === 0 && (
                <p className="text-sm text-muted">No posted marks yet.</p>
              )}
            </section>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
