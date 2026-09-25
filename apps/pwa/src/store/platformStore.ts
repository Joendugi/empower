import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DeploymentMode = 'offline' | 'campus' | 'cloud';

export interface PlatformSettings {
  deploymentMode: DeploymentMode;
  apiBaseUrl: string;
  mediaCdnUrl: string;
  requestTimeoutMs: number;
  httpsMediaOnly: boolean;
  allowedMediaHosts: string;
  requireWatchBeforeContinue: boolean;
  enableAnimations: boolean;
  enableVideo: boolean;
  enableAudio: boolean;
}

function envMode(): DeploymentMode {
  const value = import.meta.env.VITE_DEPLOYMENT_MODE;
  if (value === 'offline' || value === 'campus' || value === 'cloud') return value;
  return 'campus';
}

export const defaultPlatformSettings: PlatformSettings = {
  deploymentMode: envMode(),
  apiBaseUrl: import.meta.env.VITE_API_URL || '/api/v1',
  mediaCdnUrl: import.meta.env.VITE_MEDIA_CDN_URL || '',
  requestTimeoutMs: 8000,
  httpsMediaOnly: true,
  allowedMediaHosts: 'youtube.com,youtu.be,youtube-nocookie.com,vimeo.com,player.vimeo.com',
  requireWatchBeforeContinue: false,
  enableAnimations: true,
  enableVideo: true,
  enableAudio: true,
};

interface PlatformState extends PlatformSettings {
  update: (patch: Partial<PlatformSettings>) => void;
  reset: () => void;
}

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set) => ({
      ...defaultPlatformSettings,
      update: (patch) => set(patch),
      reset: () => set(defaultPlatformSettings),
    }),
    {
      name: 'empower-platform',
      version: 2,
      migrate: (persisted, version) => {
        const state = (persisted ?? {}) as Partial<PlatformSettings>;
        if (version < 2) {
          return {
            ...defaultPlatformSettings,
            ...state,
            requestTimeoutMs:
              !state.requestTimeoutMs || state.requestTimeoutMs < 2000
                ? 8000
                : state.requestTimeoutMs,
            deploymentMode: state.deploymentMode ?? defaultPlatformSettings.deploymentMode,
          };
        }
        const { adminPin: _removed, ...safe } = state as PlatformSettings & { adminPin?: string };
        void _removed;
        return { ...defaultPlatformSettings, ...safe };
      },
    }
  )
);
