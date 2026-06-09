import { useNavigate } from 'react-router-dom'
import { SearchBar } from '@/components/search/SearchBar'
import { R7MusicLogo } from '@/components/ui/R7MusicLogo'

export const Header = ({ title = '' }) => {
  const navigate = useNavigate()

  return (
    <header
      className="flex items-center gap-3 px-4 md:px-5 py-3"
      style={{
        background: 'rgba(9,9,15,0.80)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo — only on mobile (desktop has sidebar) */}
      <button
        className="md:hidden flex items-center gap-1.5 flex-shrink-0"
        onClick={() => navigate('/')}
        aria-label="r7Music home"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <R7MusicLogo size={32} />
        <span
          className="font-bold text-sm"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, var(--color-brand-from), var(--color-brand-via), var(--color-brand-to))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          r7Music
        </span>
      </button>

      {/* Page title — desktop only */}
      {title && (
        <h1
          className="hidden md:block text-lg font-bold flex-shrink-0"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title}
        </h1>
      )}

      {/* Search bar */}
      <div className="flex-1 max-w-lg" style={{ marginLeft: title ? undefined : 0 }}>
        <SearchBar onSearch={() => navigate('/search')} />
      </div>
    </header>
  )
}

export default Header
