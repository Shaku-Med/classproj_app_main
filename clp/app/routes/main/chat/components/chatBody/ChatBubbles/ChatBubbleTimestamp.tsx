import { Check, CheckCheck } from "lucide-react"
import type { MessageStatus } from "./types"

type ChatBubbleTimestampProps = {
  timestamp: string
  status?: MessageStatus
  isOutgoing: boolean
}

export function ChatBubbleTimestamp({
  timestamp,
  status,
  isOutgoing,
}: ChatBubbleTimestampProps) {
  return (
    <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-muted-foreground/70">
      {timestamp}
      {isOutgoing && status ? (
        <span className="inline-flex">
          {status === "sent" ? (
            <Check className="size-3" />
          ) : (
            <CheckCheck
              className={status === "read" ? "size-3 text-blue-400" : "size-3"}
            />
          )}
        </span>
      ) : null}
    </span>
  )
}
