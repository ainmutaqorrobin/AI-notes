import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

const manrope = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-editorial",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | AI Notes",
    default: "AI Notes",
  },
  description:
    "A premium AI-assisted notes workspace for professionals, built with Convex and the Vercel AI SDK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${manrope.variable} ${fraunces.variable}`}
      >
        <body className="font-sans antialiased">
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <Toaster position="top-right" />
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
