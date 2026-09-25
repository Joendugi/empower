import { useEffect, useState } from 'react';
import { useLearnerStore } from '@/store/learnerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { usePlatformStore } from '@/store/platformStore';

function allHydrated() {
  return (
    useLearnerStore.persist.hasHydrated() &&
    usePlatformStore.persist.hasHydrated() &&
    useLibraryStore.persist.hasHydrated()
  );
}

export function useHydrated() {
  const [hydrated, setHydrated] = useState(allHydrated);

  useEffect(() => {
    const mark = () => {
      if (allHydrated()) setHydrated(true);
    };
    mark();
    const unsubs = [
      useLearnerStore.persist.onFinishHydration(mark),
      usePlatformStore.persist.onFinishHydration(mark),
      useLibraryStore.persist.onFinishHydration(mark),
    ];
    return () => {
      for (const unsub of unsubs) unsub();
    };
  }, []);

  return hydrated;
}
