import { useRef, useEffect } from 'react'
import { Search, X, Compass } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export const SearchBar = ({ value, onChange, placeholder = 'Que souhaitez-vous écouter ou regarder ?', autoFocus = false, onSearch }) => {
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  // Keyboard shortcut: "/" focuses search
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        if (location.pathname !== '/search') navigate('/search')
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate, location.pathname])

  const handleChange = (e) => {
    onChange?.(e.target.value)
    onSearch?.()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (location.pathname !== '/search') navigate('/search')
      onSearch?.()
    }
  }

  return (
    <div className="relative w-full flex items-center" role="search" style={{ maxWidth: '480px' }}>
      <Search
        size={20}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '16px',
          color: 'var(--color-text-muted)',
          pointerEvents: 'none',
          opacity: 0.8,
        }}
      />
      <input
        ref={inputRef}
        id="global-search"
        type="search"
        role="searchbox"
        aria-label="Search music"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          height: '48px',
          background: '#1f1f1f',
          border: '1px solid transparent',
          borderRadius: '9999px',
          color: 'white',
          paddingLeft: '48px',
          paddingRight: '76px',
          fontSize: '0.875rem',
          outline: 'none',
          transition: 'all 0.2s ease',
          margin: 0,
        }}
        onFocus={(e) => {
          e.target.style.background = '#2a2a2a'
          e.target.style.border = '1px solid rgba(255,255,255,0.2)'
        }}
        onBlur={(e) => {
          e.target.style.background = '#1f1f1f'
          e.target.style.border = '1px solid transparent'
        }}
      />
      <div
        className="absolute right-4 flex items-center gap-2"
        style={{ pointerEvents: 'auto' }}
      >
        {value && (
          <button
            aria-label="Clear search"
            onClick={() => onChange?.('')}
            className="flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <X size={16} />
          </button>
        )}
        <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
        <button
          aria-label="Browse"
          onClick={() => navigate('/tracks')}
          className="flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <Compass size={18} />
        </button>
      </div>
    </div>
  )
}

export default SearchBar
