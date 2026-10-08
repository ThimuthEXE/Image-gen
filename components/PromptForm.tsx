'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Dices, 
  X, 
  Layers, 
  Maximize2, 
  Square, 
  RectangleHorizontal, 
  RectangleVertical,
  Loader2,
  ChevronDown,
  Info
} from 'lucide-react';
import { AspectRatioSize, StylePreset } from '@/types';

interface PromptFormProps {
  prompt: string;
  setPrompt: (p: string) => void;
  selectedSize: AspectRatioSize;
  setSelectedSize: (size: AspectRatioSize) => void;
  selectedPreset: string | null;
  setSelectedPreset: (id: string | null) => void;
  isGenerating: boolean;
  onGenerate: (overridePrompt?: string) => void;
}

const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'children-book',
    name: "Children's book illustration",
    iconName: 'Smile',
    suffix: ", whimsical children's book illustration, vibrant playful colors, storybook art style, charming and naive details",
    description: 'Charming storybook art style with whimsical touches',
    previewGradient: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'photorealistic',
    name: 'Photorealistic 8k',
    iconName: 'Camera',
    suffix: ', ultra-realistic photography, 8k resolution, highly detailed textures, professional studio lighting, canon eos r5',
    description: 'Crisp camera lens detail and real-world lighting',
    previewGradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk neon aesthetic',
    iconName: 'Zap',
    suffix: ', cyberpunk neon aesthetic, rainy night cityscape, volumetric holographic glow, futuristic synthwave vibe',
    description: 'Futuristic neon lights and dystopian aesthetic',
    previewGradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'impressionist',
    name: 'Impressionist oil painting',
    iconName: 'Palette',
    suffix: ', classical impressionist oil painting, textured impasto brushstrokes, rich color palette, museum fine art masterpiece',
    description: 'Rich artistic brushstrokes on canvas',
    previewGradient: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'ghibli',
    name: 'Studio Ghibli anime style',
    iconName: 'Sparkles',
    suffix: ', Studio Ghibli anime style, Hayao Miyazaki aesthetic, hand-drawn anime background, luminous clouds, lush scenery',
    description: 'Dynamic Studio Ghibli animation aesthetic',
    previewGradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'cinematic',
    name: 'Cinematic 35mm',
    iconName: 'Film',
    suffix: ', cinematic 35mm film still, anamorphic lens flare, shallow depth of field, dramatic moody lighting',
    description: 'Dramatic lighting from high-budget cinema',
    previewGradient: 'from-purple-600 to-indigo-700',
  },
  {
    id: '3d-render',
    name: '3D Octane Render',
    iconName: 'Box',
    suffix: ', stylized 3D octane render, smooth clay materials, subsurface scattering, ambient occlusion, raytraced',
    description: 'Polished 3D digital scene with soft lighting',
    previewGradient: 'from-violet-500 to-fuchsia-600',
  },
];

const SURPRISE_PROMPTS: string[] = [
  "A children drawing of a veterinarian using a stethoscope to listen to a baby otter in a cozy clinic",
  "A mystical floating island covered in bioluminescent cherry blossoms and crystalline waterfalls cascading into clouds",
  "A cozy futuristic cafe in a glass dome on Mars during a cosmic meteor shower, warm barista serving glowing latte",
  "An ancient library with spiraling wooden staircases reaching into eternity, glowing ancient scrolls floating mid-air",
  "A majestic snow leopard wearing ornate samurai armor perched on a misty Himalayan mountain peak at sunrise",
  "A high-tech cybernetic hummingbird sipping holographic nectar from a mechanical neon flower in neo-Tokyo",
  "A serene Japanese zen garden built inside an orbital space station overlooking the curvature of the Earth",
  "A crystalline dragon curled atop a glowing iceberg under the vibrant dancing aurora borealis"
];

const SIZES: { label: string; value: AspectRatioSize; ratio: string; icon: any }[] = [
  { label: 'Square (1:1)', value: '1024x1024', ratio: '1:1', icon: Square },
  { label: 'Portrait (9:16)', value: '1024x1792', ratio: '9:16', icon: RectangleVertical },
  { label: 'Landscape (16:9)', value: '1792x1024', ratio: '16:9', icon: RectangleHorizontal },
];

