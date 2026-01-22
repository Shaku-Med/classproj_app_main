import { Star } from "lucide-react"

const sampleStarredMessages = [
  {
    id: "1",
    content: "Don't forget about the meeting tomorrow at 3pm!",
    timestamp: "Yesterday",
    isOutgoing: false,
  },
  {
    id: "2",
    content: "Here's the link to the project repo",
    timestamp: "Jan 15",
    isOutgoing: true,
  },
  {
    id: "3",
    content: "Thanks for helping me with that issue!",
    timestamp: "Jan 10",
    isOutgoing: false,
  },
]

export function StarredMessagesScreen() {
  if (sampleStarredMessages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Star className="size-12 text-muted-foreground/50" />
        <p className="mt-4 text-sm text-muted-foreground">No starred messages</p>
        <p className="mt-1 text-xs text-muted-foreground text-center px-8">
          Tap and hold on a message, then tap star to save it here.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {sampleStarredMessages.map((message) => (
        <div
          key={message.id}
          className="flex flex-col gap-1 border-b border-border px-4 py-3 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {message.isOutgoing ? "You" : "Contact"}
            </span>
            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
          </div>
          <p className="text-sm">{message.content}</p>
        </div>
      ))}
    </div>
  )
}
