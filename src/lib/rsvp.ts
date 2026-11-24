import { weddingConfig } from '../config/weddingConfig';

export interface RsvpPayload {
  name: string;
  phone: string;
  attending: boolean;
  guests: number;
  message: string;
}

const URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const backendConfigured = Boolean(URL && KEY);

export type RsvpResult = { saved: true } | { saved: false; reason: 'not-configured' | 'failed' };

/**
 * Inserts one row through Supabase's REST API (anon key + insert-only RLS).
 * Returns saved:true ONLY when the server answered 2xx — we never pretend.
 */
export async function submitRsvp(p: RsvpPayload): Promise<RsvpResult> {
  if (!URL || !KEY) return { saved: false, reason: 'not-configured' };
  try {
    const res = await fetch(`${URL}/rest/v1/rsvps`, {
      method: 'POST',
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        invitation_id: weddingConfig.invitationId,
        guest_name: p.name,
        phone: p.phone,
        attending: p.attending,
        guest_count: p.attending ? p.guests : 0,
        message: p.message || null,
      }),
    });
    return res.ok ? { saved: true } : { saved: false, reason: 'failed' };
  } catch {
    return { saved: false, reason: 'failed' };
  }
}
