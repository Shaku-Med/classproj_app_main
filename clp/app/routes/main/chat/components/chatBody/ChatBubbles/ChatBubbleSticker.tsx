import type { MessageSticker } from "./types"

type ChatBubbleStickerProps = {
  sticker: MessageSticker
}

export function ChatBubbleSticker({ sticker }: ChatBubbleStickerProps) {
  return (
    <div className="max-w-[180px]">
      <img
        src={sticker.url}
        alt={sticker.alt ?? "Sticker"}
        className="h-auto w-full object-contain"
        loading="lazy"
      />
    </div>
  )
}
