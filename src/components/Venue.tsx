import { weddingConfig } from '../config/weddingConfig';
import { directionsUrl, telUrl, whatsappChat } from '../lib/links';
import { useReveal } from '../lib/hooks';
import { Icon } from './Icon';
import { Divider, Paper } from './Ornaments';

export function Venue() {
  const { venue } = weddingConfig;
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal">
      <Paper labelledBy="venue-h">
        <h2 id="venue-h" className="section-title">{venue.title}</h2>
        <Divider />
        <div className="venue-pin"><Icon name="pin" size={30} /></div>
        <address className="venue-address">{venue.address}</address>
        <a className="btn btn-primary btn-block" href={directionsUrl()} target="_blank" rel="noopener noreferrer">
          <Icon name="navigate" size={20} /> रास्ता देखें (Google Maps)
        </a>
        <p className="venue-contact-label">संपर्क</p>
        <div className="btn-row">
          <a className="btn btn-ghost" href={telUrl()}>
            <Icon name="phone" size={20} /> {venue.phone}
          </a>
          <a className="btn btn-ghost" href={whatsappChat()} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={20} /> WhatsApp
          </a>
        </div>
      </Paper>
    </div>
  );
}
