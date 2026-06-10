import { NavLink } from 'react-router-dom'
import { Home, Search, Heart, Music2, Disc3, Users } from 'lucide-react'
import { R7MusicLogo } from '@/components/ui/R7MusicLogo'
import { usePlayerStore } from '@/store/playerStore'

const NAV_MAIN = [
  { to: '/',          icon: Home,   label: 'Discover'  },
  { to: '/search',    icon: Search, label: 'Search'    },
  { to: '/favorites', icon: Heart,  label: 'Favorites' },
]

const NAV_BROWSE = [
  { to: '/tracks',  icon: Music2, label: 'Tracks'  },
  { to: '/albums',  icon: Disc3,  label: 'Albums'  },
  { to: '/artists', icon: Users,  label: 'Artists' },
]

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end={to === '/'}
    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
  >
    {({ isActive }) => (
      <>
        <Icon
          size={18}
          aria-hidden="true"
          strokeWidth={isActive ? 2.2 : 1.8}
          style={{ flexShrink: 0 }}
        />
        {label}
      </>
    )}
  </NavLink>
)

export const Sidebar = () => {
  const currentTrack     = usePlayerStore((s) => s.currentTrack)
  const isPlaying        = usePlayerStore((s) => s.isPlaying)
  const toggleNowPlaying = usePlayerStore((s) => s.toggleNowPlaying)

  return (
    <aside
      className="glass-strong"
      style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 0',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        overflowY: 'auto',
        paddingBottom: 110,
        zIndex: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
      aria-label="Main navigation"
    >
      {/* Nav */}
      <nav className="flex-1 px-3">
        <p className="px-4 mb-3" style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
          Menu
        </p>
        <div className="flex flex-col gap-2.5 mb-8">
          {NAV_MAIN.map((item) => <NavItem key={item.to} {...item} />)}
        </div>

        <p className="px-4 mb-3" style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
          Browse
        </p>
        <div className="flex flex-col gap-2.5">
          {NAV_BROWSE.map((item) => <NavItem key={item.to} {...item} />)}
        </div>
      </nav>

      {/* Mini now playing */}
      {currentTrack && (
        <button
          onClick={toggleNowPlaying}
          className="glass hover-glow-brand"
          style={{
            margin: '0 12px 16px',
            padding: '12px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textAlign: 'left',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
          aria-label="Open now playing"
        >
          {currentTrack.album_image ? (
            <img
              src={currentTrack.album_image}
              alt=""
              className="rounded-lg flex-shrink-0"
              style={{ width: 40, height: 40, objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
            />
          ) : (
            <div className="rounded-lg flex-shrink-0 flex items-center justify-center" style={{ width: 40, height: 40, background: 'var(--color-bg-card)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Music2 size={16} style={{ color: 'var(--color-text-muted)' }} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p
              className="truncate font-bold text-white"
              style={{ fontSize: '0.8125rem' }}
            >
              <span className="text-brand-gradient">{currentTrack.name}</span>
            </p>
            <p
              className="truncate mt-0.5"
              style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}
            >
              {currentTrack.artist_name}
            </p>
          </div>
          {isPlaying && (
            <div className="flex items-end gap-[2px] flex-shrink-0" style={{ height: 12 }}>
              <div className="equalizer-bar" style={{ height: 5 }} />
              <div className="equalizer-bar" style={{ height: 10 }} />
              <div className="equalizer-bar" style={{ height: 6 }} />
            </div>
          )}
        </button>
      )}

      {/* Footer */}
      <div className="px-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          Powered by{' '}
          <a
            href="https://www.jamendo.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
            className="hover:text-white"
          >
            Jamendo
          </a>
          {' '}· Free &amp; CC
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
