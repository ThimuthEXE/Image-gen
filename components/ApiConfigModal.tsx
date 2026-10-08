'use client';

import { X, Key, ShieldCheck, Cpu, CheckCircle2, ExternalLink } from 'lucide-react';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiConfigModal({ isOpen, onClose }: ApiConfigModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="api-config-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="api-config-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                API Configuration & Security
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Backend architecture & OpenAI setup
              </p>
            </div>
          </div>
          <button
            id="close-api-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-800 dark:text-emerald-300">
              <span className="font-semibold block mb-0.5">Zero Client-Side Exposure</span>
              Your OpenAI API key is never bundled or sent to the browser. All generation requests are proxied via the Next.js server route (<code className="px-1 py-0.5 bg-emerald-500/20 rounded font-mono">/api/generate</code>).
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500">
              <Cpu className="w-4 h-4 text-indigo-500" /> How to configure your API key
            </h4>
            <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 space-y-1">
              <p className="text-slate-400"># In your project root, edit .env.local:</p>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">OPENAI_API_KEY=sk-your-actual-key-here</p>
              <p className="text-slate-400"># Model preference:</p>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">OPENAI_IMAGE_MODEL=gpt-image-2.5-sunburst</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-slate-500">
              Features ready
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Automatic demo simulation fallback if key is empty
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Seamless fallback to DALL-E-3 if model alias requires subscription
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Error classification for rate limits (429) & safety checks (400)
              </li>
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Get OpenAI API Key <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors shadow-sm"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
