import { weddingConfig } from '../config/weddingConfig';

const { venue, share } = weddingConfig;

/** Current invitation URL without hash (works on Vercel and in WhatsApp). */
export function invitationUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin + window.location.pathname;
}

/** Configured map URL, otherwise a search-based directions link for the address. */
export function directionsUrl(): string {
  if (venue.mapsUrl) return venue.mapsUrl;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.address)}`;
}

export function telUrl(): string {
  return `tel:${venue.phone.replace(/[^+\d]/g, '')}`;
}

/** Click-to-chat link (no WhatsApp API involved). */
export function whatsappChat(text?: string): string {
  const base = `https://wa.me/${venue.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Share the invitation to any WhatsApp contact. */
export function whatsappShare(): string {
  const text = `${share.whatsappText}\n${invitationUrl()}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function rsvpWhatsAppText(p: {
  name: string;
  attending: boolean;
  guests: number;
  message: string;
}): string {
  const lines = [
    'नमस्कार!',
    p.attending
      ? `मैं ${p.name}, ${weddingConfig.groom.shortName} एवं ${weddingConfig.bride.shortName} के शुभ विवाह में अवश्य उपस्थित रहूँगा/रहूँगी।`
      : `मैं ${p.name}, ${weddingConfig.groom.shortName} एवं ${weddingConfig.bride.shortName} के शुभ विवाह में खेद है कि उपस्थित नहीं हो पाऊँगा/पाऊँगी।`,
  ];
  if (p.attending && p.guests > 0) lines.push(`मेरे साथ ${p.guests} अतिथि होंगे।`);
  if (p.message.trim()) lines.push(`शुभकामना: ${p.message.trim()}`);
  lines.push('', invitationUrl());
  return lines.join('\n');
}
