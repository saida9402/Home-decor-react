/**
 * Hairline social glyphs.
 *
 * @mui/icons-material ships Facebook/Instagram/Telegram/YouTube as filled
 * brand marks only — there is no Outlined variant for three of the four —
 * so they are hand-drawn here at a 1px stroke to sit with the rest of the
 * system. Colour is inherited from currentColor, so the CSS controls the
 * default (--ink-muted) and hover (--accent) states.
 */

interface GlyphProps {
  className?: string;
}

const BASE = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function FacebookGlyph({ className }: GlyphProps) {
  return (
    <svg {...BASE} className={className}>
      <path d="M14.5 8.5V6.9c0-.8.3-1.2 1.2-1.2H17V3.1h-2c-2.3 0-3.3 1.2-3.3 3.3v2.1H10v2.6h1.7V21h2.8v-9.9h2l.3-2.6z" />
    </svg>
  );
}

export function InstagramGlyph({ className }: GlyphProps) {
  return (
    <svg {...BASE} className={className}>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TelegramGlyph({ className }: GlyphProps) {
  return (
    <svg {...BASE} className={className}>
      <path d="M21.2 4.3 2.9 11.4c-.6.2-.6.9 0 1.1l4.5 1.4 1.7 5c.2.5.8.6 1.1.2l2.4-2.5 4.6 3.4c.4.3 1 .1 1.1-.4l3.6-14.4c.1-.6-.5-1.1-1.1-.9z" />
        <path d="m7.4 13.9 11-7.6-8.4 8.5-.2 4" />
    </svg>
  );
}

export function YouTubeGlyph({ className }: GlyphProps) {
  return (
    <svg {...BASE} className={className}>
      <rect x="2.4" y="5.6" width="19.2" height="12.8" rx="4" />
      <path d="m10.3 9.3 4.9 2.7-4.9 2.7z" />
    </svg>
  );
}
