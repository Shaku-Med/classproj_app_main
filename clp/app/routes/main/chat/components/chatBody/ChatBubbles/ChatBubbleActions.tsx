import { Reply, Smile } from "lucide-react"
import { cn } from "~/lib/utils"

type ChatBubbleActionsProps = {
  isOutgoing: boolean
  onReactionClick?: () => void
  onReplyClick?: () => void
}

export function ChatBubbleActions({
  isOutgoing,
  onReactionClick,
  onReplyClick,
}: ChatBubbleActionsProps) {
  return (
    <div
      className={cn(
        "absolute -top-3 flex items-center gap-0.5 rounded-full bg-card/90 p-0.5 shadow-md backdrop-blur-sm opacity-0 transition-all duration-200 group-hover:opacity-100",
        isOutgoing ? "right-2" : "left-2"
      )}
    >
      <button
        type="button"
        onClick={onReactionClick}
        className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Smile className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={onReplyClick}
        className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Reply className="size-3.5" />
      </button>
    </div>
  )
}
