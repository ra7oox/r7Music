import { NavLink } from 'react-router-dom'
import {
  Home, Search, Heart, Music2, Disc3, Users,
} from 'lucide-react'
import { R7MusicLogo } from '@/components/ui/R7MusicLogo'

const NAV = [
  { to: '/',         icon: Home,    label: 'Discover'   },
  { to: '/search',   icon: Search,  label: 'Search'     },
  { to: '/favorites',icon: Heart,   label: 'Favorites'  },
]

const BROWSE = [
  { to: '/tracks',   icon: Music2,  label: 'Tracks'     },
  { to: '/albums',   icon: Disc3,   label: 'Albums'     },
  { to: '/artists',  icon: Users,   label: 'Artists'    },
]

export const Sidebar = () => (
  <aside
    className="slide-up"
    style={{
      gridRow: '1',
      position: 'sticky',
      top: 0,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 14px',
      paddingBottom: '100px',
      overflowY: 'auto',
      borderRight: '1px solid var(--color-border)',
      background: 'rgba(12, 12, 26, 0.95)',
    }}
    aria-label="Main navigation"
  >
    {/* Logo */}
    <div className="flex items-center gap-2 mb-8 px-1">
      <R7MusicLogo size={44} />
      <span
        className="font-bold text-lg tracking-tight"
        style={{
          fontFamily: 'var(--font-display)',
          background: 'linear-gradient(135deg, #4A8FE8, #A855F7, #C8389A)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        r7Music
      </span>
    </div>

    {/* Main nav */}
    <nav>
      <p
        className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em]"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Menu
      </p>
      <ul role="list" className="flex flex-col gap-0.5 mb-6">
        {NAV.map(({ to, icon: Icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              style={({ isActive }) => ({
                borderLeft: isActive ? '3px solid var(--color-play)' : '3px solid transparent',
                borderRadius: '0 10px 10px 0',
                paddingLeft: isActive ? '11px' : '14px',
              })}
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <p
        className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em]"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Browse
      </p>
      <ul role="list" className="flex flex-col gap-0.5">
        {BROWSE.map(({ to, icon: Icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              style={({ isActive }) => ({
                borderLeft: isActive ? '3px solid var(--color-play)' : '3px solid transparent',
                borderRadius: '0 10px 10px 0',
                paddingLeft: isActive ? '11px' : '14px',
              })}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>

    {/* Bottom brand */}
    <div
      className="mt-auto px-2 pt-4"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        Powered by{' '}
        <a
          href="https://www.jamendo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline transition-all"
          style={{ color: 'var(--color-play)' }}
        >
          Jamendo
        </a>
        <br />
        Free &amp; Creative Commons
      </p>
    </div>
  </aside>
)

export default Sidebar
