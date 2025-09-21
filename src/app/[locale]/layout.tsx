import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "./providers";
import ChatbotClientWrapper from "@/components/layout/ChatbotClientWrapper";
import { Toaster } from "@/components/ui/sonner"
 // <--- Composant client !

const inter = Inter({
  subsets: ['latin'],
  variable: "--font-inter",
  preload: false,
});

const RootLayout = async ({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>
}>) => {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased`}
      >
        <Providers locale={(await params).locale}>
          {children}
         {/*  <ChatbotClientWrapper /> */}
        </Providers>
        
        <Toaster />

      </body>
    </html>
  );
}

export default RootLayout;
