import React from 'react';
import {
  Play,
  Pause,
  ArrowRight,
  Sparkles,
  Volume2,
  CheckCircle2,
  ShoppingBag,
  Download,
  Share2,
  Folder,
  Music,
  ShieldCheck,
  Disc,
  ArrowUpRight
} from 'lucide-react';
import { Beat, Collection, ProducerProfile } from '../types';
import { BeatCard } from '../components/BeatCard';
import { EmptyState } from '../components/EmptyState';

interface HomeViewProps {
  beats: Beat[];
  collections: Collection[];
  profile: ProducerProfile;
  currentBeat: Beat | null;
  isPlaying: boolean;
  onPlayToggle: (beat: Beat) => void;
  onBuyClick: (beat: Beat) => void;
  onFreeDownloadClick: (beat: Beat) => void;
  onShareClick: (beat: Beat) => void;
  onViewDetail: (beat: Beat) => void;
  onNavigate: (view: string, filter?: string) => void;
  currencySymbol: string;
  youtubeVideos: any[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  beats,
  collections,
  profile,
  currentBeat,
  isPlaying,
  onPlayToggle,
  onBuyClick,
  onFreeDownloadClick,
  onShareClick,
  onViewDetail,
  onNavigate,
  currencySymbol,
  youtubeVideos = [],
}) => {
  const [playingVideoId, setPlayingVideoId] = React.useState<string | null>(null);

  // Top featured beat or primary beat for Hero Audio
  const heroBeat = beats.find((b) => b.featured) || beats[0] || null;
  const isHeroPlaying = heroBeat && currentBeat?.id === heroBeat.id && isPlaying;

  const featuredBeats = beats.filter((b) => b.featured);
  const primaryFeatured = featuredBeats[0] || beats[0] || null;
  const secondaryFeatured = featuredBeats.slice(1, 4);

  const latestBeats = [...beats]
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 4);

  const vaultBeats = beats.slice(0, 8);

  return (
    <div className="space-y-24 sm:space-y-32 pb-32">
      {/* 1. CINEMATIC HOMEPAGE HERO (RUNWAY SEQUENCE 1: INTRODUCTION) */}
      <section className="relative min-h-[580px] lg:min-h-[660px] rounded-3xl overflow-hidden bg-black border border-purple-950/60 p-8 sm:p-12 lg:p-16 flex flex-col justify-between shadow-2xl">
        {/* Layered Atmospheric Background */}
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center filter grayscale contrast-125"
          style={{ backgroundImage: `url(${profile.bannerUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-purple-950/30" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-purple-900/15 blur-[120px] pointer-events-none" />

        {/* Hero Header Identity Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>CASHMERE KID$ · ARCHITECT VAULT</span>
          </div>

          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
            ATLANTA / LOS ANGELES / TOKYO
          </span>
        </div>

        {/* Hero Main Editorial Typography & Composition */}
        <div className="relative z-10 max-w-3xl my-auto py-8 space-y-6">
          <div className="space-y-3">
            <span className="text-xs sm:text-sm font-mono text-purple-400 font-extrabold uppercase tracking-widest block">
              OFFICIAL BEAT STORE
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
              BEATS FOR ARTISTS WHO REFUSE TO SOUND ORDINARY.
            </h1>
          </div>

          <p className="text-sm sm:text-base text-zinc-400 font-medium leading-relaxed max-w-xl">
            Multi-platinum audio architecture crafted for world-tier recording artists. Stream, audition, and license high-fashion instrumentals directly from the producer vault.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('browse')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-purple-950 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span>ENTER THE VAULT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {heroBeat ? (
              <button
                onClick={() => onPlayToggle(heroBeat)}
                className="px-8 py-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/50 text-white font-extrabold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
              >
                {isHeroPlaying ? (
                  <>
                    <Pause className="w-4 h-4 text-purple-400 fill-current" />
                    <span>PAUSE PREVIEW</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-purple-400 fill-current" />
                    <span>LISTEN NOW</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => onNavigate('uploader')}
                className="px-8 py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-extrabold text-xs uppercase tracking-widest"
              >
                UPLOAD BEAT
              </button>
            )}
          </div>
        </div>

        {/* Hero Audio Card Widget (Real Beat Feature) */}
        <div className="relative z-10 pt-6 border-t border-zinc-900/80">
          {heroBeat ? (
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                <div
                  className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-zinc-800 cursor-pointer group"
                  onClick={() => onViewDetail(heroBeat)}
                >
                  <img
                    src={heroBeat.artworkUrl}
                    alt={heroBeat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayToggle(heroBeat);
                    }}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isHeroPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest">SPOTLIGHT INSTRUMENTAL</span>
                    <span>·</span>
                    <span className="text-[10px] font-mono text-zinc-400">{heroBeat.bpm} BPM</span>
                  </div>
                  <h3
                    onClick={() => onViewDetail(heroBeat)}
                    className="font-black text-base text-white hover:text-purple-300 transition-colors cursor-pointer truncate"
                  >
                    {heroBeat.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold">
                    <span>CASHMERE KID$</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 fill-purple-950" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                <div className="text-right pr-2">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">MP3 Lease</span>
                  <span className="text-sm font-black font-mono text-white">
                    {currencySymbol}{heroBeat.pricing.mp3Lease.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => onBuyClick(heroBeat)}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Buy</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-900 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm uppercase">THE VAULT IS READY</h3>
                <p className="text-xs text-zinc-400">Upload your first beat to initialize the CASHMERE KID$ storefront.</p>
              </div>
              <button
                onClick={() => onNavigate('uploader')}
                className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Upload First Beat
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. FEATURED MUSIC SPOTLIGHT (RUNWAY SEQUENCE 2) */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-extrabold text-purple-400 uppercase tracking-widest block">
              CURATED SELECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              FEATURED PRODUCTIONS
            </h2>
          </div>

          <button
            onClick={() => onNavigate('browse')}
            className="text-xs font-extrabold text-purple-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {primaryFeatured ? (
          <div className="space-y-8">
            {/* Primary Featured Beat Hero Presentation */}
            <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-purple-500/30 p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8 shadow-2xl">
              <div className="relative aspect-square w-full lg:w-80 rounded-2xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800 shadow-2xl group">
                <img
                  src={primaryFeatured.artworkUrl}
                  alt={primaryFeatured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => onPlayToggle(primaryFeatured)}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform"
                >
                  {currentBeat?.id === primaryFeatured.id && isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1" />
                  )}
                </button>
              </div>

              <div className="flex-1 space-y-5 text-center lg:text-left w-full">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>PRIMARY FEATURED BEAT</span>
                  </div>

                  <h3
                    onClick={() => onViewDetail(primaryFeatured)}
                    className="text-3xl sm:text-4xl font-black text-white hover:text-purple-300 cursor-pointer transition-colors"
                  >
                    {primaryFeatured.title}
                  </h3>

                  <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-zinc-400">
                    <span>CASHMERE KID$</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 fill-purple-950" />
                    <span>·</span>
                    <span className="font-mono text-purple-300">{primaryFeatured.bpm} BPM</span>
                    <span>·</span>
                    <span className="font-mono text-zinc-300">{primaryFeatured.key}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {primaryFeatured.description || 'Mastered 24-bit luxury instrumental ready for high-level vocal recording.'}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <button
                    onClick={() => onBuyClick(primaryFeatured)}
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>License Beat — {currencySymbol}{primaryFeatured.pricing.mp3Lease.toFixed(2)}</span>
                  </button>

                  {primaryFeatured.freeDownload && (
                    <button
                      onClick={() => onFreeDownloadClick(primaryFeatured)}
                      className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-purple-300 hover:text-white font-extrabold text-xs flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Free Download</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Secondary Featured Beats Row */}
            {secondaryFeatured.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {secondaryFeatured.map((beat) => (
                  <BeatCard
                    key={beat.id}
                    beat={beat}
                    isPlaying={isPlaying}
                    isCurrent={currentBeat?.id === beat.id}
                    onPlayToggle={onPlayToggle}
                    onBuyClick={onBuyClick}
                    onFreeDownloadClick={onFreeDownloadClick}
                    onShareClick={onShareClick}
                    onViewDetail={onViewDetail}
                    currencySymbol={currencySymbol}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="NO FEATURED PRODUCTIONS"
            description="Set published beats to 'Featured' in the Studio Dashboard to highlight top productions."
            actionLabel="Open Studio Dashboard"
            onAction={() => onNavigate('dashboard')}
          />
        )}
      </section>

      {/* 3. LATEST RELEASES (RUNWAY SEQUENCE 3) */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-extrabold text-purple-400 uppercase tracking-widest block">
              NEW IN VAULT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              LATEST RELEASES
            </h2>
          </div>

          <button
            onClick={() => onNavigate('browse')}
            className="text-xs font-extrabold text-purple-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>EXPLORE ALL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {latestBeats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {latestBeats.map((beat) => (
              <BeatCard
                key={beat.id}
                beat={beat}
                isPlaying={isPlaying}
                isCurrent={currentBeat?.id === beat.id}
                onPlayToggle={onPlayToggle}
                onBuyClick={onBuyClick}
                onFreeDownloadClick={onFreeDownloadClick}
                onShareClick={onShareClick}
                onViewDetail={onViewDetail}
                currencySymbol={currencySymbol}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="NO RELEASES YET"
            description="Published releases will appear here automatically."
            actionLabel="Upload First Release"
            onAction={() => onNavigate('uploader')}
          />
        )}
      </section>

      {/* 4. THE VAULT CATALOG SHOWCASE (RUNWAY SEQUENCE 4) */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-extrabold text-purple-400 uppercase tracking-widest block">
              COMPLETE CATALOG
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              THE VAULT
            </h2>
          </div>

          <button
            onClick={() => onNavigate('browse')}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-extrabold text-xs transition-colors flex items-center gap-1.5"
          >
            <span>VIEW ALL BEATS</span>
            <ArrowUpRight className="w-4 h-4 text-purple-400" />
          </button>
        </div>

        {vaultBeats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {vaultBeats.map((beat) => (
              <BeatCard
                key={beat.id}
                beat={beat}
                isPlaying={isPlaying}
                isCurrent={currentBeat?.id === beat.id}
                onPlayToggle={onPlayToggle}
                onBuyClick={onBuyClick}
                onFreeDownloadClick={onFreeDownloadClick}
                onShareClick={onShareClick}
                onViewDetail={onViewDetail}
                currencySymbol={currencySymbol}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="THE VAULT IS EMPTY"
            description="No beats currently in the catalog."
            actionLabel="Upload Beat"
            onAction={() => onNavigate('uploader')}
          />
        )}
      </section>

      {/* 5. REAL COLLECTIONS (RUNWAY SEQUENCE 5 - ONLY IF REAL COLLECTIONS EXIST) */}
      {collections && collections.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-extrabold text-purple-400 uppercase tracking-widest block">
                CURATED PACKS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                COLLECTIONS
              </h2>
            </div>

            <button
              onClick={() => onNavigate('collections')}
              className="text-xs font-extrabold text-purple-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>EXPLORE COLLECTIONS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {collections.map((col) => (
              <div
                key={col.id}
                onClick={() => onNavigate('collections')}
                className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 hover:border-purple-500/40 cursor-pointer transition-all flex items-center gap-6 group shadow-xl"
              >
                <img
                  src={col.artworkUrl}
                  alt={col.name}
                  className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-zinc-800 group-hover:scale-105 transition-transform"
                />
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">
                    {col.beatCount} Tracks Pack
                  </span>
                  <h3 className="font-black text-xl text-white group-hover:text-purple-300 transition-colors truncate">
                    {col.name}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 font-medium">
                    {col.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5.5. STUDIO SESSIONS & BEAT VISUALIZERS (YOUTUBE VAULT) */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-extrabold text-purple-400 uppercase tracking-widest block">
              VISUAL CONTENT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-brand">
              STUDIO SESSIONS & VISUALIZERS
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {youtubeVideos.map((video) => (
            <div
              key={video.id}
              className="bg-zinc-900/40 border border-zinc-850 rounded-2xl overflow-hidden hover:border-purple-500/20 transition-all flex flex-col justify-between shadow-lg"
            >
              {/* Responsive Video/Thumbnail Area */}
              <div className="relative aspect-video w-full bg-black border-b border-zinc-900">
                {playingVideoId === video.id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                    title={video.title}
                    className="w-full h-full absolute inset-0 rounded-t-2xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    onClick={() => setPlayingVideoId(video.id)}
                    className="w-full h-full absolute inset-0 group focus:outline-none"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover filter brightness-75 group-hover:brightness-50 transition-all duration-300"
                    />
                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-purple-600/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    {/* Duration Badge */}
                    <span className="absolute bottom-2.5 right-2.5 bg-black/80 font-mono text-[10px] text-zinc-300 px-2 py-0.5 rounded font-bold">
                      {video.duration}
                    </span>
                  </button>
                )}
              </div>

              {/* Text Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-purple-400 bg-purple-950/40 border border-purple-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {video.category}
                  </span>
                  <h3 className="font-extrabold text-sm text-white pt-1 line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3 pt-1">
                    {video.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BRAND STORY (RUNWAY SEQUENCE 6) */}
      <section className="rounded-3xl bg-zinc-950 border border-purple-950/80 p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-purple-500/40 shrink-0 shadow-2xl shadow-purple-950">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-xs font-mono font-extrabold text-purple-400 uppercase tracking-widest">PRODUCER PROFILE</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400 fill-purple-950" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {profile.name}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed max-w-2xl">
            {profile.bio || 'Audio Architect crafting luxury instrumentals for world-tier recording artists.'}
          </p>

          <div className="pt-2 text-xs font-mono text-zinc-500">
            <span>LOCATION: {profile.location}</span>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION (RUNWAY SEQUENCE 7) */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-black to-zinc-950 border border-purple-500/30 p-10 sm:p-16 text-center space-y-6 shadow-2xl">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-2xl mx-auto">
          READY TO CREATE YOUR NEXT HIT?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 font-medium max-w-lg mx-auto">
          Instant automated license delivery, untagged WAV stems, and 100% royalty-cleared audio files.
        </p>

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => onNavigate('browse')}
            className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-purple-950 transition-all flex items-center gap-2"
          >
            <span>EXPLORE ALL INSTRUMENTALS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
