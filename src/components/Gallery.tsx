import { useCallback, useEffect, useRef, useState } from 'react';
import { weddingConfig, type GalleryPhoto } from '../config/weddingConfig';
import { useReveal } from '../lib/hooks';
import { Icon } from './Icon';
import { Divider, Paper } from './Ornaments';

/** Elegant stand-in shown whenever a photo has no `src` yet (or fails to load). */
function Placeholder({ caption }: { caption?: string }) {
  return (
    <div className="ph" role="img" aria-label={caption ?? 'चित्र के लिए स्थान'}>
      <svg viewBox="-40 -40 80 80" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d="M0 -30C6 -22 6 -12 0 -6 -6 -12 -6 -22 0 -30Z" transform={`rotate(${i * 45})`} fill="none" stroke="currentColor" strokeWidth="1" />
        ))}
        <circle r="5" fill="currentColor" opacity=".7" />
      </svg>
      {caption && <span>{caption}</span>}
    </div>
  );
}

function Photo({ photo, eager = false }: { photo: GalleryPhoto; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!photo.src || failed) return <Placeholder caption={photo.caption} />;
  return (
    <img
      src={photo.src}
      alt={photo.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const startX = useRef<number | null>(null);
  const n = photos.length;
  const go = useCallback((d: number) => onIndex((index + d + n) % n), [index, n, onIndex]);

  useEffect(() => {
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  const p = photos[index];
  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="चित्र दर्शक"
      onClick={onClose}
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX.current === null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        startX.current = null;
      }}
    >
      <button ref={closeRef} className="lb-btn lb-close" onClick={onClose} aria-label="बंद करें">
        <Icon name="close" />
      </button>
      {n > 1 && (
        <button className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="पिछला चित्र">
          <Icon name="prev" />
        </button>
      )}
      <figure className="lb-fig" onClick={(e) => e.stopPropagation()} key={index}>
        <div className="lb-frame">
          <Photo photo={p} eager />
        </div>
        {p.caption && <figcaption>{p.caption}</figcaption>}
        <span className="lb-count">{index + 1} / {n}</span>
      </figure>
      {n > 1 && (
        <button className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="अगला चित्र">
          <Icon name="next" />
        </button>
      )}
    </div>
  );
}

export function Gallery() {
  const { gallery } = weddingConfig;
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const ref = useReveal<HTMLDivElement>();
  const section = gallery.sections[tab];

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  return (
    <div ref={ref} className="reveal">
      <Paper labelledBy="gal-h">
        <h2 id="gal-h" className="section-title">{gallery.heading}</h2>
        <Divider />
        <div className="tabs" role="tablist" aria-label="चित्र श्रेणी">
          {gallery.sections.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === tab}
              className={`tab ${i === tab ? 'tab-on' : ''}`}
              onClick={() => setTab(i)}
            >
              {s.title}
            </button>
          ))}
        </div>
        <div className="grid" role="tabpanel" key={section.id}>
          {section.photos.map((p, i) => (
            <button
              key={i}
              className={`tile ${i === 0 && section.photos.length % 2 === 1 ? 'tile-wide' : ''}`}
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`${p.alt} — बड़ा देखें`}
              style={{ ['--i' as string]: i }}
            >
              <Photo photo={p} />
            </button>
          ))}
        </div>
      </Paper>
      {open !== null && <Lightbox photos={section.photos} index={open} onClose={close} onIndex={setOpen} />}
    </div>
  );
}
