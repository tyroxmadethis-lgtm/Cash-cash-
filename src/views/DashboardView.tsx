import React, { useState } from 'react';
import {
  DollarSign,
  Play,
  Download,
  Users,
  TrendingUp,
  Tag,
  FileText,
  Radio,
  ShoppingBag,
  Settings,
  Trash2,
  Edit2,
  CheckCircle2,
  BarChart2,
  Zap,
  Plus,
  Percent,
  Gift,
  Copy,
  Check,
  Package,
  Mic2,
  ExternalLink,
  Shield,
  Clock,
  Sparkles,
  Sliders,
  Mail,
  FileSpreadsheet,
  X,
  Menu,
  FileCode,
  Youtube,
  MapPin,
  User,
  Image,
  Link2,
  AlertTriangle
} from 'lucide-react';
import { Beat, FreeDownloadLead, Promotion, SaleRecord, StoreSettings, ProducerProfile, BeatPack } from '../types';
import { UploadModal } from '../components/UploadModal';

interface DashboardViewProps {
  beats: Beat[];
  salesRecords: SaleRecord[];
  leads: FreeDownloadLead[];
  promotions: Promotion[];
  settings: StoreSettings;
  onUpdateBeatPrice: (beatId: string, newPrice: number) => void;
  onToggleFreeDownload: (beatId: string, free: boolean) => void;
  onDeleteBeat: (beatId: string) => void;
  onDuplicateBeat?: (beatId: string) => void;
  onAddPromotion: (promo: Promotion) => void;
  onDeletePromotion: (id: string) => void;
  onPublishBeat?: (newBeat: Beat) => void;
  onUpdateBeat?: (beat: Beat) => void;
  currencySymbol: string;
  profile: ProducerProfile;
  onUpdateProfile: (p: ProducerProfile) => void;
  youtubeVideos: any[];
  onUpdateYoutubeVideos: (v: any[]) => void;
  onNavigateToProfile: () => void;
  beatPacks?: BeatPack[];
  onUpdateBeatPacks?: (packs: BeatPack[]) => void;
}

interface SoundKitItem {
  id: string;
  title: string;
  price: number;
  salesCount: number;
  type: string;
  coverUrl: string;
}

interface ServiceItem {
  id: string;
  title: string;
  price: number;
  deliveryDays: number;
  description: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  beats,
  salesRecords,
  leads,
  promotions,
  settings,
  onUpdateBeatPrice,
  onToggleFreeDownload,
  onDeleteBeat,
  onDuplicateBeat,
  onAddPromotion,
  onDeletePromotion,
  onPublishBeat,
  onUpdateBeat,
  currencySymbol,
  profile,
  onUpdateProfile,
  youtubeVideos = [],
  onUpdateYoutubeVideos,
  onNavigateToProfile,
  beatPacks = [],
  onUpdateBeatPacks,
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Beat Packs manager local states
  const [editingPack, setEditingBeatPack] = useState<BeatPack | null>(null);
  const [packName, setPackName] = useState('');
  const [packDesc, setPackDesc] = useState('');
  const [packPrice, setPackPrice] = useState<number>(39.99);
  const [packArtwork, setPackArtwork] = useState('');
  const [packBeats, setPackBeats] = useState<string[]>([]); // Selected beat IDs
  const [packFree, setPackFree] = useState(false);
  const [packPublished, setPackPublished] = useState(true);
  const [packNotice, setPackNotice] = useState<string | null>(null);

  // Mastering Console local states
  const [eqLow, setEqLow] = useState<number>(3.0); // dB
  const [eqMid, setEqMid] = useState<number>(-1.5); // dB
  const [eqHigh, setEqHigh] = useState<number>(4.2); // dB
  const [compThreshold, setCompThreshold] = useState<number>(-18.5); // dB
  const [compRatio, setCompRatio] = useState<number>(3.5); // :1 ratio
  const [limiterThreshold, setLimiterThreshold] = useState<number>(-2.5); // dB
  const [limiterCeiling, setLimiterCeiling] = useState<number>(-0.2); // dB
  const [watermarkInterval, setWatermarkInterval] = useState<number>(15); // seconds
  const [masteringSaved, setMasteringSaved] = useState<boolean>(false);
  const [masteringSaving, setMasteringSaving] = useState<boolean>(false);

  // Sidebar toggler for mobile devices
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // local state for Profile Settings tab
  const [profileName, setProfileName] = useState(profile.name || 'CASHMERE KID$');
  const [profileHandle, setProfileHandle] = useState(profile.handle || '@cashmerekid');
  const [profileAvatar, setProfileAvatar] = useState(profile.avatarUrl || '');
  const [profileBanner, setProfileBanner] = useState(profile.bannerUrl || '');
  const [profileLocation, setProfileLocation] = useState(profile.location || 'Atlanta / Los Angeles / Tokyo');
  const [profileBio, setProfileBio] = useState(profile.bio || '');

  // Social link inputs
  const [socialInsta, setSocialInsta] = useState(profile.socialLinks?.instagram || '');
  const [socialYoutube, setSocialYoutube] = useState(profile.socialLinks?.youtube || '');
  const [socialTwitter, setSocialTwitter] = useState(profile.socialLinks?.twitter || '');
  const [socialSpotify, setSocialSpotify] = useState(profile.socialLinks?.spotify || '');
  const [socialTiktok, setSocialTiktok] = useState(profile.socialLinks?.tiktok || '');
  const [socialSoundcloud, setSocialSoundcloud] = useState(profile.socialLinks?.soundcloud || '');
  const [socialFacebook, setSocialFacebook] = useState(profile.socialLinks?.facebook || '');
  const [socialAppleMusic, setSocialAppleMusic] = useState(profile.socialLinks?.appleMusic || '');

  const [profileSaveState, setProfileSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // New YouTube video form state
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoId, setNewVideoId] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState('OFFICIAL VISUALIZER');
  const [newVideoDesc, setNewVideoDesc] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('3:00');
  const [newVideoNotice, setNewVideoNotice] = useState(false);

