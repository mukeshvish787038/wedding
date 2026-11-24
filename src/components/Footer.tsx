import { weddingConfig } from '../config/weddingConfig';
import { whatsappShare } from '../lib/links';
import { Icon } from './Icon';

export function Footer() {
  const { brand, wording } = weddingConfig;
  return (
    <footer className="footer">
      <a className="btn btn-ghost btn-light" href={whatsappShare()} target="_blank" rel="noopener noreferrer">
        <Icon name="share" size={20} /> WhatsApp पर निमंत्रण भेजें
      </a>
      <p className="footer-blessing gold-text">{wording.invocation}</p>
      <p className="footer-brand">{brand.signature}</p>
      <p className="footer-brand small">{brand.company} · {brand.tagline}</p>
    </footer>
  );
}
