import { NavLink } from 'react-router-dom'
import { Home, Search, Heart, Music2 } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'

const NAV = [
  { to: '/',         icon: Home,    label: 'Home'     },
  { to: '/search',   icon: Search,  label: 'Search'   },
  { to: '/favorites',icon: Heart,   label: 'Favs'     },
  { to: '/tracks',   icon: Music2,  label: 'Tracks'   },
]

export const MobileNav = () => {
  const currentTrack = usePlayerStore((s) => s.currentTrack)

  return (
    <nav
      className="md:hidden flex items-center justify-around safe-bottom"
      aria-label="Mobile navigation"
      style={{
        position: 'fixed',
        bottom: currentTrack ? 56 : 0,
        left: 0,
        right: 0,
        zIndex: 99,
        height: 52,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'rgba(12, 12, 26, 0.97)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className="flex flex-col items-center justify-center gap-0.5 transition-colors"
          style={({ isActive }) => ({
            color: isActive ? 'var(--color-play)' : 'var(--color-text-muted)',
            padding: '4px 12px',
            textDecoration: 'none',
          })}
        >
          <Icon size={18} />
          <span className="text-[10px] font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileNav
