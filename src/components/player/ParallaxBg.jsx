export const ParallaxBg = ({ imageUrl, isVisible }) => {
  if (!imageUrl || !isVisible) return null

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.12,
        transition: 'opacity 0.6s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(60px) saturate(1.4)',
          transform: 'scale(1.1)',
        }}
      />
    </div>
  )
}
