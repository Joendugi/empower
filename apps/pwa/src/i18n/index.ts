import { strings, type Lang, type StringKey } from './strings';
import { useLearnerStore } from '@/store/learnerStore';

export function t(key: StringKey, lang?: Lang): string {
  const resolved = lang ?? useLearnerStore.getState().language;
  return strings[resolved][key] ?? strings.en[key];
}

export function useT() {
  const language = useLearnerStore((s) => s.language);
  return (key: StringKey) => strings[language][key];
}
