import React, { useState } from 'react';
import { X, Copy, Check, Code, ExternalLink } from 'lucide-react';
import { Beat } from '../types';

interface ShareModalProps {
  beat: Beat | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ beat, isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  if (!isOpen || !beat) return null;

  const beatUrl = `${window.location.origin}/#beat=${beat.id}`;
  const embedCode = `<iframe src="${window.location.origin}/embed/${beat.id}" width="100%" height="160" frameborder="0" scrolling="no"></iframe>`;

  const copyToClipboard = (text: string, isEmbed: boolean) => {
    navigator.clipboard.writeText(text);
    if (isEmbed) {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
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

        <div className="flex items-center gap-3 mb-5">
          <img
            src={beat.artworkUrl}
            alt={beat.title}
            className="w-12 h-12 rounded-xl object-cover border border-purple-500/30"
          />
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">SHARE INSTRUMENTAL</span>
            <h3 className="text-base font-bold text-white line-clamp-1">{beat.title}</h3>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Direct Beat Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={beatUrl}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(beatUrl, false)}
                className="px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedLink ? <Check className="w-4 h-4 text-purple-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 flex items-center gap-1">
              <Code className="w-3.5 h-3.5 text-purple-400" />
              <span>Embed Waveform Player</span>
            </label>
            <div className="flex gap-2">
              <textarea
                readOnly
                rows={2}
                value={embedCode}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-[11px] font-mono text-zinc-400 focus:outline-none resize-none"
              />
              <button
                onClick={() => copyToClipboard(embedCode, true)}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0 self-start"
              >
                {copiedEmbed ? <Check className="w-4 h-4 text-purple-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedEmbed ? 'Copied' : 'Embed'}</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-400">Social link:</span>
            <div className="flex items-center gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=Check%20out%20${encodeURIComponent(beat.title)}%20by%20Voodoo%20Boomin&url=${encodeURIComponent(beatUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3 text-purple-400" />
                <span>X / Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
