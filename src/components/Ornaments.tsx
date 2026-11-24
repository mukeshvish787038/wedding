import type { ReactNode } from 'react';

/** Quarter-circle corner ornament for the card borders */
export function CornerOrnament({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 60" aria-hidden="true">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6dc8e" />
          <stop offset=".5" stopColor="#c8932f" />
          <stop offset="1" stopColor="#8a5a14" />
        </linearGradient>
      </defs>
      <path d="M2 2h30M2 2v30" stroke="url(#cg)" strokeWidth="2" fill="none" />
      <path d="M2 10c14 0 24 10 24 24" stroke="url(#cg)" strokeWidth="1.200" fill="none" />
      <path d="M10 2c0 14 10 24 24 24" stroke="url(#cg)" strokeWidth="1.200" fill="none" />
      <circle cx="12" cy="12" r="3" fill="url(#cg)" />
      <path d="M20 20c4-6 10-8 14-6-2 4-8 8-14 6Z" fill="url(#cg)" opacity=".85" />
      <circle cx="36" cy="6" r="1.600" fill="url(#cg)" />
      <circle cx="6" cy="36" r="1.600" fill="url(#cg)" />
    </svg>
  );
}

/** Horizontal divider with a small lotus in the middle */
export function Divider({ light = false }: { light?: boolean }) {
  const c = light ? '#f0d58a' : '#b07f22';
  return (
    <svg className="divider" viewBox="0 0 220 24" aria-hidden="true">
      <path d="M4 12h84M132 12h84" stroke={c} strokeWidth="1" />
      <circle cx="94" cy="12" r="1.800" fill={c} />
      <circle cx="126" cy="12" r="1.800" fill={c} />
      <g fill="none" stroke={c} strokeWidth="1.100">
        <path d="M110 4c4 4 4 10 0 16-4-6-4-12 0-16Z" />
        <path d="M110 20c-8-1-12-6-12-10 5 0 10 3 12 10Z" />
        <path d="M110 20c8-1 12-6 12-10-5 0-10 3-12 10Z" />
      </g>
    </svg>
  );
}

/** Ivory paper panel with double gold border and four corner ornaments */
export function Paper({
  children,
  className = '',
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`paper ${className}`}>
      <span className="paper-border" aria-hidden="true" />
      <CornerOrnament className="corner c-tl" />
      <CornerOrnament className="corner c-tr" />
      <CornerOrnament className="corner c-bl" />
      <CornerOrnament className="corner c-br" />
      <div className="paper-body">{children}</div>
    </section>
  );
}
