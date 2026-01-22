import * as React from "react"
import {
  Bell,
  BellOff,
  Image,
  Info,
  MousePointerClick,
  Search,
  Star,
  Timer,
  Trash2,
  X,
} from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/components/ui/context-menu"

type ChatBodyContextMenuProps = {
  children: React.ReactNode
  onContactInfo?: () => void
  onSelectMessages?: () => void
  onSearch?: () => void
  onMuteToggle?: () => void
  onDisappearingMessages?: () => void
  onWallpaper?: () => void
  onAddToFavorites?: () => void
  onClearChat?: () => void
  onCloseChat?: () => void
  isMuted?: boolean
}

export function ChatBodyContextMenu({
  children,
  onContactInfo,
  onSelectMessages,
  onSearch,
  onMuteToggle,
  onDisappearingMessages,
  onWallpaper,
  onAddToFavorites,
  onClearChat,
  onCloseChat,
  isMuted = false,
}: ChatBodyContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56 rounded-xl">
        <ContextMenuItem onClick={onContactInfo} className="gap-3">
          <Info className="size-4" />
          Contact info
        </ContextMenuItem>
        <ContextMenuItem onClick={onSelectMessages} className="gap-3">
          <MousePointerClick className="size-4" />
          Select messages
        </ContextMenuItem>
        <ContextMenuItem onClick={onSearch} className="gap-3">
          <Search className="size-4" />
          Search in chat
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onWallpaper} className="gap-3">
          <Image className="size-4" />
          Wallpaper
        </ContextMenuItem>
        <ContextMenuItem onClick={onMuteToggle} className="gap-3">
          {isMuted ? (
            <>
              <Bell className="size-4" />
              Unmute notifications
            </>
          ) : (
            <>
              <BellOff className="size-4" />
              Mute notifications
            </>
          )}
        </ContextMenuItem>
        <ContextMenuItem onClick={onDisappearingMessages} className="gap-3">
          <Timer className="size-4" />
          Disappearing messages
        </ContextMenuItem>
        <ContextMenuItem onClick={onAddToFavorites} className="gap-3">
          <Star className="size-4" />
          Add to favorites
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onClearChat} className="gap-3">
          <Trash2 className="size-4" />
          Clear chat
        </ContextMenuItem>
        <ContextMenuItem onClick={onCloseChat} className="gap-3">
          <X className="size-4" />
          Close chat
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
