import React from 'react';
import { X, Shield, FileText, RefreshCw, Lock, Award } from 'lucide-react';

interface PolicyModalProps {
  policyType: 'privacy' | 'terms' | 'licensing' | 'refunds' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ policyType, onClose }) => {
  if (!policyType) return null;

  const contentMap = {
    privacy: {
      title: 'PRIVACY POLICY',
      icon: <Lock className="w-5 h-5 text-purple-400" />,
      body: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed font-sans">
          <p>
            This Privacy Policy describes how <strong>CASHMERE KID$</strong> processes customer contact information, digital download delivery details, and licensing records.
          </p>
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">1. Data Collected</h4>
            <p className="text-zinc-400">
              We collect email addresses provided during free download requests and customer checkout solely for order fulfillment, digital stem delivery, and license contract generation.
            </p>
          </div>
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">2. Data Usage & Security</h4>
            <p className="text-zinc-400">
              Customer emails are never sold or shared with third parties. All transactional records and license agreements are stored securely within the CASHMERE KID$ Producer Studio database.
            </p>
          </div>
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">3. Account & Access Rights</h4>
            <p className="text-zinc-400">
              Customers may request deletion of their lead history or re-send order download credentials by contacting CASHMERE KID$ management.
            </p>
          </div>
        </div>
      ),
    },
    terms: {
      title: 'TERMS OF SERVICE',
      icon: <FileText className="w-5 h-5 text-purple-400" />,
      body: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed font-sans">
          <p>
            By purchasing or downloading audio files from the <strong>CASHMERE KID$</strong> store, you agree to the following operational terms:
          </p>
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">1. License Scope</h4>
            <p className="text-zinc-400">
              Each instrumental purchase grants specific usage rights (MP3 Lease, Premium Lease, Unlimited, or Exclusive License) as defined in your official PDF license agreement.
            </p>
          </div>
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">2. Producer Credit Requirement</h4>
            <p className="text-zinc-400">
              All commercial releases utilizing CASHMERE KID$ production must clearly display credit in metadata and track titles as <em>"Prod. CASHMERE KID$"</em>.
            </p>
          </div>
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">3. Non-Transferability</h4>
            <p className="text-zinc-400">
              Licenses issued through the CASHMERE KID$ Vault are non-transferable and tied strictly to the purchasing artist or record label.
            </p>
          </div>
        </div>
      ),
    },
    licensing: {
      title: 'LICENSING POLICY & TIER GUIDELINES',
      icon: <Award className="w-5 h-5 text-purple-400" />,
      body: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed font-sans">
          <p>
            CASHMERE KID$ offers 4 standardized licensing tiers tailored for underground independent artists through major label executive releases:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
            <div className="p-3 bg-zinc-950 rounded-xl border border-purple-500/30">
              <span className="text-purple-300 font-bold block text-[11px]">MP3 LEASE</span>
              <span className="text-zinc-400 text-[10px]">100,000 Streams · Non-Exclusive Untagged MP3</span>
            </div>
            <div className="p-3 bg-zinc-950 rounded-xl border border-purple-500/30">
              <span className="text-purple-300 font-bold block text-[11px]">PREMIUM LEASE</span>
              <span className="text-zinc-400 text-[10px]">500,000 Streams · High-Quality Stems & MP3</span>
            </div>
            <div className="p-3 bg-zinc-950 rounded-xl border border-purple-500/30">
              <span className="text-purple-300 font-bold block text-[11px]">UNLIMITED LEASE</span>
              <span className="text-zinc-400 text-[10px]">Unlimited Streams · Commercial Radio & Video</span>
            </div>
            <div className="p-3 bg-zinc-950 rounded-xl border border-purple-500/30">
              <span className="text-purple-300 font-bold block text-[11px]">EXCLUSIVE RIGHTS</span>
              <span className="text-zinc-400 text-[10px]">Full Ownership Transfer · Removed from Vault</span>
            </div>
          </div>
        </div>
      ),
    },
    refunds: {
      title: 'REFUND & DIGITAL DOWNLOAD POLICY',
      icon: <RefreshCw className="w-5 h-5 text-purple-400" />,
      body: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed font-sans">
          <p>
            Due to the non-returnable nature of digital audio files and stems, all digital beat license sales are final once download links are generated.
          </p>
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Corrupted Files or Download Errors</h4>
            <p className="text-zinc-400">
              If you experience any technical issues opening audio zip archives or accessing stems, contact Cashmere Kid$ studio support immediately for direct re-issuance.
            </p>
          </div>
        </div>
      ),
    },
  };

  const current = contentMap[policyType];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-zinc-900 border border-purple-500/30 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            {current.icon}
            <h3 className="font-brand font-black text-white text-base tracking-widest uppercase">
              {current.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {current.body}
        </div>

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all uppercase tracking-wider"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
