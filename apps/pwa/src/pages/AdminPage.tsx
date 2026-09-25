import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { AnimationPreset, Lesson, ProgrammeTrack } from '@cyberlearn/types';
import { allLessons, builtInSkillPaths, getLesson } from '@/content';
import { buildProgrammeFromForm, useCurriculumStore } from '@/store/curriculumStore';
import {
  defaultPlatformSettings,
  type DeploymentMode,
  usePlatformStore,
} from '@/store/platformStore';
import AdminGate from '@/components/admin/AdminGate';
import CourseAnalytics from '@/components/admin/CourseAnalytics';
import BrandMark from '@/components/ui/BrandMark';
import ProfileButton from '@/components/ui/ProfileButton';
import { useT } from '@/i18n';
import { proposalLessons, useModerationStore, validateProposal } from '@/store/moderationStore';

const fieldClass = 'w-full rounded-xl bg-primary-dark border border-surface-light px-3 py-3';
const ANIMATION_PRESETS: AnimationPreset[] = ['pulse', 'gear', 'wave', 'weld', 'stitch', 'circuit'];

const emptyForm = {
  title: '',
  titleSw: '',
  description: '',
  track: 'trades' as ProgrammeTrack,
  certificationTarget: '',
  moduleTitle: '',
  briefing: '',
  learningOutcomes: '',
  sourceReferences: '',
  estimatedMinutes: 30,
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correct: 'a' as 'a' | 'b' | 'c' | 'd',
  lessonVideoUrl: '',
  lessonAudioUrl: '',
  lessonAnimation: '',
  questionVideoUrl: '',
  questionAudioUrl: '',
  questionAnimation: '',
  mustFinishMedia: false,
  includeWatchItem: true,
  practicalType: 'video' as 'none' | 'video' | 'audio' | 'photo',
  practicalPrompt: '',
  practicalRubric: '',
};