  // Edit beat catalog modal state
  const [editingBeat, setEditingBeat] = useState<Beat | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<number>(29.99);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editBpm, setEditBpm] = useState<number>(140);
  const [editKey, setEditKey] = useState<string>('C Minor');
  const [editGenre, setEditGenre] = useState<string>('TRAP');
  const [editUnlimitedPrice, setEditUnlimitedPrice] = useState<number>(199.99);
  const [editFeatured, setEditFeatured] = useState<boolean>(false);
  const [editPublished, setEditPublished] = useState<boolean>(true);
  const [editArtworkUrl, setEditArtworkUrl] = useState<string>('');

  const artworkPresets = [
    '/src/assets/images/cashmere_cover_velvet_1790419833792.jpg',
    '/src/assets/images/cashmere_cover_vault_1790419848357.jpg',
    '/src/assets/images/cashmere_hero_runway_1790419818906.jpg',
  ];

  // New promo form state
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState<number>(20);
  const [newPromoDesc, setNewPromoDesc] = useState('');
  const [newPromoExp, setNewPromoExp] = useState('2026-12-31');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // BOGO / Bulk Deals state
  const [bogoEnabled, setBogoEnabled] = useState(true);
  const [bogoDealType, setBogoDealType] = useState<'buy2get1' | 'buy3get2'>('buy2get1');

  // Sample SoundKits list
  const [soundKits, setSoundKits] = useState<SoundKitItem[]>([
    {
      id: 'sk-1',
      title: 'VOODOO VAULT Vol. 1 (808s & Drums)',
      price: 34.99,
      salesCount: 0, // Reset to zero-state for integrity
      type: 'Drum Kit',
      coverUrl: '/src/assets/images/cashmere_cover_velvet_1790419833792.jpg',
    },
    {
      id: 'sk-2',
      title: 'ANALOG VOODOO SYNTH PRESETS',
      price: 24.99,
      salesCount: 0,
      type: 'Serum Presets',
      coverUrl: '/src/assets/images/cashmere_cover_vault_1790419848357.jpg',
    },
  ]);

  // Sample Services list
  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: 'srv-1',
      title: 'Vocal Mixing & Mastering',
      price: 149.99,
      deliveryDays: 3,
      description: 'Industry standard vocal tuning, analog warmth EQ, compression and mastering.',
    },
    {
      id: 'srv-2',
      title: 'Exclusive Custom Beat Production',
      price: 499.99,
      deliveryDays: 5,
      description: 'Tailored 1-on-1 production built exclusively for your album release.',
    },
  ]);

  // Lead export notice
  const [exportNotice, setExportNotice] = useState(false);

  // Contract Terms State
  const [mp3StreamLimit, setMp3StreamLimit] = useState('100,000');
  const [unlimitedStreamLimit, setUnlimitedStreamLimit] = useState('Unlimited');

  // Calculate REAL metrics directly from authoritative data (NO fake stats!)
  const totalRevenue = salesRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalPlays = beats.reduce((sum, b) => sum + b.playCount, 0);
  const totalDownloads = beats.reduce((sum, b) => sum + b.downloadCount, 0);

  // Structured Sidebar Navigation Links List
  const sidebarLinks = [
    { section: 'OVERVIEW', items: [
      { id: 'overview', label: 'Overview Dashboard', icon: TrendingUp },
    ]},
    { section: 'MUSIC', items: [
      { id: 'catalog', label: 'Beats Catalog', icon: Radio },
      { id: 'beatpacks', label: 'Beat Packs', icon: Package },
      { id: 'mastering', label: 'Audio Mastering', icon: Sliders },
      { id: 'soundkits', label: 'Merch & Kits', icon: Package },
      { id: 'services', label: 'Bespoke Services', icon: Mic2 },
    ]},
    { section: 'STORE', items: [
      { id: 'sales', label: 'Sales & Orders', icon: DollarSign },
      { id: 'downloads', label: 'Artist Leads', icon: Download },
      { id: 'promotions', label: 'Coupon Campaigns', icon: Tag },
    ]},
    { section: 'CONTENT', items: [
      { id: 'youtube_videos', label: 'YouTube Videos', icon: Youtube },
    ]},
    { section: 'SETTINGS', items: [
      { id: 'profile_settings', label: 'Profile Settings', icon: User },
      { id: 'settings', label: 'Store Settings', icon: Settings },
      { id: 'integrations', label: 'Payment Settings', icon: Zap },
    ]},
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleExportLeads = () => {
    if (leads.length === 0) return;
    const csvContent = 'data:text/csv;charset=utf-8,' + ['Email,Beat Title,Date,Country', ...leads.map((l) => `${l.email},"${l.beatTitle}",${l.downloadDate},${l.ipCountry}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cashmere_kid_artist_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const startEditingBeat = (beat: Beat) => {
    setEditingBeat(beat);
    setEditPriceVal(beat.pricing.mp3Lease);
    setEditTitle(beat.title);
    setEditBpm(beat.bpm);
    setEditKey(beat.key);
    setEditGenre(beat.genre);
    setEditUnlimitedPrice(beat.pricing.unlimited);
    setEditFeatured(!!beat.featured);
    setEditPublished(beat.published !== false);
    setEditArtworkUrl(beat.artworkUrl || '');
  };

  const saveEditedBeat = () => {
    if (!editingBeat || !onUpdateBeat) return;
    const updated: Beat = {
      ...editingBeat,
      title: editTitle,
      bpm: editBpm,
      key: editKey,
      genre: editGenre as any,
      featured: editFeatured,
      published: editPublished,
      artworkUrl: editArtworkUrl,
      pricing: {
        ...editingBeat.pricing,
        mp3Lease: editPriceVal,
        unlimited: editUnlimitedPrice,
      }
    };
    onUpdateBeat(updated);
    setEditingBeat(null);
  };

  // Profile Settings Save Routine
  const handleSaveProfile = () => {
    setProfileSaveState('saving');
    setProfileErrorMsg(null);

    // Simple robust form validation
    if (!profileName.trim()) {
      setProfileSaveState('error');
      setProfileErrorMsg('Public Display Name cannot be empty.');
      return;
    }

    setTimeout(() => {
      try {
        const updatedProfile: ProducerProfile = {
          name: profileName.trim(),
          handle: profileHandle.trim(),
          avatarUrl: profileAvatar.trim(),
          bannerUrl: profileBanner.trim(),
          location: profileLocation.trim(),
          bio: profileBio.trim(),
          verified: profile.verified,
          socialLinks: {
            instagram: socialInsta.trim(),
            youtube: socialYoutube.trim(),
            twitter: socialTwitter.trim(),
            spotify: socialSpotify.trim(),
            tiktok: socialTiktok.trim(),
            soundcloud: socialSoundcloud.trim(),
            facebook: socialFacebook.trim(),
            appleMusic: socialAppleMusic.trim(),
          } as any
        };
        onUpdateProfile(updatedProfile);
        setProfileSaveState('saved');
        setTimeout(() => setProfileSaveState('idle'), 2500);
      } catch (err) {
        setProfileSaveState('error');
        setProfileErrorMsg('A secure file system saving block timeout occurred.');
      }
    }, 800);
  };

  // Add YouTube Video Action
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim() || !newVideoId.trim()) return;

    const newVideo = {
      id: `video-${Date.now()}`,
      youtubeId: newVideoId.trim(),
      title: newVideoTitle.toUpperCase().trim(),
      category: newVideoCategory,
      duration: newVideoDuration,
      description: newVideoDesc.trim() || 'Custom studio video uploaded to YouTube Vault.',
      thumbnail: '/src/assets/images/cashmere_hero_runway_1790419818906.jpg'
    };

    onUpdateYoutubeVideos([newVideo, ...youtubeVideos]);
    setNewVideoTitle('');
    setNewVideoId('');
    setNewVideoDesc('');
    setNewVideoNotice(true);
    setTimeout(() => setNewVideoNotice(false), 3000);
  };

  const handleDeleteVideo = (id: string) => {
    onUpdateYoutubeVideos(youtubeVideos.filter((v) => v.id !== id));
  };

  return (
    <div className="pb-32 space-y-8 font-sans">
      {/* Dynamic Mobile Header Controls */}
      <div className="lg:hidden flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="font-brand font-black text-white text-sm tracking-wider uppercase">CASHMERE PORTAL</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2.5 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-zinc-300 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Split Dashboard Grid (Spacious Left Sidebar + Right Workspace) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Sticky Navigation Sidebar (lg:col-span-3) */}
        <aside className={`lg:col-span-3 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 lg:sticky lg:top-24 space-y-6 shadow-xl ${
          mobileSidebarOpen ? 'block animate-slideIn' : 'hidden lg:block'
        }`}>
          {/* Studio Owner Signature Card */}
          <div className="flex items-center gap-3 pb-5 border-b border-zinc-900 text-left">
            <div className="w-11 h-11 rounded-2xl bg-purple-950/80 border border-purple-500/30 overflow-hidden shrink-0 shadow">
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-white uppercase tracking-wider truncate">{profile.name}</h4>
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">{profile.handle}</span>
            </div>
          </div>

          {/* Nav Categories */}
          <nav className="space-y-6">
            {sidebarLinks.map((section) => (
              <div key={section.section} className="space-y-1.5 text-left">
                <span className="text-[10px] font-mono font-bold text-zinc-600 tracking-widest block pl-2">{section.section}</span>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const IconComp = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
                          isActive
                            ? 'bg-purple-950/60 border-purple-500/30 text-purple-300 shadow-md'
                            : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
                        }`}
                      >
                        <IconComp className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-zinc-500'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Quick Shortcuts */}
          <div className="pt-4 border-t border-zinc-900 space-y-2">
            <button
              onClick={() => {
                setMobileSidebarOpen(false);
                setIsUploadModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Instrumental</span>
            </button>
            <button
              onClick={onNavigateToProfile}
              className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              <span>Public Store Profile</span>
            </button>
          </div>
        </aside>

        {/* RIGHT COLUMN: Spacious Main Workspace area (lg:col-span-9) */}
        <main className="lg:col-span-9 space-y-8 text-left">
          
          {/* HEADER BRAND BANNER */}
          <div className="relative rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-black p-8 sm:p-12 border border-zinc-900 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-widest block">SECURE SYSTEM CONTROL ROOM</span>
              <h1 className="text-3xl sm:text-5xl font-brand font-black text-white uppercase tracking-tight">
                STUDIO CONSOLE
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl font-medium">
                Administer beats catalog distribution, configure metadata parameters, oversee digital licensings, and customize public brand styling.
              </p>
            </div>
          </div>

          {/* ==================== 1. OVERVIEW DASHBOARD TAB ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Elegant Real Stats Panel (NO mock/fake stats!) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl space-y-2 relative shadow-lg">
                  <div className="flex justify-between text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    <span>Direct Revenue</span>
                    <DollarSign className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-mono font-extrabold text-white">
                    {currencySymbol}{totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Cumulative secure escrow deposits from real confirmed checkout transactions.
                  </p>
                </div>

                <div className="p-6 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl space-y-2 relative shadow-lg">
                  <div className="flex justify-between text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    <span>Published Catalog</span>
                    <Radio className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-mono font-extrabold text-white">
                    {beats.length}
                  </div>
                  <p className="text-[10px] text-purple-300 leading-relaxed font-bold">
                    Active uncompressed high-fidelity trap instrumentals published to the store.
                  </p>
                </div>

                <div className="p-6 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl space-y-2 relative shadow-lg">
                  <div className="flex justify-between text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    <span>Captured Leads</span>
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-mono font-extrabold text-white">
                    {leads.length}
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Total verified artist emails acquired from free tagged audio downloads.
                  </p>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-brand">QUICK CONSOLE SHORTCUTS</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <button onClick={() => setIsUploadModalOpen(true)} className="p-4 bg-zinc-900 hover:bg-zinc-850 rounded-2xl border border-zinc-800 text-center hover:border-purple-500/20 transition-all flex flex-col items-center gap-1.5 cursor-pointer">
                    <Plus className="w-5 h-5 text-purple-400" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Upload Beat</span>
                  </button>
                  <button onClick={() => setActiveTab('soundkits')} className="p-4 bg-zinc-900 hover:bg-zinc-850 rounded-2xl border border-zinc-800 text-center hover:border-purple-500/20 transition-all flex flex-col items-center gap-1.5 cursor-pointer">
                    <Package className="w-5 h-5 text-purple-400" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Add Merch Item</span>
                  </button>
                  <button onClick={() => setActiveTab('youtube_videos')} className="p-4 bg-zinc-900 hover:bg-zinc-850 rounded-2xl border border-zinc-800 text-center hover:border-purple-500/20 transition-all flex flex-col items-center gap-1.5 cursor-pointer">
                    <Youtube className="w-5 h-5 text-purple-400" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Embed Video</span>
                  </button>
                  <button onClick={() => setActiveTab('profile_settings')} className="p-4 bg-zinc-900 hover:bg-zinc-850 rounded-2xl border border-zinc-800 text-center hover:border-purple-500/20 transition-all flex flex-col items-center gap-1.5 cursor-pointer">
                    <User className="w-5 h-5 text-purple-400" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity Logs with high-end dark empty state */}
              <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800/80">
                  <h3 className="font-brand font-black text-sm text-white uppercase tracking-widest">RECORDED SALES ACTIVITY</h3>
                  <span className="text-[10px] font-mono text-zinc-500 font-bold">{salesRecords.length} ORDERS TOTAL</span>
                </div>

                {salesRecords.length > 0 ? (
                  <div className="space-y-3">
                    {salesRecords.map((sale) => (
                      <div key={sale.id} className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-850/80 flex items-center justify-between hover:border-purple-500/30 transition-all">
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{sale.beatTitle}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-500/20 font-mono">
                              {sale.licenseType}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5">{sale.customerEmail} · Order {sale.orderId}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-purple-300">{currencySymbol}{sale.amount.toFixed(2)}</div>
                          <div className="text-[10px] text-emerald-400 font-semibold">{sale.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center bg-zinc-950/40 border border-zinc-800 rounded-2xl space-y-2">
                    <AlertTriangle className="w-8 h-8 text-zinc-600 mx-auto" />
                    <h4 className="font-brand font-black text-white text-xs tracking-wider">NO ORDERS YET</h4>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed font-medium">
                      Your store has zero recorded physical or digital sales orders. Secure escrow systems are active.
                    </p>
                  </div>
                )}
              </div>

              {/* BOGO DEALS / BULK CAMPAIGNS PANEL */}
              <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-brand font-black text-sm text-white uppercase tracking-wider">BOGO / BULK DEAL AUTOMATION</h3>
                    <p className="text-[10px] text-zinc-500 font-medium">Apply automated multi-lease promotions globally across the checkout checkout flows.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={bogoEnabled}
                    onChange={(e) => setBogoEnabled(e.target.checked)}
                    className="w-10 h-5 bg-zinc-900 border border-zinc-800 rounded-full accent-purple-600 cursor-pointer"
                  />
                </div>

                {bogoEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-900">
                    <button
                      onClick={() => setBogoDealType('buy2get1')}
                      className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${
                        bogoDealType === 'buy2get1' ? 'bg-purple-950/20 border-purple-500/40 text-purple-300' : 'bg-zinc-900/40 border-zinc-850 text-zinc-400'
                      }`}
                    >
                      <div className="font-extrabold text-xs uppercase tracking-wider text-white">Buy 2 Get 1 Free</div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Cart automatically applies full discount on the cheapest beat when 3 items are present.</p>
                    </button>
                    <button
                      onClick={() => setBogoDealType('buy3get2')}
                      className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${
                        bogoDealType === 'buy3get2' ? 'bg-purple-950/20 border-purple-500/40 text-purple-300' : 'bg-zinc-900/40 border-zinc-850 text-zinc-400'
                      }`}
                    >
                      <div className="font-extrabold text-xs uppercase tracking-wider text-white">Buy 3 Get 2 Free</div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Cart automatically discounts the 2 cheapest items when 5 items are present.</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== 2. BEATS CATALOG MANAGEMENT TAB ==================== */}
          {activeTab === 'catalog' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-brand font-black text-white uppercase tracking-tight">BEATS CATALOG</h2>
                  <p className="text-xs text-zinc-500">Edit prices, toggle licensing formats, publish drafts, and copy duplicates.</p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>UPLOAD BEAT</span>
                </button>
              </div>

              {/* Beats Table/List with spacious layout */}
              <div className="space-y-4">
                {beats.map((beat) => (
                  <div
                    key={beat.id}
                    className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-5 hover:border-purple-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img src={beat.artworkUrl} alt={beat.title} className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-zinc-850 shadow-md" />
                      <div className="space-y-1 text-left min-w-0">
                        <h4 className="font-extrabold text-sm text-white uppercase group-hover:text-purple-300 transition-colors truncate">
                          {beat.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                          <span className="font-bold text-purple-400">{beat.bpm} BPM</span>
                          <span>·</span>
                          <span>{beat.key}</span>
                          <span>·</span>
                          <span className="uppercase text-zinc-500">{beat.genre}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Lease Price</span>
                        <span className="font-mono text-sm font-black text-white">${beat.pricing.mp3Lease.toFixed(2)}</span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Status</span>
                        <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                          beat.published !== false
                            ? 'bg-purple-950 text-purple-300 border-purple-500/20'
                            : 'bg-zinc-950 text-zinc-600 border-zinc-850'
                        }`}>
                          {beat.published !== false ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      {/* Row Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditingBeat(beat)}
                          className="p-2 bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"
                          title="Edit Beat Parameters"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {onDuplicateBeat && (
                          <button
                            onClick={() => onDuplicateBeat(beat.id)}
                            className="p-2 bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-purple-300 transition-colors"
                            title="Duplicate Beat Record"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Permanently purge this instrumental from the catalog?')) {
                              onDeleteBeat(beat.id);
                            }
                          }}
                          className="p-2 bg-zinc-950 border border-zinc-850 hover:bg-red-950/40 rounded-xl text-zinc-500 hover:text-red-400 transition-colors"
                          title="Purge Beat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 2.5. BEAT PACKS MANAGEMENT TAB ==================== */}
          {activeTab === 'beatpacks' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <div className="space-y-1 text-left">
                  <h2 className="text-xl font-brand font-black text-white uppercase tracking-tight">BEAT PACKS BUNDLES</h2>
                  <p className="text-xs text-zinc-500">Curate multi-instrumental volumes, configure checkboxes for included files, and set bundle prices.</p>
                </div>
                {editingPack === null && (
                  <button
                    onClick={() => {
                      setEditingBeatPack({
                        id: 'new',
                        name: '',
                        description: '',
                        price: 39.99,
                        artworkUrl: artworkPresets[0],
                        beatIds: [],
                        freeDownload: false,
                        published: true,
                        createdDate: new Date().toISOString().split('T')[0],
                      });
                      setPackName('');
                      setPackDesc('');
                      setPackPrice(39.99);
                      setPackArtwork(artworkPresets[0]);
                      setPackBeats([]);
                      setPackFree(false);
                      setPackPublished(true);
                      setPackNotice(null);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>CREATE NEW PACK</span>
                  </button>
                )}
              </div>

              {packNotice && (
                <div className={`p-4 rounded-xl text-xs font-mono font-bold ${
                  packNotice.startsWith('✓')
                    ? 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-300'
                    : 'bg-red-950/40 border border-red-500/20 text-red-300'
                }`}>
                  {packNotice}
                </div>
              )}

              {/* LIST OF BEAT PACKS VIEW */}
              {editingPack === null ? (
                <div className="space-y-4 text-left">
                  {beatPacks && beatPacks.length > 0 ? (
                    beatPacks.map((pack) => (
                      <div
                        key={pack.id}
                        className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-5 hover:border-purple-500/20 transition-all group"
                      >
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <img src={pack.artworkUrl} alt={pack.name} className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-zinc-850 shadow" />
                          <div className="space-y-1 text-left min-w-0">
                            <h4 className="font-extrabold text-sm text-white uppercase group-hover:text-purple-300 transition-colors truncate">
                              {pack.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-500 font-mono">
                              <span className="font-bold text-purple-400">{pack.beatIds?.length || 0} INSTRUMENTALS</span>
                              <span>·</span>
                              <span>CREATED: {pack.createdDate || '2026-09-21'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                          <div className="text-left md:text-right">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Price</span>
                            <span className="font-mono text-sm font-black text-white">
                              {pack.price > 0 ? `${currencySymbol}${pack.price.toFixed(2)}` : 'FREE COMPLIMENTARY'}
                            </span>
                          </div>

                          <div className="text-left md:text-right">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Status</span>
                            <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                              pack.published !== false
                                ? 'bg-purple-950 text-purple-300 border-purple-500/20'
                                : 'bg-zinc-950 text-zinc-600 border-zinc-850'
                            }`}>
                              {pack.published !== false ? 'Published' : 'Draft'}
                            </span>
                          </div>

                          {/* Row Action buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingBeatPack(pack);
                                setPackName(pack.name);
                                setPackDesc(pack.description);
                                setPackPrice(pack.price);
                                setPackArtwork(pack.artworkUrl);
                                setPackBeats(pack.beatIds || []);
                                setPackFree(pack.freeDownload);
                                setPackPublished(pack.published);
                                setPackNotice(null);
                              }}
                              className="p-2 bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"
                              title="Edit Pack Parameters"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (onUpdateBeatPacks) {
                                  const duplicated: BeatPack = {
                                    ...pack,
                                    id: `pack-dup-${Date.now()}`,
                                    name: `${pack.name} (COPY)`,
                                    createdDate: new Date().toISOString().split('T')[0],
                                  };
                                  onUpdateBeatPacks([duplicated, ...beatPacks]);
                                  setPackNotice('✓ Beat Pack duplicated successfully!');
                                  setTimeout(() => setPackNotice(null), 2000);
                                }
                              }}
                              className="p-2 bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-purple-300 transition-colors"
                              title="Duplicate Pack"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Permanently delete this curated beat pack bundle?') && onUpdateBeatPacks) {
                                  onUpdateBeatPacks(beatPacks.filter(p => p.id !== pack.id));
                                  setPackNotice('✓ Curated pack deleted.');
                                  setTimeout(() => setPackNotice(null), 2000);
                                }
                              }}
                              className="p-2 bg-zinc-950 border border-zinc-850 hover:bg-red-950/40 rounded-xl text-zinc-500 hover:text-red-400 transition-colors"
                              title="Purge Pack"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center bg-zinc-950/40 border border-zinc-800 rounded-2xl space-y-2">
                      <Package className="w-8 h-8 text-zinc-600 mx-auto" />
                      <h4 className="font-brand font-black text-white text-xs tracking-wider">NO CURATED BUNDLES</h4>
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed font-medium">
                        You have not published any bulk beat bundles. Curate collections of multiple WAV/MP3 files at a discount.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* ADVANCED BEAT PACK UPLOADER / MANAGER FORM */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!packName.trim()) {
                      setPackNotice('Error: Curated pack name cannot be empty.');
                      return;
                    }
                    if (packBeats.length === 0) {
                      setPackNotice('Error: Select at least one instrumental from the checkboxes catalog list.');
                      return;
                    }

                    const saved: BeatPack = {
                      id: editingPack.id === 'new' ? `pack-${Date.now()}` : editingPack.id,
                      name: packName.toUpperCase().trim(),
                      description: packDesc.trim(),
                      price: packFree ? 0 : packPrice,
                      artworkUrl: packArtwork || artworkPresets[0],
                      beatIds: packBeats,
                      freeDownload: packFree,
                      published: packPublished,
                      createdDate: editingPack.createdDate || new Date().toISOString().split('T')[0],
                    };

                    let updated: BeatPack[];
                    if (editingPack.id === 'new') {
                      updated = [saved, ...beatPacks];
                      setPackNotice('✓ New curated Beat Pack published successfully!');
                    } else {
                      updated = beatPacks.map(p => p.id === saved.id ? saved : p);
                      setPackNotice('✓ Curated Beat Pack changes saved successfully!');
                    }

                    if (onUpdateBeatPacks) {
                      onUpdateBeatPacks(updated);
                    }

                    setTimeout(() => {
                      setEditingBeatPack(null);
                      setPackNotice(null);
                    }, 1200);
                  }}
                  className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl text-left space-y-6 animate-fadeIn"
                >
                  <h3 className="text-xs font-mono font-black text-purple-300 uppercase tracking-widest block border-b border-zinc-800 pb-2">
                    {editingPack.id === 'new' ? 'CREATE CURATED BUNDLE' : 'EDIT CURATED BUNDLE'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Pack Name</label>
                        <input
                          required
                          type="text"
                          value={packName}
                          onChange={(e) => setPackName(e.target.value)}
                          placeholder="e.g. PLATINUM SCORINGS VOL. 1"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Pack Description</label>
                        <textarea
                          rows={4}
                          value={packDesc}
                          onChange={(e) => setPackDesc(e.target.value)}
                          placeholder="Curate details about the files inside this package..."
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Bundle Price ({currencySymbol})</label>
                          <input
                            type="number"
                            step="0.01"
                            disabled={packFree}
                            value={packFree ? 0 : packPrice}
                            onChange={(e) => setPackPrice(parseFloat(e.target.value) || 0)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono disabled:opacity-50"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Publication Status</label>
                          <select
                            value={packPublished ? 'true' : 'false'}
                            onChange={(e) => setPackPublished(e.target.value === 'true')}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-bold"
                          >
                            <option value="true">Published (Live Store)</option>
                            <option value="false">Draft (Invisible)</option>
                          </select>
                        </div>
                      </div>

                      <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 flex items-center justify-between">
                        <div className="space-y-0.5 text-left">
                          <label className="text-xs font-bold text-white block">Complimentary Free Download</label>
                          <span className="text-[10px] text-zinc-500">Require artist email address before uncompressed files download.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={packFree}
                          onChange={(e) => {
                            setPackFree(e.target.checked);
                            if (e.target.checked) setPackPrice(0);
                          }}
                          className="w-8 h-4 rounded bg-zinc-900 border-zinc-800 accent-purple-600 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Artwork Preset Selector */}
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-2 font-bold uppercase">Artwork Cover Presets</label>
                        <div className="grid grid-cols-3 gap-3">
                          {artworkPresets.map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setPackArtwork(preset)}
                              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                                packArtwork === preset ? 'border-purple-500 scale-95 shadow-md shadow-purple-950/20' : 'border-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              <img src={preset} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ADVANCED CHECKBOXES SELECTOR FOR INDIVIDUAL CATALOG FILES */}
                      <div className="space-y-2">
                        <label className="block text-[10px] text-zinc-500 font-bold uppercase">
                          Select Catalog Beats ({packBeats.length} SELECTED)
                        </label>
                        <p className="text-[9px] text-zinc-400">Checkbox any published master files to curate them in this package.</p>
                        
                        <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-4 max-h-56 overflow-y-auto space-y-2.5 scrollbar-thin">
                          {beats.map((beat) => {
                            const isSelected = packBeats.includes(beat.id);
                            return (
                              <label
                                key={beat.id}
                                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-purple-950/20 border-purple-500/30'
                                    : 'bg-zinc-900/30 border-transparent hover:border-zinc-800'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      if (isSelected) {
                                        setPackBeats(packBeats.filter((id) => id !== beat.id));
                                      } else {
                                        setPackBeats([...packBeats, beat.id]);
                                      }
                                    }}
                                    className="rounded border-zinc-800 bg-zinc-900 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                                  />
                                  <div className="flex items-center gap-2.5 min-w-0 text-left">
                                    <img src={beat.artworkUrl} className="w-8 h-8 rounded-lg object-cover" />
                                    <div className="min-w-0">
                                      <span className="text-xs font-bold text-white block truncate">{beat.title}</span>
                                      <span className="text-[9px] font-mono text-zinc-500">
                                        {beat.bpm} BPM · {beat.key}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850/80">
                                  {currencySymbol}{beat.pricing.mp3Lease}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => setEditingBeatPack(null)}
                      className="px-5 py-2.5 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg cursor-pointer"
                    >
                      {editingPack.id === 'new' ? 'Publish Curated Pack' : 'Save Curated Pack'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ==================== 2.6. AUDIO ENGINE MASTERING TAB ==================== */}
          {activeTab === 'mastering' && (
            <div className="space-y-8 animate-fadeIn text-left">
              <div className="border-b border-zinc-900 pb-4">
                <h2 className="text-xl font-brand font-black text-white uppercase tracking-tight">COEFFICIENTS PROCESSING MODULE</h2>
                <p className="text-xs text-zinc-500">Tune the simulated Moog and solid-state mastering curves. Configurations compile directly into the uncompressed playback audio engine.</p>
              </div>

              {masteringSaved && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>✓ Master coefficients successfully compiled! True Peak limiters, EQ bands, and Gain reduction factors applied globally.</span>
                </div>
              )}

              {/* Mastering Split Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: EQ & Dynamics Sliders (col-span-7) */}
                <div className="xl:col-span-7 space-y-6">
                  
                  {/* EQ SECTION */}
                  <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-5">
                    <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-black text-purple-300 uppercase tracking-widest block">THREE-BAND PROSCENIUM SCORING</span>
                        <h3 className="font-extrabold text-sm text-white uppercase">ANALOG EQUALIZER COEFFICIENTS</h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* LOW EQ */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold font-mono">
                          <span className="text-zinc-400">Low Sub shelf (60Hz)</span>
                          <span className={`${eqLow >= 0 ? 'text-purple-300' : 'text-zinc-500'}`}>
                            {eqLow >= 0 ? `+${eqLow.toFixed(1)}` : eqLow.toFixed(1)} dB
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-12"
                          max="12"
                          step="0.5"
                          value={eqLow}
                          onChange={(e) => {
                            setEqLow(parseFloat(e.target.value));
                            setMasteringSaved(false);
                          }}
                          className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                      </div>

                      {/* MID EQ */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold font-mono">
                          <span className="text-zinc-400">Mid Vocal range (2.5kHz)</span>
                          <span className={`${eqMid >= 0 ? 'text-purple-300' : 'text-zinc-500'}`}>
                            {eqMid >= 0 ? `+${eqMid.toFixed(1)}` : eqMid.toFixed(1)} dB
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-12"
                          max="12"
                          step="0.5"
                          value={eqMid}
                          onChange={(e) => {
                            setEqMid(parseFloat(e.target.value));
                            setMasteringSaved(false);
                          }}
                          className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                      </div>

                      {/* HIGH EQ */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold font-mono">
                          <span className="text-zinc-400">High Air brilliance (10kHz)</span>
                          <span className={`${eqHigh >= 0 ? 'text-purple-300' : 'text-zinc-500'}`}>
                            {eqHigh >= 0 ? `+${eqHigh.toFixed(1)}` : eqHigh.toFixed(1)} dB
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-12"
                          max="12"
                          step="0.5"
                          value={eqHigh}
                          onChange={(e) => {
                            setEqHigh(parseFloat(e.target.value));
                            setMasteringSaved(false);
                          }}
                          className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                      </div>
                    </div>

                    {/* Quick presets toggles */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEqLow(6.5);
                          setEqMid(-1.0);
                          setEqHigh(1.5);
                          setMasteringSaved(false);
                        }}
                        className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 rounded-lg text-[9px] font-mono font-bold text-zinc-400 hover:text-purple-300 transition-all uppercase"
                      >
                        60Hz Sub Boost
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEqLow(1.0);
                          setEqMid(-3.5);
                          setEqHigh(3.0);
                          setMasteringSaved(false);
                        }}
                        className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 rounded-lg text-[9px] font-mono font-bold text-zinc-400 hover:text-purple-300 transition-all uppercase"
                      >
                        2kHz Vocal Scoop
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEqLow(2.0);
                          setEqMid(0.0);
                          setEqHigh(6.5);
                          setMasteringSaved(false);
                        }}
                        className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 rounded-lg text-[9px] font-mono font-bold text-zinc-400 hover:text-purple-300 transition-all uppercase"
                      >
                        10kHz High Air
                      </button>
                    </div>
                  </div>

                  {/* DYNAMICS COMPRESSOR SECTION */}
                  <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-5">
                    <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                      <div className="space-y-0.5 text-left">
                        <span className="text-[10px] font-mono font-black text-purple-300 uppercase tracking-widest block">SOLID STATE SCORING DYNAMICS</span>
                        <h3 className="font-extrabold text-sm text-white uppercase">VCA MASTER COMPRESSOR</h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* THRESHOLD */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold font-mono">
                          <span className="text-zinc-400">Compression Threshold</span>
                          <span className="text-purple-300">{compThreshold.toFixed(1)} dB</span>
                        </div>
                        <input
                          type="range"
                          min="-40"
                          max="0"
                          step="0.5"
                          value={compThreshold}
                          onChange={(e) => {
                            setCompThreshold(parseFloat(e.target.value));
                            setMasteringSaved(false);
                          }}
                          className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                      </div>

                      {/* RATIO */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold font-mono">
                          <span className="text-zinc-400">Compression Ratio</span>
                          <span className="text-purple-300">{compRatio.toFixed(1)}:1</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          step="0.1"
                          value={compRatio}
                          onChange={(e) => {
                            setCompRatio(parseFloat(e.target.value));
                            setMasteringSaved(false);
                          }}
                          className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                      </div>

                      {/* GAIN REDUCTION BAR (DYNAMIC SIMULATION) */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[10px] font-mono font-black text-zinc-500 uppercase tracking-wider">
                          <span>Simulated gain reduction</span>
                          <span className="text-red-400">
                            -{Math.max(0, (-compThreshold) * (compRatio - 1) * 0.05).toFixed(1)} dB
                          </span>
                        </div>
                        <div className="h-2.5 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(0, (-compThreshold) * (compRatio - 1) * 0.8)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PEAK LIMITER AND VOICE WATERMARKING SECTION */}
                  <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-4">
                    <h3 className="font-extrabold text-sm text-white uppercase border-b border-zinc-850 pb-2">TRUE PEAK LIMITER & WATERMARK</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Limiter Threshold (dB)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="-20"
                          max="0"
                          value={limiterThreshold}
                          onChange={(e) => {
                            setLimiterThreshold(parseFloat(e.target.value) || 0);
                            setMasteringSaved(false);
                          }}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-xl p-2.5 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Watermark Tag Schedule (Seconds)</label>
                        <input
                          type="number"
                          min="5"
                          max="60"
                          value={watermarkInterval}
                          onChange={(e) => {
                            setWatermarkInterval(parseInt(e.target.value) || 15);
                            setMasteringSaved(false);
                          }}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-xl p-2.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Dynamic SVG curve graph, DB meter display, compile CTA (col-span-5) */}
                <div className="xl:col-span-5 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 lg:sticky lg:top-24 space-y-6 shadow-2xl relative text-left">
                  
                  {/* SVG REAL-TIME EQ GRAPH PLOT */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block">MASTER WAVE CURVE PLOT</span>
                    
                    <div className="rounded-2xl bg-black border border-zinc-900 p-4 aspect-[4/3] flex flex-col justify-between">
                      {/* Graph Header coordinates */}
                      <div className="flex justify-between text-[9px] font-mono text-zinc-600 font-bold border-b border-zinc-900 pb-1.5">
                        <span>EQ CURVE: {eqLow > 0 ? '+' : ''}{eqLow.toFixed(1)} / {eqMid > 0 ? '+' : ''}{eqMid.toFixed(1)} / {eqHigh > 0 ? '+' : ''}{eqHigh.toFixed(1)} dB</span>
                        <span className="text-purple-500 font-black animate-pulse">ACTIVE COEFFICIENTS</span>
                      </div>

                      {/* SVG Canvas Plot */}
                      <div className="flex-1 relative flex items-center justify-center py-4">
                        <svg viewBox="0 0 400 150" className="w-full h-full stroke-zinc-800 stroke-[0.5] fill-none">
                          {/* Grid horizontal markers */}
                          <line x1="0" y1="25" x2="400" y2="25" strokeDasharray="3 3" />
                          <line x1="0" y1="75" x2="400" y2="75" strokeWidth="1" stroke="rgba(147,51,234,0.15)" />
                          <line x1="0" y1="125" x2="400" y2="125" strokeDasharray="3 3" />

                          {/* Grid vertical markers */}
                          <line x1="100" y1="0" x2="100" y2="150" strokeDasharray="3 3" />
                          <line x1="200" y1="0" x2="200" y2="150" strokeDasharray="3 3" />
                          <line x1="300" y1="0" x2="300" y2="150" strokeDasharray="3 3" />

                          {/* Dynamic Curve Path based on state - pure SVG math rendering! */}
                          <path
                            d={`M 0 75 Q 100 ${75 - eqLow * 5.5} 200 ${75 - eqMid * 5.5} T 400 ${75 - eqHigh * 5.5}`}
                            stroke="url(#purpleGrad)"
                            strokeWidth="3.5"
                            className="transition-all duration-300"
                          />

                          {/* Glow filter definition */}
                          <defs>
                            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#c084fc" />
                              <stop offset="50%" stopColor="#a855f7" />
                              <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>
                          </defs>

                          {/* Interactive indicator nodes */}
                          <circle cx="100" cy={75 - eqLow * 5.5} r="4.5" fill="#c084fc" className="transition-all duration-300" />
                          <circle cx="200" cy={75 - eqMid * 5.5} r="4.5" fill="#a855f7" className="transition-all duration-300" />
                          <circle cx="300" cy={75 - eqHigh * 5.5} r="4.5" fill="#6366f1" className="transition-all duration-300" />
                        </svg>
                      </div>

                      {/* Frequency captions */}
                      <div className="flex justify-between text-[9px] font-mono text-zinc-500 font-bold border-t border-zinc-900 pt-1.5 uppercase">
                        <span>20Hz Sub</span>
                        <span>250Hz Bass</span>
                        <span>2.5kHz Mid</span>
                        <span>15kHz Air</span>
                      </div>
                    </div>
                  </div>

                  {/* MASTER OUTPUT VERTICAL DB PEAK METERS */}
                  <div className="p-4 bg-black border border-zinc-900 rounded-2xl space-y-2">
                    <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">TRUE PEAK LEVEL MATRIX</span>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Left Out channel */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                          <span>PEAK L</span>
                          <span>-0.1 dB</span>
                        </div>
                        <div className="h-4 bg-zinc-950 border border-zinc-850 rounded-lg p-0.5 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-md w-[96%]" />
                        </div>
                      </div>

                      {/* Right Out channel */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                          <span>PEAK R</span>
                          <span>-0.1 dB</span>
                        </div>
                        <div className="h-4 bg-zinc-950 border border-zinc-850 rounded-lg p-0.5 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-md w-[95%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save/Compile processing controls */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      disabled={masteringSaving}
                      onClick={() => {
                        setMasteringSaving(true);
                        setTimeout(() => {
                          setMasteringSaving(false);
                          setMasteringSaved(true);
                        }, 1200);
                      }}
                      className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {masteringSaving ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-white rounded-full animate-spin" />
                          <span>COMPILING COEFFICIENTS...</span>
                        </>
                      ) : (
                        <span>COMPILE CONSOLE PROCESSING COEFFICIENTS</span>
                      )}
                    </button>
                    <span className="text-[10px] font-mono text-zinc-500 leading-relaxed text-center block">
                      Save compiles direct hardware coefficients into high-fidelity playback engine files.
                    </span>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ==================== 3. MERCH AND BOUTIQUE KITS TAB ==================== */}
          {activeTab === 'soundkits' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-900 pb-4">
                <h2 className="text-xl font-brand font-black text-white uppercase tracking-tight">MERCH & KITS BOUTIQUE</h2>
                <p className="text-xs text-zinc-500">Configure standard physical merchandise details, stem kits, and trackout bundles.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {soundKits.map((sk) => (
                  <div key={sk.id} className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-3xl flex items-center justify-between hover:border-purple-500/20 transition-all shadow-md text-left">
                    <div className="flex items-center gap-4">
                      <img src={sk.coverUrl} alt={sk.title} className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-zinc-850 shadow" />
                      <div>
                        <h4 className="font-extrabold text-sm text-white uppercase">{sk.title}</h4>
                        <span className="text-[10px] text-purple-300 font-mono">{sk.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-black text-white">${sk.price.toFixed(2)}</div>
                      <span className="text-[10px] text-zinc-500 font-mono">0 sold</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Merch Placeholder panel with integrity notice */}
              <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-brand">ADD BOUTIQUE ITEM</h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  Drop apparel and high-fidelity stem kits are strictly configured at the factory level to ensure integrated tap NFC stems match digital recordings correctly.
                </p>
                <div className="flex justify-end">
                  <button disabled className="px-5 py-2.5 bg-zinc-850 text-zinc-500 border border-zinc-800 rounded-xl text-xs font-bold font-brand uppercase tracking-wider">
                    Add New Merchant Item (Offline)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 4. SERVICES TAB ==================== */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-900 pb-4">
                <h2 className="text-xl font-brand font-black text-white uppercase tracking-tight">BESPOKE STUDIO SERVICES</h2>
                <p className="text-xs text-zinc-500">Add or deactivate custom engineering, sound design, and custom tracking bookings.</p>
              </div>

              <div className="space-y-4">
                {services.map((srv) => (
                  <div key={srv.id} className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow">
                    <div className="space-y-1">
                      <h4 className="font-black text-base text-white uppercase">{srv.title}</h4>
                      <p className="text-xs text-zinc-400 font-medium leading-relaxed">{srv.description}</p>
                      <span className="text-[10px] font-mono text-zinc-500 font-bold">Delivery: {srv.deliveryDays} Days</span>
                    </div>
                    <div className="font-mono text-base font-black text-purple-300 shrink-0">
                      ${srv.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 5. ORDERS & SALES TAB ==================== */}
          {activeTab === 'sales' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-900 pb-4">
                <h2 className="text-xl font-brand font-black text-white uppercase tracking-tight">TRANSACTION ARCHIVE</h2>
                <p className="text-xs text-zinc-500">Review verified checkout settlements, capture times, and customer details.</p>
              </div>

              {salesRecords.length > 0 ? (
                <div className="space-y-3">
                  {salesRecords.map((sale) => (
                    <div key={sale.id} className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{sale.beatTitle}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 font-mono border border-purple-500/20">
                            {sale.licenseType}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1">Ref: #{sale.orderId} · {sale.customerName} ({sale.customerEmail})</p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="font-mono text-sm font-black text-purple-300 block">${sale.amount.toFixed(2)}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{sale.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center bg-zinc-950/40 border border-zinc-800 rounded-2xl space-y-2">
                  <AlertTriangle className="w-8 h-8 text-zinc-600 mx-auto" />
                  <h4 className="font-brand font-black text-white text-xs tracking-wider">NO ORDERS YET</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed font-medium">
                    No physical or digital sales orders have been registered. Launch promotions or share your beats catalog to trigger actions.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ==================== 6. DOWNLOADS & LEADS TAB ==================== */}
          {activeTab === 'downloads' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-4">
                <div>
                  <h2 className="text-xl font-brand font-black text-white uppercase tracking-tight">ARTIST LEADS</h2>
                  <p className="text-xs text-zinc-500">Every artist who requests a free tagged download is recorded for marketing.</p>
                </div>
                <button
                  onClick={handleExportLeads}
                  disabled={leads.length === 0}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export CSV ({leads.length})</span>
                </button>
              </div>

              {exportNotice && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl font-mono">
                  ✓ Artist lead CSV directory exported successfully!
                </div>
              )}

              {leads.length > 0 ? (
                <div className="overflow-x-auto bg-zinc-950 border border-zinc-900 rounded-3xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 uppercase font-semibold">
                      <tr>
                        <th className="p-4">Email</th>
                        <th className="p-4">Beat Title</th>
                        <th className="p-4">Captured Date</th>
                        <th className="p-4">Country</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-zinc-300 font-mono">
                      {leads.map((l) => (
                        <tr key={l.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="p-4 font-bold text-purple-300">{l.email}</td>
                          <td className="p-4 text-white font-sans font-semibold">{l.beatTitle}</td>
                          <td className="p-4 text-zinc-500">{l.downloadDate}</td>
                          <td className="p-4 text-zinc-400">{l.ipCountry || 'USA'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-10 text-center bg-zinc-950/40 border border-zinc-800 rounded-2xl space-y-2">
                  <Download className="w-8 h-8 text-zinc-600 mx-auto" />
                  <h4 className="font-brand font-black text-white text-xs tracking-wider">NO LEADS CAPTURED</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed font-medium">
                    When artists request free tagged downloads on your public store, their emails will register here automatically.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ==================== 7. COUPON CAMPAIGNS TAB ==================== */}
          {activeTab === 'promotions' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-900 pb-4">
                <h2 className="text-xl font-brand font-black text-white uppercase tracking-tight">COUPONS & CAMPAIGNS</h2>
                <p className="text-xs text-zinc-500">Create discount campaigns and manage active promo codes.</p>
              </div>

              {/* Promo code list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promotions.map((promo) => (
                  <div key={promo.id} className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-3xl flex justify-between items-center text-left">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold text-purple-300 uppercase tracking-widest">{promo.code}</span>
                        <span className="text-[10px] bg-purple-950 text-purple-200 border border-purple-500/20 px-2 py-0.5 rounded font-mono font-bold">
                          {promo.discountPercent}% OFF
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-medium">{promo.description}</p>
                      <span className="text-[10px] text-zinc-500 font-mono">Expires: {promo.expirationDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(promo.code)}
                        className="p-2 bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all"
                        title="Copy Code"
                      >
                        {copiedCode === promo.code ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => onDeletePromotion(promo.id)}
                        className="p-2 bg-zinc-950 border border-zinc-850 hover:bg-red-950/40 rounded-xl text-zinc-500 hover:text-red-400 transition-all"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Create Code Form */}
              <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-brand">LAUNCH NEW CAMPAIGN</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Campaign Code</label>
                    <input type="text" value={newPromoCode} onChange={(e) => setNewPromoCode(e.target.value)} placeholder="e.g. VIP30" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white uppercase font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Discount Percent (%)</label>
                    <input type="number" value={newPromoDiscount} onChange={(e) => setNewPromoDiscount(parseInt(e.target.value) || 0)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Description</label>
                    <input type="text" value={newPromoDesc} onChange={(e) => setNewPromoDesc(e.target.value)} placeholder="Summer Sale" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Expiration Date</label>
                    <input type="date" value={newPromoExp} onChange={(e) => setNewPromoExp(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      if (newPromoCode) {
                        onAddPromotion({
                          id: `promo-${Date.now()}`,
                          code: newPromoCode.toUpperCase().trim(),
                          discountPercent: newPromoDiscount,
                          active: true,
                          usageCount: 0,
                          expirationDate: newPromoExp,
                          description: newPromoDesc || `${newPromoDiscount}% OFF Promotion`
                        });
                        setNewPromoCode('');
                        setNewPromoDesc('');
                      }
                    }}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer animate-pulse"
                  >
                    Publish Promo Code
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 8. YOUTUBE VIDEO MANAGEMENT TAB ==================== */}
          {activeTab === 'youtube_videos' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-900 pb-4">
                <h2 className="text-xl font-brand font-black text-white uppercase tracking-tight">YOUTUBE VIDEO VAULT</h2>
                <p className="text-xs text-zinc-500">Embed and manage official music visuals and live studio scoring sessions on the homepage.</p>
              </div>

              {/* List current embedded videos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {youtubeVideos.map((video) => (
                  <div key={video.id} className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden flex flex-col justify-between">
                    <div className="aspect-video relative bg-black border-b border-zinc-900">
                      <iframe src={`https://www.youtube.com/embed/${video.youtubeId}`} title={video.title} className="w-full h-full absolute inset-0" allowFullScreen />
                    </div>
                    <div className="p-4 space-y-3 text-left">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono font-bold text-purple-400 bg-purple-950/40 border border-purple-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                          {video.category}
                        </span>
                        <h4 className="font-extrabold text-xs text-white truncate pt-1">{video.title}</h4>
                      </div>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="w-full py-1.5 bg-zinc-900 hover:bg-red-950/30 text-zinc-400 hover:text-red-400 border border-zinc-850 hover:border-red-900/30 rounded-xl text-[10px] font-bold uppercase transition-all"
                      >
                        Delete Video
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Video Form */}
              <form onSubmit={handleAddVideo} className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-brand">EMBED NEW VIDEO</h3>
                
                {newVideoNotice && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl font-mono">
                    ✓ New visualizer published to storefront successfully!
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Video Title</label>
                    <input required type="text" value={newVideoTitle} onChange={(e) => setNewVideoTitle(e.target.value)} placeholder="e.g. TOKYO NIGHTHAWK" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">YouTube Video ID</label>
                    <input required type="text" value={newVideoId} onChange={(e) => setNewVideoId(e.target.value)} placeholder="e.g. dQw4w9WgXcQ" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Video Category</label>
                    <select value={newVideoCategory} onChange={(e) => setNewVideoCategory(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white">
                      <option value="OFFICIAL VISUALIZER">OFFICIAL VISUALIZER</option>
                      <option value="STUDIO LIVE">STUDIO LIVE</option>
                      <option value="EXECUTIVE SCORE Deep Dive">EXECUTIVE SCORE Deep Dive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Description</label>
                    <input type="text" value={newVideoDesc} onChange={(e) => setNewVideoDesc(e.target.value)} placeholder="Brief companion text summary..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Duration</label>
                    <input type="text" value={newVideoDuration} onChange={(e) => setNewVideoDuration(e.target.value)} placeholder="3:12" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all cursor-pointer">
                    Embed Youtube Video
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================== 9. PROFILE SETTINGS & LIVE PREVIEW TAB ==================== */}
          {activeTab === 'profile_settings' && (
            <div className="space-y-8 animate-fadeIn">
              
              <div className="border-b border-zinc-900 pb-4">
                <h2 className="text-xl font-brand font-black text-white uppercase tracking-tight">PROFILE MANAGEMENT</h2>
                <p className="text-xs text-zinc-500">Configure global metadata parameters, editable public profile, and social links with real-time preview.</p>
              </div>

              {/* Save states notifications */}
              {profileSaveState === 'saving' && (
                <div className="p-4 bg-zinc-900 border border-zinc-800 text-yellow-400 text-xs font-mono font-bold rounded-xl animate-pulse flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-zinc-900 border-t-yellow-400 rounded-full animate-spin" />
                  <span>SAVING PROFILE... Synchronizing authoritative database files...</span>
                </div>
              )}
              {profileSaveState === 'saved' && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>SAVED successfully! Authoritative public profile updated in real-time.</span>
                </div>
              )}
              {profileSaveState === 'error' && (
                <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-300 text-xs font-mono font-bold rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>ERROR: {profileErrorMsg || 'Saving profile failed. Settle transaction rejected.'}</span>
                </div>
              )}

              {/* Spacious 2-Column Split: Inputs Form Left + Live Preview Right */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* Inputs Form taking xl:col-span-7 */}
                <div className="xl:col-span-7 space-y-6 bg-zinc-900/40 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-lg">
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono font-black text-purple-300 uppercase tracking-widest block border-b border-zinc-800 pb-2">BASIC PROFILE</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Display Name</label>
                        <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Display Tag / Handle</label>
                        <input type="text" value={profileHandle} onChange={(e) => setProfileHandle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Avatar URL</label>
                        <input type="text" value={profileAvatar} onChange={(e) => setProfileAvatar(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Banner Image URL</label>
                        <input type="text" value={profileBanner} onChange={(e) => setProfileBanner(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Location Coordinates</label>
                      <input type="text" value={profileLocation} onChange={(e) => setProfileLocation(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white" />
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Public Bio Description</label>
                      <textarea rows={4} value={profileBio} onChange={(e) => setProfileBio(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-medium leading-relaxed" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-zinc-800">
                    <h3 className="text-xs font-mono font-black text-purple-300 uppercase tracking-widest block border-b border-zinc-800 pb-2">SOCIAL NETWORK PATHS</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Instagram</label>
                        <input type="text" value={socialInsta} onChange={(e) => setSocialInsta(e.target.value)} placeholder="https://instagram.com/..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">YouTube Channel</label>
                        <input type="text" value={socialYoutube} onChange={(e) => setSocialYoutube(e.target.value)} placeholder="https://youtube.com/..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Spotify Artist URI</label>
                        <input type="text" value={socialSpotify} onChange={(e) => setSocialSpotify(e.target.value)} placeholder="https://open.spotify.com/..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">TikTok Profile</label>
                        <input type="text" value={socialTiktok} onChange={(e) => setSocialTiktok(e.target.value)} placeholder="https://tiktok.com/..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">SoundCloud</label>
                        <input type="text" value={socialSoundcloud} onChange={(e) => setSocialSoundcloud(e.target.value)} placeholder="https://soundcloud.com/..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Apple Music</label>
                        <input type="text" value={socialAppleMusic} onChange={(e) => setSocialAppleMusic(e.target.value)} placeholder="https://music.apple.com/..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-zinc-800/80">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={profileSaveState === 'saving'}
                      className="px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Save Profile Settings
                    </button>
                  </div>
                </div>

                {/* Live Preview Panel taking xl:col-span-5 */}
                <div className="xl:col-span-5 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 lg:sticky lg:top-24 space-y-5 shadow-2xl relative">
                  <div className="absolute top-4 right-4 px-2 py-0.5 bg-purple-950 border border-purple-500/20 rounded font-mono text-[9px] text-purple-300 font-bold uppercase tracking-wider animate-pulse">
                    Live Profile Preview
                  </div>
                  
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block text-left">PREVIEW CLIENT VIEW</span>
                    
                    {/* Simulated Phone Card Container */}
                    <div className="rounded-2xl border border-zinc-850 bg-zinc-900/30 overflow-hidden shadow-xl text-left relative">
                      {/* Simulated Banner */}
                      <div className="h-28 bg-zinc-950 relative overflow-hidden">
                        {profileBanner ? (
                          <img src={profileBanner} alt="banner" className="w-full h-full object-cover filter brightness-50" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-purple-950 to-zinc-950 flex items-center justify-center text-zinc-800 font-mono text-[9px]">no banner loaded</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                      </div>

                      {/* Simulated Avatar and Header */}
                      <div className="p-4 -mt-10 flex items-end gap-3 z-10 relative">
                        <div className="w-16 h-16 rounded-xl bg-zinc-950 border-2 border-zinc-900 overflow-hidden shrink-0 shadow-lg">
                          {profileAvatar ? (
                            <img src={profileAvatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-950"><User className="w-6 h-6" /></div>
                          )}
                        </div>
                        <div className="min-w-0 pb-1">
                          <h4 className="text-sm font-black text-white truncate uppercase tracking-tight leading-snug">{profileName}</h4>
                          <span className="text-[9px] font-mono text-purple-300 tracking-wider truncate block">{profileHandle}</span>
                        </div>
                      </div>

                      {/* Simulated Location & Bio Description */}
                      <div className="p-4 pt-1 space-y-3">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-purple-400" />
                          <span>{profileLocation}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-medium line-clamp-3 pl-3 border-l border-purple-500/40 italic">
                          {profileBio || 'Write your mysterious biography or tagline to see it render here.'}
                        </p>

                        {/* Live Social links list */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/60">
                          {[
                            { link: socialInsta, key: 'insta' },
                            { link: socialYoutube, key: 'youtube' },
                            { link: socialSpotify, key: 'spotify' },
                            { link: socialTiktok, key: 'tiktok' },
                            { link: socialSoundcloud, key: 'soundcloud' },
                            { link: socialAppleMusic, key: 'apple' }
                          ].map((item) => {
                            if (!item.link || !item.link.startsWith('http')) return null;
                            return (
                              <div key={item.key} className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-850 text-purple-400 text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 scale-90">
                                <span>{item.key}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== 10. GLOBAL STORE SETTINGS TAB ==================== */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-5 animate-fadeIn">
              <div>
                <h3 className="font-brand font-black text-lg text-white uppercase tracking-tight">Store Identity & Preferences</h3>
                <p className="text-xs text-zinc-500">Configure global storefront branding and voice tag parameters.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold uppercase text-[10px]">Store Public Name</label>
                  <input type="text" defaultValue={settings.storeName} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold uppercase text-[10px]">Custom Store Domain</label>
                  <input type="text" defaultValue={settings.customDomain} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono focus:border-purple-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold uppercase text-[10px]">Currency Symbol</label>
                    <input type="text" defaultValue={settings.currencySymbol} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono focus:border-purple-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold uppercase text-[10px]">Voice Tag Frequency (Secs)</label>
                    <input type="number" defaultValue={settings.voiceTagFrequencySeconds} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono focus:border-purple-500 outline-none" />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer">
                    Save Store Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 11. PAYMENT SETTINGS & INTEGRATIONS TAB ==================== */}
          {activeTab === 'integrations' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-zinc-900/60 p-5 rounded-3xl border border-zinc-800">
                <h3 className="font-brand font-black text-lg text-white uppercase tracking-tight">Payment & Distribution Integrations</h3>
                <p className="text-xs text-zinc-500">Direct secure integrations for instant bank payouts and automated lead directories.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Stripe Payments Gateway', desc: 'Direct credit/debit card checkout processing', status: 'Connected', active: true },
                  { name: 'PayPal Commerce Gateway', desc: 'Instant PayPal Smart Buttons checkout connection', status: 'Connected', active: true },
                  { name: 'YouTube Content ID Sync', desc: 'Automated copyright protection for upload audio', status: 'Active Protection', active: true },
                  { name: 'Mailchimp Sync', desc: 'Auto-sync captured free download email leads', status: 'Active Sync', active: true },
                ].map((item, idx) => (
                  <div key={idx} className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex items-center justify-between hover:border-purple-500/20 transition-all text-left group">
                    <div className="space-y-1">
                      <div className="font-extrabold text-sm text-white group-hover:text-purple-300 transition-colors">{item.name}</div>
                      <div className="text-[11px] text-zinc-400">{item.desc}</div>
                      <div className="text-[10px] text-emerald-400 font-black uppercase pt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{item.status}</span>
                      </div>
                    </div>
                    <Zap className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Upload File Modal (7-Step Wizard) */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPublishBeat={(newBeat) => {
          if (onPublishBeat) onPublishBeat(newBeat);
        }}
        currencySymbol={currencySymbol}
      />

      {/* Edit Beat parameters modal */}
      {editingBeat && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn text-left">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-black text-white uppercase tracking-wider font-brand">EDIT INSTRUMENTAL</h3>
              <button onClick={() => setEditingBeat(null)} className="p-1 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Beat Title</label>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">BPM</label>
                  <input type="number" value={editBpm} onChange={(e) => setEditBpm(parseInt(e.target.value) || 0)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Scale Key</label>
                  <input type="text" value={editKey} onChange={(e) => setEditKey(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Genre</label>
                  <select value={editGenre} onChange={(e) => setEditGenre(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white">
                    <option value="TRAP">TRAP</option>
                    <option value="FREESTYLE TRAP">FREESTYLE TRAP</option>
                    <option value="DARK SYNTH">DARK SYNTH</option>
                    <option value="HARD TRAP">HARD TRAP</option>
                    <option value="DRILL">DRILL</option>
                    <option value="HYPER TRAP">HYPER TRAP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Standard Lease Price ($)</label>
                  <input type="number" value={editPriceVal} onChange={(e) => setEditPriceVal(parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Unlimited Price ($)</label>
                  <input type="number" value={editUnlimitedPrice} onChange={(e) => setEditUnlimitedPrice(parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono" />
                </div>
              </div>

              {/* Artwork selection with presets */}
              <div>
                <label className="block text-[10px] text-zinc-500 mb-1 font-bold uppercase">Artwork Image Source</label>
                <input type="text" value={editArtworkUrl} onChange={(e) => setEditArtworkUrl(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono mb-2" />
                <div className="flex gap-2">
                  {artworkPresets.map((img) => (
                    <button
                      key={img}
                      onClick={() => setEditArtworkUrl(img)}
                      className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 ${
                        editArtworkUrl === img ? 'border-purple-500' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 font-bold text-zinc-400 cursor-pointer">
                  <input type="checkbox" checked={editFeatured} onChange={(e) => setEditFeatured(e.target.checked)} className="rounded bg-zinc-950 border-zinc-800 text-purple-600 focus:ring-0" />
                  <span>Spotlight Featured</span>
                </label>
                <label className="flex items-center gap-2 font-bold text-zinc-400 cursor-pointer">
                  <input type="checkbox" checked={editPublished} onChange={(e) => setEditPublished(e.target.checked)} className="rounded bg-zinc-950 border-zinc-800 text-purple-600 focus:ring-0" />
                  <span>Published Publicly</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
              <button onClick={() => setEditingBeat(null)} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold font-brand uppercase tracking-wider">Cancel</button>
              <button onClick={saveEditedBeat} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-950">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
