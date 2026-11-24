/**
 * ============================================================
 *  weddingConfig.ts  —  the ONLY file you edit for a new invitation
 * ============================================================
 *  Every name, date, venue, photo and line of wording lives here.
 *  Components never hardcode wedding details.
 *
 *  Rules used for this edition:
 *   - Nothing is invented. Anything not confirmed is left empty ("").
 *   - Empty event date/time  => the date/time is simply not shown.
 *   - Empty photo `src`      => an elegant placeholder frame is shown.
 *   - Empty `mapsUrl`        => a search-based Google Maps link is built
 *                               from `venue.address`.
 */

export type EventIcon =
  | 'haldi'
  | 'mehndi'
  | 'matkor'
  | 'sangeet'
  | 'devpujan'
  | 'mandap'
  | 'baraat'
  | 'vivah'
  | 'bhoj';

export interface WeddingEvent {
  id: string;
  name: string;
  icon: EventIcon;
  /** ISO date "YYYY-MM-DD". Leave "" until confirmed — it will not be shown. */
  date: string;
  /** Free text, e.g. "शाम 7:00 बजे". Leave "" until confirmed. */
  time: string;
  /** Optional extra line (venue, dress code…). Leave "" if none. */
  note: string;
}

export interface GalleryPhoto {
  /** Path in /public (e.g. "/photos/couple-1.webp") or full URL. "" = placeholder. */
  src: string;
  alt: string;
  caption?: string;
}

export interface FamilySide {
  /** Heading, e.g. "वर पक्ष" */
  title: string;
  /** Main line(s) shown prominently */
  lines: string[];
  /** "अन्य पारिवारिक विवरण" lines. Shown exactly as given, no relation guessed. */
  otherLines: string[];
  /** Native place line (village/post/district/state). */
  place: string;
}

