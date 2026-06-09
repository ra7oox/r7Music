import { Download, Loader2 } from 'lucide-react'
import { useDownload } from '@/hooks/useDownload'

export const DownloadButton = ({ track, size = 'sm' }) => {
  const { download, isDownloading } = useDownload()
  const loading = isDownloading(track.id)

  return (
    <button
      className="btn-icon"
      aria-label={`Download ${track.name}`}
      title="Download MP3"
      onClick={(e) => {
        e.stopPropagation()
        download(track)
      }}
      disabled={loading}
      style={{ opacity: loading ? 0.7 : 1 }}
    >
      {loading ? (
        <Loader2
          size={size === 'sm' ? 14 : 18}
          style={{ animation: 'spin 1s linear infinite' }}
        />
      ) : (
        <Download size={size === 'sm' ? 14 : 18} />
      )}
    </button>
  )
}

export default DownloadButton
