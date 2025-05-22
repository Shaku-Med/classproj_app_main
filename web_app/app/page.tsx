'use client'
import Logo from "@/components/Logo";
import { useMobileDetector } from "@/hooks/useMobileDetector";
import { MessageCircleDashed, MessageSquare } from "lucide-react";

export default function DefaultChatPage() {
  let ismobile = useMobileDetector()
  // 
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center space-y-4 relative flex items-center justify-center flex-col w-full">
        <Logo className={`w-50 h-50`} />
      </div>
    </div>
  );
}