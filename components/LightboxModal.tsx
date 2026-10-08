'use client';

import { useEffect } from 'react';
import { X, Download, Copy, ExternalLink } from 'lucide-react';
import { GeneratedImageResult } from '@/types';

interface LightboxModalProps {
  image: GeneratedImageResult | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (img: GeneratedImageResult) => void;
  onCopyUrl: (url: string) => void;
}

export default function LightboxModal({
  image,
  isOpen,
  onClose,
  onDownload,
  onCopyUrl,
}: LightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !image) return null;

  return (
    <div
      id="lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        id="lightbox-close-btn"
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-200"
        title="Close (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Container */}
      <div
        className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-h-[75vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.imageUrl}
            alt={image.prompt}
            className="w-auto h-auto max-h-[75vh] max-w-full object-contain select-none"
          />
        </div>

        {/* Caption & Actions */}
        <div className="mt-4 w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-2xl text-center sm:text-left">
            &ldquo;{image.prompt}&rdquo;
          </p>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onCopyUrl(image.imageUrl)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy URL</span>
            </button>

            <button
              onClick={() => onDownload(image)}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download High-Res</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
