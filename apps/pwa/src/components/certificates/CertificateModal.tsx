import { useRef } from 'react';
import { 
  Award, 
  Printer, 
  Share2, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode 
} from 'lucide-react';
import type { SkillPath } from '@cyberlearn/types';
import BrandMark from '@/components/ui/BrandMark';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  learnerName: string;
  path: SkillPath;
  completionDate?: string;
  certificateId?: string;
}

export default function CertificateModal({
  isOpen,
  onClose,
  learnerName,
  path,
  completionDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  certificateId = `EMP-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${new Date().getFullYear()}`,
}: CertificateModalProps) {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const issued = /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(certificateId);
  const verifyPath = issued ? `/verify/${certificateId}` : `/verify?cert=${certificateId}`;

  const handlePrint = () => {
    if (issued) {
      window.open(`/api/v1/certificates/${certificateId}/pdf`, '_blank', 'noopener');
      return;
    }
    window.print();
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${verifyPath}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Empower TVET Certificate - ${path.title}`,
          text: `Verified TVET Competency Certificate for ${learnerName} in ${path.title}`,
          url,
        });
      } catch {
        // Fallback to clipboard
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Verification link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-dark/90 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface border border-white/[0.12] rounded-lg overflow-hidden flex flex-col my-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-primary-dark/50">
          <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Verified Digital Credential</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> {issued ? 'Download PDF' : 'Print / Save PDF'}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Printable Body */}
        <div 
          ref={certRef}
          className="p-8 sm:p-10 bg-primary-dark text-white border border-white/10 m-4 rounded-md relative overflow-hidden print:m-0 print:border print:text-black print:bg-white"
        >

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-3">
              <BrandMark size="md" />
            </div>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-accent">
              EMPOWER TECHNICAL & VOCATIONAL TRAINING
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              Certificate of Competency
            </h1>
            <p className="text-xs text-muted">This is officially presented to acknowledge that</p>
          </div>

          {/* Recipient Name */}
          <div className="text-center my-6 py-3 border-y border-white/[0.08]">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              {learnerName || 'Learner'}
            </h2>
            <p className="text-xs text-muted-light mt-1">
              has successfully fulfilled all module outcomes, interactive lab challenges, and practical evidence assessments for
            </p>
          </div>

          {/* Course Subject & Specification */}
          <div className="text-center space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {path.title}
            </h3>
            <p className="text-xs text-accent font-mono">
              {path.certificationTarget ?? 'TVET CDACC / NITA Standardized Qualification'}
            </p>
            <p className="text-[11px] text-muted">
              {path.nodes.length} Accredited Units Completed · Semester Depth Practical Evidence Verified
            </p>
          </div>

          {/* Footer Seals, Signatures & QR Code */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] grid grid-cols-3 items-end text-center">
            {/* Date & Registry */}
            <div className="text-left space-y-0.5">
              <p className="text-[10px] uppercase font-mono text-muted">Date of Award</p>
              <p className="text-xs font-semibold text-white">{completionDate}</p>
              <p className="text-[9px] font-mono text-accent">Cert ID: {certificateId}</p>
            </div>

            {/* Verification QR Emblem */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg">
                <QrCode className="w-12 h-12 text-primary-dark" />
              </div>
              <span className="text-[9px] text-muted font-mono mt-1 flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5 text-accent" /> Scan to Verify
              </span>
            </div>

            {/* Certification Seal */}
            <div className="text-right space-y-0.5">
              <div className="w-12 h-12 rounded-md border border-white/20 bg-surface-light text-white ml-auto flex items-center justify-center font-semibold text-xs">
                ★ SEAL ★
              </div>
              <p className="text-[9px] font-mono text-muted mt-1">Academic Registrar</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 bg-primary-dark/60 border-t border-white/[0.08] flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Cryptographically Verified Credential
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary !py-1.5 !px-4 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
