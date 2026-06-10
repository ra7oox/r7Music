import { useNavigate } from 'react-router-dom'
import { SearchBar } from '@/components/search/SearchBar'
import { R7MusicLogo } from '@/components/ui/R7MusicLogo'

export const Header = ({ title = '' }) => {
  const navigate = useNavigate()

  return (
    <header
      className="flex items-center gap-4 px-6 md:px-12 py-4"
      style={{
        background: 'rgba(6, 4, 12, 0.45)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo — only on mobile (desktop has sidebar) */}
      <button
        className="md:hidden flex items-center gap-2 flex-shrink-0"
        onClick={() => navigate('/')}
        aria-label="r7Music home"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <R7MusicLogo size={32} />
        <span
          className="font-extrabold text-sm text-brand-gradient"
          style={{
            fontFamily: 'var(--font-display)',
          }}
        >
          r7Music
        </span>
      </button>

      {/* Page title — desktop only */}
      {title && (
        <h1
          className="hidden md:block text-base font-extrabold flex-shrink-0 tracking-tight text-white font-display"
        >
          {title}
        </h1>
      )}

      {/* Search bar */}
      <div className="flex-1 max-w-md md:ml-auto">
        <SearchBar onSearch={() => navigate('/search')} />
      </div>
    </header>
  )
}

export default Header
