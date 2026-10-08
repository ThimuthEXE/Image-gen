'use client';

import { useState, useEffect } from 'react';
import { 
  Download, 
  Copy, 
  RotateCw, 
  Maximize2, 
  Sparkles, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Image as ImageIcon,
  Flame,
  ArrowRight
} from 'lucide-react';
import { GeneratedImageResult, AspectRatioSize } from '@/types';

interface ImageDisplayProps {
  image: GeneratedImageResult | null;
  isGenerating: boolean;
  selectedSize: AspectRatioSize;
  activePrompt: string;
  onRegenerate: () => void;
  onSelectPrompt: (p: string) => void;
  onOpenLightbox: () => void;
  onDownload: (img: GeneratedImageResult) => void;
  onCopyUrl: (url: string) => void;
}

const GENERATING_STEPS = [
  'Connecting to neural pipeline...',
  'Interpreting semantic nuances & style tokens...',
  'Synthesizing latent diffusion representation...',
  'Refining lighting, textures & chromatic depth...',
  'Finalizing high-resolution output...',
];

const INSPIRATION_CARDS = [
  {
    title: 'Cyberpunk Skyline',
    prompt: 'Neon drenched cyberpunk metropolis in torrential rain, flying vehicles between glass skyscrapers, cinematic lighting, 8k resolution',
    tag: 'Sci-Fi',
  },
  {
    title: 'Ghibli Meadow',
    prompt: 'Enchanted anime meadow with glowing wildflowers and ancient stone ruins under fluffy clouds, Studio Ghibli aesthetic, vibrant colors',
    tag: 'Anime',
  },
  {
    title: 'Renaissance Astronaut',
    prompt: 'An astronaut floating in deep cosmos surrounded by classical Renaissance oil painting clouds and cherubs, high detail, masterpiece',
    tag: 'Surreal',
  },
];