export default function AdminPage() {
  const t = useT();
  const [tab, setTab] = useState<'analytics' | 'curriculum' | 'validation' | 'settings'>('analytics');
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const paths = useCurriculumStore((state) => state.paths);
  const addProgramme = useCurriculumStore((state) => state.addProgramme);
  const removeProgramme = useCurriculumStore((state) => state.removeProgramme);
  const applications = useModerationStore((state) => state.applications);
  const proposals = useModerationStore((state) => state.proposals);
  const reviewApplication = useModerationStore((state) => state.reviewApplication);
  const reviewProposal = useModerationStore((state) => state.reviewProposal);

  const publish = (event: FormEvent) => {
    event.preventDefault();
    const noteWords = form.briefing.trim().split(/\s+/).filter(Boolean).length;
    const outcomes = form.learningOutcomes.split('\n').filter((item) => item.trim());
    const references = form.sourceReferences.split('\n').filter((item) => item.trim());
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.question.trim() ||
      [form.optionA, form.optionB, form.optionC, form.optionD].some((item) => !item.trim()) ||
      outcomes.length < 2 ||
      references.length < 1 ||
      noteWords < 120
    ) {
      setMessage(
        'Validation failed: add all answer options, two learning outcomes, one source, and at least 120 words of study notes.'
      );
      return;
    }
    const built = buildProgrammeFromForm(form);
    addProgramme(built.path, built.lesson);
    setForm(emptyForm);
    setMessage(t('adminSaved'));
  };

  const exportJson = () => {
    const blob = new Blob(
      [JSON.stringify({ paths, lessons: useCurriculumStore.getState().lessons }, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'empower-curriculum.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminGate>
    <div className="min-h-dvh bg-primary-dark text-white">
      <header className="flex items-center justify-between px-5 py-4 max-w-5xl mx-auto border-b border-surface-light">
        <Link to="/" className="flex items-center gap-2">
          <BrandMark size="sm" />
          <span className="font-semibold">{t('brand')}</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/learn/skill-tree" className="text-sm text-muted hover:text-white">
            {t('programmes')}
          </Link>
          <ProfileButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8 space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{t('adminKicker')}</p>
          <h1 className="text-3xl font-bold mt-1">{t('adminTitle')}</h1>
          <p className="text-muted mt-2 max-w-2xl leading-relaxed">{t('adminHelp')}</p>
        </div>

        <>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={tab === 'analytics' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setTab('analytics')}
              >
                {t('analyticsTitle')}
              </button>
              <button
                type="button"
                className={tab === 'validation' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setTab('validation')}
              >
                Validation queue ({applications.filter((item) => item.status === 'pending').length +
                  proposals.filter((item) => item.status === 'pending').length})
              </button>
              <button
                type="button"
                className={tab === 'curriculum' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setTab('curriculum')}
              >
                {t('adminTabCurriculum')}
              </button>
              <button
                type="button"
                className={tab === 'settings' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setTab('settings')}
              >
                {t('adminTabSettings')}
              </button>
            </div>

            {tab === 'analytics' ? (
              <CourseAnalytics />
            ) : tab === 'curriculum' ? (
              <>
                <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{t('studioTitle')}</h2>
                    <p className="text-sm text-muted mt-1">{t('studioHelp')}</p>
                  </div>
                  <Link to="/curriculum" className="btn-primary text-center">
                    {t('studioOpen')}
                  </Link>
                </div>
                <form className="card grid gap-3 md:grid-cols-2" onSubmit={publish}>
                  <h2 className="md:col-span-2 text-lg font-semibold">{t('adminNewProgramme')}</h2>
                  <input
                    className={fieldClass}
                    placeholder={t('adminTitleEn')}
                    value={form.title}
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                  />
                  <input
                    className={fieldClass}
                    placeholder={t('adminTitleSw')}
                    value={form.titleSw}
                    onChange={(event) => setForm({ ...form, titleSw: event.target.value })}
                  />
                  <textarea
                    className={`md:col-span-2 min-h-[88px] ${fieldClass}`}
                    placeholder={t('adminDescription')}
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                  />
                  <select
                    className={fieldClass}
                    value={form.track}
                    onChange={(event) => setForm({ ...form, track: event.target.value as ProgrammeTrack })}
                  >
                    <option value="trades">{t('tradesTrack')}</option>
                    <option value="tvet">{t('tvetTrack')}</option>
                    <option value="cybersecurity">{t('cyberTrack')}</option>
                  </select>
                  <input
                    className={fieldClass}
                    placeholder={t('adminCert')}
                    value={form.certificationTarget}
                    onChange={(event) => setForm({ ...form, certificationTarget: event.target.value })}
                  />
                  <input
                    className={`md:col-span-2 ${fieldClass}`}
                    placeholder={t('adminModule')}
                    value={form.moduleTitle}
                    onChange={(event) => setForm({ ...form, moduleTitle: event.target.value })}
                  />
                  <textarea
                    className={`md:col-span-2 min-h-[120px] ${fieldClass}`}
                    placeholder={'Learning outcomes — one per line (minimum two)'}
                    value={form.learningOutcomes}
                    onChange={(event) => setForm({ ...form, learningOutcomes: event.target.value })}
                  />
                  <textarea
                    className={`md:col-span-2 min-h-[260px] ${fieldClass}`}
                    placeholder={`${t('adminBriefing')} — minimum 120 words. Include theory, PPE, tools, procedure, quality tests, common faults, and a local workshop task.`}
                    value={form.briefing}
                    onChange={(event) => setForm({ ...form, briefing: event.target.value })}
                  />
                  <textarea
                    className={`md:col-span-2 min-h-[100px] ${fieldClass}`}
                    placeholder={'Sources and standards — one per line (CDACC/NITA unit, manual, law, or professional standard)'}
                    value={form.sourceReferences}
                    onChange={(event) => setForm({ ...form, sourceReferences: event.target.value })}
                  />
                  <label className="text-sm text-muted">
                    Estimated lesson minutes
                    <input
                      type="number"
                      min={10}
                      className={`${fieldClass} mt-1`}
                      value={form.estimatedMinutes}
                      onChange={(event) =>
                        setForm({ ...form, estimatedMinutes: Number(event.target.value) || 30 })
                      }
                    />
                  </label>

                  <h3 className="md:col-span-2 text-sm font-semibold text-accent mt-2">{t('adminLessonMedia')}</h3>
                  <p className="md:col-span-2 text-xs text-muted -mt-1">{t('adminMediaHelp')}</p>
                  <MediaFields
                    video={form.lessonVideoUrl}
                    audio={form.lessonAudioUrl}
                    animation={form.lessonAnimation}
                    onVideo={(lessonVideoUrl) => setForm({ ...form, lessonVideoUrl })}
                    onAudio={(lessonAudioUrl) => setForm({ ...form, lessonAudioUrl })}
                    onAnimation={(lessonAnimation) => setForm({ ...form, lessonAnimation })}
                  />

                  <h3 className="md:col-span-2 text-sm font-semibold text-accent mt-2">{t('adminQuestionMedia')}</h3>
                  <MediaFields
                    video={form.questionVideoUrl}
                    audio={form.questionAudioUrl}
                    animation={form.questionAnimation}
                    onVideo={(questionVideoUrl) => setForm({ ...form, questionVideoUrl })}
                    onAudio={(questionAudioUrl) => setForm({ ...form, questionAudioUrl })}
                    onAnimation={(questionAnimation) => setForm({ ...form, questionAnimation })}
                  />
                  <label className="text-sm text-muted flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.mustFinishMedia}
                      onChange={(event) => setForm({ ...form, mustFinishMedia: event.target.checked })}
                    />
                    {t('adminMustFinish')}
                  </label>

                  <h3 className="md:col-span-2 text-sm font-semibold text-accent mt-2">
                    Practical evidence answer
                  </h3>
                  <select
                    className={fieldClass}
                    value={form.practicalType}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        practicalType: event.target.value as 'none' | 'video' | 'audio' | 'photo',
                      })
                    }
                  >
                    <option value="video">Learner records / uploads video</option>
                    <option value="photo">Learner captures / uploads photo</option>
                    <option value="audio">Learner records oral answer</option>
                    <option value="none">No practical evidence</option>
                  </select>
                  {form.practicalType !== 'none' && (
                    <>
                      <textarea
                        className={`md:col-span-2 min-h-[88px] ${fieldClass}`}
                        placeholder="Practical task prompt — say exactly what must be shown or explained"
                        value={form.practicalPrompt}
                        onChange={(event) => setForm({ ...form, practicalPrompt: event.target.value })}
                      />
                      <textarea
                        className={`md:col-span-2 min-h-[100px] ${fieldClass}`}
                        placeholder={'Safety and quality rubric — one item per line\nPPE visible\nCorrect sequence shown\nFinished work tested'}
                        value={form.practicalRubric}
                        onChange={(event) => setForm({ ...form, practicalRubric: event.target.value })}
                      />
                    </>
                  )}
                  <label className="text-sm text-muted flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.includeWatchItem}
                      onChange={(event) => setForm({ ...form, includeWatchItem: event.target.checked })}
                    />
                    {t('adminWatchItem')}
                  </label>

                  <input
                    className={`md:col-span-2 ${fieldClass}`}
                    placeholder={t('adminQuestion')}
                    value={form.question}
                    onChange={(event) => setForm({ ...form, question: event.target.value })}
                  />
                  <input
                    className={fieldClass}
                    placeholder="A"
                    value={form.optionA}
                    onChange={(event) => setForm({ ...form, optionA: event.target.value })}
                  />
                  <input
                    className={fieldClass}
                    placeholder="B"
                    value={form.optionB}
                    onChange={(event) => setForm({ ...form, optionB: event.target.value })}
                  />
                  <input
                    className={fieldClass}
                    placeholder="C"
                    value={form.optionC}
                    onChange={(event) => setForm({ ...form, optionC: event.target.value })}
                  />
                  <input
                    className={fieldClass}
                    placeholder="D"
                    value={form.optionD}
                    onChange={(event) => setForm({ ...form, optionD: event.target.value })}
                  />
                  <label className="text-sm text-muted flex items-center gap-2">
                    {t('adminCorrect')}
                    <select
                      className="rounded-lg bg-primary-dark border border-surface-light px-2 py-1"
                      value={form.correct}
                      onChange={(event) => setForm({ ...form, correct: event.target.value as 'a' | 'b' | 'c' | 'd' })}
                    >
                      <option value="a">A</option>
                      <option value="b">B</option>
                      <option value="c">C</option>
                      <option value="d">D</option>
                    </select>
                  </label>
                  <div className="md:col-span-2 flex flex-wrap gap-2">
                    <button className="btn-primary" type="submit">
                      {t('adminPublish')}
                    </button>
                    <button className="btn-secondary" type="button" onClick={exportJson}>
                      {t('adminExport')}
                    </button>
                  </div>
                  {message && <p className="md:col-span-2 text-sm text-accent">{message}</p>}
                </form>

                <section>
                  <h2 className="text-lg font-semibold mb-3">{t('adminCustomList')}</h2>
                  {paths.length === 0 && <p className="text-sm text-muted">{t('adminNoCustom')}</p>}
                  <div className="grid gap-3">
                    {paths.map((path) => (
                      <article key={path.id} className="card flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{path.title}</h3>
                          <p className="text-sm text-muted mt-1">{path.description}</p>
                        </div>
                        <button className="text-xs text-danger" type="button" onClick={() => removeProgramme(path.id)}>
                          {t('adminRemove')}
                        </button>
                      </article>
                    ))}
                  </div>
                </section>

                <section>
                  <LocalLessonEditor />
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">{t('adminBuiltIn')}</h2>
                  <p className="text-sm text-muted mb-3">{t('adminBuiltInHelp')}</p>
                  <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                    {builtInSkillPaths.map((path) => (
                      <li key={path.id} className="card !py-3">
                        {path.title}
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            ) : tab === 'validation' ? (
              <section className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold">Educator verification</h2>
                  <p className="text-sm text-muted mt-2">
                    Verify identity, qualifications, references, and relevant trade experience. Approval permits
                    proposals only; it never permits direct publishing.
                  </p>
                  <div className="grid gap-3 mt-4">
                    {applications.length === 0 && <p className="text-sm text-muted">No applications yet.</p>}
                    {applications.map((application) => (
                      <article key={application.id} className="card">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold">{application.displayName}</h3>
                            <p className="text-xs text-muted">{application.email} · {application.phone} · {application.county}</p>
                          </div>
                          <span className="text-xs uppercase text-accent">{application.status}</span>
                        </div>
                        <dl className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
                          <div><dt className="text-muted">Institution</dt><dd>{application.institution}</dd></div>
                          <div><dt className="text-muted">Experience</dt><dd>{application.experienceYears} years</dd></div>
                          <div><dt className="text-muted">Trade areas</dt><dd>{application.tradeAreas}</dd></div>
                          <div><dt className="text-muted">Qualifications</dt><dd>{application.qualifications}</dd></div>
                        </dl>
                        <p className="text-sm mt-4 leading-relaxed">{application.statement}</p>
                        {application.status === 'pending' && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() => reviewApplication(application.id, 'approved', 'Credentials verified by curriculum admin.')}
                            >
                              Verify educator
                            </button>
                            <button
                              type="button"
                              className="btn-secondary text-danger"
                              onClick={() => reviewApplication(application.id, 'rejected', 'Credentials or experience need further verification.')}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold">Curriculum validation</h2>
                  <p className="text-sm text-muted mt-2">
                    Content remains invisible to learners until every quality check passes and an administrator publishes it.
                  </p>
                  <div className="grid gap-3 mt-4">
                    {proposals.length === 0 && <p className="text-sm text-muted">No course proposals yet.</p>}
                    {proposals.map((proposal) => {
                      const validation = validateProposal(proposal);
                      return (
                        <article key={proposal.id} className="card">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="font-semibold">{proposal.path.title}</h3>
                              <p className="text-xs text-muted">
                                {proposal.lesson.title} · by {proposal.educatorName}
                              </p>
                            </div>
                            <span className="text-xs uppercase text-accent">{proposal.status}</span>
                          </div>
                          <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
                            {validation.checks.map((check) => (
                              <li key={check.label} className={check.pass ? 'text-success' : 'text-danger'}>
                                {check.pass ? '✓' : '×'} {check.label}
                              </li>
                            ))}
                          </ul>
                          <details className="mt-4">
                            <summary className="cursor-pointer text-sm text-accent">Review full study notes and sources</summary>
                            <div className="mt-3 text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                              {proposal.lesson.briefing}
                            </div>
                          </details>
                          {proposal.status === 'pending' && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              <button
                                type="button"
                                className="btn-primary"
                                disabled={!validation.valid}
                                onClick={() => {
                                  addProgramme(proposal.path, proposalLessons(proposal));
                                  reviewProposal(proposal.id, 'approved', 'Validated and published by curriculum admin.');
                                }}
                              >
                                Validate & publish
                              </button>
                              <button
                                type="button"
                                className="btn-secondary text-danger"
                                onClick={() =>
                                  reviewProposal(
                                    proposal.id,
                                    'rejected',
                                    validation.valid
                                      ? 'Returned for subject-matter revisions.'
                                      : 'Returned because required validation checks did not pass.'
                                  )
                                }
                              >
                                Return for revision
                              </button>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </div>
              </section>
            ) : (
              <ArchitectureSettings />
            )}
          </>
      </main>
    </div>
    </AdminGate>
  );
}

function LocalLessonEditor() {
  const storedLessons = useCurriculumStore((state) => state.lessons);
  const saveLesson = useCurriculumStore((state) => state.saveLesson);
  const removeLesson = useCurriculumStore((state) => state.removeLesson);
  const choices = useMemo(() => {
    const byId = new Map<string, Lesson>();
    for (const lesson of allLessons) byId.set(lesson.id, lesson);
    for (const lesson of Object.values(storedLessons)) byId.set(lesson.id, lesson);
    return [...byId.values()].sort((a, b) => a.title.localeCompare(b.title));
  }, [storedLessons]);
  const [selectedId, setSelectedId] = useState(choices[0]?.id ?? '');
  const selected = selectedId ? getLesson(selectedId) : undefined;
  const isBuiltIn = Boolean(allLessons.some((lesson) => lesson.id === selectedId));
  const isOverridden = Boolean(storedLessons[selectedId] && isBuiltIn);
  const [title, setTitle] = useState('');
  const [titleSw, setTitleSw] = useState('');
  const [briefing, setBriefing] = useState('');
  const [minutes, setMinutes] = useState(30);
  const [videoUrl, setVideoUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!selected) return;
    setTitle(selected.title);
    setTitleSw(selected.titleSw ?? '');
    setBriefing(selected.briefing ?? '');
    setMinutes(selected.estimatedMinutes);
    setVideoUrl(selected.media?.find((asset) => asset.kind === 'video')?.url ?? '');
    setSaved(false);
  }, [selectedId, selected]);

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!selected || !title.trim() || briefing.trim().split(/\s+/).filter(Boolean).length < 80) return;
    const otherMedia = (selected.media ?? []).filter((asset) => asset.kind !== 'video');
    saveLesson({
      ...selected,
      title: title.trim(),
      titleSw: titleSw.trim() || undefined,
      briefing: briefing.trim(),
      estimatedMinutes: Math.max(10, minutes),
      media: videoUrl.trim()
        ? [{ kind: 'video', url: videoUrl.trim(), caption: 'Trainer demonstration' }, ...otherMedia]
        : otherMedia,
      contentVersion: `local-${Date.now()}`,
    });
    setSaved(true);
  };

  return (
    <form className="card grid md:grid-cols-2 gap-3" onSubmit={save}>
      <div className="md:col-span-2">
        <h2 className="text-lg font-semibold">Local curriculum editor</h2>
        <p className="text-sm text-muted mt-1">
          Edit any shipped or custom lesson. Changes are stored on this device as an override and included in
          curriculum JSON export; the original packaged lesson remains available to restore.
        </p>
      </div>
      <label className="md:col-span-2 text-sm text-muted">
        Lesson
        <select
          className={`${fieldClass} mt-1`}
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
        >
          {choices.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.courseId} · {lesson.title}
            </option>
          ))}
        </select>
      </label>
      <input
        className={fieldClass}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Lesson title"
        required
      />
      <input
        className={fieldClass}
        value={titleSw}
        onChange={(event) => setTitleSw(event.target.value)}
        placeholder="Kiswahili title"
      />
      <textarea
        className={`md:col-span-2 min-h-[300px] ${fieldClass}`}
        value={briefing}
        onChange={(event) => setBriefing(event.target.value)}
        placeholder="Detailed study notes (minimum 80 words)"
        required
      />
      <label className="text-sm text-muted">
        Estimated minutes
        <input
          className={`${fieldClass} mt-1`}
          type="number"
          min={10}
          value={minutes}
          onChange={(event) => setMinutes(Number(event.target.value) || 30)}
        />
      </label>
      <label className="text-sm text-muted">
        Demonstration video URL
        <input
          className={`${fieldClass} mt-1`}
          type="url"
          value={videoUrl}
          onChange={(event) => setVideoUrl(event.target.value)}
          placeholder="https://…"
        />
      </label>
      <div className="md:col-span-2 flex flex-wrap gap-2">
        <button className="btn-primary" type="submit">
          Save local version
        </button>
        {isOverridden && (
          <button
            className="btn-secondary"
            type="button"
            onClick={() => {
              removeLesson(selectedId);
              setSaved(false);
            }}
          >
            Restore packaged version
          </button>
        )}
      </div>
      {saved && <p className="md:col-span-2 text-sm text-success">Local lesson version saved.</p>}
    </form>
  );
}

function MediaFields({
  video,
  audio,
  animation,
  onVideo,
  onAudio,
  onAnimation,
}: {
  video: string;
  audio: string;
  animation: string;
  onVideo: (value: string) => void;
  onAudio: (value: string) => void;
  onAnimation: (value: string) => void;
}) {
  const t = useT();
  const isPreset = ANIMATION_PRESETS.includes(animation as AnimationPreset);
  const [useCustomUrl, setUseCustomUrl] = useState(() => Boolean(animation) && !isPreset);
  const selectValue = useCustomUrl ? 'url' : animation;
  return (
    <>
      <input
        className={fieldClass}
        placeholder={t('adminVideoUrl')}
        value={video}
        onChange={(event) => onVideo(event.target.value)}
      />
      <input
        className={fieldClass}
        placeholder={t('adminAudioUrl')}
        value={audio}
        onChange={(event) => onAudio(event.target.value)}
      />
      <select
        className={fieldClass}
        value={selectValue}
        onChange={(event) => {
          const value = event.target.value;
          if (value === 'url') {
            setUseCustomUrl(true);
            if (isPreset) onAnimation('');
            return;
          }
          setUseCustomUrl(false);
          onAnimation(value);
        }}
      >
        <option value="">{t('adminAnimationNone')}</option>
        {ANIMATION_PRESETS.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
        <option value="url">{t('adminAnimationCustom')}</option>
      </select>
      {useCustomUrl && (
        <input
          className={fieldClass}
          placeholder={t('adminAnimationUrl')}
          value={isPreset ? '' : animation}
          onChange={(event) => onAnimation(event.target.value)}
        />
      )}
    </>
  );
}

function ArchitectureSettings() {
  const t = useT();
  const settings = usePlatformStore();
  const [saved, setSaved] = useState(false);

  const save = (event: FormEvent) => {
    event.preventDefault();
    settings.update({
      deploymentMode: settings.deploymentMode,
      apiBaseUrl: settings.apiBaseUrl.trim() || defaultPlatformSettings.apiBaseUrl,
      mediaCdnUrl: settings.mediaCdnUrl.trim(),
      requestTimeoutMs: Math.max(2000, settings.requestTimeoutMs),
      httpsMediaOnly: settings.httpsMediaOnly,
      allowedMediaHosts: settings.allowedMediaHosts,
      requireWatchBeforeContinue: settings.requireWatchBeforeContinue,
      enableAnimations: settings.enableAnimations,
      enableVideo: settings.enableVideo,
      enableAudio: settings.enableAudio,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form className="card grid gap-3 md:grid-cols-2" onSubmit={save}>
      <h2 className="md:col-span-2 text-lg font-semibold">{t('adminSettingsTitle')}</h2>
      <p className="md:col-span-2 text-sm text-muted leading-relaxed">{t('adminSettingsHelp')}</p>

      <label className="text-sm text-muted space-y-1">
        <span>{t('adminMode')}</span>
        <select
          className={fieldClass}
          value={settings.deploymentMode}
          onChange={(event) => settings.update({ deploymentMode: event.target.value as DeploymentMode })}
        >
          <option value="offline">{t('adminModeOffline')}</option>
          <option value="campus">{t('adminModeCampus')}</option>
          <option value="cloud">{t('adminModeCloud')}</option>
        </select>
      </label>
      <label className="text-sm text-muted space-y-1">
        <span>{t('adminTimeout')}</span>
        <input
          type="number"
          min={2000}
          className={fieldClass}
          value={settings.requestTimeoutMs}
          onChange={(event) => settings.update({ requestTimeoutMs: Number(event.target.value) || 8000 })}
        />
      </label>
      <label className="md:col-span-2 text-sm text-muted space-y-1">
        <span>{t('adminApiBase')}</span>
        <input
          className={fieldClass}
          value={settings.apiBaseUrl}
          onChange={(event) => settings.update({ apiBaseUrl: event.target.value })}
        />
      </label>
      <label className="md:col-span-2 text-sm text-muted space-y-1">
        <span>{t('adminMediaCdn')}</span>
        <input
          className={fieldClass}
          value={settings.mediaCdnUrl}
          onChange={(event) => settings.update({ mediaCdnUrl: event.target.value })}
        />
      </label>
      <label className="md:col-span-2 text-sm text-muted space-y-1">
        <span>{t('adminAllowedHosts')}</span>
        <input
          className={fieldClass}
          value={settings.allowedMediaHosts}
          onChange={(event) => settings.update({ allowedMediaHosts: event.target.value })}
        />
      </label>
      <p className="md:col-span-2 text-sm text-muted">{t('officeKeyHelp')}</p>

      <label className="text-sm text-muted flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.httpsMediaOnly}
          onChange={(event) => settings.update({ httpsMediaOnly: event.target.checked })}
        />
        {t('adminHttpsOnly')}
      </label>
      <label className="text-sm text-muted flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.requireWatchBeforeContinue}
          onChange={(event) => settings.update({ requireWatchBeforeContinue: event.target.checked })}
        />
        {t('adminRequireWatch')}
      </label>
      <label className="text-sm text-muted flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.enableAnimations}
          onChange={(event) => settings.update({ enableAnimations: event.target.checked })}
        />
        {t('adminEnableAnim')}
      </label>
      <label className="text-sm text-muted flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.enableVideo}
          onChange={(event) => settings.update({ enableVideo: event.target.checked })}
        />
        {t('adminEnableVideo')}
      </label>
      <label className="text-sm text-muted flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.enableAudio}
          onChange={(event) => settings.update({ enableAudio: event.target.checked })}
        />
        {t('adminEnableAudio')}
      </label>

      <div className="md:col-span-2 flex flex-wrap gap-2 mt-2">
        <button className="btn-primary" type="submit">
          {t('adminSettingsSave')}
        </button>
        <button
          className="btn-secondary"
          type="button"
          onClick={() => {
            settings.reset();
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2500);
          }}
        >
          {t('adminSettingsReset')}
        </button>
      </div>
      {saved && <p className="md:col-span-2 text-sm text-accent">{t('adminSettingsSaved')}</p>}
    </form>
  );
}