export const weddingConfig = {
  /* ------------------------------ Brand ------------------------------ */
  brand: {
    company: 'NexCodes Technologies',
    collection: 'Mukesh Prints – Wedding Invitation Collection',
    tagline: 'परंपरा का सम्मान, तकनीक का नया अनुभव।',
    signature: 'A Premium Digital Wedding Experience by NexCodes.',
    edition: 'Edition 01 · Divine Temple',
  },

  /** Unique id stored with each RSVP so one database can serve many invitations */
  invitationId: 'mukesh-anamika-2026',

  /* ------------------------------ Couple ------------------------------ */
  groom: {
    prefix: 'चिरंजीवी',
    name: 'मुकेश कुमार विश्वकर्मा',
    shortName: 'मुकेश',
    english: 'Mukesh Kumar Vishwakarma',
  },
  bride: {
    prefix: 'आयुष्मती',
    name: 'अनामिका राज',
    shortName: 'अनामिका',
    english: 'Anamika Raj',
  },

  /* ------------------------------ Wedding ------------------------------ */
  wedding: {
    /** Confirmed date. Countdown always targets this date in Asia/Kolkata. */
    date: '2026-12-12',
    /** Countdown target time (IST, 24h "HH:MM"). Exact muhurat is not confirmed,
     *  so the countdown aims at the start of the day. Change when known. */
    countdownTime: '00:00',
    /** Human readable form shown on the card */
    displayDate: '१२ दिसम्बर २०२६',
    displayDateEnglish: '12 December 2026',
  },

  /* ------------------------------ Venue ------------------------------ */
  venue: {
    title: 'विवाह स्थल',
    /** Shown exactly as supplied */
    address: 'Near Delhi Public School, Tundi Road, Giridih, Jharkhand, India.',
    /** Paste the exact Google Maps share URL here when available. */
    mapsUrl: '',
    phone: '+91 7870383803',
    /** WhatsApp number, digits only with country code */
    whatsappNumber: '917870383803',
  },

  /* --------------------------- Invitation wording --------------------------- */
  wording: {
    invocation: '॥ श्री गणेशाय नमः ॥',
    shloka:
      'मंगलम् भगवान विष्णुः, मंगलम् गरुड़ध्वजः।\nमंगलम् पुण्डरीकाक्षः, मंगलाय तनो हरिः॥',
    greeting: 'स्नेही स्वजन,',
    intro: 'परमपिता परमेश्वर की असीम अनुकम्पा से',
    connector: 'एवं',
    request:
      'के पावन परिणयोत्सव की मांगलिक बेला में सपरिवार पधारकर वर-वधू को अपना स्नेह एवं आशीर्वाद प्रदान कर हमें कृतार्थ करें।',
    templeTagline: 'शुभारंभ के लिए दीप प्रज्वलित करें',
    /** Short traditional Ganesh mantra shown inside the sanctum */
    sanctumTitle: 'ॐ गं गणपतये नमः',
    sanctumLine: 'विघ्नहर्ता की कृपा से शुभ कार्य निर्विघ्न सम्पन्न हो',
    envelopeHint: 'निमंत्रण खोलने के लिए मुहर पर स्पर्श करें',
  },

  /* ------------------------------ Family ------------------------------ */
  family: {
    heading: 'पारिवारिक परिचय',
    groomSide: {
      title: 'वर पक्ष',
      lines: [
        'चिरंजीवी मुकेश कुमार विश्वकर्मा',
        'सुपुत्र: श्री सुंदर लाल विश्वकर्मा एवं श्रीमती रीना देवी',
      ],
      otherLines: ['स्वर्गीय जगदीश विश्वकर्मा एवं स्वर्गीय लीलावती देवी'],
      place: 'ग्राम छाताटांड, पोस्ट बुढ़ियाडीह, जिला गिरिडीह, झारखंड',
    } satisfies FamilySide,
    brideSide: {
      title: 'वधू पक्ष',
      lines: [
        'आयुष्मती अनामिका राज',
        'सुपुत्री: श्री ओमप्रकाश उर्फ अनिल विश्वकर्मा एवं श्रीमती प्रतिमा देवी',
      ],
      otherLines: ['स्वर्गीय कार्तिक विश्वकर्मा एवं स्वर्गीय देवा देवी'],
      place: 'ग्राम पकरीबरावां, जिला नवादा, बिहार',
    } satisfies FamilySide,
    otherHeading: 'अन्य पारिवारिक विवरण',
  },

  /* ------------------------------ Events ------------------------------ */
  eventsHeading: 'मांगलिक कार्यक्रम',
  /** Shown under the heading while some events have no confirmed date. */
  eventsPendingNote: 'तिथि एवं समय की सूचना यथासमय दी जाएगी।',
  events: [
    { id: 'haldi', name: 'हल्दीलेपन', icon: 'haldi', date: '', time: '', note: '' },
    { id: 'mehndi', name: 'मेहंदी', icon: 'mehndi', date: '', time: '', note: '' },
    { id: 'matkor', name: 'मटकोर', icon: 'matkor', date: '', time: '', note: '' },
    { id: 'sangeet', name: 'संगीत', icon: 'sangeet', date: '', time: '', note: '' },
    { id: 'devpujan', name: 'देवपूजन एवं गृहशांति', icon: 'devpujan', date: '', time: '', note: '' },
    { id: 'mandap', name: 'मंडपाच्छादन', icon: 'mandap', date: '', time: '', note: '' },
    { id: 'baraat', name: 'बारात प्रस्थान', icon: 'baraat', date: '', time: '', note: '' },
    { id: 'vivah', name: 'शुभ विवाह', icon: 'vivah', date: '', time: '', note: '' },
    { id: 'bhoj', name: 'प्रीतिभोज', icon: 'bhoj', date: '', time: '', note: '' },
  ] satisfies WeddingEvent[],

  /* ------------------------------ Gallery ------------------------------ */
  gallery: {
    heading: 'स्नेह के पल',
    /** Replace `src` with real photos later. Put files in /public/photos/ */
    sections: [
      {
        id: 'couple',
        title: 'युगल',
        photos: [
          { src: '', alt: 'वर-वधू का चित्र', caption: 'यहाँ वर-वधू का चित्र लगेगा' },
          { src: '', alt: 'वर-वधू का दूसरा चित्र', caption: 'यहाँ वर-वधू का चित्र लगेगा' },
          { src: '', alt: 'वर-वधू का तीसरा चित्र', caption: 'यहाँ वर-वधू का चित्र लगेगा' },
        ],
      },
      {
        id: 'family',
        title: 'परिवार',
        photos: [
          { src: '', alt: 'वर पक्ष का पारिवारिक चित्र', caption: 'यहाँ परिवार का चित्र लगेगा' },
          { src: '', alt: 'वधू पक्ष का पारिवारिक चित्र', caption: 'यहाँ परिवार का चित्र लगेगा' },
        ],
      },
      {
        id: 'moments',
        title: 'शुभ क्षण',
        photos: [
          { src: '', alt: 'शुभ क्षण', caption: 'यहाँ शुभ क्षणों का चित्र लगेगा' },
          { src: '', alt: 'शुभ क्षण', caption: 'यहाँ शुभ क्षणों का चित्र लगेगा' },
          { src: '', alt: 'शुभ क्षण', caption: 'यहाँ शुभ क्षणों का चित्र लगेगा' },
          { src: '', alt: 'शुभ क्षण', caption: 'यहाँ शुभ क्षणों का चित्र लगेगा' },
        ],
      },
    ] as { id: string; title: string; photos: GalleryPhoto[] }[],
  },

  /** Optional: path to a Ganesh illustration you are licensed to use
   *  (e.g. "/images/ganesh.webp"). Empty = decorative lotus-Om motif. */
  ganeshImage: '',

  /* ------------------------------ Music ------------------------------ */
  audio: {
    /** Empty = built-in original synthesized bells/conch/ambient (no licensing issue).
     *  Or set to a licensed MP3 in /public/audio/ for background music. */
    backgroundMusicUrl: '',
    volume: 0.5,
  },

  /* ------------------------------ RSVP ------------------------------ */
  rsvp: {
    heading: 'आपका आगमन हमारे लिए सौभाग्य की बात होगी।',
    maxGuests: 10,
    labels: {
      name: 'अतिथि का नाम',
      phone: 'मोबाइल नंबर',
      attending: 'क्या आप समारोह में शामिल होंगे?',
      guests: 'आपके साथ आने वाले मेहमानों की संख्या',
      message: 'शुभकामना संदेश',
      yes: 'हाँ, हम अवश्य आएंगे।',
      no: 'खेद है, हम उपस्थित नहीं हो पाएंगे।',
    },
  },

  /* ------------------------------ Share / SEO ------------------------------ */
  share: {
    pageTitle: 'मुकेश एवं अनामिका का शुभ विवाह | Digital Wedding Invitation',
    description: 'मुकेश कुमार विश्वकर्मा एवं अनामिका राज के शुभ विवाह का सादर निमंत्रण।',
    whatsappText: 'नमस्कार! मुकेश एवं अनामिका के शुभ विवाह का निमंत्रण सादर स्वीकार करें।',
  },
};

export type WeddingConfig = typeof weddingConfig;
