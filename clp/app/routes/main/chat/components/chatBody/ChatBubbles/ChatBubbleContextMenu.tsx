import * as React from "react"
import {
  Copy,
  Forward,
  Pin,
  Reply,
  Smile,
  Star,
  Trash2,
} from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/components/ui/context-menu"

type ChatBubbleContextMenuProps = {
  children: React.ReactNode
  isOutgoing: boolean
  onReply?: () => void
  onReact?: () => void
  onForward?: () => void
  onCopy?: () => void
  onPin?: () => void
  onStar?: () => void
  onDelete?: () => void
}

export function ChatBubbleContextMenu({
  children,
  isOutgoing,
  onReply,
  onReact,
  onForward,
  onCopy,
  onPin,
  onStar,
  onDelete,
}: ChatBubbleContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48 rounded-xl">
        <ContextMenuItem onClick={onReply} className="gap-3">
          <Reply className="size-4" />
          Reply
        </ContextMenuItem>
        <ContextMenuItem onClick={onReact} className="gap-3">
          <Smile className="size-4" />
          React
        </ContextMenuItem>
        <ContextMenuItem onClick={onForward} className="gap-3">
          <Forward className="size-4" />
          Forward
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onCopy} className="gap-3">
          <Copy className="size-4" />
          Copy
        </ContextMenuItem>
        <ContextMenuItem onClick={onPin} className="gap-3">
          <Pin className="size-4" />
          Pin
        </ContextMenuItem>
        <ContextMenuItem onClick={onStar} className="gap-3">
          <Star className="size-4" />
          Star
        </ContextMenuItem>
        {isOutgoing ? (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={onDelete}
              className="gap-3 text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4" />
              Delete
            </ContextMenuItem>
          </>
        ) : null}
      </ContextMenuContent>
    </ContextMenu>
  )
}
