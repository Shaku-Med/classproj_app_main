import type { MessageMedia } from "./types"

type ChatBubbleMediaProps = {
  media: MessageMedia
}

export function ChatBubbleMedia({ media }: ChatBubbleMediaProps) {
  if (media.type === "video") {
    return (
      <div className="overflow-hidden rounded-lg">
        <video
          src={media.url}
          className="max-h-72 w-full object-cover"
          controls
        />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg">
      <img
        src={media.url}
        alt={media.caption ?? "Media"}
        className="max-h-72 w-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
