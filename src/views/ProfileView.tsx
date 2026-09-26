import React from 'react';
import {
  Youtube,
  Instagram,
  Twitter,
  Music,
  MapPin,
  ExternalLink,
  Facebook,
  Disc,
  ShoppingBag,
  Download,
  FileText
} from 'lucide-react';
import { ProducerProfile, SaleRecord } from '../types';

interface ProfileViewProps {
  profile: ProducerProfile;
  salesRecords?: SaleRecord[];
  currencySymbol: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  salesRecords = [],
  currencySymbol,
}) => {
  // Social icons mapping
  const socialIcons: Record<string, React.ReactNode> = {
    youtube: <Youtube className="w-5 h-5 text-red-500" />,
    instagram: <Instagram className="w-5 h-5 text-purple-400" />,
    twitter: <Twitter className="w-5 h-5 text-zinc-400" />,
    spotify: <Music className="w-5 h-5 text-emerald-400" />,
    tiktok: <Music className="w-5 h-5 text-pink-400" />,
    facebook: <Facebook className="w-5 h-5 text-blue-500" />,
    soundcloud: <Disc className="w-5 h-5 text-amber-500" />,
    appleMusic: <Music className="w-5 h-5 text-red-400" />,
  };

  const hasConfiguredSocials = Object.values(profile.socialLinks || {}).some(
    (val) => val && typeof val === 'string' && val.startsWith('http')
  );

  return (
    <div className="space-y-24 py-16 animate-fadeIn max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      
      {/* 1. EDITORIAL ROW: High-Fashion Asymmetrical Portrait & Bold Wordmark */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Sleek square/rectangular profile avatar frame - Luxury styling, no generic circular shape */}
        <div className="md:col-span-5 relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-900/40 to-transparent rounded-3xl blur-2xl opacity-60 pointer-events-none" />
          <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-900 shadow-2xl">
            <img
              src={profile.avatarUrl || '/src/assets/images/cashmere_cover_velvet_1790419833792.jpg'}
              alt={profile.name}
              className="w-full h-full object-cover grayscale contrast-110 filter brightness-90 group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          {profile.verified && (
            <div className="absolute bottom-4 right-4 bg-purple-600 border border-purple-400/40 px-3 py-1.5 rounded-2xl shadow-2xl flex items-center gap-1.5">
              <span className="text-[9px] font-mono font-black text-white uppercase tracking-widest">
                VERIFIED ARCHITECT
              </span>
            </div>
          )}
        </div>

        {/* Text Area with Massive Typographic presence */}
        <div className="md:col-span-7 space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-[0.25em] block">
              ESTABLISHED IN BEAT COUTURE
            </span>
            <h1 className="text-5xl sm:text-7xl font-brand font-black text-white uppercase tracking-tight leading-none">
              {profile.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 font-bold uppercase tracking-wider pt-1">
              <span className="text-purple-300">{profile.handle}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                {profile.location || 'Atlanta / Los Angeles / Tokyo'}
              </span>
            </div>
          </div>

          <div className="h-px bg-zinc-900 w-24"></div>

          {/* Mysterious, Confident Biography */}
          <div className="space-y-6">
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-sans font-medium max-w-xl">
              {profile.bio || 'Independent Audio Architect crafting custom luxury beats and high-fashion trap compositions for world-tier recording artists. Beats engineered for the next era.'}
            </p>
          </div>

          {/* Social Presence: Show only configured links */}
          {hasConfiguredSocials && (
            <div className="space-y-3 pt-4">
              <span className="text-[10px] font-mono font-black text-zinc-600 uppercase tracking-widest block">
                DIGITAL CHANNELS
              </span>
              <div className="flex flex-wrap gap-3">
                {Object.entries(profile.socialLinks || {}).map(([key, value]) => {
                  if (!value || typeof value !== 'string' || !value.startsWith('http')) return null;
                  return (
                    <a
                      key={key}
                      href={value}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all shadow-md flex items-center justify-center hover:-translate-y-0.5 cursor-pointer"
                      title={`Visit ${key}`}
                    >
                      {socialIcons[key] || <ExternalLink className="w-4 h-4" />}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. SECURE ESCROW CLIENT LICENSE MANAGEMENT HUB (Visible only if real sales exist) */}
      {salesRecords.length > 0 && (
        <div className="border-t border-zinc-900 pt-16 space-y-8 animate-fadeIn">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-widest block">
              CLIENT VAULT DIRECTORY
            </span>
            <h3 className="font-brand font-black text-2xl text-white uppercase tracking-tight">
              LICENSE DIRECTORY
            </h3>
            <p className="text-xs text-zinc-500 max-w-xl leading-relaxed font-medium">
              Secured uncompressed master stems, contract PDFs, and lease configurations synced directly to your verified purchases history.
            </p>
          </div>

          <div className="space-y-3">
            {salesRecords.map((record) => (
              <div
                key={record.id}
                className="p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-purple-500/20 transition-all"
              >
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-black text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/20">
                      ORDER #{record.orderId}
                    </span>
                    <h4 className="font-bold text-white text-sm uppercase tracking-wide">
                      {record.beatTitle}
                    </h4>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono flex flex-wrap items-center gap-3">
                    <span>TYPE: {record.licenseType}</span>
                    <span aria-hidden="true" className="text-zinc-800">·</span>
                    <span>SECURED: {record.date}</span>
                    <span aria-hidden="true" className="text-zinc-800">·</span>
                    <span className="text-purple-300 font-bold">{currencySymbol}{record.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => {
                      const blob = new Blob([`CASHMERE KID$ OFFICIAL LICENSE AGREEMENT\nOrder Ref: #${record.orderId}\nBeat: ${record.beatTitle}\nLicense: ${record.licenseType}\nCustomer: ${record.customerName} (${record.customerEmail})\nDate: ${record.date}\nAmount: $${record.amount}`], { type: 'text/plain' });
                      const a = document.createElement('a');
                      a.href = URL.createObjectURL(blob);
                      a.download = `CASHMERE_KIDS_CONTRACT_${record.orderId}.txt`;
                      a.click();
                    }}
                    className="flex-1 md:flex-none px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>LICENSE CONTRACT</span>
                  </button>

                  <button
                    onClick={() => {
                      const blob = new Blob([`[CASHMERE KID$ MASTER AUDIO FILE - ${record.beatTitle}]\nLicense Tier: ${record.licenseType}`], { type: 'text/plain' });
                      const a = document.createElement('a');
                      a.href = URL.createObjectURL(blob);
                      a.download = `${record.beatTitle.replaceAll(' ', '_')}_MASTER.mp3`;
                      a.click();
                    }}
                    className="flex-1 md:flex-none px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ZIP STEMS</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
