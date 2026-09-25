import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLearnerStore } from '@/store/learnerStore';
import { useModerationStore } from '@/store/moderationStore';
import BrandMark from '@/components/ui/BrandMark';
import { useT } from '@/i18n';

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
  const t = useT();
  const learnerId = useLearnerStore((state) => state.learnerId) ?? '';
  const email = useLearnerStore((state) => state.email) ?? '';
  const displayName = useLearnerStore((state) => state.displayName) ?? 'Educator';
  const applications = useModerationStore((state) => state.applications);
  const proposals = useModerationStore((state) => state.proposals);
  const submitApplication = useModerationStore((state) => state.submitApplication);
  const application = useMemo(
    () => applications.find((item) => item.email.toLowerCase() === email.toLowerCase()),
    [applications, email]
  );
  const ownProposals = proposals.filter((item) => item.educatorEmail.toLowerCase() === email.toLowerCase());
  const [applicationForm, setApplicationForm] = useState(blankApplication);
  const [message, setMessage] = useState('');

  const apply = (event: FormEvent) => {
    event.preventDefault();
    submitApplication({
      userId: learnerId,
      email,
      displayName,
      ...applicationForm,
    });
    setMessage('Application submitted for admin review.');
  };

  return (
    <div className="min-h-dvh bg-primary-dark text-white">
      <header className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between border-b border-surface-light">
        <Link to="/" className="flex items-center gap-2">
          <BrandMark size="sm" />
          <span className="font-semibold">Empower</span>
        </Link>
        <Link to="/learn/skill-tree" className="text-sm text-muted hover:text-white">
          Learning portal
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-10 space-y-8">
        <section>
          <p className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">Educator pathway</p>
          <h1 className="text-3xl font-bold mt-2">Teach skills that strengthen society</h1>
          <p className="text-muted mt-3 max-w-3xl leading-relaxed">
            Apply with your qualifications and trade experience. After you are verified, write Week 1, Week 2,
            an outline, videos, and autograded checks in the same layout learners see.
          </p>
        </section>

        {message && <p className="card border-accent/40 text-accent">{message}</p>}

        {!application || application.status === 'rejected' ? (
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
              placeholder="Phone number"
              value={applicationForm.phone}
              onChange={(event) => setApplicationForm({ ...applicationForm, phone: event.target.value })}
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
              placeholder="Why you want to teach and how learners or the community will benefit"
              value={applicationForm.statement}
              onChange={(event) => setApplicationForm({ ...applicationForm, statement: event.target.value })}
              required
            />
            <button className="btn-primary md:col-span-2" type="submit">
              Submit for verification
            </button>
          </form>
        ) : application.status === 'pending' ? (
          <section className="card">
            <p className="text-amber-300 font-semibold">Application pending verification</p>
            <p className="text-sm text-muted mt-2">
              An administrator must verify your identity, qualifications, and subject experience before you
              can publish curriculum for learners.
            </p>
          </section>
        ) : (
          <section className="card space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-success text-xs font-semibold uppercase">Verified educator</p>
                <h2 className="text-xl font-semibold">{t('studioTitle')}</h2>
              </div>
              <span className="text-xs rounded-full bg-success/10 text-success px-3 py-1">Approved</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">{t('studioHelp')}</p>
            <Link to="/curriculum" className="btn-primary inline-flex">
              {t('studioOpen')}
            </Link>
          </section>
        )}

        {ownProposals.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-3">Your proposals</h2>
            <div className="grid gap-3">
              {ownProposals.map((item) => (
                <article key={item.id} className="card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{item.path.title}</h3>
                      <p className="text-sm text-muted mt-1">{item.lesson.title}</p>
                    </div>
                    <span className="text-xs uppercase text-accent">{item.status}</span>
                  </div>
                  {item.reviewerNote && <p className="text-sm text-muted mt-3">{item.reviewerNote}</p>}
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
