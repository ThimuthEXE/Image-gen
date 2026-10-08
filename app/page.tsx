'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import PromptForm from '@/components/PromptForm';
import ImageDisplay from '@/components/ImageDisplay';
import HistoryGallery from '@/components/HistoryGallery';
import LightboxModal from '@/components/LightboxModal';
import Toast, { ToastMessage } from '@/components/Toast';
import { AspectRatioSize, GeneratedImageResult, GenerateApiResponse } from '@/types';
import { AlertCircle, RefreshCw, KeyRound, Sparkles } from 'lucide-react';

const LOCAL_STORAGE_HISTORY_KEY = 'ai_image_studio_generations_v1';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState<AspectRatioSize>('1024x1024');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImageResult | null>(null);
  const [history, setHistory] = useState<GeneratedImageResult[]>([]);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load history from localStorage on initial client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as GeneratedImageResult[];
        setHistory(parsed);
        if (parsed.length > 0) {
          setCurrentImage(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to parse history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((items: GeneratedImageResult[]) => {
    setHistory(items);
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, []);

  // Toast helpers
  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Main Generation Handler
  const handleGenerate = async (overridePrompt?: string) => {
    const promptToUse = (overridePrompt || prompt).trim();
    if (!promptToUse) {
      addToast('error', 'Prompt Required', 'Please enter a description for your image.');
      return;
    }

    setIsGenerating(true);
    setErrorNotice(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptToUse,
          size: selectedSize,
          style: selectedPreset,
        }),
      });

      const data: GenerateApiResponse = await res.json();

      if (!res.ok || !data.success || (!data.data && !data.url)) {
        const msg = data.error || 'Failed to generate image. Please verify your API key or network.';
        setErrorNotice(msg);
        addToast('error', 'Generation Error', msg);
        return;
      }

      const imageUrl = data.data?.imageUrl || data.url || data.imageUrl || '';
      const newImage: GeneratedImageResult = data.data || {
        id: `img-${Date.now()}`,
        imageUrl,
        prompt: promptToUse,
        size: selectedSize,
        model: 'gpt-image-2.5-sunburst',
        createdAt: new Date().toISOString(),
        isDemo: data.isDemo,
      };

      setCurrentImage(newImage);

      // Add to session history without duplicates
      const updatedHistory = [newImage, ...history.filter((h) => h.id !== newImage.id)].slice(0, 30);
      saveHistory(updatedHistory);

      if (newImage.isDemo) {
        addToast(
          'info',
          'Demo Preview Created',
          'Image created with demo simulation. Add OPENAI_API_KEY to .env.local for live synthesis.'
        );
      } else {
        addToast('success', 'Artwork Created!', 'Your image has been generated successfully.');
      }
    } catch (err: any) {
      console.error('Generation network error:', err);
      const msg = err?.message || 'Unable to communicate with generation server.';
      setErrorNotice(msg);
      addToast('error', 'Network Failure', msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Selection from starter prompt card
  const handleSelectStarterPrompt = (starterPrompt: string) => {
    setPrompt(starterPrompt);
    handleGenerate(starterPrompt);
  };

  // Selection from History Gallery
  const handleSelectHistoryItem = (item: GeneratedImageResult) => {
    setCurrentImage(item);
    setPrompt(item.prompt);
    if (item.size && (item.size === '1024x1024' || item.size === '1024x1792' || item.size === '1792x1024')) {
      setSelectedSize(item.size as AspectRatioSize);
    }
    // Scroll smoothly to preview
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // Clear all history
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your generation history?')) {
      saveHistory([]);
      addToast('info', 'History Cleared', 'All local thumbnail records have been removed.');
    }
  };

  // Delete single history item
  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistory(updated);
    if (currentImage?.id === id) {
      setCurrentImage(updated[0] || null);
    }
  };

  // Robust image download handler
  const handleDownloadImage = async (img: GeneratedImageResult) => {
    try {
      addToast('info', 'Downloading', 'Preparing high-resolution file for download...');
      const response = await fetch(img.imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const sanitizedName = img.prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `ai-studio-${sanitizedName || 'artwork'}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      addToast('success', 'Download Complete', 'The image has been saved to your downloads.');
    } catch (e) {
      // Fallback direct link download
      const link = document.createElement('a');
      link.href = img.imageUrl;
      link.target = '_blank';
      link.download = `ai-studio-${Date.now()}.png`;
      link.click();
    }
  };

  // Copy Image URL handler
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast('success', 'Copied to Clipboard', 'Image URL copied successfully.');
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-indigo-500 selection:text-white">
      {/* Background radial lighting */}
      <div className="fixed inset-0 pointer-events-none radial-glow -z-10" />
      <div className="fixed inset-0 pointer-events-none grid-pattern opacity-30 -z-20" />

      {/* Header */}
      <Header isDemoMode={currentImage?.isDemo} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Error notification banner if any */}
        {errorNotice && (
          <div
            id="generation-error-banner"
            className="w-full max-w-4xl mx-auto p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start justify-between gap-3 text-rose-800 dark:text-rose-200 animate-scale-up"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold block">Generation Error</span>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{errorNotice}</p>
              </div>
            </div>
            <button
              onClick={() => handleGenerate()}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Section 1: Centered Prompt Creation Bar */}
        <section aria-label="Prompt Input">
          <PromptForm
            prompt={prompt}
            setPrompt={setPrompt}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedPreset={selectedPreset}
            setSelectedPreset={setSelectedPreset}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
          />
        </section>

        {/* Section 2: Display Area (Result, Skeleton Loader, or Placeholder) */}
        <section aria-label="Artwork Preview" className="pt-2">
          <ImageDisplay
            image={currentImage}
            isGenerating={isGenerating}
            selectedSize={selectedSize}
            activePrompt={prompt}
            onRegenerate={() => handleGenerate()}
            onSelectPrompt={handleSelectStarterPrompt}
            onOpenLightbox={() => setIsLightboxOpen(true)}
            onDownload={handleDownloadImage}
            onCopyUrl={handleCopyUrl}
          />
        </section>

        {/* Section 3: Recent Session Generations History Gallery */}
        <HistoryGallery
          history={history}
          activeImageId={currentImage?.id}
          onSelectImage={handleSelectHistoryItem}
          onClearHistory={handleClearHistory}
          onDeleteHistoryItem={handleDeleteHistoryItem}
          onDownload={handleDownloadImage}
        />
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">AI Image Studio</span>
            <span>—</span>
            <span>Powered by OpenAI & Next.js App Router</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Secure server proxy ensures your <code className="font-mono text-indigo-500">OPENAI_API_KEY</code> is never exposed.
          </p>
        </div>
      </footer>

      {/* Lightbox Fullscreen Modal */}
      <LightboxModal
        image={currentImage}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onDownload={handleDownloadImage}
        onCopyUrl={handleCopyUrl}
      />

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
