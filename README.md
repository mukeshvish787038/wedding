# NexCodes · Divine Temple Wedding Invitation (Edition 01)

A mobile-first interactive Hindu wedding invitation: temple doors → diya lighting → temple bell →
sanctum → wax-sealed envelope → physical-style card, followed by family details, live countdown,
events, venue, gallery and RSVP.

Built with **React + TypeScript + Vite**. No UI framework: styling is one hand-written CSS file and
all animation is CSS (transform/opacity only, so it stays smooth on mid-range Android).
Sound is synthesized with the Web Audio API, so there are no copyrighted audio files.

---

## 1. Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build -> dist/
npm run typecheck    # optional strict TypeScript check
```

Node 18+ recommended.

## 2. Edit the wedding details (one file)

Everything lives in **`src/config/weddingConfig.ts`**. Components never hardcode wedding data.

| To change… | Edit in `weddingConfig.ts` |
|---|---|
| Names | `groom`, `bride` |
| Date / countdown | `wedding.date` (`YYYY-MM-DD`), `wedding.countdownTime` (IST, `HH:MM`), `wedding.displayDate` |
| Family wording | `family.groomSide`, `family.brideSide` (`lines`, `otherLines`, `place`) |
| Venue / phone | `venue.address`, `venue.phone`, `venue.whatsappNumber` |
| Exact Google Maps pin | `venue.mapsUrl` (paste the Share link). Empty = a search link built from the address |
| Invitation wording | `wording.*` |
| Event dates/times | each item in `events` → `date: '2026-12-11'`, `time: 'शाम 7:00 बजे'`, `note: '…'` |
| RSVP texts/limits | `rsvp.*` |
| WhatsApp share text | `share.whatsappText` |

**Events:** a date or time is shown only if you fill it in. Empty = only the event name appears.
Nothing is auto-assigned.

**Countdown:** targets `wedding.date` + `countdownTime` in **Asia/Kolkata**, whatever timezone the
visitor's phone is in. The muhurat time is not confirmed, so it currently counts to 00:00 IST on
12 Dec 2026. Set `countdownTime` (e.g. `'09:30'`) when the time is known. On the wedding day a
blessing message replaces the numbers, and afterwards a thank-you message.

> Check the family section: the supplied text lists श्री सुंदर लाल विश्वकर्मा एवं श्रीमती रीना देवी as the
> groom's parents (वर पक्ष) and स्वर्गीय जगदीश विश्वकर्मा एवं स्वर्गीय लीलावती देवी under
> "अन्य पारिवारिक विवरण". It is shown exactly like that, with no relationship added. Edit
> `family.*` if the printed card says otherwise.

## 3. Replace the sample photos

1. Put images in `public/photos/` (WebP, ~1200px on the long side, under ~250 KB each).
2. In `weddingConfig.ts` → `gallery.sections`, set `src: '/photos/couple-1.webp'` and update `alt`/`caption`.
3. Add or remove items freely. Photos with empty `src`, or that fail to load, show the ornamental placeholder.

Images are lazy-loaded and the grid reserves space, so there is no layout shift.

**Ganesh illustration (optional):** the sanctum shows a lotus-Om motif by default. If you have an
illustration you are licensed to use, put it at `public/images/ganesh.webp` and set `ganeshImage: '/images/ganesh.webp'`.

## 4. Music and sound

- Sound starts **only after the first tap** (on the diya) and never autoplays.
- The round speaker button (top-right) mutes/unmutes; the choice is remembered.
- Default: built-in original sounds — soft bell, gentle conch, drone and flute-like ambience.
- To use real shehnai/flute music instead: put a **properly licensed** MP3 at `public/audio/music.mp3` and set
  `audio.backgroundMusicUrl: '/audio/music.mp3'`. If it fails to load, the page stays silent and works normally.
- Do not use commercial film/album recordings without permission.

## 5. RSVP (Supabase, optional)

Without Supabase the RSVP form still works as a **WhatsApp RSVP**: after submitting, the guest taps a
button that opens WhatsApp to +91 7870383803 with a ready Hindi message. The confirmation screen then says
plainly that the answer was *not saved on the page* — it never claims a save that did not happen.

To store answers:

1. Create a free project at <https://supabase.com>.
2. **SQL Editor → New query →** paste `supabase/schema.sql` → **Run**.
3. **Project Settings → API:** copy the *Project URL* and the **anon public** key.
4. Put them in `.env` (local) and in Vercel Environment Variables:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
5. Read responses in Supabase **Table Editor → rsvps** (or export CSV).

Why this is safe: the anon key is *meant* to be public. The SQL enables Row Level Security with an
**insert-only** rule for anonymous visitors, so guest names and numbers can never be read from the website.
**Never** put the `service_role` key in this project.

## 6. Deploy: GitHub → Vercel

```bash
git init && git add . && git commit -m "Divine Temple invitation"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

1. Vercel → **Add New → Project** → import the repo. Framework is auto-detected as Vite
   (build `npm run build`, output `dist`).
2. Add Environment Variables: `VITE_SITE_URL` (your final URL, no trailing slash, e.g.
   `https://mukesh-anamika.vercel.app`) and, if using RSVP storage, the two Supabase variables.
3. Deploy. Then **redeploy once** after you know the final URL so the WhatsApp preview image gets an absolute URL.

**WhatsApp preview:** WhatsApp caches link previews. If you change the title/image later, test with a new
URL suffix such as `?v=2`. The preview image is `public/og-image.jpg` (1200×630).

**Commercial note:** Vercel's free *Hobby* plan is for non-commercial/demo use. Before you accept paying
customers, use a Vercel plan or another host whose terms allow commercial use.

## 7. Selling it to other customers

Duplicate the repo (or branch), then change only `weddingConfig.ts`, the photos in `public/photos/`,
`public/og-image.jpg`, the `<title>`/description in `index.html`, and `invitationId` (so each wedding's
RSVPs stay separate in one Supabase table).

## 8. Project structure

```
src/
  config/weddingConfig.ts   ← all editable content
  components/               Temple, Envelope, Card, Countdown, Events, Venue, Gallery, Rsvp, …
  lib/                      audio (Web Audio), links (WhatsApp/Maps), rsvp (Supabase), hooks
  styles/index.css          design tokens + all styling
public/                     favicon, share image, (your photos/audio)
supabase/schema.sql         RSVP table + security rules
```

## 9. Accessibility and performance notes

- Honors `prefers-reduced-motion` (short, calm transitions; no falling petals).
- Diya, seal, buttons, tabs and the lightbox are real buttons: keyboard and screen-reader friendly;
  lightbox supports Esc/arrow keys and swipe.
- A visible "आगे बढ़ें" button lets guests skip the opening cinematic.
- Fonts: Tiro Devanagari Hindi, Hind, Noto Sans Devanagari (Google Fonts, `display=swap`) with system
  Devanagari fallbacks; line-height is generous so matras are never clipped.
- Opening scene is pure CSS/SVG (no image downloads). no heavy libraries (React only).
