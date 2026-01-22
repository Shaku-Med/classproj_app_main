import { useParams } from "react-router"
import { ChatHeader } from "./components/chatHeader/ChatHeader"
import ChatBody from "./components/chatBody/chatBody"
import ChatFooter from "./components/ChatFooter/ChatFooter"

const ChatPage = () => {
  const { chatId } = useParams()
  const chatTitle =
    chatId
      ?.split("-")
      .map((word) => word[0]?.toUpperCase() + word.slice(1))
      .join(" ") ?? "Unknown"

  return (
    <>
      <div className={`chat-page flex flex-col h-full justify-between`}>
        <section>
          <ChatHeader
            title={chatTitle}
            subtitle="online"
            backHref="/"
          />
        </section>
        <section className={`h-full overflow-y-auto`}>
          <ChatBody />
        </section>
        <section>
          <ChatFooter />
        </section>
      </div>
    </>
  )
}

export default ChatPage
