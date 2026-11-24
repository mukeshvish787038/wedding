import { useMemo } from 'react';
import { weddingConfig } from '../config/weddingConfig';

export type TempleStage = 'idle' | 'lit' | 'opening' | 'sanctum';

/* Deterministic pseudo-random so SSR/refresh gives the same layout */
function rnd(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function Petals({ count }: { count: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: rnd(i + 1) * 100,
        delay: -rnd(i + 20) * 14,
        dur: 11 + rnd(i + 40) * 9,
        size: 9 + rnd(i + 60) * 10,
        hue: i % 3,
        sway: 18 + rnd(i + 80) * 36,
      })),
    [count],
  );
  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className={`petal petal-${p.hue}`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.3,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            ['--sway' as string]: `${p.sway}px`,
          }}
        />
      ))}
    </div>
  );
}

function Sparks({ active }: { active: boolean }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const a = rnd(i + 3) * Math.PI * 2;
        const r = 70 + rnd(i + 9) * 150;
        return {
          dx: Math.cos(a) * r,
          dy: Math.sin(a) * r - 60,
          d: rnd(i + 30) * 0.6,
          s: 2 + rnd(i + 50) * 3,
        };
      }),
    [],
  );
  if (!active) return null;
  return (
    <div className="sparks" aria-hidden="true">
      {sparks.map((s, i) => (
        <i
          key={i}
          style={{
            width: s.s,
            height: s.s,
            animationDelay: `${s.d}s`,
            ['--dx' as string]: `${s.dx}px`,
            ['--dy' as string]: `${s.dy}px`,
          }}
        />
      ))}
    </div>
  );
}

function Bell({ x, len, delay }: { x: number; len: number; delay: number }) {
  return (
    <div className="bell" style={{ left: `${x}%`, animationDelay: `${delay}s` }} aria-hidden="true">
      <span className="bell-cord" style={{ height: len }} />
      <svg width="30" height="36" viewBox="0 0 30 36">
        <defs>
          <linearGradient id={`bg${x}`} x1="0" x2="1">
            <stop offset="0" stopColor="#8a5a14" />
            <stop offset=".35" stopColor="#f3d98a" />
            <stop offset=".7" stopColor="#c8932f" />
            <stop offset="1" stopColor="#6b430c" />
          </linearGradient>
        </defs>
        <path d="M15 2a3 3 0 0 1 3 3v1.500c5 1.500 8 6 8 12v6l3 4H1l3-4v-6c0-6 3-10.500 8-12V5a3 3 0 0 1 3-3Z" fill={`url(#bg${x})`} stroke="#4a2c06" strokeWidth=".7" />
        <path d="M5 26h20" stroke="#4a2c06" strokeWidth=".6" opacity=".6" />
        <circle cx="15" cy="32" r="2.600" fill="#f3d98a" stroke="#4a2c06" strokeWidth=".6" />
      </svg>
    </div>
  );
}

function Toran() {
  // marigold garland following a gentle curve across the lintel
  const beads = Array.from({ length: 21 }, (_, i) => {
    const t = i / 20;
    const x = 4 + t * 92;
    const y = 8 + Math.sin(t * Math.PI) * 14;
    return { x, y, hue: i % 2 };
  });
  return (
    <svg className="toran" viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 8 Q50 36 96 8" fill="none" stroke="#3d5a1f" strokeWidth=".7" />
      {beads.map((b, i) => (
        <g key={i}>
          <ellipse cx={b.x} cy={b.y + 3.800} rx="1.600" ry="3.200" fill="#4d7a2a" opacity=".85" />
          <circle cx={b.x} cy={b.y} r="2.300" fill={b.hue ? '#f2a31b' : '#e8710a'} />
          <circle cx={b.x} cy={b.y} r="1" fill="#ffd36b" />
        </g>
      ))}
    </svg>
  );
}

