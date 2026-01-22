import type { MessageReply } from "./types"

type ChatBubbleReplyProps = {
  reply: MessageReply
}

export function ChatBubbleReply({ reply }: ChatBubbleReplyProps) {
  return (
    <div className="mb-1 rounded-md border-l-4 border-primary bg-background/30 px-3 py-2">
      <div className="text-xs font-semibold text-primary">
        {reply.senderName}
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">
        {reply.content}
      </div>
    </div>
  )
}
