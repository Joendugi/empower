import { FormEvent, useMemo, useState } from 'react';
import { getLesson, getSkillPaths } from '@/content';
import { saveAsset } from '@/lib/assetStore';
import { downloadText, buildScanPdf } from '@/lib/scanPdf';
import { scanCodeFor } from '@/lib/qrV1';
import { useCampusCatalogue } from '@/store/campusCatalogue';

const field =
  'w-full rounded-xl bg-primary-dark border border-surface-light px-3 py-3 text-white placeholder:text-muted';

export default function CatalogueEditor({
  actorEmail,
  actorName,
  initialPathId = 'plumbing',
}: {
  actorEmail: string;
  actorName: string;
  initialPathId?: string;
}) {
  const paths = useMemo(() => getSkillPaths(), []);
  const overlays = useCampusCatalogue((state) => state.overlays);
  const upsertOverlay = useCampusCatalogue((state) => state.upsertOverlay);
  const addPdf = useCampusCatalogue((state) => state.addPdf);
  const setLock = useCampusCatalogue((state) => state.setLock);
  const exportOverlays = useCampusCatalogue((state) => state.exportOverlays);
  const [pathId, setPathId] = useState(initialPathId);
  const path = paths.find((item) => item.id === pathId) ?? paths[0];
  const overlay = overlays[pathId];
  const firstLessonId = path?.nodes[0]?.lessonIds[0] ?? '';
  const firstLesson = firstLessonId ? getLesson(firstLessonId) : undefined;
  const [form, setForm] = useState({
    title: overlay?.title ?? path?.title ?? '',
    description: overlay?.description ?? path?.description ?? '',
    educatorName: overlay?.educatorName ?? actorName,
    school: overlay?.school ?? '',
    relatedIds: (overlay?.relatedIds ?? []).join(', '),
    briefing: overlay?.lessonBriefings[firstLessonId] ?? firstLesson?.briefing ?? '',
    password: '',
  });
  const [note, setNote] = useState('');

  const reloadForm = (nextId: string) => {
    const nextPath = paths.find((item) => item.id === nextId);
    const nextOverlay = overlays[nextId];
    const lessonId = nextPath?.nodes[0]?.lessonIds[0] ?? '';
    const lesson = lessonId ? getLesson(lessonId) : undefined;
    setPathId(nextId);
    setForm({
      title: nextOverlay?.title ?? nextPath?.title ?? '',
      description: nextOverlay?.description ?? nextPath?.description ?? '',
      educatorName: nextOverlay?.educatorName ?? actorName,
      school: nextOverlay?.school ?? '',
      relatedIds: (nextOverlay?.relatedIds ?? []).join(', '),
      briefing: nextOverlay?.lessonBriefings[lessonId] ?? lesson?.briefing ?? '',
      password: '',
    });
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!path) return;
    upsertOverlay(
      path.id,
      {
        title: form.title.trim(),
        description: form.description.trim(),
        educatorName: form.educatorName.trim(),
        school: form.school.trim(),
        relatedIds: form.relatedIds
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        lessonBriefings: firstLessonId ? { [firstLessonId]: form.briefing } : {},
      },
      actorEmail
    );
    setNote('Campus copy updated. Learners see this without editing the shipped files.');
  };

  const attachPdf = async (file: File | null) => {
    if (!file || !path) return;
    const stored = await saveAsset(file, file.name);
    addPdf(path.id, { title: file.name, assetId: stored.id, scannable: file.type === 'application/pdf' }, actorEmail);
    setNote('PDF attached. Prefer a text PDF, not a photo of a page.');
  };

  const makeScanCard = () => {
    if (!path) return;
    const url = `${window.location.origin}/s/${path.id}`;
    const pdf = buildScanPdf({
      title: form.title || path.title,
      school: form.school,
      educatorName: form.educatorName,
      url,
      pathId: path.id,
    });
    downloadText(`${path.id}-scan-card.pdf`, pdf);
    addPdf(
      path.id,
      { title: `${path.title} scan card`, url: `${url}`, scannable: true },
      actorEmail
    );
    setNote(`Scan card downloaded. Code ${scanCodeFor(path.id)} opens ${url}.`);
  };

  const changeLock = async (mode: 'set' | 'free') => {
    if (!path) return;
    if (mode === 'free') {
      await setLock(path.id, null, actorEmail);
      setNote('Material is free on this device.');
      return;
    }
    if (form.password.length < 4) {
      setNote('Use at least 4 characters, or leave it free.');
      return;
    }
    await setLock(path.id, form.password, actorEmail);
    setForm({ ...form, password: '' });
    setNote('Password saved. You can change it any time from this form.');
  };

  const downloadOverlay = () => {
    downloadText('campus-catalogue.json', exportOverlays(), 'application/json');
    setNote('Downloaded campus overlay JSON. Keep this as the admin copy of shipped-file edits.');
  };

  if (!path) return null;

  return (
    <div className="space-y-4">
      <form className="card grid md:grid-cols-2 gap-3" onSubmit={save}>
        <h3 className="md:col-span-2 font-semibold">Update campus catalogue</h3>
        <p className="md:col-span-2 text-sm text-muted">
          Shipped YAML/TS stays as the factory copy. This form writes an overlay the next learner load uses.
        </p>
        <select className={field} value={pathId} onChange={(event) => reloadForm(event.target.value)}>
          {paths.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
        <input
          className={field}
          placeholder="Educator name"
          value={form.educatorName}
          onChange={(event) => setForm({ ...form, educatorName: event.target.value })}
        />
        <input
          className={field}
          placeholder="School / polytechnic"
          value={form.school}
          onChange={(event) => setForm({ ...form, school: event.target.value })}
        />
        <input
          className={`md:col-span-2 ${field}`}
          placeholder="Programme title"
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
        />
        <textarea
          className={`md:col-span-2 min-h-24 ${field}`}
          placeholder="What learners can do"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
        <textarea
          className={`md:col-span-2 min-h-32 ${field}`}
          placeholder="First-week notes overlay (replaces the shipped briefing on this device)"
          value={form.briefing}
          onChange={(event) => setForm({ ...form, briefing: event.target.value })}
        />
        <input
          className={`md:col-span-2 ${field}`}
          placeholder="Related programme ids, comma separated (e.g. electrical-installation, solar-energy)"
          value={form.relatedIds}
          onChange={(event) => setForm({ ...form, relatedIds: event.target.value })}
        />
        <button className="btn-primary md:col-span-2" type="submit">
          Save campus copy
        </button>
      </form>

      <section className="card space-y-3">
        <h3 className="font-semibold">Scannable PDF</h3>
        <p className="text-sm text-muted">
          Generate a text-layer scan card with a camera QR, or attach a text PDF. Photo-of-a-page PDFs cannot be
          searched.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary text-sm" onClick={makeScanCard}>
            Download scan card PDF
          </button>
          <label className="btn-secondary text-sm cursor-pointer">
            Attach PDF
            <input
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={(event) => void attachPdf(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      </section>

      <section className="card space-y-3">
        <h3 className="font-semibold">Lock or leave free</h3>
        <p className="text-sm text-muted">
          {overlay?.lockHash ? 'This programme is locked. Change the password or open it.' : 'This programme is free.'}
        </p>
        <input
          className={field}
          type="password"
          placeholder="New material password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary text-sm" onClick={() => void changeLock('set')}>
            Set / change password
          </button>
          <button type="button" className="btn-secondary text-sm" onClick={() => void changeLock('free')}>
            Leave free
          </button>
        </div>
      </section>

      <button type="button" className="btn-secondary" onClick={downloadOverlay}>
        Download overlay JSON
      </button>
      {note && <p className="text-sm text-success">{note}</p>}
    </div>
  );
}
