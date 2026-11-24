import { useRef, useState, type FormEvent } from 'react';
import { weddingConfig } from '../config/weddingConfig';
import { rsvpWhatsAppText, whatsappChat, whatsappShare } from '../lib/links';
import { backendConfigured, submitRsvp, type RsvpResult } from '../lib/rsvp';
import { useReveal } from '../lib/hooks';
import { Icon } from './Icon';
import { Divider, Paper } from './Ornaments';

interface Done {
  attending: boolean;
  name: string;
  guests: number;
  message: string;
  result: RsvpResult;
}

export function Rsvp() {
  const { rsvp, groom, bride } = weddingConfig;
  const L = rsvp.labels;
  const ref = useReveal<HTMLDivElement>();
  const choice = useRef<boolean>(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<Done | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (String(f.get('website') ?? '') !== '') return; // honeypot: bots only
    const name = String(f.get('name') ?? '').trim();
    const phone = String(f.get('phone') ?? '').trim();
    const digits = phone.replace(/\D/g, '');
    if (!name) return setError('कृपया अपना नाम लिखें।');
    if (digits.length < 10 || digits.length > 13) return setError('कृपया सही मोबाइल नंबर लिखें।');
    const attending = choice.current;
    const guests = attending ? Math.min(Number(f.get('guests') ?? 0) || 0, rsvp.maxGuests) : 0;
    const message = String(f.get('message') ?? '').trim().slice(0, 600);
    setError('');
    setBusy(true);
    const result = await submitRsvp({ name, phone, attending, guests, message });
    setBusy(false);
    setDone({ attending, name, guests, message, result });
  };

  if (done) {
    const saved = done.result.saved;
    const wa = whatsappChat(rsvpWhatsAppText(done));
    return (
      <div ref={ref} className="reveal">
        <Paper className="rsvp-done" labelledBy="rsvp-h">
          <span className="done-badge"><Icon name="check" size={34} /></span>
          <h2 id="rsvp-h" className="section-title">
            {done.attending ? 'धन्यवाद, ' : 'आपके स्नेह के लिए आभार, '}
            {done.name}
          </h2>
          <Divider />
          <p className="done-text">
            {done.attending
              ? `${groom.shortName} एवं ${bride.shortName} के शुभ विवाह में आपकी उपस्थिति हमारे लिए सौभाग्य की बात होगी।`
              : `आपकी शुभकामनाएँ ही हमारे लिए आशीर्वाद हैं। ${groom.shortName} एवं ${bride.shortName} की ओर से हार्दिक आभार।`}
          </p>
          <p className={`done-status ${saved ? 'ok' : 'warn'}`} role="status">
            {saved
              ? 'आपका उत्तर सुरक्षित रूप से दर्ज हो गया है।'
              : done.result.saved === false && done.result.reason === 'failed'
                ? 'नेटवर्क समस्या के कारण आपका उत्तर दर्ज नहीं हो सका। कृपया नीचे के बटन से WhatsApp पर भेज दें।'
                : 'आपका उत्तर इस पेज पर सहेजा नहीं गया है। कृपया नीचे के बटन से WhatsApp पर भेज दें।'}
          </p>
          <div className="btn-col">
            <a className="btn btn-primary btn-block" href={wa} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={20} /> WhatsApp पर उत्तर भेजें
            </a>
            <a className="btn btn-ghost btn-block" href={whatsappShare()} target="_blank" rel="noopener noreferrer">
              <Icon name="share" size={20} /> निमंत्रण साझा करें
            </a>
            <button className="btn-link" onClick={() => setDone(null)}>उत्तर बदलें</button>
          </div>
        </Paper>
      </div>
    );
  }

  return (
    <div ref={ref} className="reveal">
      <Paper labelledBy="rsvp-h">
        <h2 id="rsvp-h" className="section-title rsvp-title">{rsvp.heading}</h2>
        <Divider />
        <form className="rsvp-form" onSubmit={onSubmit} noValidate>
          <label className="field">
            <span>{L.name}</span>
            <input name="name" type="text" autoComplete="name" maxLength={120} required />
          </label>
          <label className="field">
            <span>{L.phone}</span>
            <input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} placeholder="+91" required />
          </label>
          <label className="field">
            <span>{L.guests}</span>
            <select name="guests" defaultValue="0">
              {Array.from({ length: rsvp.maxGuests + 1 }, (_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>{L.message}</span>
            <textarea name="message" rows={3} maxLength={600} />
          </label>
          {/* honeypot — hidden from people */}
          <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <p className="field-q">{L.attending}</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="btn-col">
            <button className="btn btn-primary btn-block" type="submit" disabled={busy} onClick={() => (choice.current = true)}>
              {busy && choice.current ? 'भेजा जा रहा है…' : L.yes}
            </button>
            <button className="btn btn-ghost btn-block" type="submit" disabled={busy} onClick={() => (choice.current = false)}>
              {busy && !choice.current ? 'भेजा जा रहा है…' : L.no}
            </button>
          </div>
          {!backendConfigured && (
            <p className="rsvp-note">उत्तर देने के बाद आप उसे WhatsApp द्वारा भी भेज सकेंगे।</p>
          )}
        </form>
      </Paper>
    </div>
  );
}
