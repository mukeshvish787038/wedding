import { useEffect, useRef, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Adds class "in" to the element once it scrolls into view. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  phase: 'before' | 'today' | 'after';
}

/** Live countdown to an absolute timestamp (ms). Timezone-independent. */
export function useCountdown(targetMs: number): Remaining {
  const calc = (): Remaining => {
    const now = Date.now();
    const diff = targetMs - now;
    if (diff <= 0) {
      const phase = now < targetMs + 24 * 3600 * 1000 ? 'today' : 'after';
      return { days: 0, hours: 0, minutes: 0, seconds: 0, phase };
    }
    const s = Math.floor(diff / 1000);
    return {
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
      phase: 'before',
    };
  };
  const [r, setR] = useState<Remaining>(calc);
  useEffect(() => {
    const id = window.setInterval(() => setR(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetMs]);
  return r;
}
