import { weddingConfig, type FamilySide } from '../config/weddingConfig';
import { Divider, Paper } from './Ornaments';
import { useReveal } from '../lib/hooks';

export function InvitationCard() {
  const { wording, groom, bride, wedding } = weddingConfig;
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal card-reveal">
      <Paper className="invite-card" labelledBy="couple-names">
        <p className="card-invocation gold-text">{wording.invocation}</p>
        <p className="card-shloka">
          {wording.shloka.split('\n').map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </p>
        <Divider />
        <p className="card-greeting">{wording.greeting}</p>
        <p className="card-intro">{wording.intro}</p>

        <h1 id="couple-names" className="couple">
          <span className="couple-prefix">{groom.prefix}</span>
          <span className="couple-name gold-text emboss">{groom.name}</span>
          <span className="couple-and">{wording.connector}</span>
          <span className="couple-prefix">{bride.prefix}</span>
          <span className="couple-name gold-text emboss">{bride.name}</span>
        </h1>

        <p className="card-request">{wording.request}</p>
        <Divider />
        <p className="card-date">
          <span className="card-date-label">शुभ तिथि</span>
          <strong>{wedding.displayDate}</strong>
        </p>
        <p className="scroll-cue" aria-hidden="true">
          <span />
        </p>
      </Paper>
    </div>
  );
}

function Side({ side }: { side: FamilySide }) {
  return (
    <div className="family-side">
      <h3>{side.title}</h3>
      {side.lines.map((l) => (
        <p key={l} className="family-main">
          {l}
        </p>
      ))}
      {side.otherLines.length > 0 && (
        <>
          <p className="family-other-label">{weddingConfig.family.otherHeading}</p>
          {side.otherLines.map((l) => (
            <p key={l} className="family-other">
              {l}
            </p>
          ))}
        </>
      )}
      {side.place && <p className="family-place">{side.place}</p>}
    </div>
  );
}

export function FamilyCard() {
  const { family } = weddingConfig;
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal">
      <Paper labelledBy="family-h">
        <h2 id="family-h" className="section-title">
          {family.heading}
        </h2>
        <Divider />
        <Side side={family.groomSide} />
        <span className="family-sep" aria-hidden="true">❖</span>
        <Side side={family.brideSide} />
      </Paper>
    </div>
  );
}
