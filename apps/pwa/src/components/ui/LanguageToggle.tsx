import { useLearnerStore } from '@/store/learnerStore';

export default function LanguageToggle() {
  const language = useLearnerStore((s) => s.language);
  const setLanguage = useLearnerStore((s) => s.setLanguage);

  return (
    <button
      className="text-xs px-2 py-1 rounded-full border border-surface-light text-muted"
      onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
      aria-label="Toggle language"
    >
      {language === 'en' ? 'SW' : 'EN'}
    </button>
  );
}
