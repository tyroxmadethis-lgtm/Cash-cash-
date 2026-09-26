import React from 'react';
import { X, Play, Pause, Download, ShoppingBag, Share2, CheckCircle2, Music, Sparkles } from 'lucide-react';
import { Beat } from '../types';

interface BeatDetailModalProps {
  beat: Beat | null;
  beats?: Beat[]; // Real catalog to derive related beats
  isOpen: boolean;
  isPlaying: boolean;
  isCurrent: boolean;
  onClose: () => void;
  onPlayToggle: (beat: Beat) => void;
  onBuyClick: (beat: Beat) => void;
  onFreeDownloadClick: (beat: Beat) => void;
  onShareClick: (beat: Beat) => void;
  currencySymbol: string;
}

export const BeatDetailModal: React.FC<BeatDetailModalProps> = ({
  beat,
  beats = [],
  isOpen,
  isPlaying,
  isCurrent,
  onClose,
  onPlayToggle,
  onBuyClick,
  onFreeDownloadClick,
  onShareClick,
  currencySymbol,
}) => {
  if (!isOpen || !beat) return null;

  const isThisPlaying = isCurrent && isPlaying;

  // Derive related beats from real catalog (matching genre, key, or tags)
  const relatedBeats = beats
    .filter((b) => b.id !== beat.id && (b.genre === beat.genre || b.key === beat.key || b.tags.some((t) => beat.tags.includes(t))))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-950/80 overflow-hidden my-auto flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 text-zinc-400 hover:text-white rounded-full bg-zinc-900/80 backdrop-blur border border-zinc-800 transition-colors"
          title="Close Product Presentation"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Large Hi-Res Artwork */}
        <div className="md:w-1/2 relative bg-zinc-900 aspect-square md:aspect-auto overflow-hidden group">
          <img
            src={beat.artworkUrl}
            alt={beat.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/src/assets/images/cashmere_cover_velvet_1790419833792.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/20 to-transparent" />

          {/* Centered Play Control Button */}
          <button
            onClick={() => onPlayToggle(beat)}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all border border-purple-400/50"
            aria-label={isThisPlaying ? 'Pause' : 'Play'}
          >
            {isThisPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>

          {/* Key Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-zinc-800 text-white text-xs font-mono font-bold">
            {beat.key}
          </div>
        </div>

        {/* Right Column: Beat Specs & Commercial Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
          <div className="space-y-4">
            {/* Header: Title & Producer */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300 text-[10px] font-mono uppercase tracking-wider">
                <span>{beat.genre}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
                {beat.title}
              </h2>

              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold pt-0.5">
                <span>PROD. {beat.producerName || 'CASHMERE KID$'}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 fill-purple-950" />
              </div>
            </div>

            {/* Quick Technical Specs Grid */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-900 text-xs font-mono">
              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80 text-center">
                <span className="text-zinc-500 block text-[10px] uppercase">TEMPO</span>
                <span className="font-extrabold text-white text-sm">{beat.bpm} BPM</span>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80 text-center">
                <span className="text-zinc-500 block text-[10px] uppercase">KEY</span>
                <span className="font-extrabold text-white text-sm">{beat.key}</span>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80 text-center">
                <span className="text-zinc-500 block text-[10px] uppercase">DURATION</span>
                <span className="font-extrabold text-white text-sm">{beat.duration}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Production Description</span>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                {beat.description || 'Mastered 24-bit high-fashion instrumental crafted by CASHMERE KID$. Ready for vocal recording and digital commercial release.'}
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Sound Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {beat.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Real Beats */}
            {relatedBeats.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Related Vault Beats</span>
                <div className="space-y-1.5">
                  {relatedBeats.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => {
                        onClose();
                        onPlayToggle(rel);
                      }}
                      className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/40 flex items-center justify-between gap-2 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={rel.artworkUrl} alt={rel.title} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-xs font-bold text-white truncate">{rel.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-purple-300 shrink-0">{rel.bpm} BPM</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Commercial Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-zinc-900">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">MP3 Lease Starting At</span>
              <span className="text-2xl font-mono font-black text-white">
                {currencySymbol}{beat.pricing.mp3Lease.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onBuyClick(beat);
                }}
                className="flex-1 py-3.5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-950 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Select License Option</span>
              </button>

              {beat.freeDownload && (
                <button
                  onClick={() => {
                    onClose();
                    onFreeDownloadClick(beat);
                  }}
                  className="p-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-purple-300 rounded-xl transition-colors"
                  title="Free Tagged Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => {
                  onClose();
                  onShareClick(beat);
                }}
                className="p-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl transition-colors"
                title="Share Beat"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
