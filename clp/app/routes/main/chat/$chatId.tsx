import { useState } from "react"
import { useParams } from "react-router"
import { ChatHeader } from "./components/chatHeader/ChatHeader"
import ChatBody from "./components/chatBody/chatBody"
import ChatFooter from "./components/ChatFooter/ChatFooter"
import { ContactDataPanel } from "./components/ContactData"
import { cn } from "~/lib/utils"

const ChatPage = () => {
  const { chatId } = useParams()
  const [showContactInfo, setShowContactInfo] = useState(false)
  
  const chatTitle =
    chatId
      ?.split("-")
      .map((word) => word[0]?.toUpperCase() + word.slice(1))
      .join(" ") ?? "Unknown"

  return (
    <div className="flex h-full overflow-hidden">
      <div className={cn(
        "chat-page flex flex-col h-full justify-between",
        showContactInfo ? "lg:flex-1 hidden lg:flex" : "w-full"
      )}>
        <section>
          <ChatHeader
            title={chatTitle}
            subtitle="online"
            backHref="/"
            onAvatarClick={() => setShowContactInfo(true)}
          />
        </section>
        <section className="h-full overflow-y-auto">
          <ChatBody />
        </section>
        <section>
          <ChatFooter />
        </section>
      </div>
      
      {showContactInfo && (
        <div className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto lg:w-[380px] lg:border-l lg:border-border lg:h-full animate-slide-in-right lg:animate-none">
          <ContactDataPanel
            name={chatTitle}
            phone="+232 78 175912"
            about="Hey there! I'm using Clp Cloud"
            mediaCount={6}
            onClose={() => setShowContactInfo(false)}
          />
        </div>
      )}
    </div>
  )
}

export default ChatPage
