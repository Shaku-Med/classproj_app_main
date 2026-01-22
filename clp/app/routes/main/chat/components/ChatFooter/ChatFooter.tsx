import { useState } from "react"
import { Mic, Plus, Send, Smile, X } from "lucide-react"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import { AttachmentMenu } from "./components/AttachmentMenu"
import { ChatInput } from "./components/ChatInput"

const ChatFooter = () => {
  const [isMultiline, setIsMultiline] = useState(false)
  const [hasText, setHasText] = useState(false)

  return (
    <footer className="px-4 pb-3">
      <div
        className={cn(
          "flex items-end gap-2 bg-muted px-3 py-2 transition-[border-radius] duration-200",
          isMultiline ? "rounded-2xl" : "rounded-full"
        )}
      >
        <AttachmentMenu>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 h-8 w-8 rounded-full text-muted-foreground hover:bg-background/20 hover:text-foreground"
          >
            <Plus className="size-5" />
          </Button>
        </AttachmentMenu>
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 h-8 w-8 rounded-full text-muted-foreground hover:bg-background/20 hover:text-foreground"
        >
          <Smile className="size-5" />
        </Button>
        <ChatInput
          placeholder="Type a message"
          onMultilineChange={setIsMultiline}
          onHasTextChange={setHasText}
        />
        {hasText ? (
          <Button
            size="icon"
            className="shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="size-5 rotate-45 ml-[-5px]" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 rounded-full text-muted-foreground hover:bg-background/20 hover:text-foreground"
          >
            <Mic className="size-5" />
          </Button>
        )}
      </div>
    </footer>
  )
}

export default ChatFooter
