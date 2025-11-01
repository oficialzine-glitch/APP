import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface StorageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function StorageLimitModal({ isOpen, onClose, onContinue }: StorageLimitModalProps) {
  if (!isOpen) return null;

  const handleContinue = () => {
    onContinue();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full border border-yellow-500/30 shadow-2xl shadow-yellow-500/20 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex items-center justify-center mb-6">
          <div className="p-4 bg-yellow-500/20 rounded-full border border-yellow-500/30">
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Storage Limit Reached
        </h2>

        <p className="text-slate-300 text-center mb-6 leading-relaxed">
          You've reached your limit of 10 stored analyses. You can still perform more facial analyses, but they won't be saved to your history.
        </p>

        <p className="text-slate-400 text-sm text-center mb-8">
          To make space for new analyses, delete some older ones from your Results page.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-700/60 hover:bg-slate-600/60 text-white rounded-xl font-medium transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-yellow-500/30"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
