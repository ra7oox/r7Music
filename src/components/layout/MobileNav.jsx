import { NavLink } from 'react-router-dom'
import { Home, Search, Heart, Music2, Disc3 } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'

const NAV = [
  { to: '/',          icon: Home,   label: 'Home'    },
  { to: '/search',    icon: Search, label: 'Search'  },
  { to: '/favorites', icon: Heart,  label: 'Favs'    },
  { to: '/tracks',    icon: Music2, label: 'Tracks'  },
  { to: '/albums',    icon: Disc3,  label: 'Albums'  },
]

export const MobileNav = () => {
  const currentTrack = usePlayerStore((s) => s.currentTrack)

  return (
    <nav
      className="md:hidden safe-bottom"
      aria-label="Mobile navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 120,
        height: 60,
        background: 'rgba(8, 8, 10, 0.96)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingLeft: 8,
        paddingRight: 8,
      }}
    >
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={{ textDecoration: 'none', flex: 1, display: 'flex', justifyContent: 'center' }}
        >
          {({ isActive }) => (
            <div
              className="flex flex-col items-center justify-center gap-0.5 transition-all"
              style={{
                padding: '5px 10px',
                borderRadius: 12,
                background: isActive
                  ? 'linear-gradient(135deg, rgba(124,63,228,0.22), rgba(200,56,154,0.16))'
                  : 'transparent',
                minWidth: 48,
              }}
            >
              <Icon
                size={19}
                style={{
                  color: isActive ? 'var(--color-accent-mid)' : 'var(--color-text-muted)',
                  transition: 'color 200ms',
                  strokeWidth: isActive ? 2.2 : 1.8,
                }}
              />
              <span
                className="text-[9px] font-semibold"
                style={{
                  color: isActive ? 'var(--color-accent-mid)' : 'var(--color-text-muted)',
                  transition: 'color 200ms',
                  letterSpacing: '0.03em',
                }}
              >
                {label}
              </span>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileNav
