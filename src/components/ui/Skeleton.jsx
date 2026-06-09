export const Skeleton = ({ className = '', style = {} }) => (
  <div className={`skeleton ${className}`} style={style} aria-hidden="true" />
)

export const TrackSkeleton = () => (
  <div
    className="flex items-center gap-4 p-3 rounded-xl"
    style={{ background: 'rgba(255,255,255,0.02)' }}
  >
    <Skeleton style={{ width: 48, height: 48, borderRadius: 8, flexShrink: 0 }} />
    <div className="flex-1 min-w-0">
      <Skeleton style={{ height: 14, width: '60%', marginBottom: 8 }} />
      <Skeleton style={{ height: 12, width: '40%' }} />
    </div>
    <Skeleton style={{ height: 12, width: 36 }} />
  </div>
)

export const CardSkeleton = () => (
  <div className="glass-card p-4">
    <Skeleton style={{ width: '100%', paddingBottom: '100%', marginBottom: 12 }} />
    <Skeleton style={{ height: 16, width: '75%', marginBottom: 8 }} />
    <Skeleton style={{ height: 13, width: '50%' }} />
  </div>
)

export const TrackListSkeleton = ({ count = 8 }) => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: count }).map((_, i) => (
      <TrackSkeleton key={i} />
    ))}
  </div>
)

export const CardGridSkeleton = ({ count = 6 }) => (
  <div
    className="grid gap-4"
    style={{
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
)
