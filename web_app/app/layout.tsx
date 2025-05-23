import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import SEO from "@/helper/seo";
import './globals.css'
import DynamicCSS from "@/hooks/DynamicCSS";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {...SEO()}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif']
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['monospace']
});

export const viewport: Viewport = {
  maximumScale: 1,
  initialScale: 1,
  width: 'device-width',
  userScalable: false,
  viewportFit: 'cover',
}

export default async function RootLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  let h = await headers()
  let theme = 'system'
  
  return (
    <html lang="en" className="scroll-smooth">
      <DynamicCSS cssFile={`violet.css`} />
      <body className={`${geistSans.variable} ${geistMono.variable} ${theme} fixed top-0 left-0 w-full h-full overflow-x-hidden antialiased`}>
        <SidebarProvider defaultOpen>
          <Sidebar className="glass-panel sidebar w-full min-w-[400px] max-w-[400px]">
            {sidebar}
          </Sidebar>
          <SidebarInset className={`md:pl-[144px] p-0 overflow-x-hidden overflow-y-auto h-full w-full`}>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}