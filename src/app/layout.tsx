import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { SkipLinks } from "@/components/accessibility/SkipLinks";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aplikasi Pembelajaran Tunanetra - Platform Edukasi Inklusif",
  description: "Aplikasi pembelajaran yang dirancang khusus untuk penyandang tunanetra dengan fitur aksesibilitas lengkap, pembaca suara, dan navigasi keyboard yang optimal.",
  keywords: ["pembelajaran", "tunanetra", "aksesibilitas", "edukasi inklusif", "screen reader", "text-to-speech"],
  authors: [{ name: "Tim Aksesibilitas" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-152x152.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Belajar Tunanetra",
    startupImage: [
      {
        url: "/icons/icon-192x192.png",
        media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/icons/icon-192x192.png",
        media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  openGraph: {
    title: "Aplikasi Pembelajaran Tunanetra",
    description: "Platform edukasi inklusif dengan aksesibilitas lengkap untuk penyandang tunanetra",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aplikasi Pembelajaran Tunanetra",
    description: "Platform edukasi inklusif dengan aksesibilitas lengkap",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Belajar Tunanetra",
    "application-name": "Belajar Tunanetra",
    "msapplication-TileColor": "#0ea5e9",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AccessibilityProvider>
          <SkipLinks />
          {children}
          <Toaster />
        </AccessibilityProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Service Worker Registration for Vercel
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  // Try to register the Vercel-optimized service worker first
                  navigator.serviceWorker.register('/sw-vercel.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                      
                      // Check for updates periodically
                      setInterval(() => {
                        registration.update();
                      }, 60 * 60 * 1000); // Check every hour
                    })
                    .catch(function(error) {
                      console.log('SW registration failed with sw-vercel.js, trying sw.js: ', error);
                      
                      // Fallback to original service worker
                      navigator.serviceWorker.register('/sw.js')
                        .then(function(registration) {
                          console.log('SW registered with fallback: ', registration);
                        })
                        .catch(function(registrationError) {
                          console.log('SW registration completely failed: ', registrationError);
                        });
                    });
                });
              }
              
              // PWA Install Prompt Handler
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                console.log('Install prompt ready');
                
                // Store for later use
                window.deferredPrompt = deferredPrompt;
              });
              
              // Handle app installed event
              window.addEventListener('appinstalled', (evt) => {
                console.log('App was installed');
                window.deferredPrompt = null;
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
