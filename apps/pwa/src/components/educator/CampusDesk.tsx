import { FormEvent, useMemo, useState } from 'react';
import { publicProgrammes } from '@/content/publicStudies';
import { getStaffKey } from '@/lib/adminAccess';
import { api } from '@/lib/api';
import { saveAsset } from '@/lib/assetStore';
import { reminderText } from '@/lib/notify';
import { useNoticeStore } from '@/store/noticeStore';
import { useEducatorStore } from '@/store/educatorStore';
import type { NoticeChannel } from '@/lib/notify';
import { phoneError, sanitizePhoneInput } from '@/lib/validate';
import {
  classesForEducator,
  useCampusHub,
  type MaterialKind,
} from '@/store/campusHub';

const field =
  'w-full rounded-xl bg-primary-dark border border-surface-light px-3 py-3 text-white placeholder:text-muted';

type Pane = 'classes' | 'roster' | 'materials' | 'exams' | 'results' | 'notices';

export default function CampusDesk({
  educatorEmail,
  educatorName,
}: {
  educatorEmail: string;
  educatorName: string;
}) {
  const campuses = useCampusHub((state) => state.campuses);
  const classes = useCampusHub((state) => state.classes);
  const roster = useCampusHub((state) => state.roster);
  const materials = useCampusHub((state) => state.materials);
  const exams = useCampusHub((state) => state.exams);
  const results = useCampusHub((state) => state.results);
  const submissions = useEducatorStore((state) => state.submissions);
  const createCampus = useCampusHub((state) => state.createCampus);
  const createClass = useCampusHub((state) => state.createClass);
  const addLearner = useCampusHub((state) => state.addLearner);
  const addMaterial = useCampusHub((state) => state.addMaterial);
  const addExam = useCampusHub((state) => state.addExam);
  const setExamPublished = useCampusHub((state) => state.setExamPublished);
  const recordResult = useCampusHub((state) => state.recordResult);
  const notices = useNoticeStore((state) => state.notices);
  const postNotice = useNoticeStore((state) => state.postNotice);

  const mine = useMemo(() => classesForEducator(educatorEmail), [classes, campuses, educatorEmail]);
  const [pane, setPane] = useState<Pane>('classes');
  const [classId, setClassId] = useState(mine[0]?.id ?? 'class-plb-morning');
  const room = mine.find((item) => item.id === classId) ?? mine[0];
  const campus = campuses.find((item) => item.id === room?.campusId);
  const [note, setNote] = useState('');

  const [campusForm, setCampusForm] = useState({ name: '', county: 'Nairobi' });
  const [classForm, setClassForm] = useState({ title: '', programmeId: 'plumbing' });
  const [learnerForm, setLearnerForm] = useState({ name: '', email: '', phone: '' });
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    body: '',
    due: '',
    channel: 'email' as NoticeChannel | 'inbox',
  });
  const [materialForm, setMaterialForm] = useState({
    kind: 'link' as MaterialKind,
    title: '',
    url: '',
    body: '',
  });
  const [examForm, setExamForm] = useState({
    title: '',
    due: '',
    prompt: '',
    a: '',
    b: '',
    c: '',
    d: '',
    correct: 'b' as 'a' | 'b' | 'c' | 'd',
  });
  const [resultForm, setResultForm] = useState({ email: '', name: '', title: '', score: '', max: '100', remark: '' });

  const roomRoster = roster.filter((item) => item.classId === room?.id);
  const roomMaterials = materials.filter((item) => item.classId === room?.id);
  const roomExams = exams.filter((item) => item.classId === room?.id);
  const roomResults = results.filter((item) => item.classId === room?.id);
  const roomWork = submissions.filter((item) => !room || item.programmeId === room.programmeId);

  const makeCampus = (event: FormEvent) => {
    event.preventDefault();
    const next = createCampus({
      name: campusForm.name.trim(),
      county: campusForm.county.trim(),
      educatorEmail,
      educatorName,
    });
    setCampusForm({ name: '', county: 'Nairobi' });
    setNote(`Campus created. Institution code ${next.joinCode}.`);
  };

  const makeClass = (event: FormEvent) => {
    event.preventDefault();
    const campusId = campus?.id ?? createCampus({
      name: campusForm.name.trim() || `${educatorName}'s campus`,
      county: campusForm.county || 'Nairobi',
      educatorEmail,
      educatorName,
    }).id;
    const programme = publicProgrammes.find((item) => item.id === classForm.programmeId);
    const next = createClass({
      campusId,
      title: classForm.title.trim(),
      programmeId: classForm.programmeId,
      programmeTitle: programme?.title ?? classForm.programmeId,
    });
    setClassId(next.id);
    setClassForm({ title: '', programmeId: 'plumbing' });
    setNote(`Class opened. Learners join with ${next.joinCode}.`);
  };

  const enroll = (event: FormEvent) => {
    event.preventDefault();
    if (!room) return;
    if (learnerForm.phone.trim()) {
      const invalid = phoneError(learnerForm.phone);
      if (invalid) {
        setNote(invalid);
        return;
      }
    }
    const added = addLearner({ classId: room.id, name: learnerForm.name, email: learnerForm.email, phone: learnerForm.phone });
    setLearnerForm({ name: '', email: '', phone: '' });
    setNote(added ? `${added.name} is on the roster.` : 'That email is already in this class.');
  };

  const saveMaterial = async (event: FormEvent) => {
    event.preventDefault();
    if (!room) return;
    addMaterial({
      classId: room.id,
      kind: materialForm.kind,
      title: materialForm.title.trim(),
      url: materialForm.url.trim() || undefined,
      body: materialForm.body.trim() || undefined,
    });
    setMaterialForm({ kind: materialForm.kind, title: '', url: '', body: '' });
    setNote('Material is on the class shelf. Learners see it after they join.');
  };

  const attachFile = async (file: File | null, kind: MaterialKind) => {
    if (!file || !room) return;
    const stored = await saveAsset(file, file.name);
    addMaterial({
      classId: room.id,
      kind,
      title: file.name,
      assetId: stored.id,
    });
    setNote(`${file.name} stored for this class.`);
  };

  const publishExam = (event: FormEvent) => {
    event.preventDefault();
    if (!room) return;
    addExam({
      classId: room.id,
      title: examForm.title.trim(),
      due: examForm.due,
      published: true,
      questions: [
        {
          id: 'q1',
          prompt: examForm.prompt.trim(),
          options: [examForm.a, examForm.b, examForm.c, examForm.d],
          correct: examForm.correct,
        },
      ],
    });
    setExamForm({ title: '', due: '', prompt: '', a: '', b: '', c: '', d: '', correct: 'b' });
    setNote('Exam published. Learners sit it from Campus.');
  };

  const sendNotice = async (event: FormEvent) => {
    event.preventDefault();
    if (!room) return;
    const emails = roomRoster.map((item) => item.email);
    const phones = roomRoster.map((item) => item.phone).filter((item): item is string => Boolean(item));
    if (noticeForm.channel === 'sms' && phones.length === 0) {
      setNote('Add phone numbers on the roster first, or send by email / inbox.');
      return;
    }
    if (noticeForm.channel === 'email' && emails.length === 0) {
      setNote('Add learners to the roster first.');
      return;
    }
    let mailed = false;
    if (noticeForm.channel === 'email') {
      try {
        const staffKey = getStaffKey();
        await api<{ mailed?: number }>('/notices/email', {
          method: 'POST',
          headers: staffKey ? { 'X-Staff-Key': staffKey } : undefined,
          body: JSON.stringify({
            subject: noticeForm.title.trim(),
            body: reminderText({
              title: noticeForm.title,
              body: noticeForm.body,
              campus: campus?.name,
              due: noticeForm.due || undefined,
            }),
            emails,
          }),
        });
        mailed = true;
      } catch {
        /* SMTP unset or offline — open the free mail app */
      }
    }
    postNotice({
      classId: room.id,
      title: noticeForm.title,
      body: noticeForm.body,
      due: noticeForm.due || undefined,
      channel: noticeForm.channel,
      audienceEmails: emails,
      phones,
      campus: campus?.name,
      createdBy: educatorName,
      skipDispatch: mailed,
    });
    setNoticeForm({ title: '', body: '', due: '', channel: noticeForm.channel });
    setNote(
      mailed
        ? 'The platform emailed the class. A copy is also on Campus inbox.'
        : noticeForm.channel === 'inbox'
          ? 'Notice posted to the class inbox on Campus.'
          : 'Your email or SMS app opened. Send that message to deliver the reminder — no paid gateway.'
    );
  };

  const saveResult = (event: FormEvent) => {
    event.preventDefault();
    if (!room) return;
    recordResult({
      classId: room.id,
      learnerEmail: resultForm.email.trim(),
      learnerName: resultForm.name.trim(),
      title: resultForm.title.trim(),
      score: Number(resultForm.score) || 0,
      max: Number(resultForm.max) || 100,
      remark: resultForm.remark.trim(),
      recordedBy: educatorName,
    });
    setResultForm({ email: '', name: '', title: '', score: '', max: '100', remark: '' });
    setNote('Result posted. The learner sees it on Campus.');
  };

  return (
    <section className="space-y-4">
      <div className="card">
        <p className="text-xs uppercase tracking-wider text-accent font-semibold">Campus</p>
        <h2 className="text-xl font-semibold mt-1">{campus?.name ?? 'Open a campus'}</h2>
        <p className="text-sm text-muted mt-2">
          Like eMasomo: one institution, class streams, a roster, exams, results, and a shelf for images, videos, and
          links. Learners join with a class code at /campus.
        </p>
        {room && (
          <p className="text-sm text-accent mt-3">
            {room.title} · class code {room.joinCode}
            {campus ? ` · campus code ${campus.joinCode}` : ''}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {(['classes', 'roster', 'materials', 'exams', 'results', 'notices'] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={pane === item ? 'btn-primary !py-2 !px-3 text-xs' : 'btn-secondary !py-2 !px-3 text-xs'}
              onClick={() => setPane(item)}
            >
              {item}
            </button>
          ))}
        </div>
        {mine.length > 1 && (
          <select className={`${field} mt-3`} value={room?.id} onChange={(event) => setClassId(event.target.value)}>
            {mine.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} ({item.joinCode})
              </option>
            ))}
          </select>
        )}
      </div>

      {pane === 'classes' && (
        <div className="grid md:grid-cols-2 gap-4">
          <form className="card grid gap-3" onSubmit={makeCampus}>
            <h3 className="font-semibold">Create campus</h3>
            <input className={field} placeholder="Institution name" value={campusForm.name} onChange={(event) => setCampusForm({ ...campusForm, name: event.target.value })} required />
            <input className={field} placeholder="County" value={campusForm.county} onChange={(event) => setCampusForm({ ...campusForm, county: event.target.value })} />
            <button className="btn-primary" type="submit">Create campus</button>
          </form>
          <form className="card grid gap-3" onSubmit={makeClass}>
            <h3 className="font-semibold">Open a class stream</h3>
            <input className={field} placeholder="e.g. Plumbing L5 morning" value={classForm.title} onChange={(event) => setClassForm({ ...classForm, title: event.target.value })} required />
            <select className={field} value={classForm.programmeId} onChange={(event) => setClassForm({ ...classForm, programmeId: event.target.value })}>
              {publicProgrammes.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
            <button className="btn-primary" type="submit">Create class</button>
          </form>
        </div>
      )}

      {pane === 'roster' && room && (
        <div className="space-y-4">
          <form className="card grid md:grid-cols-2 gap-3" onSubmit={enroll}>
            <h3 className="md:col-span-2 font-semibold">Add a learner</h3>
            <input className={field} placeholder="Name" value={learnerForm.name} onChange={(event) => setLearnerForm({ ...learnerForm, name: event.target.value })} required />
            <input className={field} type="email" placeholder="Email" value={learnerForm.email} onChange={(event) => setLearnerForm({ ...learnerForm, email: event.target.value })} required />
            <input
              className={`md:col-span-2 ${field}`}
              placeholder="Phone 0712000000 (optional)"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={16}
              pattern="[0-9+]*"
              title="Numbers only"
              value={learnerForm.phone}
              onChange={(event) => setLearnerForm({ ...learnerForm, phone: sanitizePhoneInput(event.target.value) })}
            />
            <button className="btn-primary md:col-span-2" type="submit">Add to class</button>
          </form>
          {roomRoster.map((item) => (
            <article key={item.id} className="card flex justify-between gap-3">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-muted">{item.email}</p>
                {item.phone && <p className="text-xs text-muted">{item.phone}</p>}
              </div>
              <span className="text-xs text-muted">{item.sample ? 'sample' : 'enrolled'}</span>
            </article>
          ))}
        </div>
      )}

      {pane === 'materials' && room && (
        <div className="space-y-4">
          <form className="card grid md:grid-cols-2 gap-3" onSubmit={(event) => void saveMaterial(event)}>
            <h3 className="md:col-span-2 font-semibold">Put study material on the shelf</h3>
            <select className={field} value={materialForm.kind} onChange={(event) => setMaterialForm({ ...materialForm, kind: event.target.value as MaterialKind })}>
              <option value="link">Link</option>
              <option value="video">Video URL</option>
              <option value="image">Image URL</option>
              <option value="note">Note</option>
              <option value="file">File note</option>
            </select>
            <input className={field} placeholder="Title" value={materialForm.title} onChange={(event) => setMaterialForm({ ...materialForm, title: event.target.value })} required />
            <input className={`md:col-span-2 ${field}`} placeholder="https://… image, YouTube, or document" value={materialForm.url} onChange={(event) => setMaterialForm({ ...materialForm, url: event.target.value })} />
            <textarea className={`md:col-span-2 min-h-20 ${field}`} placeholder="What learners should do with this" value={materialForm.body} onChange={(event) => setMaterialForm({ ...materialForm, body: event.target.value })} />
            <button className="btn-primary md:col-span-2" type="submit">Publish to class</button>
            <label className="btn-secondary text-sm cursor-pointer md:col-span-2 text-center">
              Upload image or video file
              <input className="sr-only" type="file" accept="image/*,video/*" onChange={(event) => void attachFile(event.target.files?.[0] ?? null, event.target.files?.[0]?.type.startsWith('video') ? 'video' : 'image')} />
            </label>
          </form>
          {roomMaterials.map((item) => (
            <article key={item.id} className="card">
              <p className="text-xs uppercase text-accent">{item.kind}</p>
              <h3 className="font-semibold mt-1">{item.title}</h3>
              {item.body && <p className="text-sm text-muted mt-1">{item.body}</p>}
              {item.url && (
                <a className="text-sm text-accent break-all" href={item.url} target="_blank" rel="noreferrer">
                  {item.url}
                </a>
              )}
            </article>
          ))}
        </div>
      )}

      {pane === 'exams' && room && (
        <div className="space-y-4">
          <form className="card grid md:grid-cols-2 gap-3" onSubmit={publishExam}>
            <h3 className="md:col-span-2 font-semibold">Set a CAT / exam</h3>
            <input className={field} placeholder="Title" value={examForm.title} onChange={(event) => setExamForm({ ...examForm, title: event.target.value })} required />
            <input className={field} type="date" value={examForm.due} onChange={(event) => setExamForm({ ...examForm, due: event.target.value })} required />
            <textarea className={`md:col-span-2 min-h-20 ${field}`} placeholder="Question" value={examForm.prompt} onChange={(event) => setExamForm({ ...examForm, prompt: event.target.value })} required />
            <input className={field} placeholder="A" value={examForm.a} onChange={(event) => setExamForm({ ...examForm, a: event.target.value })} required />
            <input className={field} placeholder="B" value={examForm.b} onChange={(event) => setExamForm({ ...examForm, b: event.target.value })} required />
            <input className={field} placeholder="C" value={examForm.c} onChange={(event) => setExamForm({ ...examForm, c: event.target.value })} required />
            <input className={field} placeholder="D" value={examForm.d} onChange={(event) => setExamForm({ ...examForm, d: event.target.value })} required />
            <select className={field} value={examForm.correct} onChange={(event) => setExamForm({ ...examForm, correct: event.target.value as 'a' | 'b' | 'c' | 'd' })}>
              <option value="a">Correct: A</option>
              <option value="b">Correct: B</option>
              <option value="c">Correct: C</option>
              <option value="d">Correct: D</option>
            </select>
            <button className="btn-primary" type="submit">Publish exam</button>
          </form>
          {roomExams.map((item) => (
            <article key={item.id} className="card flex justify-between gap-3">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-xs text-muted">Due {item.due} · {item.questions.length} question(s)</p>
              </div>
              <button type="button" className="btn-secondary text-xs" onClick={() => setExamPublished(item.id, !item.published)}>
                {item.published ? 'Unpublish' : 'Publish'}
              </button>
            </article>
          ))}
        </div>
      )}

      {pane === 'results' && room && (
        <div className="space-y-4">
          <form className="card grid md:grid-cols-2 gap-3" onSubmit={saveResult}>
            <h3 className="md:col-span-2 font-semibold">Enter a mark</h3>
            <input className={field} placeholder="Learner name" value={resultForm.name} onChange={(event) => setResultForm({ ...resultForm, name: event.target.value })} required />
            <input className={field} type="email" placeholder="Learner email" value={resultForm.email} onChange={(event) => setResultForm({ ...resultForm, email: event.target.value })} required />
            <input className={field} placeholder="Paper / practical name" value={resultForm.title} onChange={(event) => setResultForm({ ...resultForm, title: event.target.value })} required />
            <div className="grid grid-cols-2 gap-2">
              <input className={field} type="number" placeholder="Score" value={resultForm.score} onChange={(event) => setResultForm({ ...resultForm, score: event.target.value })} required />
              <input className={field} type="number" placeholder="Out of" value={resultForm.max} onChange={(event) => setResultForm({ ...resultForm, max: event.target.value })} />
            </div>
            <input className={`md:col-span-2 ${field}`} placeholder="Remark" value={resultForm.remark} onChange={(event) => setResultForm({ ...resultForm, remark: event.target.value })} />
            <button className="btn-primary md:col-span-2" type="submit">Post result</button>
          </form>
          {roomResults.map((item) => (
            <article key={item.id} className="card">
              <div className="flex justify-between gap-3">
                <h3 className="font-semibold">{item.learnerName}</h3>
                <span className="text-accent font-semibold">{item.score}/{item.max}</span>
              </div>
              <p className="text-sm text-muted mt-1">{item.title} · {item.remark}</p>
            </article>
          ))}
          {roomWork.length > 0 && (
            <div className="card">
              <h3 className="font-semibold">Practicals waiting on the grade tab</h3>
              <p className="text-sm text-muted mt-1">{roomWork.filter((item) => item.status === 'pending').length} pending workshop submissions for {room.programmeTitle}.</p>
            </div>
          )}
        </div>
      )}

      {pane === 'notices' && room && (
        <div className="space-y-4">
          <form className="card grid md:grid-cols-2 gap-3" onSubmit={(event) => void sendNotice(event)}>
            <h3 className="md:col-span-2 font-semibold">Send a reminder or notice</h3>
            <p className="md:col-span-2 text-sm text-muted">
              Free email or SMS uses the app already on this phone. Inbox stays on Campus for learners who joined.
            </p>
            <input className={field} placeholder="Title" value={noticeForm.title} onChange={(event) => setNoticeForm({ ...noticeForm, title: event.target.value })} required />
            <input className={field} type="date" value={noticeForm.due} onChange={(event) => setNoticeForm({ ...noticeForm, due: event.target.value })} />
            <textarea className={`md:col-span-2 min-h-20 ${field}`} placeholder="Details learners should know" value={noticeForm.body} onChange={(event) => setNoticeForm({ ...noticeForm, body: event.target.value })} required />
            <select
              className={field}
              value={noticeForm.channel}
              onChange={(event) => setNoticeForm({ ...noticeForm, channel: event.target.value as NoticeChannel | 'inbox' })}
            >
              <option value="email">Free email app</option>
              <option value="sms">Free SMS app</option>
              <option value="inbox">Campus inbox only</option>
            </select>
            <button className="btn-primary" type="submit">
              {noticeForm.channel === 'inbox' ? 'Post to inbox' : 'Open and send'}
            </button>
          </form>
          {notices
            .filter((item) => item.classId === room.id)
            .map((item) => (
              <article key={item.id} className="card">
                <p className="text-xs uppercase text-accent">{item.channel}</p>
                <h3 className="font-semibold mt-1">{item.title}</h3>
                <p className="text-sm text-muted mt-1">{item.body}</p>
                {item.due && <p className="text-xs text-muted mt-2">When {item.due}</p>}
              </article>
            ))}
        </div>
      )}
      {note && <p className="text-sm text-success">{note}</p>}
    </section>
  );
}
