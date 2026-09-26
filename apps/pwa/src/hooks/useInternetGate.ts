import { useCallback, useEffect, useState } from 'react';
import {
  markWebAdmitted,
  probeInternet,
  readWebAdmitted,
  type InternetProbeReason,
} from '@/lib/internet';
import { usePlatformStore } from '@/store/platformStore';

/** Gate lifecycle for cold start. After admit, the app stays mounted even if net drops. */
export type InternetGatePhase = 'checking' | 'blocked' | 'ready';

export function useInternetGate() {
  const deploymentMode = usePlatformStore((state) => state.deploymentMode);
  const apiBaseUrl = usePlatformStore((state) => state.apiBaseUrl);
  const skipGate = deploymentMode === 'offline';

  const [phase, setPhase] = useState<InternetGatePhase>(() =>
    skipGate || readWebAdmitted() ? 'ready' : 'checking'
  );
  const [liveOnline, setLiveOnline] = useState(
    () => typeof navigator === 'undefined' || navigator.onLine
  );
  const [reason, setReason] = useState<InternetProbeReason | null>(null);
  const [apiUp, setApiUp] = useState(false);

  const verify = useCallback(
    async (opts?: { admitOnSuccess?: boolean }) => {
      const admitOnSuccess = opts?.admitOnSuccess ?? true;
      if (skipGate) {
        setPhase('ready');
        setLiveOnline(true);
        setApiUp(false);
        setReason('ok');
        return true;
      }

      const alreadyReady = phase === 'ready' || readWebAdmitted();
      if (!alreadyReady) setPhase('checking');

      const result = await probeInternet(apiBaseUrl);
      setLiveOnline(result.online);
      setApiUp(result.apiUp);
      setReason(result.reason);

      if (result.online) {
        if (admitOnSuccess || alreadyReady) {
          markWebAdmitted();
          setPhase('ready');
        }
        return true;
      }

      if (alreadyReady) {
        setPhase('ready');
        return false;
      }
      setPhase('blocked');
      return false;
    },
    [apiBaseUrl, phase, skipGate]
  );

  useEffect(() => {
    if (skipGate) {
      setPhase('ready');
      return;
    }
    void verify({ admitOnSuccess: true });
  }, [skipGate, apiBaseUrl]);

  useEffect(() => {
    const onOnline = () => {
      void verify({ admitOnSuccess: true });
    };
    const onOffline = () => {
      setLiveOnline(false);
      setApiUp(false);
      setReason('offline');
      // Keep phase ready after first admit so lessons stay available.
      if (!readWebAdmitted() && !skipGate) {
        setPhase('blocked');
      }
    };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [skipGate, verify]);

  return {
    phase,
    liveOnline,
    apiUp,
    reason,
    skipGate,
    admitted: phase === 'ready',
    retry: () => verify({ admitOnSuccess: true }),
  };
}
