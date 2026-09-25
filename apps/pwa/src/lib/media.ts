import type { MediaAsset } from '@cyberlearn/types';
import { usePlatformStore } from '@/store/platformStore';

export function youtubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.replace('/', '') || null;
    if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v');
  } catch {
    return null;
  }
  return null;
}

export function vimeoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('vimeo.com')) return null;
    const match = parsed.pathname.match(/\/(\d+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export function resolveMediaUrl(asset: MediaAsset): string | undefined {
  const cdn = usePlatformStore.getState().mediaCdnUrl.replace(/\/$/, '');
  if (!asset.url) return undefined;
  if (
    asset.url.startsWith('idb:') ||
    asset.url.startsWith('blob:') ||
    asset.url.startsWith('http://') ||
    asset.url.startsWith('https://') ||
    asset.url.startsWith('/')
  ) {
    return asset.url;
  }
  if (cdn) return `${cdn}/${asset.url.replace(/^\//, '')}`;
  return asset.url;
}

export function isMediaAllowed(url: string): { ok: boolean; reason?: string } {
  if (url.startsWith('idb:') || url.startsWith('blob:')) return { ok: true };
  const settings = usePlatformStore.getState();
  let parsed: URL;
  try {
    parsed = new URL(url, window.location.origin);
  } catch {
    return { ok: false, reason: 'invalid' };
  }
  if (settings.httpsMediaOnly && parsed.protocol === 'http:' && parsed.hostname !== 'localhost') {
    return { ok: false, reason: 'https' };
  }
  const hosts = settings.allowedMediaHosts
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  if (!hosts.length) return { ok: true };
  if (parsed.origin === window.location.origin) return { ok: true };
  const host = parsed.hostname.toLowerCase();
  if (hosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`))) return { ok: true };
  return { ok: false, reason: 'host' };
}

export function collectMedia(assets: MediaAsset[] | undefined): MediaAsset[] {
  const settings = usePlatformStore.getState();
  return (assets ?? []).filter((asset) => {
    if (asset.kind === 'video' && !settings.enableVideo) return false;
    if (asset.kind === 'audio' && !settings.enableAudio) return false;
    if (asset.kind === 'animation' && !settings.enableAnimations) return false;
    return true;
  });
}
