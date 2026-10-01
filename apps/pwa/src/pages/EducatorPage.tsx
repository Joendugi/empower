import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TeachingDesk from '@/components/educator/TeachingDesk';
import BrandMark from '@/components/ui/BrandMark';
import { updateLocalProfile } from '@/lib/localAccounts';
import { sanitizePhoneInput, validateEducatorApplication } from '@/lib/validate';
import { useLearnerStore } from '@/store/learnerStore';
import { useModerationStore } from '@/store/moderationStore';

const field =
  'w-full rounded-xl bg-primary-dark border border-surface-light px-3 py-3 text-white placeholder:text-muted';

const blankApplication = {
  phone: '',
  county: '',
  institution: '',
  tradeAreas: '',
  qualifications: '',
  experienceYears: 0,
  statement: '',
};

export default function EducatorPage() {
  const token = useLearnerStore((state) => state.token);
  const isGuest = useLearnerStore((state) => state.isGuest);
  const signedIn = Boolean(token && !isGuest);
  const learnerId = useLearnerStore((state) => state.learnerId) ?? '';
  const email = useLearnerStore((state) => state.email) ?? '';
  const displayName = useLearnerStore((state) => state.displayName) ?? 'Educator';
  const applications = useModerationStore((state) => state.applications);
  const submitApplication = useModerationStore((state) => state.submitApplication);
  const application = useMemo(
    () => applications.find((item) => item.email.toLowerCase() === email.toLowerCase()),
    [applications, email]
  );
  const [applicationForm, setApplicationForm] = useState(blankApplication);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const apply = (event: FormEvent) => {
    event.preventDefault();
    const check = validateEducatorApplication(applicationForm);
    if (!check.ok) {
      setErrors(check.errors);
      setMessage('');
      return;
    }
    setErrors([]);
    updateLocalProfile(email, { phone: check.phone });
    submitApplication({
      userId: learnerId,
      email,
      displayName,
      ...applicationForm,
      phone: check.phone,
    });
    setMessage('Verification request sent to the office. Open /office → Educators to review it.');
  };

  const approved = application?.status === 'approved';
  const pending = application?.status === 'pending';

  return (
    <div className="min-h-dvh bg-primary-dark text-white">
      <header className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between border-b border-surface-light">
        <Link to="/" className="flex items-center gap-2">
          <BrandMark size="sm" />
          <span className="font-semibold">Empower</span>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/campus" className="text-muted hover:text-white">
            Campus
          </Link>
          <Link to="/study" className="text-muted hover:text-white">
            Library
          </Link>
          <Link to="/profile" className="text-muted hover:text-white">
            Profile
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-10 space-y-8">
        <section>
          <p className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">Educator pathway</p>
          <h1 className="text-3xl font-bold mt-2">Teach. Grade. Do not sit the course.</h1>
          <p className="text-muted mt-3 max-w-3xl leading-relaxed">
            Educators grade assignments and practicals, put curriculum notes in the study library, and vary
            instructor-led teaching methods. Learner courses, XP, and quizzes stay with learners.
          </p>
          <ol className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
            <li className="card !p-4">
              <p className="text-xs uppercase tracking-wider text-accent font-semibold">1. Account</p>
              <p className="mt-1 text-muted">Create an educator account. The office verifies your trade experience.</p>
            </li>
            <li className="card !p-4">
              <p className="text-xs uppercase tracking-wider text-accent font-semibold">2. Apply</p>
              <p className="mt-1 text-muted">Submit institution, trade areas, and a verifier the office can call.</p>
            </li>
            <li className="card !p-4">
              <p className="text-xs uppercase tracking-wider text-accent font-semibold">3. Teach</p>
              <p className="mt-1 text-muted">
                Grade work, publish library notes, and run instructor-led variations. You never enrol as a learner.
              </p>
            </li>
          </ol>
        </section>

        {message && <p className="card border-accent/40 text-accent">{message}</p>}

        {!signedIn ? (
          <section className="card space-y-3">
            <h2 className="text-xl font-semibold">Start your application</h2>
            <p className="text-sm text-muted">
              You need an educator account. After verification you grade and write notes — you do not take courses.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to="/login?role=educator&next=/educator" className="btn-primary">
                Create educator account
              </Link>
              <Link to="/login?next=/educator" className="btn-secondary">
                Sign in
              </Link>
            </div>
          </section>
        ) : approved ? (
          <TeachingDesk />
        ) : pending ? (
          <section className="card">
            <p className="text-amber-300 font-semibold">Application pending verification</p>
            <p className="text-sm text-muted mt-2">
              The office must verify your identity and trade experience. You cannot sit learner courses while this
              account is marked educator.
            </p>
          </section>
        ) : (
          <form className="card grid md:grid-cols-2 gap-3" onSubmit={apply}>
            <h2 className="md:col-span-2 text-xl font-semibold">Educator application</h2>
            {application?.status === 'rejected' && (
              <p className="md:col-span-2 text-sm text-danger">
                Previous application was not approved: {application.reviewerNote || 'Review the details and reapply.'}
              </p>
            )}
            <input className={field} value={email} disabled aria-label="Account email" />
            <input
              className={field}
              placeholder="Phone 0712000000"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={16}
              pattern="[0-9+]+"
              title="Numbers only"
              value={applicationForm.phone}
              onChange={(event) =>
                setApplicationForm({ ...applicationForm, phone: sanitizePhoneInput(event.target.value) })
              }
              required
            />
            <input
              className={field}
              placeholder="County"
              value={applicationForm.county}
              onChange={(event) => setApplicationForm({ ...applicationForm, county: event.target.value })}
              required
            />
            <input
              className={field}
              placeholder="Institution / workshop / employer"
              value={applicationForm.institution}
              onChange={(event) => setApplicationForm({ ...applicationForm, institution: event.target.value })}
              required
            />
            <input
              className={field}
              placeholder="Trade areas (e.g. plumbing, solar, caregiving)"
              value={applicationForm.tradeAreas}
              onChange={(event) => setApplicationForm({ ...applicationForm, tradeAreas: event.target.value })}
              required
            />
            <input
              className={field}
              type="number"
              min={0}
              max={60}
              inputMode="numeric"
              placeholder="Years of practical experience"
              value={applicationForm.experienceYears}
              onChange={(event) =>
                setApplicationForm({ ...applicationForm, experienceYears: Number(event.target.value) || 0 })
              }
              required
            />
            <textarea
              className={`md:col-span-2 min-h-24 ${field}`}
              placeholder="Qualifications, certificates, licence numbers, or verifier contacts"
              value={applicationForm.qualifications}
              onChange={(event) => setApplicationForm({ ...applicationForm, qualifications: event.target.value })}
              required
            />
            <textarea
              className={`md:col-span-2 min-h-28 ${field}`}
              placeholder="How you will grade, write library notes, and run instructor-led sessions"
              value={applicationForm.statement}
              onChange={(event) => setApplicationForm({ ...applicationForm, statement: event.target.value })}
              required
            />
            {errors.length > 0 && (
              <ul className="md:col-span-2 text-sm text-rose-300 space-y-1">
                {errors.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            <button className="btn-primary md:col-span-2" type="submit">
              Submit for verification
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
