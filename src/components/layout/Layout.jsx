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
      style={{ minHeight: '100vh', background: 'var(--color-bg-base)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Floating ambient glowing orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full ambient-orb"
        style={{
          background: 'radial-gradient(circle, rgba(124, 63, 228, 0.18) 0%, rgba(200, 56, 154, 0.08) 50%, transparent 100%)',
          pointerEvents: 'none',
        }} />
      <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full ambient-orb"
        style={{
          background: 'radial-gradient(circle, rgba(74, 143, 232, 0.15) 0%, rgba(124, 63, 228, 0.05) 60%, transparent 100%)',
          animationDelay: '-3s',
          pointerEvents: 'none',
        }} />

      {/* Sidebar — hidden on mobile */}
      <div style={{ gridColumn: 1, gridRow: 1, zIndex: 10 }} className="hidden md:block">
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
          zIndex: 1,
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
