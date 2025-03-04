import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./Nav/Sidebar/Sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import DynamicColors from "./Nav/DynamicColors";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `Chatzy`,
    template: `%s - Meeting new people`
  },
  description: `Meeting new prople online on chatzy`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`auto home_p`} lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ResizablePanelGroup style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `100%`,
          height: `100%`,
          overflow: 'hidden',
        }} className={`p-0 sm:p-3 h_CT reset transition-all`} direction="horizontal">
          <div className="dim transition-all opacity-0 md:hidden z-[10000000] fixed top-0 left-0 w-full h-full bg-background/50" />
          <ResizablePanel style={{
            minWidth: '350px'
          }} className={`xpo z-[1000000000] h_CT reset md:transition-none transition-all rounded-none md:rounded-l-2xl`} defaultSize={20} minSize={30} maxSize={50}>
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle className={` md:block hidden bg-foreground/30 p-[1px] opacity-[.3] active:opacity-[1] hover:opacity-[1]`} />
          <ResizablePanel defaultSize={50}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
        <DynamicColors/>
      </body>
    </html>
  );
}
