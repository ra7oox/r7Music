import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { getDownloadUrl } from '@/services/jamendoService'

export const useDownload = () => {
  const [downloading, setDownloading] = useState({})

  const download = useCallback(async (track) => {
    if (downloading[track.id]) return
    setDownloading((prev) => ({ ...prev, [track.id]: true }))

    const toastId = toast.loading(`Preparing download: ${track.name}`)
    try {
      const url = getDownloadUrl(track.id)
      const response = await fetch(url)
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${track.artist_name} - ${track.name}.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)

      toast.success(`Downloaded: ${track.name}`, { id: toastId })
    } catch (err) {
      console.error('Download error:', err)
      toast.error('Download failed. Try again.', { id: toastId })
    } finally {
      setDownloading((prev) => {
        const next = { ...prev }
        delete next[track.id]
        return next
      })
    }
  }, [downloading])

  const isDownloading = useCallback((trackId) => !!downloading[trackId], [downloading])

  return { download, isDownloading }
}