function Diya({ lit, onLight, interactive }: { lit: boolean; onLight: () => void; interactive: boolean }) {
  return (
    <button
      type="button"
      className={`diya ${lit ? 'diya-lit' : ''}`}
      onClick={onLight}
      disabled={!interactive}
      aria-label="दीप प्रज्वलित करें"
    >
      {!lit && <span className="diya-ring" aria-hidden="true" />}
      <span className="flame-wrap" aria-hidden="true">
        <span className="flame-glow" />
        <span className="flame">
          <span className="flame-core" />
        </span>
      </span>
      <svg className="diya-body" viewBox="0 0 160 84" aria-hidden="true">
        <defs>
          <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7a4d0e" />
            <stop offset=".3" stopColor="#f6dc8e" />
            <stop offset=".55" stopColor="#c8932f" />
            <stop offset=".8" stopColor="#f0cf78" />
            <stop offset="1" stopColor="#6a420a" />
          </linearGradient>
          <radialGradient id="oil" cx=".5" cy=".3" r=".8">
            <stop offset="0" stopColor="#ffcf6a" />
            <stop offset="1" stopColor="#8a4b0a" />
          </radialGradient>
        </defs>
        {/* bowl */}
        <path d="M6 22h148c0 30-30 48-74 48S6 52 6 22Z" fill="url(#brass)" stroke="#4a2c06" strokeWidth="1.200" />
        <ellipse cx="80" cy="22" rx="74" ry="9" fill="url(#brass)" stroke="#4a2c06" strokeWidth="1.200" />
        <ellipse cx="80" cy="22" rx="62" ry="6" fill="url(#oil)" />
        {/* spout (wick holder) */}
        <path d="M138 21c10-3 16-8 18-14-8 1-14 4-20 10" fill="url(#brass)" stroke="#4a2c06" strokeWidth="1" />
        {/* engraved band */}
        <path d="M24 38c18 8 94 8 112 0" fill="none" stroke="#4a2c06" strokeWidth="1" opacity=".55" />
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={34 + i * 11.500} cy={44 + Math.sin((i / 8) * Math.PI) * 4} r="2" fill="#4a2c06" opacity=".5" />
        ))}
        {/* stem + base */}
        <path d="M68 68h24l4 8H64l4-8Z" fill="url(#brass)" stroke="#4a2c06" strokeWidth="1" />
        <ellipse cx="80" cy="78" rx="30" ry="5" fill="url(#brass)" stroke="#4a2c06" strokeWidth="1" />
      </svg>
    </button>
  );
}

function Lotus({ size = 150 }: { size?: number }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg width={size} height={size} viewBox="-60 -60 120 120" className="lotus" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff1b8" />
          <stop offset=".55" stopColor="#e2b04a" />
          <stop offset="1" stopColor="#9b6a16" />
        </linearGradient>
      </defs>
      {petals.map((a) => (
        <path key={a} d="M0 -52C9 -38 9 -22 0 -10 -9 -22 -9 -38 0 -52Z" transform={`rotate(${a})`} fill="url(#lg)" opacity=".92" stroke="#7a4d0e" strokeWidth=".5" />
      ))}
      {petals.map((a) => (
        <path key={`i${a}`} d="M0 -36C6 -27 6 -18 0 -10 -6 -18 -6 -27 0 -36Z" transform={`rotate(${a + 15})`} fill="#fff4cc" opacity=".85" />
      ))}
      <circle r="17" fill="#5a0f14" stroke="url(#lg)" strokeWidth="1.500" />
      <text x="0" y="8" textAnchor="middle" fontSize="22" fill="#f6dc8e" fontFamily="'Tiro Devanagari Hindi','Noto Sans Devanagari',serif">ॐ</text>
    </svg>
  );
}

interface Props {
  stage: TempleStage;
  onLight: () => void;
  onSkip: () => void;
  reduced: boolean;
}

export function Temple({ stage, onLight, onSkip, reduced }: Props) {
  const lit = stage !== 'idle';
  const open = stage === 'opening' || stage === 'sanctum';
  const { wording, ganeshImage } = weddingConfig;

  return (
    <section className={`temple stage-${stage}`} aria-label="मंदिर द्वार">
      <div className="temple-vignette" aria-hidden="true" />
      <div className="temple-glow" aria-hidden="true" />
      {!reduced && <Petals count={11} />}

      <header className="temple-head">
        <p className="invocation gold-text">{wording.invocation}</p>
        <p className="temple-tagline">{wording.templeTagline}</p>
      </header>

      <div className="temple-stage">
        <div className="pillar pillar-l" aria-hidden="true"><i /></div>
        <div className="pillar pillar-r" aria-hidden="true"><i /></div>

        <div className="lintel" aria-hidden="true">
          <Toran />
          <Bell x={18} len={22} delay={0} />
          <Bell x={50} len={34} delay={-1.600} />
          <Bell x={82} len={22} delay={-0.800} />
        </div>

        <div className="doorway">
          {/* what lies behind the doors */}
          <div className="sanctum" aria-live="polite">
            <div className="sanctum-rays" aria-hidden="true" />
            {ganeshImage ? (
              <img className="ganesh-img" src={ganeshImage} alt="श्री गणेश" />
            ) : (
              <Lotus />
            )}
            <p className="sanctum-title gold-text">{wording.sanctumTitle}</p>
            <p className="sanctum-line">{wording.sanctumLine}</p>
          </div>

          <div className={`doors ${open ? 'doors-open' : ''}`} aria-hidden="true">
            <div className="door door-l"><span className="ring" /></div>
            <div className="door door-r"><span className="ring" /></div>
          </div>
        </div>
      </div>

      <div className="diya-zone">
        <Sparks active={lit && !reduced} />
        <Diya lit={lit} onLight={onLight} interactive={!lit} />
        {!lit && <span className="tap-hint">दीये को स्पर्श करें</span>}
      </div>

      {lit && (
        <button type="button" className="skip-btn" onClick={onSkip}>
          आगे बढ़ें
        </button>
      )}
    </section>
  );
}
