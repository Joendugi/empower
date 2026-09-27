import confetti from 'canvas-confetti';

export function triggerConfettiBurst(options?: confetti.Options) {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#e85d04', '#ca8a04', '#f5f5f4', '#262626', '#f48c06'],
      disableForReducedMotion: true,
      ...options,
    });
  } catch {
    // Graceful fallback in environments where canvas is restricted
  }
}

export function triggerLevelUpCelebration() {
  try {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#e85d04', '#ca8a04', '#f5f5f4', '#dc2626', '#f48c06'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  } catch {
    // Ignore canvas errors
  }
}
