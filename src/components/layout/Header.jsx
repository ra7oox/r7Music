import { useNavigate } from 'react-router-dom'
import { SearchBar } from '@/components/search/SearchBar'
import { Bell, Settings } from 'lucide-react'

export const Header = ({ title = '' }) => {
  const navigate = useNavigate()

  return (
    <header
      className="flex items-center gap-4 px-6 py-4"
      style={{
        background: 'rgba(8,8,15,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {title && (
        <h1
          className="text-lg font-bold"
          style={{ color: 'var(--color-text-primary)', minWidth: 'max-content' }}
        >
          {title}
        </h1>
      )}
      <div className="flex-1 max-w-xl">
        <SearchBar onSearch={() => navigate('/search')} />
      </div>
      <div className="flex items-center gap-1 ml-auto">
        <button className="btn-icon" aria-label="Notifications" title="Notifications">
          <Bell size={18} />
        </button>
        <button className="btn-icon" aria-label="Settings" title="Settings">
          <Settings size={18} />
        </button>
      </div>
    </header>
  )
}

export default Header