export default function ImageDisplay({
  image,
  isGenerating,
  selectedSize,
  activePrompt,
  onRegenerate,
  onSelectPrompt,
  onOpenLightbox,
  onDownload,
  onCopyUrl,
}: ImageDisplayProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showRevised, setShowRevised] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Cycling generation message & timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timer: NodeJS.Timeout;

    if (isGenerating) {
      setElapsedSeconds(0);
      setLoadingStepIdx(0);

      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % GENERATING_STEPS.length);
      }, 3000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [isGenerating]);

  const handleCopyUrl = (url: string) => {
    onCopyUrl(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  // Determine aspect ratio class
  const getAspectRatioClass = () => {
    if (selectedSize === '1024x1792') return 'aspect-[9/16] max-w-sm';
    if (selectedSize === '1792x1024') return 'aspect-[16/9] max-w-4xl';
    return 'aspect-square max-w-xl';
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* State 1: Skeleton Loader during Generation */}
      {isGenerating && (
        <div
          id="generating-skeleton-loader"
          className={`w-full ${getAspectRatioClass()} mx-auto rounded-3xl overflow-hidden glass-panel-elevated relative flex flex-col items-center justify-center p-6 border-2 border-indigo-500/30 animate-pulse-slow shadow-2xl`}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 dark:via-indigo-400/15 to-transparent animate-shimmer-sweep" />

          {/* Animated center orb */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 animate-spin">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
            </div>
            <div className="absolute -inset-3 rounded-full bg-indigo-500/20 blur-xl -z-10 animate-pulse" />
          </div>

          {/* Step message & timer */}
          <div className="text-center space-y-2 z-10 max-w-md px-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Creating your artwork
            </h3>
            <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-medium transition-all duration-300 min-h-[20px]">
              {GENERATING_STEPS[loadingStepIdx]}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{elapsedSeconds}s elapsed</span>
            </div>
          </div>

          {/* Skeleton progress bars */}
          <div className="w-48 mt-6 space-y-1.5">
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full w-2/3 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* State 2: Generated Image Preview */}
      {!isGenerating && image && (
        <div id="generated-image-result" className="w-full max-w-4xl space-y-5 animate-scale-up">
          {/* Main Visual Display Card */}
          <div className="glass-panel-elevated rounded-3xl overflow-hidden p-3 sm:p-5 relative group border border-slate-200/80 dark:border-slate-800/90 shadow-2xl">
            {/* Aspect container */}
            <div
              className={`relative mx-auto rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center cursor-pointer ${getAspectRatioClass()}`}
              onClick={onOpenLightbox}
              title="Click to view full screen"
            >
              {/* Image element */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                id="generated-artwork-img"
                src={image.imageUrl}
                alt={image.prompt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Hover Fullscreen Badge */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white font-medium text-xs flex items-center gap-2 border border-white/30 shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                  <span>View Fullscreen</span>
                </div>
              </div>

              {/* Top overlay metadata badge */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-mono border border-white/10">
                  {image.size}
                </span>

                {image.isDemo ? (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/90 text-white text-[11px] font-semibold shadow-md">
                    Demo Mode
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/90 text-white text-[11px] font-semibold shadow-md">
                    OpenAI Generated
                  </span>
                )}
              </div>
            </div>

            {/* Prompt Description & Info Bar */}
            <div className="mt-4 px-2 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Prompt
                  </h4>
                  <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                    &ldquo;{image.prompt}&rdquo;
                  </p>
                </div>

                <button
                  id="copy-prompt-btn"
                  onClick={() => handleCopyPrompt(image.prompt)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex-shrink-0"
                  title="Copy Prompt"
                >
                  {copiedPrompt ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Revised Prompt expandable toggle (if revised exists) */}
              {image.revisedPrompt && image.revisedPrompt !== image.prompt && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => setShowRevised(!showRevised)}
                    className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    <span>{showRevised ? 'Hide' : 'View'} AI Revised Enhancement</span>
                    {showRevised ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {showRevised && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 italic font-serif leading-relaxed">
                      {image.revisedPrompt}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons Toolbar */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                {/* Download button */}
                <button
                  id="download-image-btn"
                  onClick={() => onDownload(image)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 shadow-md shadow-indigo-600/20 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </button>

                {/* Copy Image URL */}
                <button
                  id="copy-image-url-btn"
                  onClick={() => handleCopyUrl(image.imageUrl)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 border border-slate-200/80 dark:border-slate-700/60 active:scale-95"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Copied!
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Image URL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Regenerate button */}
              <button
                id="regenerate-image-btn"
                onClick={onRegenerate}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 border border-slate-200/80 dark:border-slate-700/60 active:scale-95"
              >
                <RotateCw className="w-4 h-4" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State 3: Prominent Placeholder State (Empty Canvas) */}
      {!isGenerating && !image && (
        <div
          id="empty-state-placeholder"
          className="w-full max-w-3xl rounded-3xl glass-panel-elevated p-8 sm:p-12 text-center relative overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl"
        >
          {/* Subtle background radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Central artistic icon badge */}
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-pink-500/15 border border-indigo-500/20 flex items-center justify-center">
              <ImageIcon className="w-9 h-9 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 text-white shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
            Your Creative Canvas Awaits
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
            Type your vision above or select a starter prompt below. Next-gen AI will synthesize a masterpiece in seconds.
          </p>

          {/* Prompt Inspiration Starter Cards */}
          <div className="text-left space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Trending Inspirations (Click to try)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {INSPIRATION_CARDS.map((card, idx) => (
                <button
                  key={idx}
                  id={`starter-card-${idx}`}
                  type="button"
                  onClick={() => onSelectPrompt(card.prompt)}
                  className="group p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-800 hover:border-indigo-400/60 dark:hover:border-indigo-600/60 transition-all duration-200 text-left flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        {card.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 font-medium">
                        {card.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {card.prompt}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                    <span>Use prompt</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
