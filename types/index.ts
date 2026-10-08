export type AspectRatioSize = '1024x1024' | '1024x1792' | '1792x1024';

export interface StylePreset {
  id: string;
  name: string;
  iconName: string;
  suffix: string;
  description: string;
  previewGradient: string;
}

export interface GenerateImagePayload {
  prompt: string;
  size?: AspectRatioSize | string;
  style?: string;
  quality?: 'standard' | 'hd';
}

export interface GeneratedImageResult {
  id: string;
  imageUrl: string;
  prompt: string;
  rawPrompt?: string;
  revisedPrompt?: string;
  styleApplied?: string;
  size: string;
  model: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface GenerateApiResponse {
  success: boolean;
  url?: string;
  imageUrl?: string;
  data?: GeneratedImageResult;
  error?: string;
  details?: string;
  isDemo?: boolean;
}
