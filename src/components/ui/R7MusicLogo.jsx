/**
 * R7Music Logo Component
 * Recreates the brand logo: stylized R7 with gradient (blue→purple→pink)
 * and a music note detail, matching the provided brand image.
 */
export const R7MusicLogo = ({ size = 36, showText = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 120 120"
    width={size}
    height={size}
    aria-label="r7Music logo"
    role="img"
    fill="none"
  >
    <defs>
      <linearGradient id="r7g1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4A8FE8" />
        <stop offset="45%" stopColor="#7C3FE4" />
        <stop offset="100%" stopColor="#C8389A" />
      </linearGradient>
      <linearGradient id="r7g2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#63A8FF" />
        <stop offset="60%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#E040B0" />
      </linearGradient>
    </defs>

    {/* ── R letter ── */}
    {/* Vertical stem */}
    <rect x="14" y="18" width="11" height="58" rx="4" fill="url(#r7g1)" />
    {/* Top bump of R */}
    <path
      d="M14 18 H50 Q66 18 66 36 Q66 53 50 53 H25 V42 H47 Q54 42 54 36 Q54 30 47 30 H25 V18 Z"
      fill="url(#r7g1)"
    />
    {/* Leg of R */}
    <path
      d="M28 51 L62 76 L52 76 L22 55 Z"
      fill="url(#r7g2)"
    />

    {/* ── 7 ── */}
    {/* Top bar of 7 */}
    <rect x="62" y="18" width="44" height="11" rx="4" fill="url(#r7g2)" />
    {/* Diagonal of 7 */}
    <path
      d="M91 29 L68 76 L58 76 L81 29 Z"
      fill="url(#r7g2)"
    />

    {/* ── Music note (replaces the dot / accent of the 7) ── */}
    {/* Note head */}
    <ellipse cx="61" cy="88" rx="8" ry="6" fill="url(#r7g1)" />
    {/* Note stem */}
    <rect x="68" y="64" width="4" height="27" rx="2" fill="url(#r7g1)" />
    {/* Note flag */}
    <path
      d="M72 64 Q90 62 88 76 Q86 82 72 80"
      fill="url(#r7g1)"
    />
  </svg>
)

export default R7MusicLogo
