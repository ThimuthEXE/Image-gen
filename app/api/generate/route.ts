import { NextRequest, NextResponse } from 'next/server';
import { GenerateApiResponse, GeneratedImageResult } from '@/types';

// Curated demo artwork library for immediate zero-config testing when OPENAI_API_KEY is not configured
const DEMO_PRESETS_GALLERY: { [key: string]: string[] } = {
  general: [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=1200&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=85",
  ],
  cyberpunk: [
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=85",
  ],
  anime: [
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=85",
  ],
  nature: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=85",
  ],
};

function getDemoImage(prompt: string): string {
  const lower = prompt.toLowerCase();
  let pool = DEMO_PRESETS_GALLERY.general;
  if (lower.includes('cyberpunk') || lower.includes('neon') || lower.includes('futuristic')) {
    pool = DEMO_PRESETS_GALLERY.cyberpunk;
  } else if (lower.includes('anime') || lower.includes('manga') || lower.includes('art')) {
    pool = DEMO_PRESETS_GALLERY.anime;
  } else if (lower.includes('landscape') || lower.includes('forest') || lower.includes('mountain')) {
    pool = DEMO_PRESETS_GALLERY.nature;
  }
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, size = '1024x1024', style } = body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json<GenerateApiResponse>(
        {
          success: false,
          error: 'Prompt is required. Please provide a description for the image.',
        },
        { status: 400 }
      );
    }

    if (prompt.trim().length > 1000) {
      return NextResponse.json<GenerateApiResponse>(
        {
          success: false,
          error: 'Prompt too long. Please limit prompts to under 1,000 characters.',
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2.5-sunburst';
    const enableDemo = process.env.ENABLE_DEMO_FALLBACK === 'true' || !apiKey;

    // Check if API key is not configured
    if (!apiKey || apiKey === 'your_openai_api_key_here' || apiKey.startsWith('sk-placeholder')) {
      if (enableDemo) {
        // Return a realistic simulation to allow UI testing without crashing
        await new Promise((resolve) => setTimeout(resolve, 1800)); // Simulate generation latency
        const demoImageUrl = getDemoImage(prompt);
        const demoResult: GeneratedImageResult = {
          id: `demo-${Date.now()}`,
          imageUrl: demoImageUrl,
          prompt: prompt.trim(),
          revisedPrompt: `High dynamic range visualization: ${prompt.trim()}, masterpiece quality, ultra-detailed textures, volumetric lighting.`,
          styleApplied: style || 'Default',
          size: size || '1024x1024',
          model: `${model} (Demo Simulation)`,
          createdAt: new Date().toISOString(),
          isDemo: true,
        };

        return NextResponse.json<GenerateApiResponse>({
          success: true,
          url: demoImageUrl,
          imageUrl: demoImageUrl,
          data: demoResult,
          isDemo: true,
        });
      }

      return NextResponse.json<GenerateApiResponse>(
        {
          success: false,
          error: 'OpenAI API key is missing. Please add OPENAI_API_KEY to your .env.local file.',
        },
        { status: 401 }
      );
    }

    // Call OpenAI Image Generation API with primary model
    const payload = {
      model,
      prompt: prompt.trim(),
      n: 1,
      size: size || '1024x1024',
    };

    let response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data = await response.json();

    // Fallback attempt: If custom model name returns a 400/404 model not found error, retry with 'dall-e-3'
    if (!response.ok && data?.error?.message?.toLowerCase().includes('model')) {
      console.warn(`Model ${model} was not accepted by OpenAI API. Retrying with 'dall-e-3'...`);
      const fallbackPayload = {
        model: 'dall-e-3',
        prompt: prompt.trim(),
        n: 1,
        size: size || '1024x1024',
      };

      const fallbackResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fallbackPayload),
      });

      if (fallbackResponse.ok) {
        response = fallbackResponse;
        data = await fallbackResponse.json();
      }
    }

    // Handle API errors gracefully
    if (!response.ok) {
      const errorMessage = data?.error?.message || 'Failed to generate image from OpenAI.';
      const statusCode = response.status;

      // If user enabled demo fallback and account is out of credits (429), fall back to preview simulation with notice
      if (enableDemo && statusCode === 429) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const demoImageUrl = getDemoImage(prompt);
        const demoResult: GeneratedImageResult = {
          id: `demo-${Date.now()}`,
          imageUrl: demoImageUrl,
          prompt: prompt.trim(),
          revisedPrompt: `High dynamic range visualization: ${prompt.trim()}, masterpiece quality, ultra-detailed textures, volumetric lighting.`,
          styleApplied: style || 'Default',
          size: size || '1024x1024',
          model: `${model} (Simulated - Quota Exceeded)`,
          createdAt: new Date().toISOString(),
          isDemo: true,
        };

        return NextResponse.json<GenerateApiResponse>({
          success: true,
          url: demoImageUrl,
          imageUrl: demoImageUrl,
          data: demoResult,
          isDemo: true,
          details: 'Your OpenAI account has 0 credits remaining. Add credits at platform.openai.com/settings/organization/billing to enable live DALL-E generation.',
        });
      }

      let userFriendlyError = errorMessage;
      if (statusCode === 401) {
        userFriendlyError = 'Invalid OpenAI API key. Please check your credentials in .env.local.';
      } else if (statusCode === 429) {
        userFriendlyError = errorMessage || 'OpenAI rate limit or billing quota exceeded. Please check your account usage and limits.';
      } else if (statusCode === 400 && errorMessage.toLowerCase().includes('safety')) {
        userFriendlyError = 'The prompt was flagged by OpenAI safety guidelines. Please modify your prompt and try again.';
      }

      return NextResponse.json<GenerateApiResponse>(
        {
          success: false,
          error: userFriendlyError,
          details: errorMessage,
        },
        { status: statusCode }
      );
    }

    // Successful generation
    const imageItem = data?.data?.[0];
    if (!imageItem?.url && !imageItem?.b64_json) {
      return NextResponse.json<GenerateApiResponse>(
        {
          success: false,
          error: 'No image data returned from OpenAI.',
        },
        { status: 502 }
      );
    }

    const imageUrl = imageItem.url || `data:image/png;base64,${imageItem.b64_json}`;
    const result: GeneratedImageResult = {
      id: `img-${Date.now()}`,
      imageUrl,
      prompt: prompt.trim(),
      revisedPrompt: imageItem.revised_prompt || prompt.trim(),
      styleApplied: style,
      size: size || '1024x1024',
      model,
      createdAt: new Date().toISOString(),
      isDemo: false,
    };

    return NextResponse.json<GenerateApiResponse>({
      success: true,
      url: imageUrl,
      imageUrl: imageUrl,
      data: result,
      isDemo: false,
    });
  } catch (error: any) {
    console.error('Error generating image in /api/generate:', error);
    return NextResponse.json<GenerateApiResponse>(
      {
        success: false,
        error: error?.message || 'An unexpected error occurred while communicating with the AI service.',
      },
      { status: 500 }
    );
  }
}
