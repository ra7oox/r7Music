import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getAlbums, getArtists } from '@/services/jamendoService'
import { TrackList } from '@/components/tracks/TrackList'
import { AlbumGrid } from '@/components/albums/AlbumView'
import { ArtistGrid } from '@/components/artists/ArtistView'
import { useTracks } from '@/hooks/useTracks'
import { usePlayer } from '@/hooks/usePlayer'
import { usePlayerStore } from '@/store/playerStore'
import { useFavorites } from '@/hooks/useFavorites'
import { useSearchStore } from '@/store/searchStore'
import { 
  TrendingUp, Disc3, Users, Play, Music2, 
  Plus, Heart, ChevronRight, Compass, Sparkles
} from 'lucide-react'

/* ── Reusable Viewport Scroll Reveal Wrapper ────────────────────────────── */
const ScrollReveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const currentTarget = domRef.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [])

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-98 pointer-events-none'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ── Latest Release Banner (matching user screenshot 1) ────────────────── */
const LatestRelease = ({ track }) => {
  const { currentTrack, isPlaying } = usePlayer()
  const playTrack = usePlayerStore((s) => s.playTrack)
  const { isFavorite, toggleFavorite } = useFavorites()
  const [avatarHovered, setAvatarHovered] = useState(false)

  if (!track) return null

  const isActive = currentTrack?.id === track.id
  const isFav = isFavorite(track.id)
  const artistImage = track.artist_image || track.album_image || ''

  return (
    <div className="mb-12">
      {/* Header Row: Artist avatar & Title */}
      <div className="flex items-center gap-3 mb-5 px-1">
        {artistImage ? (
          <img
            src={artistImage}
            alt={track.artist_name}
            className="w-11 h-11 rounded-full object-cover shadow-lg border border-[rgba(255,255,255,0.08)] transition-transform duration-300"
            style={{ transform: avatarHovered ? 'scale(1.08)' : 'scale(1)' }}
            onMouseEnter={() => setAvatarHovered(true)}
            onMouseLeave={() => setAvatarHovered(false)}
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#181818] flex items-center justify-center border border-[rgba(255,255,255,0.08)]">
            <Users size={18} className="text-gray-400" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.16em] leading-none">
            Dernière sortie de
          </span>
          <span className="text-xl font-black text-white mt-1.5 leading-none font-display">
            {track.artist_name}
          </span>
        </div>
      </div>

      {/* Main glass banner row */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 group transition-all duration-500 hover:border-[rgba(255,255,255,0.12)] cursor-pointer"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
        }}
        onClick={() => playTrack(track)}
      >
        {/* Cover artwork background glow */}
        {track.album_image && (
          <div
            className="absolute inset-0 select-none pointer-events-none -z-10 transition-transform duration-1000 group-hover:scale-105"
            style={{
              background: `radial-gradient(circle at 10% 50%, rgba(124, 63, 228, 0.16) 0%, rgba(200, 56, 154, 0.06) 60%, transparent 100%)`,
              filter: 'blur(40px)',
            }}
          />
        )}

        {/* Cover image with ambient glow */}
        <div className="flex-shrink-0 relative group-hover:scale-[1.03] transition-transform duration-500" style={{ width: 172, height: 172 }}>
          <img
            src={track.album_image || ''}
            alt={track.name}
            className="rounded-2xl w-full h-full object-cover shadow-2xl"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          />
          <div 
            className="absolute inset-0 rounded-2xl -z-10 blur-2xl opacity-60 scale-95 transition-opacity duration-500 group-hover:opacity-80" 
            style={{
              background: `url(${track.album_image})`,
              backgroundSize: 'cover'
            }} 
          />
        </div>

        {/* Text info and buttons */}
        <div className="flex-1 text-center md:text-left min-w-0 z-10">
          <span className="text-[11px] font-bold text-gray-400 tracking-wider block mb-2 font-mono">
            Single • {track.artist_name}
          </span>
          <h2 className="text-3xl md:text-4.5xl font-black truncate mb-6 text-white tracking-tight leading-none font-display">
            {track.name}
          </h2>

          <div className="flex items-center justify-center md:justify-start gap-4">
            {/* White play circle button */}
            <button
              className="flex items-center justify-center flex-shrink-0 transition-all duration-300"
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255,255,255,0.15)',
              }}
              onClick={(e) => {
                e.stopPropagation()
                playTrack(track)
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,255,255,0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,255,255,0.15)'
              }}
            >
              {isActive && isPlaying ? (
                <div className="flex items-end gap-[3px]" style={{ height: 16 }}>
                  <div className="equalizer-bar" style={{ height: 6, background: '#000' }} />
                  <div className="equalizer-bar" style={{ height: 13, background: '#000' }} />
                  <div className="equalizer-bar" style={{ height: 5, background: '#000' }} />
                  <div className="equalizer-bar" style={{ height: 10, background: '#000' }} />
                </div>
              ) : (
                <Play size={20} fill="black" style={{ marginLeft: 3 }} />
              )}
            </button>

            {/* Favorite circle border button */}
            <button
              className="flex items-center justify-center flex-shrink-0 transition-all duration-300"
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.04)',
                color: isFav ? '#C8389A' : 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(track)
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {isFav ? <Heart size={20} fill="#C8389A" /> : <Plus size={22} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Recently Played (Récents) Section (matching user screenshot 2) ────── */
const RecentsSection = ({ albums }) => {
  const navigate = useNavigate()
  const { favorites } = useFavorites()

  return (
    <section style={{ marginTop: '48px', marginBottom: '48px' }}>
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="font-display font-extrabold text-xl md:text-2xl tracking-tight text-white">
          Récents
        </h2>
        <button
          onClick={() => navigate('/albums')}
          className="text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Tout afficher
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-3 snap-x">
        <div
          onClick={() => navigate('/favorites')}
          className="flex-shrink-0 w-[184px] rounded-2xl p-4 flex flex-col justify-between cursor-pointer group transition-all duration-300 hover:scale-[1.03] snap-start"
          style={{
            background: 'linear-gradient(135deg, rgba(74, 0, 224, 0.8) 0%, rgba(200, 56, 154, 0.85) 100%)',
            boxShadow: '0 8px 24px rgba(200, 56, 154, 0.18)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            height: '260px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/18 shadow-inner">
              <Heart size={18} fill="white" className="text-white" />
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <h3 className="text-[17px] font-black text-white leading-tight font-display font-display">
              Titres likés
            </h3>
            <div 
              className="inline-flex items-center gap-1.5 text-[10px] text-green-300 font-bold px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20"
              style={{ marginTop: '8px', display: 'inline-flex' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {favorites.length} {favorites.length === 1 ? 'titre enregistré' : 'titres enregistrés'}
            </div>
          </div>
        </div>

        {/* Cards: Recent Albums */}
        {albums.slice(0, 7).map((album) => (
          <div
            key={album.id}
            onClick={() => navigate(`/album/${album.id}`)}
            className="flex-shrink-0 w-[184px] cursor-pointer group transition-all duration-300 hover:scale-[1.03] snap-start"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              height: '260px',
            }}
          >
            <div 
              className="relative w-full aspect-square rounded-xl overflow-hidden"
              style={{ marginBottom: '12px' }}
            >
              <img
                src={album.image || album.zip || ''}
                alt={album.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <h4 className="text-sm font-extrabold text-white truncate leading-tight group-hover:text-[var(--color-brand-from)] transition-colors">
              {album.name}
            </h4>
            <p 
              className="text-xs text-gray-400 truncate font-semibold"
              style={{ marginTop: '4px' }}
            >
              {album.artist_name}
            </p>
            <div style={{ marginTop: '8px' }}>
              <span className="inline-flex items-center gap-1.5 text-[9px] text-[#4A8FE8] font-bold px-2 py-0.5 rounded bg-[#4A8FE8]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A8FE8]" />
                Album
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Mood / Genre Stations Grid ────────────────────────────────────────── */
const MoodStations = () => {
  const navigate = useNavigate()
  const setQuery = useSearchStore((s) => s.setQuery)

  const MOODS = [
    { name: 'Ambient Focus', gradient: 'linear-gradient(135deg, #1A2639 0%, #1e3c72 100%)', query: 'ambient', color: '#4A8FE8' },
    { name: 'Chill & Relax', gradient: 'linear-gradient(135deg, #0e3d38 0%, #134e5e 100%)', query: 'chill', color: '#10b981' },
    { name: 'Workout Beats', gradient: 'linear-gradient(135deg, #4c0519 0%, #881337 100%)', query: 'workout', color: '#f43f5e' },
    { name: 'Pop & Energy', gradient: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)', query: 'pop', color: '#a855f7' },
    { name: 'Lo-Fi Chillout', gradient: 'linear-gradient(135deg, #2e1065 0%, #581c87 100%)', query: 'lofi', color: '#c084fc' },
    { name: 'Electronic Synth', gradient: 'linear-gradient(135deg, #062f4f 0%, #005691 100%)', query: 'electronic', color: '#3b82f6' },
  ]

  const handleMoodClick = (query) => {
    setQuery(query)
    navigate('/search')
  }

  return (
    <section style={{ marginTop: '48px', marginBottom: '48px' }}>
      <h2 className="font-display font-extrabold text-xl md:text-2xl tracking-tight text-white mb-6 px-1 flex items-center gap-2">
        <Sparkles size={20} className="text-[#A855F7]" />
        Stations thématiques
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {MOODS.map((mood) => (
          <div
            key={mood.name}
            onClick={() => handleMoodClick(mood.query)}
            className="h-[108px] rounded-2xl flex flex-col justify-between cursor-pointer group transition-all duration-300 hover:scale-[1.04]"
            style={{
              background: mood.gradient,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: `0 4px 16px rgba(0, 0, 0, 0.3)`,
              padding: '16px',
              boxSizing: 'border-box',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 8px 24px ${mood.color}25`
              e.currentTarget.style.borderColor = `${mood.color}50`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 4px 16px rgba(0, 0, 0, 0.3)`
              e.currentTarget.style.borderColor = `rgba(255, 255, 255, 0.08)`
            }}
          >
            <div className="flex justify-end opacity-25 group-hover:opacity-75 transition-opacity">
              <Compass size={16} className="text-white" />
            </div>
            <h4 className="text-sm font-black text-white leading-tight font-display">
              {mood.name}
            </h4>
          </div>
        ))}
      </div>
    </section>
  )
}

const SectionHeader = ({ icon: Icon, title, color }) => (
  <div className="flex items-center gap-3 mb-6 px-1">
    <div
      className="flex items-center justify-center rounded-xl"
      style={{
        width: 38,
        height: 38,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: `inset 0 0 10px rgba(124, 63, 228, 0.05)`,
      }}
    >
      <Icon size={18} style={{ color: color || 'var(--color-accent)' }} />
    </div>
    <h2
      className="font-display font-extrabold text-xl md:text-2xl tracking-tight"
      style={{ color: 'var(--color-text-primary)' }}
    >
      {title}
    </h2>
  </div>
)

/* ── Main Discover Page Component ───────────────────────────────────────── */
export const DiscoverPage = () => {
  const {
    data: tracksPages,
    isLoading: tracksLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useTracks()

  const { data: albumsData, isLoading: albumsLoading } = useQuery({
    queryKey: ['albums-discover'],
    queryFn: () => getAlbums({ limit: 12 }),
    staleTime: 5 * 60 * 1000,
  })

  const { data: artistsData, isLoading: artistsLoading } = useQuery({
    queryKey: ['artists-discover'],
    queryFn: () => getArtists({ limit: 8 }),
    staleTime: 5 * 60 * 1000,
  })

  const tracks  = tracksPages?.pages?.flatMap((p) => p.results) || []
  const albums  = albumsData?.results || []
  const artists = artistsData?.results || []
  const featuredTrack = tracks[0] || null

  return (
    <>
      <div className="page-container space-y-12 fade-in">

        {/* ── Section 1: Latest Release (Reveal Delay 0ms) ── */}
        <ScrollReveal delay={0}>
          {!tracksLoading && featuredTrack && (
            <LatestRelease track={featuredTrack} />
          )}
          {tracksLoading && (
            <div className="skeleton rounded-3xl mb-12" style={{ height: 260 }} />
          )}
        </ScrollReveal>

        {/* ── Section 2: Recently Played (Reveal Delay 100ms) ── */}
        <ScrollReveal delay={100}>
          {!albumsLoading && albums.length > 0 && (
            <RecentsSection albums={albums} />
          )}
          {albumsLoading && (
            <div className="skeleton rounded-2xl mb-12" style={{ height: 260 }} />
          )}
        </ScrollReveal>

        {/* ── Section 3: Mood Stations Grid (Reveal Delay 150ms) ── */}
        <ScrollReveal delay={150}>
          <MoodStations />
        </ScrollReveal>

        {/* ── Section 4: Trending Tracks (Reveal Delay 200ms) ── */}
        <ScrollReveal delay={200}>
          <section>
            <SectionHeader icon={TrendingUp} title="Trending Tracks" color="#7C3FE4" />
            <TrackList
              tracks={tracks}
              isLoading={tracksLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              queueTracks={tracks}
            />
          </section>
        </ScrollReveal>

        {/* ── Section 5: Popular Albums (Reveal Delay 250ms) ── */}
        <ScrollReveal delay={250}>
          <section>
            <SectionHeader icon={Disc3} title="Popular Albums" color="#C8389A" />
            <AlbumGrid albums={albums} isLoading={albumsLoading} />
          </section>
        </ScrollReveal>

        {/* ── Section 6: Featured Artists (Reveal Delay 300ms) ── */}
        <ScrollReveal delay={300}>
          <section>
            <SectionHeader icon={Users} title="Featured Artists" color="#4A8FE8" />
            <ArtistGrid artists={artists} isLoading={artistsLoading} />
          </section>
        </ScrollReveal>

      </div>
    </>
  )
}

export default DiscoverPage
