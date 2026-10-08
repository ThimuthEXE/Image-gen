'use client';

import { History, Download, Trash2, ArrowUpRight, Clock, Sparkles } from 'lucide-react';
import { GeneratedImageResult } from '@/types';

interface HistoryGalleryProps {
  history: GeneratedImageResult[];
  activeImageId?: string;
  onSelectImage: (image: GeneratedImageResult) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
  onDownload: (image: GeneratedImageResult) => void;
}

export default function HistoryGallery({
  history,
  activeImageId,
  onSelectImage,
  onClearHistory,
  onDeleteHistoryItem,
  onDownload,
}: HistoryGalleryProps) {
  if (history.length === 0) return null;

  return (
    <section id="recent-generations-section" className="w-full max-w-5xl mx-auto pt-8 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <History className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Session History
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {history.length}
          </span>
        </div>

        <button
          id="clear-all-history-btn"
          onClick={onClearHistory}
          className="inline-flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {/* Grid of Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {history.map((item) => {
          const isActive = item.id === activeImageId;

          return (
            <div
              key={item.id}
              id={`history-item-${item.id}`}
              className={`group relative rounded-2xl overflow-hidden glass-panel border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                isActive
                  ? 'ring-2 ring-indigo-500 shadow-md shadow-indigo-500/20 border-indigo-500'
                  : 'hover:border-indigo-400/50 dark:hover:border-indigo-600/50'
              }`}
              onClick={() => onSelectImage(item)}
            >
              {/* Thumbnail image container */}
              <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-white/90">
                      {item.size}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistoryItem(item.id);
                      }}
                      className="p-1 rounded-md bg-black/60 hover:bg-rose-600 text-white/80 hover:text-white transition-colors"
                      title="Delete from history"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div>
                    <p className="text-[11px] text-white font-medium line-clamp-2 leading-tight">
                      {item.prompt}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between pt-1 border-t border-white/20">
                      <span className="text-[10px] text-indigo-300 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> View
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload(item);
                        }}
                        className="p-1 rounded bg-white/20 hover:bg-white/40 text-white transition-colors"
                        title="Download"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom mini label */}
              <div className="p-2 bg-white/90 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-700 dark:text-slate-300 truncate font-medium">
                  {item.prompt}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>{item.styleApplied || 'Standard'}</span>
                  <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
