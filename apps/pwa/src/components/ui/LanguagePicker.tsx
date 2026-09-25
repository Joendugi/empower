import { clsx } from 'clsx';
import { useLearnerStore } from '@/store/learnerStore';
import { useT } from '@/i18n';

export default function LanguagePicker() {
  const t = useT();
  const language = useLearnerStore((state) => state.language);
  const setLanguage = useLearnerStore((state) => state.setLanguage);

  return (
    <div className="grid grid-cols-2 gap-2" role="group" aria-label={t('language')}>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={clsx(
          'px-3 py-2.5 rounded-xl text-sm border text-center',
          language === 'en'
            ? 'bg-accent text-primary border-accent font-semibold'
            : 'border-surface-light text-muted hover:text-white'
        )}
      >
        {t('english')}
      </button>
      <button
        type="button"
        onClick={() => setLanguage('sw')}
        className={clsx(
          'px-3 py-2.5 rounded-xl text-sm border text-center',
          language === 'sw'
            ? 'bg-accent text-primary border-accent font-semibold'
            : 'border-surface-light text-muted hover:text-white'
        )}
      >
        {t('kiswahili')}
      </button>
    </div>
  );
}
