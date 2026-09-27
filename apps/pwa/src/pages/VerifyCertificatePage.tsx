import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Badge, Button, Card } from '@cyberlearn/ui';
import BrandMark from '@/components/ui/BrandMark';
import { usePlatformStore } from '@/store/platformStore';

type OpenBadge = {
  id?: string;
  name?: string;
  issuanceDate?: string;
  credentialSubject?: {
    name?: string;
    achievement?: { name?: string; description?: string };
  };
  empower?: { pathId?: string; verifyUrl?: string };
};

export default function VerifyCertificatePage() {
  const { certificateId: pathId } = useParams<{ certificateId: string }>();
  const [params] = useSearchParams();
  const certificateId = pathId || params.get('cert') || '';
  const apiBase = usePlatformStore((s) => s.apiBaseUrl).replace(/\/$/, '') || '/api/v1';
  const [badge, setBadge] = useState<OpenBadge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(certificateId));

  useEffect(() => {
    if (!certificateId) {
      setLoading(false);
      setError('No certificate id in this link.');
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    void fetch(`${apiBase}/certificates/${encodeURIComponent(certificateId)}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'This certificate is not in the registry.' : 'Could not reach the issuer.');
        }
        return (await res.json()) as OpenBadge;
      })
      .then((data) => {
        if (!cancelled) setBadge(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not verify this certificate.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [apiBase, certificateId]);

  const learner = badge?.credentialSubject?.name || 'Learner';
  const programme = badge?.credentialSubject?.achievement?.name || badge?.name || 'Programme';
  const issued = badge?.issuanceDate
    ? new Date(badge.issuanceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="min-h-dvh bg-primary-dark text-white grid place-items-center px-6 py-12">
      <div className="w-full max-w-lg space-y-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <BrandMark size="sm" />
          <span className="font-semibold">Empower</span>
        </Link>
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-bold">Certificate verification</h1>
            {badge ? <Badge tone="success">Valid</Badge> : error ? <Badge>Unverified</Badge> : <Badge>Checking</Badge>}
          </div>
          {loading && <p className="text-sm text-muted">Asking the issuer for this OpenBadge…</p>}
          {!loading && error && (
            <p className="text-sm text-muted">{error} Employers should only trust a Valid result from this page or the JSON below.</p>
          )}
          {!loading && badge && (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">Awarded to</dt>
                <dd className="font-semibold text-white">{learner}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">Programme</dt>
                <dd className="font-semibold text-white">{programme}</dd>
              </div>
              {issued && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">Issued</dt>
                  <dd>{issued}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">Certificate ID</dt>
                <dd className="font-mono text-xs break-all text-accent">{certificateId}</dd>
              </div>
            </dl>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            {certificateId && (
              <a href={`${apiBase}/certificates/${encodeURIComponent(certificateId)}`} target="_blank" rel="noreferrer">
                <Button variant="secondary" className="!py-2 !px-4 text-xs">
                  OpenBadge JSON
                </Button>
              </a>
            )}
            {badge && (
              <a href={`${apiBase}/certificates/${encodeURIComponent(certificateId)}/pdf`} target="_blank" rel="noreferrer">
                <Button className="!py-2 !px-4 text-xs">Download PDF</Button>
              </a>
            )}
            <Link to="/">
              <Button variant="ghost" className="!py-2 !px-4 text-xs">
                Back to Empower
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
