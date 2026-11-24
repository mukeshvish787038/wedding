import { weddingConfig } from '../config/weddingConfig';
import { useCountdown, useReveal } from '../lib/hooks';
import { Divider, Paper } from './Ornaments';

/** Absolute target in IST regardless of the visitor's device timezone. */
const TARGET = new Date(
  `${weddingConfig.wedding.date}T${weddingConfig.wedding.countdownTime}:00+05:30`,
).getTime();

const pad = (n: number, w = 2) => String(n).padStart(w, '0');

export function Countdown() {
  const r = useCountdown(TARGET);
  const ref = useReveal<HTMLDivElement>();
  const { groom, bride, wedding } = weddingConfig;

  return (
    <div ref={ref} className="reveal">
      <Paper className="countdown-paper" labelledBy="cd-h">
        <h2 id="cd-h" className="section-title">शुभ विवाह में शेष समय</h2>
        <Divider />
        {r.phase === 'before' ? (
          <div className="cd-grid" role="timer" aria-label="विवाह तक शेष समय">
            {[
              ['दिन', pad(r.days, 2)],
              ['घंटे', pad(r.hours)],
              ['मिनट', pad(r.minutes)],
              ['सेकंड', pad(r.seconds)],
            ].map(([label, val]) => (
              <div key={label} className="cd-cell">
                <span className="cd-num gold-text">{val}</span>
                <span className="cd-label">{label}</span>
              </div>
            ))}
          </div>
        ) : r.phase === 'today' ? (
          <p className="cd-message">
            आज {groom.shortName} एवं {bride.shortName} के शुभ विवाह का मंगल दिवस है।
            <br />
            आपके आशीर्वाद की प्रतीक्षा है।
          </p>
        ) : (
          <p className="cd-message">
            {groom.shortName} एवं {bride.shortName} का शुभ विवाह सम्पन्न हुआ।
            <br />
            आपके स्नेह एवं आशीर्वाद के लिए हृदय से आभार।
          </p>
        )}
        <p className="cd-date">{wedding.displayDate}</p>
      </Paper>
    </div>
  );
}
