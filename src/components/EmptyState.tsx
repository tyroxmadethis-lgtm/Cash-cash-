import React from 'react';
import { LucideIcon, Radio, ShoppingBag, DollarSign, Users, BarChart2, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Radio,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="p-10 text-center bg-zinc-900/60 border border-zinc-800 rounded-3xl space-y-4 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-500/30 text-purple-300 flex items-center justify-center mx-auto shadow-xl">
        <Icon className="w-8 h-8 text-purple-400" />
      </div>

      <div className="space-y-1">
        <h3 className="font-extrabold text-white text-base uppercase tracking-widest">{title}</h3>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">{description}</p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-950 transition-all flex items-center gap-1.5 mx-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
