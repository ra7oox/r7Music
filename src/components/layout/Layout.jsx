import { useLocation, Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { PlayerBar } from '@/components/player/PlayerBar'
import { NowPlayingPanel } from '@/components/player/NowPlayingPanel'
import { usePlayerStore } from '@/store/playerStore'
import { useKeyboardShortcuts } from '@/hooks/useControls'

export const Layout = () => {
  const location     = useLocation()
  const currentTrack = usePlayerStore((s) => s.currentTrack)

  useKeyboardShortcuts()

  return (
    <div
      className="layout-grid"
      style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}
    >
      {/* Sidebar — hidden on mobile */}
      <div style={{ gridColumn: 1, gridRow: 1 }} className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content (scrollable column) */}
      <main
        key={location.pathname}
        className="scroll-col slide-up"
        style={{
          gridColumn: 'auto',
          gridRow: 1,
          minWidth: 0,
          paddingBottom: currentTrack ? 'clamp(118px, 15vh, 140px)' : '80px',
        }}
      >
        <Outlet />
      </main>

      {/* Now Playing panel (scrollable column) */}
      {currentTrack && <NowPlayingPanel />}

      {/* Sticky player bar */}
      <PlayerBar />

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}

export default Layout
