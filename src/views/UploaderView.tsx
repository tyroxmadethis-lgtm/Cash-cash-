import React, { useState, useEffect } from 'react';
import {
  Upload,
  Music,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Folder,
  Box,
  Link as LinkIcon,
  FileAudio,
  AlertTriangle,
  Copy,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Sliders,
  Play,
  Pause
} from 'lucide-react';
import { Beat, GenreType } from '../types';

interface UploaderViewProps {
  onPublishBeat: (newBeat: Beat) => void;
  onNavigateToBrowse: () => void;
  currencySymbol: string;
  beats?: Beat[];
  onSwitchToBeatPacks?: () => void;
}

export const UploaderView: React.FC<UploaderViewProps> = ({
  onPublishBeat,
  onNavigateToBrowse,
  currencySymbol,
  beats = [],
  onSwitchToBeatPacks,
}) => {
  // 7-step professional wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Draft autosaving and restoration
  const [hasRestoredDraft, setHasRestoredDraft] = useState<boolean>(false);
  const [detectedDraftPresent, setDetectedDraftPresent] = useState<boolean>(false);

  // Step 1: Upload Audio States
  const [fileName, setFileName] = useState<string>('voodoo_synth_master_320k.mp3');
  const [fileSize, setFileSize] = useState<string>('6.85 MB');
  const [fileUploaded, setFileUploaded] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [audioError, setAudioError] = useState<string>('');
  const [audioDuration, setAudioDuration] = useState<string>('2:48');
  const [detectedBpm, setDetectedBpm] = useState<number>(142);
  const [detectedKey, setDetectedKey] = useState<string>('F# Minor');

  // Step 2: Artwork State
  const [artworkUrl, setArtworkUrl] = useState<string>('/src/assets/images/voodoo_cover_obsidian_1790419259195.jpg');
  const [customArtworkName, setCustomArtworkName] = useState<string>('');
  const [isUploadingArtwork, setIsUploadingArtwork] = useState<boolean>(false);
  const [artworkDimensions, setArtworkDimensions] = useState<string>('3000 × 3000 px');

  // Step 3: Details & Metadata Info States
  const [title, setTitle] = useState<string>('OBSIDIAN KING');
  const [bpm, setBpm] = useState<number>(142);
  const [key, setKey] = useState<string>('F# Minor');
  const [genre, setGenre] = useState<GenreType>('TRAP');
  const [moods, setMoods] = useState<string>('Dark, High Fashion, Aggressive');
  const [tags, setTags] = useState<string>('voodoo, darktrap, runway, boomin');
  const [description, setDescription] = useState<string>(
    'Sub bass glides with dark synthesizer Arps. High fashion trap canvas.'
  );

  // Step 4: Pricing & Free Downloads States
  const [mp3Price, setMp3Price] = useState<number>(39.99);
  const [premiumPrice, setPremiumPrice] = useState<number>(89.99);
  const [unlimitedPrice, setUnlimitedPrice] = useState<number>(249.99);
  const [exclusivePrice, setExclusivePrice] = useState<number>(1200.0);
  const [allowFreeDownload, setAllowFreeDownload] = useState<boolean>(true);
  const [freeDownloadType, setFreeDownloadType] = useState<'email_required' | 'no_lead'>('email_required');

  // Step 5: Customer Access & Visibility States
  const [visibility, setVisibility] = useState<'published' | 'draft' | 'hidden'>('published');
  const [stableBeatId] = useState<string>(`beat-upload-${Date.now()}`);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Step 6: Store Presentation States
  const [featured, setFeatured] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('Studio Vault');
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);

  // Track if any field was changed from default
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const stepTitles = [
    '1. AUDIO MASTER',
    '2. COVER ARTWORK',
    '3. ADVANCED METADATA',
    '4. PRICING & DOWNLOAD',
    '5. CUSTOMER ACCESS',
    '6. STORE PRESENTATION',
    '7. REVIEW & PUBLISH',
  ];

  const artworkPresets = [
    '/src/assets/images/voodoo_cover_obsidian_1790419259195.jpg',
    '/src/assets/images/voodoo_cover_runway_1790419270870.jpg',
    '/src/assets/images/voodoo_hero_campaign_1790419247104.jpg',
  ];

  // Check for saved draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('voodoo_view_uploader_draft');
    if (draft) {
      setDetectedDraftPresent(true);
    }
  }, []);

  // Autosave draft when values change
  useEffect(() => {
    if (hasChanges) {
      const draftData = {
        fileName,
        fileSize,
        fileUploaded,
        audioDuration,
        detectedBpm,
        detectedKey,
        artworkUrl,
        artworkDimensions,
        title,
        bpm,
        key,
        genre,
        moods,
        tags,
        description,
        mp3Price,
        premiumPrice,
        unlimitedPrice,
        exclusivePrice,
        allowFreeDownload,
        freeDownloadType,
        visibility,
        featured,
        category,
      };
      localStorage.setItem('voodoo_view_uploader_draft', JSON.stringify(draftData));
    }
  }, [
    fileName,
    fileSize,
    fileUploaded,
    audioDuration,
    detectedBpm,
    detectedKey,
    artworkUrl,
    artworkDimensions,
    title,
    bpm,
    key,
    genre,
    moods,
    tags,
    description,
    mp3Price,
    premiumPrice,
    unlimitedPrice,
    exclusivePrice,
    allowFreeDownload,
    freeDownloadType,
    visibility,
    featured,
    category,
    hasChanges
  ]);

  const restoreDraft = () => {
    const draft = localStorage.getItem('voodoo_view_uploader_draft');
    if (draft) {
      try {
        const d = JSON.parse(draft);
        setFileName(d.fileName || '');
        setFileSize(d.fileSize || '');
        setFileUploaded(!!d.fileUploaded);
        setAudioDuration(d.audioDuration || '2:48');
        setDetectedBpm(d.detectedBpm || 142);
        setDetectedKey(d.detectedKey || 'F# Minor');
        setArtworkUrl(d.artworkUrl || '');
        setArtworkDimensions(d.artworkDimensions || '3000 × 3000 px');
        setTitle(d.title || '');
        setBpm(d.bpm || 142);
        setKey(d.key || 'F# Minor');
        setGenre(d.genre || 'TRAP');
        setMoods(d.moods || '');
        setTags(d.tags || '');
        setDescription(d.description || '');
        setMp3Price(d.mp3Price || 39.99);
        setPremiumPrice(d.premiumPrice || 89.99);
        setUnlimitedPrice(d.unlimitedPrice || 249.99);
        setExclusivePrice(d.exclusivePrice || 1200.0);
        setAllowFreeDownload(!!d.allowFreeDownload);
        setFreeDownloadType(d.freeDownloadType || 'email_required');
        setVisibility(d.visibility || 'published');
        setFeatured(!!d.featured);
        setCategory(d.category || 'Studio Vault');
        setHasRestoredDraft(true);
        setDetectedDraftPresent(false);
      } catch (e) {
        console.error('Error restoring draft', e);
      }
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('voodoo_view_uploader_draft');
    setDetectedDraftPresent(false);
  };

  // Simulate premium uploading and compiling engine
  const handleAudioFileSelection = (file: File) => {
    setAudioError('');
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'wav') {
      setAudioError(
        'WAV format is unsupported in the storefront. Supported store formats: high-fidelity M4A or 320kbps MP3 only.'
      );
      return;
    }

    setHasChanges(true);
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    setFileUploaded(false);
    setIsUploading(true);
    setUploadProgress(0);

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          startAudioCompilingEngine(file.name);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const startAudioCompilingEngine = (name: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    const statuses = [
      'Reading digital audio headers...',
      'Validating sample rates & bit depth (44.1kHz, 320kbps)...',
      'Analyzing peak transient vectors (BPM detection)...',
      'Compiling lossy-to-lossless waveform caches...',
      'Audio successfully master validated!',
    ];

    let currentStatusIdx = 0;
    setProcessingStatus(statuses[0]);

    const processingInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        const nextProgress = prev + 5;
        const index = Math.min(
          Math.floor((nextProgress / 100) * statuses.length),
          statuses.length - 1
        );
        setProcessingStatus(statuses[index]);

        if (nextProgress >= 100) {
          clearInterval(processingInterval);
          setIsProcessing(false);
          setFileUploaded(true);
          
          const cleanTitle = name
            .replace(/\.[^/.]+$/, '')
            .replace(/[_-]/g, ' ')
            .toUpperCase();
          
          setTitle(cleanTitle);
          
          const randomBpm = [135, 140, 142, 145, 150, 160][Math.floor(Math.random() * 6)];
          const randomKey = ['F# Minor', 'C Minor', 'G Minor', 'D Minor', 'A# Minor', 'E Minor'][Math.floor(Math.random() * 6)];
          
          setDetectedBpm(randomBpm);
          setDetectedKey(randomKey);
          setBpm(randomBpm);
          setKey(randomKey);
          setAudioDuration('2:54');
          return 100;
        }
        return nextProgress;
      });
    }, 100);
  };

  const handleArtworkSelection = (file: File) => {
    setIsUploadingArtwork(true);
    setHasChanges(true);
    setTimeout(() => {
      const demoUrl = URL.createObjectURL(file);
      setArtworkUrl(demoUrl);
      setCustomArtworkName(file.name);
      setArtworkDimensions('3000 × 3000 px · RGB Space · Valid');
      setIsUploadingArtwork(false);
    }, 1000);
  };

  const handlePublish = (publishStatus: 'published' | 'draft' | 'hidden') => {
    const finalBeat: Beat = {
      id: stableBeatId,
      title: title.trim() || 'UNTITLED INSTRUMENTAL',
      producerName: 'CASHMERE KID$',
      bpm: bpm || 140,
      key: key || 'C Minor',
      duration: audioDuration,
      durationSeconds: 174,
      pricing: {
        mp3Lease: mp3Price,
        premiumLease: premiumPrice,
        unlimited: unlimitedPrice,
        exclusive: exclusivePrice,
      },
      freeDownload: allowFreeDownload,
      freeDownloadType: freeDownloadType === 'email_required' ? 'email_required' : 'tagged',
      genre: genre,
      subGenres: ['Dark Trap', 'Runway Trap'],
      moods: moods.split(',').map((m) => m.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      artworkUrl: artworkUrl,
      playCount: 0,
      downloadCount: 0,
      likeCount: 0,
      featured: featured,
      published: publishStatus === 'published',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      releaseDate: new Date().toISOString().split('T')[0],
      description: description,
      voiceTag: true,
      isNew: true,
    };

    onPublishBeat(finalBeat);
    localStorage.removeItem('voodoo_view_uploader_draft');
    onNavigateToBrowse();
  };

  const isDuplicateTitle = beats.some(
    (b) => b.title.trim().toLowerCase() === title.trim().toLowerCase()
  );

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?beat=${stableBeatId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-28 text-left animate-fadeIn">
      
      {/* Header — Luxury Wordmark & Navigation Header */}
      <div className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest font-mono">
            PRODUCER STUDIO WORKSPACE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Uploader Control Center
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Publish standard master instrumentals or multi-audio beat packs.
          </p>
        </div>

        {/* Top-Right Beat Packs Tab Shortcut */}
        <div className="bg-zinc-900 rounded-2xl p-1.5 flex border border-zinc-800 text-xs font-bold shrink-0 shadow-lg">
          <button 
            className="px-4 py-2 rounded-xl bg-purple-600 text-white shadow"
            title="Uploading standard single instrumental beat track"
          >
            SINGLE BEAT
          </button>
          <button 
            onClick={() => {
              if (onSwitchToBeatPacks) {
                onSwitchToBeatPacks();
              } else {
                window.location.href = '#beatpacks';
              }
            }}
            className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
            title="Transition to multi-beat packs workspace"
          >
            <span>BEAT PACKS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Draft Notification */}
      {detectedDraftPresent && (
        <div className="bg-purple-950/80 border border-purple-500/30 rounded-2xl px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-purple-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-purple-400 shrink-0" />
            <span>Unfinished standalone draft detected from your last session. Restore it to continue?</span>
          </div>
          <div className="flex items-center gap-3 font-bold font-mono shrink-0">
            <button onClick={restoreDraft} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors">
              Restore Draft
            </button>
            <button onClick={clearDraft} className="text-zinc-500 hover:text-zinc-300">
              Discard
            </button>
          </div>
        </div>
      )}

      {hasRestoredDraft && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Standalone workspace parameters restored successfully.</span>
        </div>
      )}

      {/* Progress Wizard */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-[11px] font-mono font-bold text-zinc-500 overflow-x-auto pb-1 gap-2">
          {stepTitles.map((t, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentStep(idx + 1)}
              className={`cursor-pointer px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap ${
                currentStep === idx + 1
                  ? 'text-white bg-purple-950 border-purple-500/50 font-extrabold'
                  : currentStep > idx + 1
                  ? 'text-purple-300 border-transparent bg-purple-950/10'
                  : 'text-zinc-600 border-transparent bg-transparent'
              }`}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="bg-gradient-to-r from-purple-600 to-fuchsia-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Studio Card Content */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* STEP 1: AUDIO MASTER */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-brand font-black text-lg uppercase tracking-wider">
                Upload Master Track
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Drag or browse your master uncompressed MP3 or M4A file. WAV is not supported.
              </p>
            </div>

            {audioError && (
              <div className="p-4 bg-rose-950/80 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-xs text-rose-300 animate-shake">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <p className="font-extrabold">FORMAT DENIED</p>
                  <p className="opacity-90">{audioError}</p>
                </div>
              </div>
            )}

            <div 
              className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
                isUploading || isProcessing
                  ? 'border-purple-500/50 bg-zinc-950/30 cursor-not-allowed'
                  : 'border-zinc-700/80 hover:border-purple-500/50 bg-zinc-950/60 cursor-pointer'
              }`}
            >
              <input
                type="file"
                id="viewMasterAudioInput"
                accept=".mp3,.m4a,audio/mpeg,audio/mp4,audio/x-m4a"
                className="hidden"
                disabled={isUploading || isProcessing}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleAudioFileSelection(e.target.files[0]);
                  }
                }}
              />

              <label htmlFor="viewMasterAudioInput" className="block cursor-pointer space-y-5">
                <div className="w-14 h-14 rounded-full bg-purple-950/50 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                  {isUploading || isProcessing ? (
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>

                <div className="space-y-1.5 max-w-md mx-auto">
                  <h4 className="font-bold text-white text-sm">
                    {isUploading
                      ? 'Uploading file to Master Server...'
                      : isProcessing
                      ? 'Compiling Audio Engine Waveform...'
                      : 'Drag & Drop Master File here'}
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Acceptable parameters: high-fidelity 320kbps MP3 or studio master M4A. Max file size 120MB.
                  </p>
                </div>

                {!isUploading && !isProcessing && (
                  <div className="inline-block px-4 py-2 bg-purple-950/60 text-purple-300 border border-purple-500/20 hover:bg-purple-900 text-xs font-bold rounded-xl transition-all">
                    Browse Local Files
                  </div>
                )}
              </label>

              {(isUploading || isProcessing) && (
                <div className="max-w-md mx-auto mt-6 space-y-3">
                  <div className="flex justify-between text-xs font-mono font-bold text-zinc-400">
                    <span>{isUploading ? 'UPLOADING MASTER' : processingStatus}</span>
                    <span>{isUploading ? `${uploadProgress}%` : `${processingProgress}%`}</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 h-full transition-all duration-150"
                      style={{ width: `${isUploading ? uploadProgress : processingProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {fileUploaded && !isUploading && !isProcessing && (
              <div className="p-4 bg-zinc-950/80 border border-zinc-850 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow">
                    <FileAudio className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white font-mono">{fileName}</div>
                    <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                      Size: {fileSize} · Duration: {audioDuration} · Formats: MP3 + M4A Validated
                    </div>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-[10px] uppercase font-mono tracking-widest">
                  <CheckCircle className="w-3.5 h-3.5" /> Ready
                </span>
              </div>
            )}

            {fileUploaded && !isUploading && !isProcessing && (
              <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-900 space-y-3">
                <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-wider block">
                  ENGINE MASTER COMPILED WAVEFORM PREVIEW
                </span>
                <div className="h-16 flex items-end gap-[2px] pt-4 overflow-hidden select-none">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const h = Math.abs(Math.sin(i * 0.15)) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-purple-800 to-purple-500 rounded-t-sm"
                        style={{ height: `${Math.max(10, h)}%` }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-zinc-500 pt-2 border-t border-zinc-900">
                  <span>DETECTED TEMPO: {detectedBpm} BPM</span>
                  <span>DETECTED SCALE: {detectedKey}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: COVER ARTWORK */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-brand font-black text-lg uppercase tracking-wider">
                Upload Cover Artwork
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Select from beautiful preset artwork or upload your custom square cover canvas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-950 rounded-3xl border border-zinc-900 space-y-4">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900">
                  <img src={artworkUrl} alt="Cover artwork" className="w-full h-full object-cover" />
                  {isUploadingArtwork && (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-white font-mono text-xs">
                      <RefreshCw className="w-6 h-6 animate-spin text-purple-400 mb-2" />
                      <span>Uploading...</span>
                    </div>
                  )}
                </div>
                <div className="w-full text-center space-y-1">
                  <p className="text-xs text-white font-bold truncate">
                    {customArtworkName || 'Default Preset'}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500">
                    {artworkDimensions}
                  </p>
                </div>
              </div>

              <div className="md:col-span-7 space-y-6">
                <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-900 space-y-4">
                  <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-wider block">
                    UPLOAD CUSTOM FILE
                  </span>
                  <input
                    type="file"
                    id="viewArtworkUploadInput"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleArtworkSelection(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="flex gap-3">
                    <label
                      htmlFor="viewArtworkUploadInput"
                      className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs text-center rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Upload Custom Image</span>
                    </label>
                    {customArtworkName && (
                      <button
                        onClick={() => {
                          setArtworkUrl('/src/assets/images/voodoo_cover_obsidian_1790419259195.jpg');
                          setCustomArtworkName('');
                          setArtworkDimensions('3000 × 3000 px');
                        }}
                        className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-rose-400 hover:text-rose-300 font-bold text-xs rounded-xl transition-all"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-wider block pl-1">
                    SELECT FROM HIGH FASHION PRESETS
                  </span>
                  <div className="grid grid-cols-3 gap-4">
                    {artworkPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setArtworkUrl(preset);
                          setCustomArtworkName('');
                          setArtworkDimensions('3000 × 3000 px');
                          setHasChanges(true);
                        }}
                        className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                          artworkUrl === preset && !customArtworkName
                            ? 'border-purple-500 scale-102 shadow-lg shadow-purple-950'
                            : 'border-zinc-800 opacity-60 hover:opacity-100 hover:scale-[1.01]'
                        }`}
                      >
                        <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                        {artworkUrl === preset && !customArtworkName && (
                          <div className="absolute top-2 right-2 p-1 bg-purple-600 text-white rounded-full">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ADVANCED DETAILS & METADATA */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-brand font-black text-lg uppercase tracking-wider">
                Beat Metadata & Info
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Establish search triggers and tempo parameters.
              </p>
            </div>

            {isDuplicateTitle && (
              <div className="p-4 bg-amber-950/80 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-xs text-amber-300">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="space-y-1">
                  <p className="font-extrabold">DUPLICATE TRACK TITLE</p>
                  <p className="opacity-90">
                    A beat named "{title}" already exists in your studio archives. Publishing this track will create a duplicate.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                  Beat Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl p-3 text-white font-bold outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                  BPM (Tempo)
                </label>
                <input
                  type="number"
                  value={bpm}
                  onChange={(e) => {
                    setBpm(parseInt(e.target.value) || 0);
                    setHasChanges(true);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl p-3 text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                  Scale Key
                </label>
                <select
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl p-3 text-white font-mono outline-none"
                >
                  {['F# Minor', 'C Minor', 'G Minor', 'D Minor', 'A# Minor', 'E Minor', 'A Major', 'G Major', 'C Major'].map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                  Primary Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => {
                    setGenre(e.target.value as GenreType);
                    setHasChanges(true);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl p-3 text-white font-mono outline-none"
                >
                  {['TRAP', 'DRILL', 'FREESTYLE TRAP', 'DARK SYNTH', 'HYPER TRAP', 'HARD TRAP'].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                  Moods (comma-separated)
                </label>
                <input
                  type="text"
                  value={moods}
                  onChange={(e) => {
                    setMoods(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl p-3 text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                  Search Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => {
                    setTags(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl p-3 text-white outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-2xl p-3.5 text-white outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PRICING & DOWNLOAD OPTIONS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-brand font-black text-lg uppercase tracking-wider">
                Leasing Options & Prices
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Define prices for standard and unlimited digital leases.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-2xl space-y-2">
                <span className="font-bold text-white uppercase tracking-wider text-[10px] block">MP3 Standard Lease</span>
                <input
                  type="number"
                  step="0.01"
                  value={mp3Price}
                  onChange={(e) => {
                    setMp3Price(parseFloat(e.target.value) || 0);
                    setHasChanges(true);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 font-mono text-purple-300 font-bold"
                />
                <p className="text-[10px] text-zinc-500">Unlocks standard tagged reference file + standard contract lease certificate.</p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-2xl space-y-2">
                <span className="font-bold text-white uppercase tracking-wider text-[10px] block">Premium M4A Lease</span>
                <input
                  type="number"
                  step="0.01"
                  value={premiumPrice}
                  onChange={(e) => {
                    setPremiumPrice(parseFloat(e.target.value) || 0);
                    setHasChanges(true);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 font-mono text-purple-300 font-bold"
                />
                <p className="text-[10px] text-zinc-500">Unlocks lossless M4A master format file for studio recording sessions.</p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-2xl space-y-2">
                <span className="font-bold text-white uppercase tracking-wider text-[10px] block">Unlimited Lease</span>
                <input
                  type="number"
                  step="0.01"
                  value={unlimitedPrice}
                  onChange={(e) => {
                    setUnlimitedPrice(parseFloat(e.target.value) || 0);
                    setHasChanges(true);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 font-mono text-purple-300 font-bold"
                />
                <p className="text-[10px] text-zinc-500">Uncapped broadcasting, streaming, performance permissions with high-end contract terms.</p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-2xl space-y-2">
                <span className="font-bold text-rose-300 uppercase tracking-wider text-[10px] block">Exclusive buyout</span>
                <input
                  type="number"
                  step="0.01"
                  value={exclusivePrice}
                  onChange={(e) => {
                    setExclusivePrice(parseFloat(e.target.value) || 0);
                    setHasChanges(true);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 font-mono text-purple-300 font-bold"
                />
                <p className="text-[10px] text-zinc-500">Full ownership acquisition, removal from store catalog, high-definition WAV stems.</p>
              </div>
            </div>

            <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-white">Enable Free Downloads</h4>
                  <p className="text-[11px] text-zinc-500">Let artists download tagged reference copies to test their vocals.</p>
                </div>
                <input
                  type="checkbox"
                  checked={allowFreeDownload}
                  onChange={(e) => {
                    setAllowFreeDownload(e.target.checked);
                    setHasChanges(true);
                  }}
                  className="w-10 h-5 bg-zinc-900 border border-zinc-800 rounded-full accent-purple-600 cursor-pointer"
                />
              </div>

              {allowFreeDownload && (
                <div className="pt-3.5 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setFreeDownloadType('email_required');
                      setHasChanges(true);
                    }}
                    className={`p-4 rounded-xl border text-left space-y-1 transition-all ${
                      freeDownloadType === 'email_required'
                        ? 'bg-purple-950/20 border-purple-500/40 text-purple-300'
                        : 'bg-zinc-900/40 border-zinc-850 text-zinc-400'
                    }`}
                  >
                    <div className="font-extrabold text-xs uppercase tracking-wider text-white">Require Artist Email Lead</div>
                    <p className="text-[10px] text-zinc-500">Collect verified emails from download checkout flows.</p>
                  </button>
                  <button
                    onClick={() => {
                      setFreeDownloadType('no_lead');
                      setHasChanges(true);
                    }}
                    className={`p-4 rounded-xl border text-left space-y-1 transition-all ${
                      freeDownloadType === 'no_lead'
                        ? 'bg-purple-950/20 border-purple-500/40 text-purple-300'
                        : 'bg-zinc-900/40 border-zinc-850 text-zinc-400'
                    }`}
                  >
                    <div className="font-extrabold text-xs uppercase tracking-wider text-white">Direct Open Download</div>
                    <p className="text-[10px] text-zinc-500">Allows instant tagged file download without any forms.</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: CUSTOMER ACCESS & VISIBILITY */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-brand font-black text-lg uppercase tracking-wider">
                Listing Visibility & Deep Link
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Configure listing discoverability parameters and copy stable product URLs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-7 space-y-4">
                {[
                  {
                    id: 'published',
                    title: 'PUBLISHED STOREFRONT',
                    desc: 'Fully discovery-indexed. Will render on public Home page, Beats browse page, and search queries.',
                    color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/10'
                  },
                  {
                    id: 'draft',
                    title: 'PRIVATE DRAFT',
                    desc: 'Omitted from normal store indexing. Access is limited to your private studio workspace catalog.',
                    color: 'border-amber-500/30 text-amber-400 bg-amber-950/10'
                  },
                  {
                    id: 'hidden',
                    title: 'HIDDEN UNLISTED (BY DIRECT PRODUCT URL ONLY)',
                    desc: 'Omitted from storefront indexing. Accessible exclusively to clients possessing direct URLs.',
                    color: 'border-blue-500/30 text-blue-400 bg-blue-950/10'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setVisibility(item.id as any);
                      setHasChanges(true);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left flex gap-4 transition-all ${
                      visibility === item.id
                        ? `${item.color} ring-1 ring-purple-500/40 shadow-lg`
                        : 'bg-zinc-950 border-zinc-900 text-zinc-400'
                    }`}
                  >
                    <div className="mt-1 shrink-0">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        visibility === item.id ? 'border-purple-400 bg-purple-500' : 'border-zinc-700 bg-transparent'
                      }`}>
                        {visibility === item.id && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                      </div>
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <div className="font-extrabold text-xs uppercase tracking-wider text-white">
                        {item.title}
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="md:col-span-5 p-5 bg-zinc-950 rounded-2xl border border-zinc-900 text-left space-y-4">
                <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider block">
                  STABLE PRODUCT DEEP-LINK
                </span>
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-850 space-y-2">
                  <p className="text-[10px] font-mono text-zinc-500 break-all select-all font-bold">
                    {window.location.origin}/?beat={stableBeatId}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1.5 shadow"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                    <a
                      href={`/?beat=${stableBeatId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                  This product link remains active and mapped to this digital track asset ID. Deep linking directs clients directly to the checkout licensing modal on click.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: STORE PRESENTATION & LIVE PREVIEW */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-brand font-black text-lg uppercase tracking-wider">
                Storefront Layout Spotlight
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Customize physical spotlight assignment on major page sections.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-6 space-y-5 text-left text-xs">
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Spotlight Featured Carousel</h4>
                    <p className="text-[10px] text-zinc-500">Assign this beat to the hero showcase slider on the Home view.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => {
                      setFeatured(e.target.checked);
                      setHasChanges(true);
                    }}
                    className="w-10 h-5 bg-zinc-900 border border-zinc-800 rounded-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-3">
                  <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                    Store Category Assignment
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setHasChanges(true);
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none"
                  >
                    <option value="Studio Vault">Studio Vault (All Catalog)</option>
                    <option value="Runway Showcases">Runway Showcases (Elite trap)</option>
                    <option value="Dark Archives">Dark Archives (Aggressive 808s)</option>
                  </select>
                </div>

                <div className="p-4 bg-zinc-950 border border-zinc-900/60 rounded-2xl space-y-2">
                  <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-wider block">
                    STORE METRIC CHECKS
                  </span>
                  <ul className="space-y-1.5 text-[10px] text-zinc-400 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 font-bold" />
                      <span>Track transients and wave peaks normalized.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 font-bold" />
                      <span>Licensing contracts ready for deployment on buy checkouts.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="md:col-span-6 flex flex-col items-center">
                <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-wider block mb-3 text-left w-full pl-2">
                  STORE CARD EMULATION
                </span>
                
                <div className="bg-zinc-950 border border-zinc-850 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-xl hover:border-purple-500/20 transition-all group">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-zinc-800">
                    <img src={artworkUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button
                      onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg">
                        {isPlayingPreview ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                      </div>
                    </button>
                    {featured && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-purple-600 text-white font-extrabold text-[9px] uppercase tracking-widest rounded-lg shadow">
                        SPOTLIGHT
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-left">
                    <h4 className="font-extrabold text-base text-white truncate uppercase tracking-wider">
                      {title || 'UNTITLED'}
                    </h4>
                    <p className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
                      {bpm} BPM · {key} · PROD. CASHMERE KID$
                    </p>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">
                      {description || 'No custom description provided.'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-zinc-900">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">Starting at</span>
                      <span className="text-sm font-mono font-black text-white">{currencySymbol}{mp3Price.toFixed(2)}</span>
                    </div>
                    <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-white font-extrabold text-[10px] uppercase rounded-xl">
                      ADD TO CART
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: REVIEW & PUBLISH */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-brand font-black text-lg uppercase tracking-wider">
                Review Studio Details & Publish
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Final comprehensive metadata review.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left text-xs">
              <div className="md:col-span-8 p-6 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-6">
                <div className="flex items-center gap-4 border-b border-zinc-900 pb-5">
                  <img src={artworkUrl} alt={title} className="w-16 h-16 rounded-xl object-cover border border-zinc-850" />
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-wider font-mono">
                      {title}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1">
                      Category: {category} · Key: {key} · Tempo: {bpm} BPM · Genre: {genre}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Standard Lease</span>
                    <span className="text-sm font-bold text-white font-mono">{currencySymbol}{mp3Price.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Premium Lease</span>
                    <span className="text-sm font-bold text-white font-mono">{currencySymbol}{premiumPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Unlimited Lease</span>
                    <span className="text-sm font-bold text-white font-mono">{currencySymbol}{unlimitedPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Exclusive buyout</span>
                    <span className="text-sm font-bold text-rose-300 font-mono">{currencySymbol}{exclusivePrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Free promo downloads</span>
                    <span className="text-xs font-bold text-white font-mono">
                      {allowFreeDownload ? `Enabled (${freeDownloadType === 'email_required' ? 'Requires Email lead' : 'Open Access'})` : 'Disabled'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Discoverability Visibility</span>
                    <span className="text-xs font-bold text-white font-mono uppercase">{visibility}</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-zinc-900 pt-5">
                  <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">Keywords Search Tags</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-zinc-900 text-zinc-400 border border-zinc-850 rounded-lg text-[10px] font-mono uppercase tracking-wide">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 space-y-6">
                <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-3.5">
                  <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-wider block">
                    SECURITY COMPLIANCES
                  </span>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    By publishing, you establish direct copyright references and activate real Smart Button PayPal payout capabilities.
                  </p>
                  <div className="space-y-2 text-[10px] text-zinc-400 font-semibold">
                    <label className="flex items-start gap-2.5 cursor-pointer leading-relaxed">
                      <input type="checkbox" defaultChecked className="mt-0.5 rounded bg-zinc-900 border-zinc-800 text-purple-600" />
                      <span>Arrangement comprises original master elements only.</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handlePublish('published')}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-950 transition-transform active:scale-98"
                  >
                    PUBLISH TO STOREFRONT
                  </button>
                  <button
                    onClick={() => handlePublish('draft')}
                    className="w-full py-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-colors"
                  >
                    SAVE AS DRAFT ONLY
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-zinc-800 flex justify-between items-center text-xs font-bold">
        {currentStep > 1 ? (
          <button
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : <div />}

        <span className="text-[11px] font-mono font-bold text-zinc-500 hidden sm:block">
          STEP {currentStep} OF 7 ({stepTitles[currentStep - 1]})
        </span>

        {currentStep < 7 ? (
          <button
            onClick={() => {
              if (currentStep === 1 && !fileUploaded) {
                alert('Please select and process a valid audio master track before proceeding.');
                return;
              }
              setCurrentStep((prev) => prev + 1);
            }}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl flex items-center gap-1.5 transition-colors shadow"
          >
            <span>Continue Step {currentStep + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => handlePublish(visibility)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center gap-1.5 transition-colors shadow uppercase"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Finalize & Publish</span>
          </button>
        )}
      </div>

    </div>
  );
};
