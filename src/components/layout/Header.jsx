import { useNavigate, useLocation } from 'react-router-dom'
import { Home } from 'lucide-react'
import { SearchBar } from '@/components/search/SearchBar'
import { R7MusicLogo } from '@/components/ui/R7MusicLogo'
import { useSearchStore } from '@/store/searchStore'

export const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const query = useSearchStore((s) => s.query)
  const setQuery = useSearchStore((s) => s.setQuery)

  return (
    <header
      className="app-header"
      style={{
        background: '#000000',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
        padding: '12px 24px',
        height: '72px',
        boxSizing: 'border-box',
        zIndex: 50,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* LEFT SECTION: Logo and Brand (Expands on desktop to balance layout) */}
      <div className="flex items-center flex-none md:flex-1 min-w-0">
        {/* Desktop view: Logo and Brand name */}
        <div 
          className="hidden md:flex items-center gap-3 cursor-pointer flex-shrink-0" 
          onClick={() => navigate('/')} 
        >
          <R7MusicLogo size={36} />
          <div className="flex flex-col">
            <span 
              className="inline-block font-bold leading-none tracking-tight text-brand-gradient"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
              }}
            >
              r7Music
            </span>
            <span className="block mt-0.5 text-[8px] text-[var(--color-text-secondary)] tracking-[0.12em] uppercase font-bold">
              Free Streaming
            </span>
          </div>
        </div>

        {/* Mobile view Logo button */}
        <button
          className="md:hidden flex items-center gap-2 flex-shrink-0 mr-3"
          onClick={() => navigate('/')}
          aria-label="r7Music home"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <R7MusicLogo size={32} />
        </button>
      </div>

      {/* CENTER SECTION: Home button & Search input (Dead center on desktop, fills width on mobile) */}
      <div className="flex items-center justify-center gap-2 flex-1 md:flex-none">
        {/* Desktop view Home button */}
        <button
          className="hidden md:flex items-center justify-center btn-icon"
          onClick={() => navigate('/')}
          aria-label="Home"
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: location.pathname === '/' ? '#2a2a2a' : '#1f1f1f',
            color: location.pathname === '/' ? 'white' : 'var(--color-text-secondary)',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.background = '#2a2a2a'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.background = location.pathname === '/' ? '#2a2a2a' : '#1f1f1f'
          }}
        >
          <Home size={22} />
        </button>

        {/* Global Search bar */}
        <div style={{ width: '100%', maxWidth: '480px' }} className="flex-1">
          <SearchBar
            value={query}
            onChange={(val) => {
              setQuery(val)
              if (location.pathname !== '/search') navigate('/search')
            }}
            placeholder="Que souhaitez-vous écouter ou regarder ?"
          />
        </div>
      </div>

      {/* RIGHT SECTION: Empty space to perfectly center the middle content on desktop */}
      <div className="hidden md:flex items-center justify-end md:flex-1">
        {/* Empty balancing spacer */}
      </div>
    </header>
  )
}

export default Header
