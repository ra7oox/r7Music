import { useLocation, Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { PlayerBar } from '@/components/player/PlayerBar'
import { NowPlayingPanel } from '@/components/player/NowPlayingPanel'
import { usePlayerStore } from '@/store/playerStore'

export const Layout = () => {
  const location = useLocation()
  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const showNowPlaying = usePlayerStore((s) => s.showNowPlaying)

  return (
    <div
      className="layout-grid"
      style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}
    >
      {/* Sidebar — hidden on mobile */}
      <div
        style={{ gridColumn: 1, gridRow: 1 }}
        className="hidden md:block"
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <main
        key={location.pathname}
        className="slide-up"
        style={{
          gridColumn: 'md:2',
          gridRow: 1,
          minWidth: 0,
          paddingBottom: currentTrack ? '120px' : '72px',
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </main>

      {/* Now Playing panel */}
      {currentTrack && <NowPlayingPanel />}

      {/* Sticky player bar */}
      <PlayerBar />

      {/* Mobile bottom nav — only when no track is playing */}
      <MobileNav />
    </div>
  )
}

export default Layout
