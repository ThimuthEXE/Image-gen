'use client';

import { useState } from 'react';
import { Sparkles, Settings2, ShieldCheck, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import ApiConfigModal from './ApiConfigModal';

interface HeaderProps {
  isDemoMode?: boolean;
}

export default function Header({ isDemoMode = false }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-md shadow-indigo-500/20 text-white">
              <Sparkles className="w-6 h-6 animate-pulse-slow" />
              <div className="absolute -inset-1 rounded-2xl bg-indigo-500/20 blur-sm -z-10" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  AI Image <span className="text-gradient">Studio</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50">
                  <Zap className="w-3 h-3 text-indigo-500" /> v2.5
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal truncate">
                Craft breathtaking visuals with cutting-edge artificial intelligence
              </p>
            </div>
          </div>

          {/* Right Controls: Model Badge, Settings & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status indicator */}
            <button
              id="api-status-badge-btn"
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 transition-all duration-200"
              title="Click to view API & security settings"
            >
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="font-mono text-[11px]">gpt-image-2.5-sunburst</span>
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              id="security-info-mobile-btn"
              onClick={() => setIsModalOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              aria-label="API Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <ApiConfigModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
