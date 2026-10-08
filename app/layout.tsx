import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Image Studio | Next-Gen AI Image Generator',
  description: 'Create high-resolution, photorealistic, and stylized artworks instantly with OpenAI image generation technology.',
  keywords: ['AI Image Generator', 'OpenAI', 'Text to Image', 'AI Studio', 'Next.js'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased font-['Plus_Jakarta_Sans',sans-serif] selection:bg-brand-500 selection:text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
