import { cn } from "~/lib/utils"
import type { Message, MessagePosition } from "./types"
import { ChatBubbleReply } from "./ChatBubbleReply"
import { ChatBubbleMedia } from "./ChatBubbleMedia"
import { ChatBubbleTimestamp } from "./ChatBubbleTimestamp"
import { ChatBubbleActions } from "./ChatBubbleActions"
import { ChatBubbleContextMenu } from "./ChatBubbleContextMenu"
import { ChatBubbleSticker } from "./ChatBubbleSticker"
import { ChatBubbleAudio } from "./ChatBubbleAudio"
import { ChatBubblePoll } from "./ChatBubblePoll"
import { ChatBubbleEvent } from "./ChatBubbleEvent"
import { ChatBubbleContact } from "./ChatBubbleContact"
import { SwipeToReply } from "./SwipeToReply"

type ChatBubbleProps = {
  message: Message
  position?: MessagePosition
  onReply?: () => void
  onReact?: () => void
  onForward?: () => void
  onCopy?: () => void
  onDelete?: () => void
  onVote?: (optionId: string) => void
}

export function ChatBubble({
  message,
  position = "single",
  onReply,
  onReact,
  onForward,
  onCopy,
  onDelete,
  onVote,
}: ChatBubbleProps) {
  const { content, timestamp, isOutgoing, status, reply, media, sticker, audio, poll, event, contact, senderAvatar, senderName } = message

  const showTail = position === "single" || position === "last"
  const isSticker = !!sticker
  const isAudio = !!audio

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content)
    }
    onCopy?.()
  }

  const stickerBubble = (
    <div
      className={cn(
        "group relative flex w-full",
        isOutgoing ? "justify-end" : "justify-start"
      )}
    >
      <ChatBubbleContextMenu
        isOutgoing={isOutgoing}
        onReply={onReply}
        onReact={onReact}
        onForward={onForward}
        onCopy={handleCopy}
        onDelete={onDelete}
      >
        <div className="relative">
          <ChatBubbleSticker sticker={sticker!} />
          <div
            className={cn(
              "absolute bottom-1 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm",
              isOutgoing ? "right-1" : "left-1"
            )}
          >
            <ChatBubbleTimestamp
              timestamp={timestamp}
              status={status}
              isOutgoing={isOutgoing}
            />
          </div>
        </div>
      </ChatBubbleContextMenu>

      <ChatBubbleActions
        isOutgoing={isOutgoing}
        onReactionClick={onReact}
        onReplyClick={onReply}
      />
    </div>
  )

  const audioBubble = (
    <div
      className={cn(
        "group relative flex w-full",
        isOutgoing ? "justify-end" : "justify-start"
      )}
    >
      <ChatBubbleContextMenu
        isOutgoing={isOutgoing}
        onReply={onReply}
        onReact={onReact}
        onForward={onForward}
        onCopy={handleCopy}
        onDelete={onDelete}
      >
        <div
          className={cn(
            "relative px-3 py-2",
            isOutgoing ? "bg-primary/20" : "bg-muted",
            showTail
              ? isOutgoing
                ? "rounded-xl rounded-br-none"
                : "rounded-xl rounded-bl-none"
              : "rounded-xl"
          )}
        >
          {showTail ? (
            <div
              className={cn(
                "absolute bottom-0 size-0 border-solid",
                isOutgoing
                  ? "-right-2 border-l-8 border-t-8 border-l-primary/20 border-t-transparent border-r-0 border-b-0"
                  : "-left-2 border-r-8 border-t-8 border-r-muted border-t-transparent border-l-0 border-b-0"
              )}
            />
          ) : null}

          {reply ? <ChatBubbleReply reply={reply} /> : null}

          <div className="flex items-end gap-2">
            <ChatBubbleAudio
              audio={audio!}
              isOutgoing={isOutgoing}
              senderAvatar={senderAvatar}
              senderName={senderName}
            />
            <ChatBubbleTimestamp
              timestamp={timestamp}
              status={status}
              isOutgoing={isOutgoing}
            />
          </div>
        </div>
      </ChatBubbleContextMenu>

      <ChatBubbleActions
        isOutgoing={isOutgoing}
        onReactionClick={onReact}
        onReplyClick={onReply}
      />
    </div>
  )

  const regularBubble = (
    <div
      className={cn(
        "group relative flex w-full",
        isOutgoing ? "justify-end" : "justify-start"
      )}
    >
      <ChatBubbleContextMenu
        isOutgoing={isOutgoing}
        onReply={onReply}
        onReact={onReact}
        onForward={onForward}
        onCopy={handleCopy}
        onDelete={onDelete}
      >
        <div
          className={cn(
            "relative max-w-[85%] px-3 py-1.5 md:max-w-[65%]",
            isOutgoing ? "bg-primary/20" : "bg-muted",
            showTail
              ? isOutgoing
                ? "rounded-lg rounded-br-none"
                : "rounded-lg rounded-bl-none"
              : "rounded-lg"
          )}
        >
          {showTail ? (
            <div
              className={cn(
                "absolute bottom-0 size-0 border-solid",
                isOutgoing
                  ? "-right-2 border-l-8 border-t-8 border-l-primary/20 border-t-transparent border-r-0 border-b-0"
                  : "-left-2 border-r-8 border-t-8 border-r-muted border-t-transparent border-l-0 border-b-0"
              )}
            />
          ) : null}

          {reply ? <ChatBubbleReply reply={reply} /> : null}

          {media ? (
            <div className={cn(content ? "mb-1" : "")}>
              <ChatBubbleMedia media={media} />
            </div>
          ) : null}

          {poll ? (
            <div className={cn(content ? "mb-1" : "")}>
              <ChatBubblePoll poll={poll} onVote={onVote} />
            </div>
          ) : null}

          {event ? (
            <div className={cn(content ? "mb-1" : "")}>
              <ChatBubbleEvent event={event} />
            </div>
          ) : null}

          {contact ? (
            <div className={cn(content ? "mb-1" : "")}>
              <ChatBubbleContact contact={contact} />
            </div>
          ) : null}

          {content ? (
            <div className="flex flex-wrap items-end gap-x-2">
              <span className="whitespace-pre-wrap break-words text-sm">
                {content}
              </span>
              <ChatBubbleTimestamp
                timestamp={timestamp}
                status={status}
                isOutgoing={isOutgoing}
              />
            </div>
          ) : (
            <div className="flex justify-end">
              <ChatBubbleTimestamp
                timestamp={timestamp}
                status={status}
                isOutgoing={isOutgoing}
              />
            </div>
          )}
        </div>
      </ChatBubbleContextMenu>

      <ChatBubbleActions
        isOutgoing={isOutgoing}
        onReactionClick={onReact}
        onReplyClick={onReply}
      />
    </div>
  )

  const getBubble = () => {
    if (isSticker) return stickerBubble
    if (isAudio) return audioBubble
    return regularBubble
  }

  return (
    <SwipeToReply onReply={onReply}>
      {getBubble()}
    </SwipeToReply>
  )
}
