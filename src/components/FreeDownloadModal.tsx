import React, { useState } from 'react';
import { X, Download, Mail, CheckCircle2 } from 'lucide-react';
import { Beat } from '../types';

interface FreeDownloadModalProps {
  beat: Beat | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadCaptured: (email: string, beat: Beat) => void;
}

export const FreeDownloadModal: React.FC<FreeDownloadModalProps> = ({
  beat,
  isOpen,
  onClose,
  onLeadCaptured,
}) => {
  const [email, setEmail] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !beat) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setDownloaded(true);
    onLeadCaptured(email, beat);

    const element = document.createElement('a');
    const file = new Blob([`[CASHMERE KID$ - ${beat.title} (Tagged Demo MP3)]\nBPM: ${beat.bpm}\nKey: ${beat.key}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${beat.title.replaceAll(' ', '_')}_CASHMERE_KIDS_DEMO.mp3`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-zinc-900 border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-950/80 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!downloaded ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={beat.artworkUrl}
                alt={beat.title}
                className="w-14 h-14 rounded-2xl object-cover border border-purple-500/30 shadow-md"
              />
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">FREE DOWNLOAD</span>
                <h3 className="text-lg font-bold text-white line-clamp-1">{beat.title}</h3>
                <p className="text-xs text-zinc-400 font-mono">Tagged Demo MP3 · {beat.bpm} BPM</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 mb-5 leading-relaxed">
              Enter your email below to receive an instant direct download link for the tagged demo version of <strong>{beat.title}</strong> and join the VIP CASHMERE KID$ artist collective.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  Your Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="artist@label.com"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-500 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-950/60 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Tagged Beat</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-950 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-950/80">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">Download Started!</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Your tagged demo MP3 for <strong>{beat.title}</strong> is downloading. A backup copy was logged for <span className="text-purple-300 font-mono">{email}</span>.
            </p>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
