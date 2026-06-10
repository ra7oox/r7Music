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
        bottom: currentTrack ? 76 : 0,
        left: 0,
        right: 0,
        zIndex: 99,
        height: 60,
        background: 'rgba(6, 4, 12, 0.7)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingLeft: 8,
        paddingRight: 8,
        transition: 'bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
              className="flex flex-col items-center justify-center gap-1 transition-all duration-300"
              style={{
                padding: '6px 12px',
                borderRadius: 14,
                background: isActive
                  ? 'linear-gradient(135deg, rgba(74, 143, 232, 0.15) 0%, rgba(124, 63, 228, 0.15) 50%, rgba(200, 56, 154, 0.15) 100%)'
                  : 'transparent',
                border: isActive ? '1px solid rgba(124, 63, 228, 0.2)' : '1px solid transparent',
                minWidth: 54,
              }}
            >
              <Icon
                size={18}
                style={{
                  color: isActive ? 'white' : 'var(--color-text-secondary)',
                  transition: 'color 200ms',
                  strokeWidth: isActive ? 2.2 : 1.8,
                }}
              />
              <span
                className="text-[9px] font-bold tracking-wider"
                style={{
                  color: isActive ? 'white' : 'var(--color-text-secondary)',
                  transition: 'color 200ms',
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
