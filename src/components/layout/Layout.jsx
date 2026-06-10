import { useLocation, Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { PlayerBar } from '@/components/player/PlayerBar'
import { NowPlayingPanel } from '@/components/player/NowPlayingPanel'
import { usePlayerStore } from '@/store/playerStore'
import { useKeyboardShortcuts } from '@/hooks/useControls'

export const Layout = () => {
  const location     = useLocation()
  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const showNowPlaying = usePlayerStore((s) => s.showNowPlaying)
  const hasNowPlaying = currentTrack && showNowPlaying

  useKeyboardShortcuts()

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100vh',
        background: 'var(--color-bg-base)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating ambient glowing orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full ambient-orb"
        style={{
          background: 'radial-gradient(circle, rgba(124, 63, 228, 0.18) 0%, rgba(200, 56, 154, 0.08) 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full ambient-orb"
        style={{
          background: 'radial-gradient(circle, rgba(74, 143, 232, 0.15) 0%, rgba(124, 63, 228, 0.05) 60%, transparent 100%)',
          animationDelay: '-3s',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

      {/* Global Header spanning the top */}
      <Header />

      {/* Workspace Area */}
      <div
        className={`layout-grid ${hasNowPlaying ? 'has-now-playing' : ''}`}
        style={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Sidebar — hidden on mobile */}
        <div style={{ gridColumn: 1, gridRow: 1, zIndex: 10, height: '100%' }} className="hidden md:block premium-sidebar">
          <Sidebar />
        </div>

        {/* Main content (scrollable column glass capsule on desktop) */}
        <main
          key={location.pathname}
          className="scroll-col glass-strong md:rounded-[24px] md:border md:border-[rgba(255,255,255,0.06)] md:shadow-2xl slide-up"
          style={{
            gridColumn: 'auto',
            gridRow: 1,
            minWidth: 0,
            height: '100%',
            paddingBottom: currentTrack ? 'clamp(118px, 15vh, 140px)' : '80px',
            zIndex: 1,
            position: 'relative',
          }}
        >
          <Outlet />
        </main>

        {/* Now Playing panel (scrollable column) */}
        <NowPlayingPanel />
      </div>

      {/* Sticky player bar */}
      <PlayerBar />

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}

export default Layout
