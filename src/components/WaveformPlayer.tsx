import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Share2,
  Download,
  ShoppingBag,
  Heart,
  Sliders,
  X,
  Maximize2,
  Minimize2,
  Repeat,
  CheckCircle2,
  Music,
  Sparkles
} from 'lucide-react';
import { Beat } from '../types';
import { audioSynth } from '../utils/audioSynth';

interface WaveformPlayerProps {
  currentBeat: Beat | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
  onBuyClick: (beat: Beat) => void;
  onFreeDownloadClick: (beat: Beat) => void;
  onShareClick: (beat: Beat) => void;
  currencySymbol: string;
  beats: Beat[];
  onPlayToggle: (beat: Beat) => void;
}

export const WaveformPlayer: React.FC<WaveformPlayerProps> = ({
  currentBeat,
  isPlaying,
  setIsPlaying,
  onPrev,
  onNext,
  onBuyClick,
  onFreeDownloadClick,
  onShareClick,
  currencySymbol,
  beats = [],
  onPlayToggle,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(165);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isLiked, setIsLiked] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [pitchShift, setPitchShift] = useState(0); // -2 to +2 semitones
  const [tempoMultiplier, setTempoMultiplier] = useState(1.0); // 0.9x to 1.1x
  const [isWatermarkActive, setIsWatermarkActive] = useState(true);
  const [showAuditionControls, setShowAuditionControls] = useState(false);
  const [isExpandedFullPlayer, setIsExpandedFullPlayer] = useState(false);
  const [playerState, setPlayerState] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error' | 'finished'>('idle');
  const [hoverSeekSecs, setHoverSeekSecs] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fullCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    audioSynth.setCallbacks(
      (time, dur) => {
        setCurrentTime(time);
        setDuration(dur);
        if (time >= dur && !isLooping) {
          setPlayerState('finished');
        }
      },
      () => {
        if (isLooping && currentBeat) {
          audioSynth.seek(0);
          setCurrentTime(0);
        } else {
          // Continuous Listening Queue Autoplay
          setCurrentTime(0);
          onNext();
        }
      }
    );
  }, [setIsPlaying, isLooping, currentBeat, onNext]);

  useEffect(() => {
    if (currentBeat) {
      setPlayerState('loading');
      const timer = setTimeout(() => {
        if (isPlaying) {
          setPlayerState('playing');
          audioSynth.playBeat(
            currentBeat.id,
            currentBeat.bpm,
            currentBeat.key,
            currentBeat.durationSeconds || 165
          );
        } else {
          setPlayerState('paused');
          audioSynth.pauseBeat();
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setPlayerState('idle');
    }
  }, [currentBeat, isPlaying]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioSynth.setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioSynth.setVolume(volume || 0.8);
      setIsMuted(false);
    } else {
      audioSynth.setVolume(0);
      setIsMuted(true);
    }
  };

  const handlePitchChange = (semitones: number) => {
    setPitchShift(semitones);
    audioSynth.setPitchShift(semitones);
  };

  const handleTempoChange = (multiplier: number) => {
    setTempoMultiplier(multiplier);
    audioSynth.setTempoMultiplier(multiplier);
  };

  // Render Canvas Waveform
  const drawWaveformOnCanvas = (canvas: HTMLCanvasElement | null, isFull: boolean = false) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const barCount = isFull ? 120 : 80;
    const barWidth = isFull ? 4 : 3;
    const gap = (width - barCount * barWidth) / (barCount - 1);
    const progressRatio = duration > 0 ? currentTime / duration : 0;

    const freqData = isPlaying ? audioSynth.getFrequencyData() : new Uint8Array(32);

    for (let i = 0; i < barCount; i++) {
      const baseHeightRatio =
        Math.sin(i * 0.15) * 0.35 +
        Math.cos(i * 0.08) * 0.25 +
        0.35 +
        (i % 3 === 0 ? 0.15 : 0);

      const freqIndex = i % (freqData.length || 1);
      const freqBoost = (freqData[freqIndex] || 0) / 255.0;

      const h = Math.max(
        6,
        Math.min(height - 4, (baseHeightRatio + freqBoost * 0.45) * height)
      );

      const x = i * (barWidth + gap);
      const y = (height - h) / 2;

      const isPlayed = i / barCount <= progressRatio;

      if (isPlayed) {
        const grad = ctx.createLinearGradient(0, y, 0, y + h);
        grad.addColorStop(0, '#f3e8ff');
        grad.addColorStop(0.5, '#a855f7');
        grad.addColorStop(1, '#6b21a8');
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = '#27272a';
      }

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, h, 2);
      ctx.fill();

      // Playhead line
      if (Math.abs(i / barCount - progressRatio) < 1 / barCount) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + barWidth / 2 - 1, 0, 2, height);
      }
    }
  };

  useEffect(() => {
    let animId: number;
    const render = () => {
      drawWaveformOnCanvas(canvasRef.current, false);
      if (isExpandedFullPlayer) {
        drawWaveformOnCanvas(fullCanvasRef.current, true);
      }
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [currentTime, duration, isPlaying, isExpandedFullPlayer]);

  if (!currentBeat) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSecs = ratio * duration;
    setCurrentTime(targetSecs);
    audioSynth.seek(targetSecs);
  };

  return (
    <>
      {/* Full Player Overlay Modal */}
      {isExpandedFullPlayer && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-12 animate-fadeIn text-zinc-100 overflow-y-auto">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="font-brand font-black tracking-widest text-lg text-white uppercase">
                CASHMERE KID$ VAULT PLAYER
              </span>
            </div>

            <button
              onClick={() => setIsExpandedFullPlayer(false)}
              className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
              title="Close Expanded Player"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Full Player Body */}
          <div className="max-w-7xl mx-auto w-full my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Large Artwork (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative aspect-square w-64 sm:w-80 md:w-96 lg:w-full rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-950/80 group">
                <img
                  src={currentBeat.artworkUrl}
                  alt={currentBeat.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {isPlaying && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-purple-900/80 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Playing</span>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Column: Controls & Large Waveform (lg:col-span-5) */}
            <div className="lg:col-span-5 w-full space-y-6 text-center lg:text-left flex flex-col justify-center">
              <div className="space-y-3">
                {/* Active Player Status Badge */}
                <div className="flex justify-center lg:justify-start">
                  {playerState === 'loading' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-yellow-400 text-[10px] font-mono font-bold uppercase animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                      <span>Loading analog stems...</span>
                    </div>
                  )}
                  {playerState === 'playing' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                      <span>High-Fidelity Playback</span>
                    </div>
                  )}
                  {playerState === 'finished' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Continuous queue loaded</span>
                    </div>
                  )}
                  {playerState === 'paused' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-mono font-bold uppercase">
                      <span>Audition paused</span>
                    </div>
                  )}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase">
                  <span>{currentBeat.genre}</span>
                  <span>·</span>
                  <span>{currentBeat.key}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none uppercase">
                  {currentBeat.title}
                </h2>

                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-zinc-300 font-semibold">
                  <span>PROD. CASHMERE KID$</span>
                  <CheckCircle2 className="w-4 h-4 text-purple-400 fill-purple-950" />
                  <span>·</span>
                  <span className="font-mono text-purple-300">{Math.round(currentBeat.bpm * tempoMultiplier)} BPM</span>
                </div>
              </div>

              {/* Large Seekable Waveform */}
              <div className="space-y-2">
                <div
                  onClick={handleSeek}
                  className="w-full h-20 bg-zinc-950/90 rounded-2xl p-3 border border-zinc-800 hover:border-purple-500/50 cursor-pointer relative shadow-inner"
                >
                  <canvas
                    ref={fullCanvasRef}
                    width={800}
                    height={60}
                    className="w-full h-full block"
                  />
                </div>

                <div className="flex items-center justify-between font-mono text-xs text-zinc-400 px-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center lg:justify-start gap-5 pt-2">
                <button
                  onClick={() => setIsLooping(!isLooping)}
                  className={`p-3 rounded-2xl border transition-colors ${
                    isLooping ? 'bg-purple-950 border-purple-500 text-purple-300 font-bold' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  title="Loop Track"
                >
                  <Repeat className="w-5 h-5" />
                </button>

                <button
                  onClick={onPrev}
                  className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                >
                  <SkipBack className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-purple-950 transform hover:scale-105 transition-all"
                >
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>

                <button
                  onClick={onNext}
                  className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                >
                  <SkipForward className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 rounded-2xl border transition-colors ${
                    isLiked ? 'bg-red-950/40 border-red-500/50 text-red-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Purchase & Download Actions */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => {
                    setIsExpandedFullPlayer(false);
                    onBuyClick(currentBeat);
                  }}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy License — {currencySymbol}{currentBeat.pricing.mp3Lease.toFixed(2)}</span>
                </button>

                {currentBeat.freeDownload && (
                  <button
                    onClick={() => {
                      setIsExpandedFullPlayer(false);
                      onFreeDownloadClick(currentBeat);
                    }}
                    className="px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-purple-300 font-extrabold text-xs flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Free Download</span>
                  </button>
                )}

                <button
                  onClick={() => onShareClick(currentBeat)}
                  className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white"
                  title="Share Beat"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Studio Playback Queue (lg:col-span-3) */}
            <div className="lg:col-span-3 w-full bg-zinc-950/60 border border-zinc-900 rounded-3xl p-5 flex flex-col space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                <h3 className="text-xs font-black tracking-widest uppercase text-purple-300 font-brand">UP NEXT / QUEUE</h3>
                <span className="text-[10px] font-mono text-zinc-500 font-bold">{beats.length} TRACKS</span>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                {beats.map((beat) => {
                  const isCurrent = beat.id === currentBeat.id;
                  return (
                    <div
                      key={beat.id}
                      onClick={() => onPlayToggle(beat)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${
                        isCurrent
                          ? 'bg-purple-950/40 border-purple-500/40'
                          : 'bg-zinc-900/40 border-transparent hover:bg-zinc-900/80 hover:border-zinc-850'
                      }`}
                    >
                      <img src={beat.artworkUrl} alt={beat.title} className="w-9 h-9 rounded-lg object-cover shrink-0 border border-zinc-800" />
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-purple-300' : 'text-white'}`}>{beat.title}</h4>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{beat.bpm} BPM · {beat.key}</div>
                      </div>
                      {isCurrent && isPlaying && (
                        <div className="flex items-end gap-0.5 h-3 shrink-0">
                          <span className="w-0.5 bg-purple-400 rounded-full animate-pulse" />
                          <span className="w-0.5 bg-purple-300 rounded-full animate-pulse delay-75" />
                          <span className="w-0.5 bg-purple-400 rounded-full animate-pulse delay-150" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar Mini Player */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 border-t border-purple-500/30 backdrop-blur-xl shadow-2xl transition-all">
        {/* Top Accent Gradient Line */}
        <div className="h-0.5 bg-gradient-to-r from-purple-600 via-indigo-400 to-purple-800" />

        {/* Auditioning Controls Drawer */}
        {showAuditionControls && (
          <div className="bg-zinc-950 border-b border-zinc-900 px-6 py-2.5 flex items-center justify-between text-xs text-zinc-300 font-mono animate-fadeIn">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-bold">Pitch Shift:</span>
                <div className="flex gap-1">
                  {[-2, -1, 0, 1, 2].map((st) => (
                    <button
                      key={st}
                      onClick={() => handlePitchChange(st)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pitchShift === st
                          ? 'bg-purple-600 text-white'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {st > 0 ? `+${st}` : st}st
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-bold">Tempo Speed:</span>
                <div className="flex gap-1">
                  {[0.9, 1.0, 1.1].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleTempoChange(spd)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tempoMultiplier === spd
                          ? 'bg-purple-600 text-white'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-bold">Producer Tag Preview:</span>
                <button
                  onClick={() => setIsWatermarkActive(!isWatermarkActive)}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold transition-colors ${
                    isWatermarkActive
                      ? 'bg-purple-900/80 text-purple-200 border border-purple-500/50'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                  }`}
                >
                  {isWatermarkActive ? 'TAG ACTIVE (PROTECTED)' : 'CLEAN AUDITION'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowAuditionControls(false)}
              className="text-zinc-500 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Left Column: Artwork & Track Details */}
            <div className="flex items-center gap-3 w-full md:w-1/4">
              <div
                className="relative group shrink-0 cursor-pointer"
                onClick={() => setIsExpandedFullPlayer(true)}
              >
                <img
                  src={currentBeat.artworkUrl}
                  alt={currentBeat.title}
                  className="w-12 h-12 rounded-xl object-cover border border-purple-500/30 shadow-md group-hover:scale-105 transition-transform"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-purple-950/60 rounded-xl flex items-center justify-center">
                    <div className="flex items-end gap-0.5 h-4">
                      <span className="w-1 bg-purple-400 rounded-full animate-pulse" />
                      <span className="w-1 bg-purple-300 rounded-full animate-pulse delay-75" />
                      <span className="w-1 bg-purple-400 rounded-full animate-pulse delay-150" />
                    </div>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4
                    onClick={() => setIsExpandedFullPlayer(true)}
                    className="text-sm font-extrabold text-white truncate hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    {currentBeat.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mt-0.5">
                  <span className="text-purple-300 font-semibold">{currentBeat.producerName || 'CASHMERE KID$'}</span>
                  <CheckCircle2 className="w-3 h-3 text-purple-400 fill-purple-950 shrink-0" />
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="font-mono text-purple-300">{Math.round(currentBeat.bpm * tempoMultiplier)} BPM</span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="font-mono text-zinc-300">{currentBeat.key}</span>
                </div>
              </div>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-xl transition-colors ${
                  isLiked ? 'text-red-400 bg-red-950/30' : 'text-zinc-500 hover:text-white'
                }`}
                title="Save to favorites"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => setIsExpandedFullPlayer(true)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors"
                title="Expand Full Player"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Middle Column: Controls & Canvas Waveform */}
            <div className="flex-1 w-full md:max-w-xl flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAuditionControls(!showAuditionControls)}
                  className={`p-1 text-xs transition-colors ${
                    showAuditionControls ? 'text-purple-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Auditioning Controls (Pitch / Tempo)"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onPrev}
                  className="text-zinc-400 hover:text-white p-1.5 transition-colors"
                  title="Previous Beat"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-950 hover:scale-105 transition-all"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={onNext}
                  className="text-zinc-400 hover:text-white p-1.5 transition-colors"
                  title="Next Beat"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsLooping(!isLooping)}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    isLooping ? 'text-purple-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Toggle Loop"
                >
                  <Repeat className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Canvas Waveform */}
              <div className="w-full flex items-center gap-2.5">
                <span className="text-[11px] font-mono text-zinc-400 w-9 text-right shrink-0">
                  {formatTime(currentTime)}
                </span>

                <div
                  onClick={handleSeek}
                  className="flex-1 h-8 cursor-pointer relative group flex items-center bg-zinc-950 rounded-lg px-2 border border-zinc-900 hover:border-purple-500/40 transition-colors shadow-inner"
                  title="Seek position"
                >
                  <canvas
                    ref={canvasRef}
                    width={450}
                    height={28}
                    className="w-full h-full block"
                  />
                </div>

                <span className="text-[11px] font-mono text-zinc-400 w-9 shrink-0">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Right Column: Actions & Volume */}
            <div className="flex items-center justify-end gap-2 w-full md:w-1/4">
              {currentBeat.freeDownload && (
                <button
                  onClick={() => onFreeDownloadClick(currentBeat)}
                  className="p-2 text-zinc-300 hover:text-purple-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors"
                  title="Free Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => onShareClick(currentBeat)}
                className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors hidden sm:block"
                title="Share Beat"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onBuyClick(currentBeat)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-md shadow-purple-950 transition-all shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy {currencySymbol}{currentBeat.pricing.mp3Lease.toFixed(2)}</span>
              </button>

              <div className="hidden lg:flex items-center gap-1.5 text-zinc-400 pl-2 border-l border-zinc-800">
                <button onClick={toggleMute} className="hover:text-white p-1">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-14 h-1 bg-zinc-800 accent-purple-500 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
