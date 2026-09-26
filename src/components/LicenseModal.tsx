import React, { useState } from 'react';
import { X, Check, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import { Beat, LicenseTierKey } from '../types';
import { LICENSE_TIERS } from '../utils/licenseInfo';

interface LicenseModalProps {
  beat: Beat | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (beat: Beat, licenseKey: LicenseTierKey) => void;
  currencySymbol: string;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({
  beat,
  isOpen,
  onClose,
  onAddToCart,
  currencySymbol,
}) => {
  const [selectedLicenseKey, setSelectedLicenseKey] = useState<LicenseTierKey>('mp3Lease');

  if (!isOpen || !beat) return null;

  const licenseKeys: LicenseTierKey[] = ['mp3Lease', 'premiumLease', 'unlimited', 'exclusive'];

  const getBeatPriceForTier = (tierKey: LicenseTierKey) => {
    switch (tierKey) {
      case 'mp3Lease':
        return beat.pricing.mp3Lease;
      case 'premiumLease':
        return beat.pricing.premiumLease;
      case 'unlimited':
        return beat.pricing.unlimited;
      case 'exclusive':
        return beat.pricing.exclusive;
      default:
        return beat.pricing.mp3Lease;
    }
  };

  const currentTierPrice = getBeatPriceForTier(selectedLicenseKey);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-950/80 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <img
              src={beat.artworkUrl}
              alt={beat.title}
              className="w-12 h-12 rounded-xl object-cover border border-purple-500/30"
            />
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">SELECT LICENSE OPTION</span>
              <h3 className="text-lg font-bold text-white">{beat.title}</h3>
              <div className="text-xs text-zinc-400 font-mono">
                {beat.bpm} BPM · {beat.key} · {beat.genre}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {licenseKeys.map((key) => {
              const tier = LICENSE_TIERS[key];
              const price = getBeatPriceForTier(key);
              const isSelected = selectedLicenseKey === key;

              return (
                <div
                  key={key}
                  onClick={() => setSelectedLicenseKey(key)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/50 ring-1 ring-purple-500'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-violet-500 text-white rounded-full shadow">
                      MOST POPULAR
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base text-white">{tier.name}</h4>
                      <span className="font-mono text-lg font-extrabold text-purple-300">
                        {currencySymbol}{price.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 mt-1">{tier.description}</p>

                    <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-1.5 text-xs text-zinc-300 font-sans">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Audio Format:</span>
                        <span className="font-medium">{tier.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Streams Limit:</span>
                        <span className="font-medium">{tier.audioStreams}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Track Stems:</span>
                        <span className={`font-medium ${tier.stemsIncluded ? 'text-purple-400 font-bold' : 'text-zinc-500'}`}>
                          {tier.stemsIncluded ? 'INCLUDED (WAV)' : 'Not Included'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 flex items-center justify-between text-xs font-semibold">
                    <span className={isSelected ? 'text-purple-300 flex items-center gap-1' : 'text-zinc-500'}>
                      {isSelected ? <Check className="w-4 h-4 text-purple-400" /> : null}
                      {isSelected ? 'Selected' : 'Click to select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-zinc-950 border border-purple-500/20 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>GUARANTEED 100% ROYALTY SPLIT TO ARTIST</span>
            </div>
            <p className="text-zinc-400">
              All licenses purchased through CASHMERE KID$ come with automated contract delivery, zero copyright strikes guarantee, and studio master audio files.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400">Selected License Total:</span>
            <div className="text-xl font-mono font-extrabold text-white">
              {currencySymbol}{currentTierPrice.toFixed(2)}
            </div>
          </div>

          <button
            onClick={() => {
              onAddToCart(beat, selectedLicenseKey);
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-500 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-950/60 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add To Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
