import * as React from "react"
import {
  AlertTriangle,
  Ban,
  BellOff,
  Info,
  MousePointerClick,
  Star,
  Timer,
  Trash2,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

type ChatMenuDropdownProps = {
  children: React.ReactNode
}

export function ChatMenuDropdown({ children }: ChatMenuDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56 rounded-xl">
        <DropdownMenuItem className="gap-3">
          <Info className="size-4" />
          Contact info
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3">
          <MousePointerClick className="size-4" />
          Select messages
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3">
          <BellOff className="size-4" />
          Mute notifications
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3">
          <Timer className="size-4" />
          Disappearing messages
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3">
          <Star className="size-4" />
          Add to favorites
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3">
          <X className="size-4" />
          Close chat
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-3">
          <AlertTriangle className="size-4" />
          Report
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3">
          <Ban className="size-4" />
          Block
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3">
          <Trash2 className="size-4" />
          Clear chat
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" className="gap-3">
          <Trash2 className="size-4" />
          Delete chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
