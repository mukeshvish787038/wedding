import type { ReactNode } from 'react';
import type { EventIcon } from '../config/weddingConfig';

/** Tiny hand-drawn SVG icon set (stroke icons, 24x24). No icon library needed. */
type Name =
  | EventIcon
  | 'volume'
  | 'mute'
  | 'pin'
  | 'phone'
  | 'whatsapp'
  | 'share'
  | 'close'
  | 'prev'
  | 'next'
  | 'check'
  | 'navigate'
  | 'skip';

const paths: Record<Name, ReactNode> = {
  haldi: (
    <>
      <path d="M12 3c3 4 5 6.6 5 9.6A5 5 0 0 1 7 12.6C7 9.600 9 7 12 3Z" />
      <path d="M9.800 13.200a2.400 2.400 0 0 0 2.200 2" />
    </>
  ),
  mehndi: (
    <>
      <path d="M12 21c-4-3-7-6-7-10 0-3 2-5 4-5 1.500 0 2.500.9 3 2 .5-1.100 1.500-2 3-2 2 0 4 2 4 5 0 4-3 7-7 10Z" />
      <path d="M12 9v6M9.500 12h5" />
    </>
  ),
  matkor: (
    <>
      <path d="M9 4h6M10 4v2.500C6.500 8 5 10.500 5 13.500 5 17.500 8 20 12 20s7-2.500 7-6.500c0-3-1.500-5.500-5-7V4" />
      <path d="M8 12.500c2.500 1.500 5.500 1.500 8 0" />
    </>
  ),
  sangeet: (
    <>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6.500" cy="18" r="2.500" />
      <circle cx="16.500" cy="16" r="2.500" />
    </>
  ),
  devpujan: (
    <>
      <path d="M12 3c2 2.500 3 4 3 5.500a3 3 0 0 1-6 0C9 7 10 5.500 12 3Z" />
      <path d="M4 14h16c0 3.500-3.500 6-8 6s-8-2.500-8-6Z" />
    </>
  ),
  mandap: (
    <>
      <path d="M3 9 12 4l9 5H3Z" />
      <path d="M5 9v11M19 9v11M12 9v11M3 20h18" />
    </>
  ),
  baraat: (
    <>
      <ellipse cx="12" cy="9" rx="8" ry="3.500" />
      <path d="M4 9v6c0 2 3.500 3.500 8 3.500s8-1.500 8-3.500V9" />
      <path d="M5 4l5 4M19 4l-5 4" />
    </>
  ),
  vivah: (
    <>
      <path d="M12 3c2.500 3 4 5 4 7a4 4 0 0 1-8 0c0-2 1.500-4 4-7Z" />
      <path d="M5 21 9 15M19 21l-4-6M7 21h10" />
    </>
  ),
  bhoj: (
    <>
      <circle cx="12" cy="13" r="6.500" />
      <circle cx="12" cy="13" r="3" />
      <path d="M3 4v6M5.500 4v6M3 7h2.500M21 4c-1.500 1.500-2 3.500-2 6h2V4Z" />
    </>
  ),
  volume: (
    <>
      <path d="M4 10v4h4l5 4V6L8 10H4Z" />
      <path d="M16.500 9a4 4 0 0 1 0 6M19 6.500a7.500 7.500 0 0 1 0 11" />
    </>
  ),
  mute: (
    <>
      <path d="M4 10v4h4l5 4V6L8 10H4Z" />
      <path d="m17 9 4 6m0-6-4 6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.200 7-11.500A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21Z" />
      <circle cx="12" cy="9.500" r="2.500" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  whatsapp: (
    <>
      <path d="M3.500 20.500 5 16A8.500 8.500 0 1 1 8.200 19L3.500 20.500Z" />
      <path d="M9 8.500c0 3.500 3 6.500 6.500 6.500l1-1.800-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2L9 8.500Z" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.500" />
      <circle cx="17.500" cy="6" r="2.500" />
      <circle cx="17.500" cy="18" r="2.500" />
      <path d="m8.200 10.800 7-3.600M8.200 13.200l7 3.600" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  prev: <path d="m15 5-7 7 7 7" />,
  next: <path d="m9 5 7 7-7 7" />,
  check: <path d="m5 12.500 4.500 4.500L19 7.500" />,
  navigate: <path d="m4 11 16-7-7 16-2.200-6.800L4 11Z" />,
  skip: <path d="m6 5 7 7-7 7M13 5l7 7-7 7" />,
};

export function Icon({ name, size = 22, className }: { name: Name; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.600"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
