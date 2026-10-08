# 🎨 AI Image Studio

A full-stack, responsive AI Image Generation web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **OpenAI Image Generation API**.

---

## ✨ Features

- **🛡️ Secure Server Proxy**: Your `OPENAI_API_KEY` is strictly handled on the server via Next.js Route Handlers (`/api/generate`) and never exposed to the client.
- **⚡ OpenAI Integration**: Configured to call OpenAI's Image Generations API with model `gpt-image-2.5-sunburst` (and automatic fallback to `dall-e-3`).
- **🎭 Quick Style Presets**: One-click prompt enhancements including:
  - *Photorealistic*, *Anime*, *Oil Painting*, *Children's Drawing*, *Cyberpunk*, *Cinematic*, *3D Render*.
- **📐 Aspect Ratio & Sizing**: Choose from:
  - Square (`1024x1024` - 1:1)
  - Portrait (`1024x1792` - 9:16)
  - Landscape (`1792x1024` - 16:9)
- **🎲 Prompt Inspiration & Randomizer**: "Surprise Me" button and trending starter prompts to ignite creativity immediately.
- **🖼️ Rich Display States**:
  - *Empty State*: Elegant canvas with inspiration starter cards.
  - *Skeleton Loader*: Dynamic progress indicator & timer during generation.
  - *High-Res Result*: Interactive preview with zoom lightbox, revised prompt viewer, and direct actions.
- **💾 Session History Gallery**: Local history strip with thumbnail previews, localStorage persistence, and quick reload into prompt.
- **📥 Image Actions**: Download high-resolution files, copy image links to clipboard, regenerate, and open in fullscreen.
- **🌓 Dark & Light Mode**: Fluid, persistent theme toggle with glassmorphism and modern radiant aesthetics.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested with Node.js 24)
- npm or yarn

### 2. Installation

Clone or open the repository folder and install dependencies:
```bash
npm install
```

### 3. Environment Variables Configuration

Copy the example environment file:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your OpenAI API key:
```env
# Required for live generation:
OPENAI_API_KEY=sk-your-openai-api-key-here

# Preferred generation model:
OPENAI_IMAGE_MODEL=gpt-image-2.5-sunburst

# Demo Fallback Mode (optional: provides simulated artwork if key is not yet set):
ENABLE_DEMO_FALLBACK=true
```

> **Note**: If `OPENAI_API_KEY` is not provided or set to demo mode, the application will automatically enter **Demo Simulation Mode**, allowing you to test the entire interface and workflow without encountering fatal errors.

### 4. Running the Development Server

Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Project Structure

```text
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts        # Secure backend API route communicating with OpenAI
│   ├── globals.css             # Tailwind directives, theme variables, glassmorphism styles
│   ├── layout.tsx              # Root HTML shell, fonts, SEO tags, dark mode script
│   └── page.tsx                # Main AI Studio page with state & history persistence
├── components/
│   ├── ApiConfigModal.tsx      # In-app setup & security modal
│   ├── Header.tsx              # Top navigation bar, model badge & theme toggle
│   ├── HistoryGallery.tsx      # Session history thumbnail gallery & actions
│   ├── ImageDisplay.tsx        # Placeholder, skeleton loader & high-res artwork display
│   ├── LightboxModal.tsx       # Fullscreen zoom lightbox modal
│   ├── PromptForm.tsx          # Multi-line prompt input, presets & size selector
│   ├── ThemeToggle.tsx         # Dark / Light theme toggle
│   └── Toast.tsx               # Feedback toast notification system
├── types/
│   └── index.ts                # TypeScript interfaces & types
├── .env.example                # Example environment variables template
├── .env.local                  # Local environment file (ignored by git)
├── next.config.mjs             # Next.js config with remote image domains
├── tailwind.config.ts          # Custom Tailwind tokens, colors, keyframe animations
└── tsconfig.json               # TypeScript configuration
```

---

## 📡 API Endpoint Reference

### `POST /api/generate`

#### Request Payload
```json
{
  "prompt": "A serene mountain sanctuary with golden sunrise reflections",
  "size": "1024x1024",
  "style": "photorealistic"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "img-1728359000",
    "imageUrl": "https://...",
    "prompt": "A serene mountain sanctuary with golden sunrise reflections...",
    "revisedPrompt": "...",
    "styleApplied": "photorealistic",
    "size": "1024x1024",
    "model": "gpt-image-2.5-sunburst",
    "createdAt": "2026-10-08T03:30:00.000Z",
    "isDemo": false
  }
}
```

#### Error Handling
Gracefully handles:
- Missing / invalid prompts (`400 Bad Request`)
- Missing or unauthorized API keys (`401 Unauthorized`)
- OpenAI Rate Limits & Billing limits (`429 Too Many Requests`)
- Safety policy violations (`400 Bad Request` with descriptive explanation)

---

## 🔒 Security Best Practices
- **No Client Exposure**: The OpenAI API key is read solely within server-side route handlers (`process.env.OPENAI_API_KEY`).
- **No `NEXT_PUBLIC_` Prefix**: Secrets avoid the Next.js client bundling prefix.
- `.env.local` is kept out of public commits via `.gitignore`.
