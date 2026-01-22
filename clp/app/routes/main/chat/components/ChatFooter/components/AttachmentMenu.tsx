import * as React from "react"
import {
  BarChart3,
  CalendarDays,
  Camera,
  FileText,
  Image,
  Mic,
  Sticker,
  User,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

type AttachmentMenuProps = {
  children: React.ReactNode
}

export function AttachmentMenu({ children }: AttachmentMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={12}
        className="w-60 rounded-xl border-border bg-card/95 p-2 shadow-xl backdrop-blur"
      >
        <DropdownMenuItem className="gap-3 px-3 py-2">
          <FileText />
          Document
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 px-3 py-2">
          <Image />
          Photos & videos
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 px-3 py-2">
          <Camera />
          Camera
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 px-3 py-2">
          <Mic />
          Audio
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 px-3 py-2">
          <User />
          Contact
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 px-3 py-2">
          <BarChart3 />
          Poll
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 px-3 py-2">
          <CalendarDays />
          Event
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem className="gap-3 px-3 py-2">
          <Sticker />
          New sticker
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
