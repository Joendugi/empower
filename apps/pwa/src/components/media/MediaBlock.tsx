import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { AnimationPreset, MediaAsset } from '@cyberlearn/types';
import { collectMedia, isMediaAllowed, resolveMediaUrl, vimeoId, youtubeId } from '@/lib/media';
import { getAsset, idFromRef, isIdbRef } from '@/lib/assetStore';
import { usePlatformStore } from '@/store/platformStore';
import { useT } from '@/i18n';

function AnimationStage({ preset }: { preset: AnimationPreset }) {
  if (preset === 'stitch') {
    return (
      <div className="media-stage">
        <motion.div
          className="h-1 w-2/3 bg-accent rounded-full origin-left"
          animate={{ scaleX: [0.2, 1, 0.2] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="text-2xl"
          animate={{ x: [-48, 48, -48], rotate: [0, 20, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          🧵
        </motion.span>
      </div>
    );
  }
  if (preset === 'weld') {
    return (
      <div className="media-stage">
        <motion.span
          className="text-4xl"
          animate={{ opacity: [1, 0.2, 1], scale: [1, 1.15, 1] }}
          transition={{ duration: 0.35, repeat: Infinity }}
        >
          ⚡
        </motion.span>
        <p className="text-xs text-muted">Arc simulation</p>
      </div>
    );
  }
  if (preset === 'gear') {
    return (
      <div className="media-stage">
        <motion.span
          className="text-5xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          ⚙️
        </motion.span>
      </div>
    );
  }
  if (preset === 'wave') {
    return (
      <div className="media-stage flex-row gap-1 h-16 items-end">
        {[0, 1, 2, 3, 4, 5].map((bar) => (
          <motion.span
            key={bar}
            className="w-2 bg-accent rounded-full"
            animate={{ height: ['20%', '100%', '20%'] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: bar * 0.1 }}
          />
        ))}
      </div>
    );
  }
  if (preset === 'circuit') {
    return (
      <div className="media-stage flex-row gap-3">
        {[0, 1, 2].map((node) => (
          <motion.span
            key={node}
            className="w-4 h-4 rounded-full bg-accent"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: node * 0.25 }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="media-stage">
      <motion.span
        className="w-16 h-16 rounded-full bg-accent/40 border-2 border-accent"
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
    </div>
  );
}

function usePlayableSrc(url?: string) {
  const [src, setSrc] = useState<string | undefined>(() => (url && !isIdbRef(url) ? url : undefined));

  useEffect(() => {
    if (!url) {
      setSrc(undefined);
      return;
    }
    if (!isIdbRef(url)) {
      setSrc(url);
      return;
    }
    let objectUrl = '';
    let cancelled = false;
    void getAsset(idFromRef(url)).then((asset) => {
      if (cancelled || !asset) return;
      objectUrl = URL.createObjectURL(asset.blob);
      setSrc(objectUrl);
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  return src;
}

function MediaFigure({
  asset,
  onEnded,
}: {
  asset: MediaAsset;
  onEnded?: () => void;
}) {
  const t = useT();
  const raw = asset.url ? resolveMediaUrl(asset) : undefined;
  const src = usePlayableSrc(raw);
  const allowed = src ? isMediaAllowed(src) : raw && isIdbRef(raw) ? { ok: true } : raw ? isMediaAllowed(raw) : { ok: true };
  const yt = src ? youtubeId(src) : null;
  const vim = src ? vimeoId(src) : null;

  return (
    <figure className="card !p-3 space-y-2">
      {asset.kind === 'animation' && asset.preset && <AnimationStage preset={asset.preset} />}
      {asset.kind === 'animation' && src && allowed.ok && !asset.preset && (
        <img src={src} alt={asset.caption ?? 'Animation'} className="w-full rounded-xl max-h-64 object-contain bg-black" />
      )}
      {asset.kind === 'video' && allowed.ok && yt && (
        <iframe
          title={asset.caption ?? 'Video'}
          className="w-full aspect-video rounded-xl bg-black"
          src={`https://www.youtube-nocookie.com/embed/${yt}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      {asset.kind === 'video' && allowed.ok && vim && (
        <iframe
          title={asset.caption ?? 'Video'}
          className="w-full aspect-video rounded-xl bg-black"
          src={`https://player.vimeo.com/video/${vim}`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )}
      {asset.kind === 'video' && allowed.ok && src && !yt && !vim && (
        <video className="w-full rounded-xl bg-black" controls src={src} onEnded={onEnded} />
      )}
      {asset.kind === 'audio' && allowed.ok && src && (
        <audio className="w-full" controls src={src} onEnded={onEnded} />
      )}
      {asset.kind === 'image' && allowed.ok && src && (
        <img src={src} alt={asset.caption ?? ''} className="w-full rounded-xl max-h-72 object-contain bg-black" />
      )}
      {!allowed.ok && (src || raw) && (
        <p className="text-sm text-danger">
          {t('mediaBlocked')} ({allowed.reason})
        </p>
      )}
      {asset.caption && <figcaption className="text-xs text-muted">{asset.caption}</figcaption>}
    </figure>
  );
}

export default function MediaBlock({
  assets,
  onComplete,
}: {
  assets?: MediaAsset[];
  onComplete?: () => void;
}) {
  const t = useT();
  const requireWatch = usePlatformStore((s) => s.requireWatchBeforeContinue);
  const notified = useRef(false);
  const items = collectMedia(assets);
  const [done, setDone] = useState(false);
  const required = items.length > 0 && (requireWatch || items.some((item) => item.mustFinish));

  useEffect(() => {
    if (notified.current) return;
    if (!items.length || !required) {
      notified.current = true;
      onComplete?.();
    }
  }, [items.length, required, onComplete]);

  const markDone = () => {
    setDone(true);
    onComplete?.();
  };

  if (!items.length) return null;

  return (
    <div className="space-y-3">
      {items.map((asset, index) => (
        <MediaFigure
          key={`${asset.kind}-${index}-${asset.url ?? asset.preset ?? index}`}
          asset={asset}
          onEnded={asset.mustFinish ? markDone : undefined}
        />
      ))}
      {required && !done && (
        <button type="button" className="btn-secondary w-full text-sm" onClick={markDone}>
          {t('mediaFinished')}
        </button>
      )}
    </div>
  );
}
