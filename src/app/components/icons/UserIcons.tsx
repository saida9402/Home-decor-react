/**
 * Hairline member glyphs.
 *
 * The shipped artwork was off-system: default-user.svg was a filled #a597fc
 * silhouette, restaurant.svg a #404a6b chef mark, and user-badge.svg a 640KB
 * SVG wrapping a bitmap rendered at 15px. All three are hand-drawn here at a
 * 1px stroke on a 24x24 box, in the same idiom as SocialIcons.tsx.
 *
 * Colour is inherited from currentColor, so CSS drives it to --ink-muted —
 * which is the reason these are inline components and not files in /public:
 * currentColor cannot cross an <img src> boundary.
 */

import React, { useEffect, useState } from "react";

interface GlyphProps {
  /** rendered size in px — 15 in cards, 17 in chrome, 19 standalone */
  size?: number;
  className?: string;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
});

/** default member — head over shoulders */
export function UserGlyph({ size = 19, className }: GlyphProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 12.4a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z M4.7 20.3c0-3.5 3.3-5.6 7.3-5.6s7.3 2.1 7.3 5.6" />
    </svg>
  );
}

/** member badge — a verified mark, the counterpart to the seller storefront */
export function UserBadgeGlyph({ size = 15, className }: GlyphProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 21.4a9.4 9.4 0 1 0 0-18.8 9.4 9.4 0 0 0 0 18.8Z M8.1 12.1l2.8 2.8 5-5.5" />
    </svg>
  );
}

/** seller badge — a storefront under an awning */
export function SellerGlyph({ size = 15, className }: GlyphProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3.6 9.6h16.8L18.6 4.9H5.4L3.6 9.6Z M5.5 9.6v9.5h13v-9.5 M9.8 19.1v-5.1h4.4v5.1" />
    </svg>
  );
}

interface MemberAvatarProps {
  /** fully-resolved image URL, or null/empty when the member has no image */
  src?: string | null;
  /** the existing avatar class at this site — the frame is unchanged */
  className?: string;
  /** glyph size for the empty state; large wells size proportionally */
  glyphSize: number;
  /** the navbar anchors its logout menu on e.currentTarget, so the event
      has to reach the handler whichever branch is rendered */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  ariaHasPopup?: boolean;
}

/**
 * Renders the member photo, or the default glyph whenever there is no usable
 * image. The previous call sites tested truthiness only, so a stale or
 * unreachable memberImage painted the browser's broken-image glyph instead of
 * falling back — onError closes that hole. The upload flow and the stored
 * path are untouched; this only decides what is displayed.
 */
export function MemberAvatar({
  src,
  className,
  glyphSize,
  onClick,
  ariaHasPopup,
}: MemberAvatarProps) {
  const [broken, setBroken] = useState<boolean>(false);

  // a new src (an upload preview, or a member switch) deserves a fresh attempt
  useEffect(() => setBroken(false), [src]);

  if (!src || broken) {
    return (
      <span
        className={className ? `${className} avatar-glyph` : "avatar-glyph"}
        onClick={onClick}
        aria-haspopup={ariaHasPopup}
      >
        <UserGlyph size={glyphSize} />
      </span>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt=""
      onClick={onClick}
      aria-haspopup={ariaHasPopup}
      onError={() => setBroken(true)}
    />
  );
}
