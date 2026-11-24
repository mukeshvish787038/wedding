import { useEffect, useRef, useState } from 'react';
import { weddingConfig } from '../config/weddingConfig';
import { sound } from '../lib/audio';

type Phase = 'closed' | 'breaking' | 'open' | 'rising';

interface Props {
  onDone: () => void;
  reduced: boolean;
}

export function Envelope({ onDone, reduced }: Props) {
  const [phase, setPhase] = useState<Phase>('closed');
  const timers = useRef<number[]>([]);
  const { groom, bride, wording, wedding } = weddingConfig;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, reduced ? Math.min(ms, 350) : ms));
  };

  const openEnvelope = () => {
    if (phase !== 'closed') return;
    sound.unlock();
    sound.bell(0, 0.12);
    setPhase('breaking');
    later(() => setPhase('open'), 520);
    later(() => setPhase('rising'), 1500);
    later(onDone, 2900);
  };

  const flapOpen = phase !== 'closed' && phase !== 'breaking';

  return (
    <section className={`envelope-scene phase-${phase}`} aria-label="निमंत्रण पत्र">
      <div className="env-bg" aria-hidden="true" />
      <p className="env-hint" aria-live="polite">
        {phase === 'closed' ? wording.envelopeHint : ' '}
      </p>

      <div className="envelope-wrap">
        <div className="envelope">
          <div className="env-back" aria-hidden="true" />

          {/* the card peeking out of the pocket */}
          <div className="env-card" aria-hidden="true">
            <div className="env-card-inner">
              <span className="mini-om gold-text">॥ श्री गणेशाय नमः ॥</span>
              <span className="mini-names">
                {groom.shortName} <em>&</em> {bride.shortName}
              </span>
              <span className="mini-date">{wedding.displayDate}</span>
            </div>
          </div>

          <div className="env-front" aria-hidden="true">
            <svg viewBox="0 0 100 70" preserveAspectRatio="none">
              <path d="M0 0 L50 38 L100 0" fill="none" stroke="rgba(176,128,40,.55)" strokeWidth=".4" vectorEffect="non-scaling-stroke" />
              <path d="M0 70 L38 34 M100 70 L62 34" fill="none" stroke="rgba(176,128,40,.28)" strokeWidth=".4" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="env-print">
              <span className="env-print-title gold-text">शुभ विवाह</span>
              <span className="env-print-names">
                {groom.shortName} &amp; {bride.shortName}
              </span>
            </div>
          </div>

          <div className={`env-flap ${flapOpen ? 'flap-open' : ''}`} aria-hidden="true">
            <div className="flap-face flap-out">
              <svg viewBox="0 0 100 52" preserveAspectRatio="none">
                <path d="M0 0 H100 L50 52 Z" className="flap-shape" />
                <path d="M6 2 H94 L50 46 Z" fill="none" stroke="rgba(176,128,40,.7)" strokeWidth=".5" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <div className="flap-face flap-in">
              <svg viewBox="0 0 100 52" preserveAspectRatio="none">
                <path d="M0 0 H100 L50 52 Z" className="flap-lining" />
              </svg>
            </div>
          </div>

          <button
            type="button"
            className={`seal ${phase !== 'closed' ? 'seal-broken' : ''}`}
            onClick={openEnvelope}
            aria-label="मुहर तोड़कर निमंत्रण खोलें"
            disabled={phase !== 'closed'}
          >
            <span className="seal-half seal-half-l" />
            <span className="seal-half seal-half-r" />
            <span className="seal-mark">
              {groom.shortName.charAt(0)}
              <i>·</i>
              {bride.shortName.charAt(0)}
            </span>
            {phase === 'closed' && <span className="seal-pulse" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </section>
  );
}
