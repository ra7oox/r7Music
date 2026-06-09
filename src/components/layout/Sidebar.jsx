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
          size={20}
          aria-hidden="true"
          strokeWidth={isActive ? 2.5 : 1.8}
          style={{ color: isActive ? 'var(--color-text-primary)' : undefined, flexShrink: 0 }}
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
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        background: '#000000',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        overflowY: 'auto',
        paddingBottom: 100,
      }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 mb-8">
        <R7MusicLogo size={40} />
        <div>
          <span
            className="block font-bold leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              background: 'linear-gradient(135deg, var(--color-brand-from), var(--color-brand-via), var(--color-brand-to))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            r7Music
          </span>
          <span className="block" style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Free Streaming
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3">
        <p className="px-3 mb-2" style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
          Menu
        </p>
        <div className="flex flex-col gap-0.5 mb-6">
          {NAV_MAIN.map((item) => <NavItem key={item.to} {...item} />)}
        </div>

        <p className="px-3 mb-2" style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
          Browse
        </p>
        <div className="flex flex-col gap-0.5">
          {NAV_BROWSE.map((item) => <NavItem key={item.to} {...item} />)}
        </div>
      </nav>

      {/* Mini now playing */}
      {currentTrack && (
        <button
          onClick={toggleNowPlaying}
          style={{
            margin: '0 12px 12px',
            padding: '10px 12px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textAlign: 'left',
          }}
          aria-label="Open now playing"
        >
          {currentTrack.album_image ? (
            <img
              src={currentTrack.album_image}
              alt=""
              className="rounded flex-shrink-0"
              style={{ width: 36, height: 36, objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: 4, background: 'var(--color-bg-card)', flexShrink: 0 }} />
          )}
          <div className="min-w-0 flex-1">
            <p
              className="truncate font-medium"
              style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}
            >
              {currentTrack.name}
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
              <div className="equalizer-bar" style={{ height: 9 }} />
              <div className="equalizer-bar" style={{ height: 6 }} />
            </div>
          )}
        </button>
      )}

      {/* Footer */}
      <div className="px-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          Powered by{' '}
          <a
            href="https://www.jamendo.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-text-secondary)' }}
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
