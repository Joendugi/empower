import { useCallback, useEffect, useState } from 'react';
import { checkInternet } from '@/lib/internet';

export type InternetGateStatus = 'checking' | 'online' | 'offline';

export function useInternetGate() {
  const [status, setStatus] = useState<InternetGateStatus>('checking');

  const verify = useCallback(async () => {
    setStatus('checking');
    const online = await checkInternet();
    setStatus(online ? 'online' : 'offline');
  }, []);

  useEffect(() => {
    void verify();
    const onOnline = () => {
      void verify();
    };
    const onOffline = () => setStatus('offline');
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [verify]);

  return { status, retry: verify };
}