export default function PromptForm({
  prompt,
  setPrompt,
  selectedSize,
  setSelectedSize,
  selectedPreset,
  setSelectedPreset,
  isGenerating,
  onGenerate,
}: PromptFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPresetsHelp, setShowPresetsHelp] = useState(false);

  // Auto-resize textarea as text grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [prompt]);

  // Handle keyboard shortcut: Enter generates, Shift+Enter adds newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && prompt.trim()) {
        onGenerate();
      }
    }
  };

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * SURPRISE_PROMPTS.length);
    const chosen = SURPRISE_PROMPTS[randomIndex];
    setPrompt(chosen);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleClear = () => {
    setPrompt('');
    setSelectedPreset(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const togglePreset = (preset: StylePreset) => {
    if (selectedPreset === preset.id) {
      // Deselect preset
      setSelectedPreset(null);
      // Remove preset suffix if present
      if (prompt.endsWith(preset.suffix)) {
        setPrompt(prompt.replace(preset.suffix, '').trim());
      }
    } else {
      // Find old preset to remove suffix if switching
      let newPrompt = prompt;
      if (selectedPreset) {
        const oldPreset = STYLE_PRESETS.find((p) => p.id === selectedPreset);
        if (oldPreset && newPrompt.endsWith(oldPreset.suffix)) {
          newPrompt = newPrompt.replace(oldPreset.suffix, '').trim();
        }
      }
      setSelectedPreset(preset.id);
      // Append style suffix cleanly
      if (!newPrompt.includes(preset.suffix.trim())) {
        newPrompt = newPrompt.trim() + preset.suffix;
      }
      setPrompt(newPrompt);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Main Prompt Card */}
      <div className="glass-panel-elevated rounded-3xl p-4 sm:p-6 transition-all duration-300 relative overflow-hidden group focus-within:ring-2 focus-within:ring-indigo-500/50">
        {/* Subtle accent border glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60" />

        {/* Top toolbar inside prompt card */}
        <div className="flex items-center justify-between pb-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Describe your vision</span>
          </div>

          <div className="flex items-center gap-2">
            {prompt.trim() && (
              <button
                id="clear-prompt-btn"
                type="button"
                onClick={handleClear}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Clear prompt"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              id="surprise-me-btn"
              type="button"
              onClick={handleRandomize}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 font-medium transition-colors"
              title="Generate a random creative prompt"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Surprise Me</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            id="prompt-input"
            ref={textareaRef}
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. A serene mountain sanctuary nestled above misty clouds, morning golden hour lighting, cinematic details..."
            disabled={isGenerating}
            className="w-full bg-transparent resize-none border-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 text-base sm:text-lg leading-relaxed disabled:opacity-50"
          />
        </div>

        {/* Bottom controls: presets, size & submit */}
        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Aspect Ratio / Size Picker */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-1 hidden sm:inline">
              Size:
            </span>
            <div className="inline-flex p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60">
              {SIZES.map((s) => {
                const Icon = s.icon;
                const isSelected = selectedSize === s.value;
                return (
                  <button
                    key={s.value}
                    id={`size-btn-${s.value}`}
                    type="button"
                    onClick={() => setSelectedSize(s.value)}
                    disabled={isGenerating}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title={s.label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{s.ratio}</span>
                  </button>
                );
              })}
            </div>

            <span className="text-[11px] font-mono text-slate-400 ml-2 hidden sm:inline">
              {prompt.length}/1000
            </span>
          </div>

          {/* Generate Button */}
          <div className="flex items-center gap-3">
            <div className="text-[11px] text-slate-400 hidden xl:flex items-center gap-1.5">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                Enter
              </kbd>
              <span>to generate</span>
            </div>

            <button
              id="generate-image-button"
              type="button"
              onClick={() => onGenerate()}
              disabled={isGenerating || !prompt.trim()}
              className="w-full sm:w-auto relative group overflow-hidden px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Artwork</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Style Presets Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Style Presets
          </span>
          <span className="text-[11px] text-slate-400">
            Click to auto-enhance prompt styling
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
          {STYLE_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                id={`preset-btn-${preset.id}`}
                type="button"
                onClick={() => togglePreset(preset)}
                disabled={isGenerating}
                className={`flex-shrink-0 group relative px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md shadow-indigo-500/25 scale-105'
                    : 'bg-white/80 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
                title={preset.description}
              >
                <span
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${preset.previewGradient} ${
                    isSelected ? 'ring-2 ring-white/60' : ''
                  }`}
                />
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
