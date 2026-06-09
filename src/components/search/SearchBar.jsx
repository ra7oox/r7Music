import { useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export const SearchBar = ({ value, onChange, placeholder = 'Search tracks, artists, albums…', autoFocus = false, onSearch }) => {
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
    <div className="relative" role="search">
      <Search
        size={16}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-muted)',
          pointerEvents: 'none',
        }}
      />
      <input
        ref={inputRef}
        id="global-search"
        type="search"
        role="searchbox"
        aria-label="Search music"
        className="search-input"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {value && (
        <button
          aria-label="Clear search"
          onClick={() => onChange?.('')}
          className="btn-icon"
          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

export default SearchBar
