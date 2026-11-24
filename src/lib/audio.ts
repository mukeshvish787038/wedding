/**
 * Sound engine — everything is synthesized with the Web Audio API, so there are
 * no copyrighted recordings and nothing to download. Audio only starts after a
 * user gesture (unlock()), and the mute choice is remembered.
 * If `audio.backgroundMusicUrl` is set in weddingConfig, that licensed file is
 * used for the background instead of the synthesized ambience.
 */
import { weddingConfig } from '../config/weddingConfig';

const KEY = 'invite-muted';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bgGain: GainNode | null = null;
  private muted = false;
  private bgStarted = false;
  private timer: number | undefined;
  private el: HTMLAudioElement | null = null;
  private listeners = new Set<() => void>();

  constructor() {
    try {
      this.muted = localStorage.getItem(KEY) === '1';
    } catch {
      /* storage may be blocked */
    }
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  private emit() {
    this.listeners.forEach((f) => f());
  }
  isMuted() {
    return this.muted;
  }

  /** Call from a tap/click handler. Safe to call many times. */
  unlock() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : weddingConfig.audio.volume;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume();
    } catch {
      /* audio is optional */
    }
  }

  setMuted(m: boolean) {
    this.muted = m;
    try {
      localStorage.setItem(KEY, m ? '1' : '0');
    } catch {
      /* ignore */
    }
    if (this.master && this.ctx) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setTargetAtTime(m ? 0 : weddingConfig.audio.volume, this.ctx.currentTime, 0.15);
    }
    if (this.el) this.el.muted = m;
    this.emit();
  }
  toggle() {
    this.unlock();
    this.setMuted(!this.muted);
  }

  /** Gentle temple bell: inharmonic partials with long soft decay. */
  bell(delay = 0, level = 0.22) {
    if (!this.ctx || !this.master) return;
    const t0 = this.ctx.currentTime + delay;
    const base = 523.25; // C5
    [1, 2.76, 5.4, 8.93].forEach((ratio, i) => {
      const o = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      o.type = 'sine';
      o.frequency.value = base * ratio;
      const peak = level / (i * 1.6 + 1);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.2 / (i * 0.7 + 1));
      o.connect(g).connect(this.master!);
      o.start(t0);
      o.stop(t0 + 3.4);
    });
  }

  /** Soft conch: slow swell on a low note, deliberately quiet. */
  conch(delay = 0) {
    if (!this.ctx || !this.master) return;
    const t0 = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const f = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    o.type = 'sawtooth';
    o2.type = 'triangle';
    o.frequency.setValueAtTime(196, t0);
    o.frequency.linearRampToValueAtTime(207, t0 + 2.2);
    o2.frequency.setValueAtTime(98, t0);
    f.type = 'lowpass';
    f.frequency.value = 520;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.1, t0 + 1.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.0);
    o.connect(f);
    o2.connect(f);
    f.connect(g).connect(this.master);
    o.start(t0);
    o2.start(t0);
    o.stop(t0 + 3.2);
    o2.stop(t0 + 3.2);
  }

  /** Quiet ambient bed: tanpura-like drone + sparse pentatonic flute notes. */
  startBackground() {
    if (this.bgStarted) return;
    const url = weddingConfig.audio.backgroundMusicUrl;
    if (url) {
      this.bgStarted = true;
      try {
        this.el = new Audio(url);
        this.el.loop = true;
        this.el.volume = weddingConfig.audio.volume * 0.7;
        this.el.muted = this.muted;
        void this.el.play().catch(() => {
          /* graceful fallback: stay silent */
        });
      } catch {
        /* ignore */
      }
      return;
    }
    if (!this.ctx || !this.master) return;
    this.bgStarted = true;
    const ctx = this.ctx;
    this.bgGain = ctx.createGain();
    this.bgGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    this.bgGain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 4);
    this.bgGain.connect(this.master);

    // drone: Sa + Pa (C3, G3) with slow shimmer
    [130.81, 196.0, 261.63].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      o.type = i === 2 ? 'sine' : 'triangle';
      o.frequency.value = freq;
      g.gain.value = i === 2 ? 0.015 : 0.035;
      lfo.frequency.value = 0.09 + i * 0.05;
      lg.gain.value = g.gain.value * 0.5;
      lfo.connect(lg).connect(g.gain);
      o.connect(g).connect(this.bgGain!);
      o.start();
      lfo.start();
    });

    // flute: raga-Bhoopali-like notes (C D E G A), sparse and soft
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33];
    let idx = 0;
    const play = () => {
      if (!this.ctx || !this.bgGain) return;
      const t0 = this.ctx.currentTime + 0.05;
      const freq = scale[idx % scale.length] * (Math.random() < 0.15 ? 0.5 : 1);
      idx += Math.random() < 0.5 ? 1 : 2;
      const dur = 2.2 + Math.random() * 1.6;
      const o = this.ctx.createOscillator();
      const v = this.ctx.createOscillator();
      const vg = this.ctx.createGain();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      v.frequency.value = 5.2;
      vg.gain.value = freq * 0.006;
      v.connect(vg).connect(o.frequency);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.45);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g).connect(this.bgGain);
      o.start(t0);
      v.start(t0);
      o.stop(t0 + dur + 0.1);
      v.stop(t0 + dur + 0.1);
      this.timer = window.setTimeout(play, (dur + 0.8 + Math.random() * 2.4) * 1000);
    };
    this.timer = window.setTimeout(play, 1800);
  }

  /** Pause audio when the tab is hidden (saves battery, avoids surprise sound). */
  suspend() {
    if (this.ctx && this.ctx.state === 'running') void this.ctx.suspend();
    this.el?.pause();
  }
  resume() {
    if (this.ctx && this.ctx.state === 'suspended' && this.bgStarted) void this.ctx.resume();
    if (this.el && this.bgStarted && !this.muted) void this.el.play().catch(() => undefined);
  }
}

export const sound = new SoundEngine();

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => (document.hidden ? sound.suspend() : sound.resume()));
}
