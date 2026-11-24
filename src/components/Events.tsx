import { weddingConfig } from '../config/weddingConfig';
import { useReveal } from '../lib/hooks';
import { Icon } from './Icon';
import { Divider, Paper } from './Ornaments';

function fmtDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00+05:30`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('hi-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function Events() {
  const { events, eventsHeading, eventsPendingNote } = weddingConfig;
  const ref = useReveal<HTMLDivElement>();
  const anyPending = events.some((e) => !e.date);
  return (
    <div ref={ref} className="reveal">
      <Paper labelledBy="ev-h">
        <h2 id="ev-h" className="section-title">{eventsHeading}</h2>
        <Divider />
        <ol className="events">
          {events.map((e, i) => (
            <li key={e.id} className="event" style={{ ['--i' as string]: i }}>
              <span className="event-icon">
                <Icon name={e.icon} size={26} />
              </span>
              <div className="event-text">
                <h3>{e.name}</h3>
                {e.date && <p className="event-date">{fmtDate(e.date)}</p>}
                {e.time && <p className="event-time">{e.time}</p>}
                {e.note && <p className="event-note">{e.note}</p>}
              </div>
            </li>
          ))}
        </ol>
        {anyPending && <p className="events-note">{eventsPendingNote}</p>}
      </Paper>
    </div>
  );
}
