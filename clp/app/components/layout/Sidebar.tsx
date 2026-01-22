import { NavLink } from "react-router"
import {
  Archive,
  MessageCirclePlus,
  MoreVertical,
  Search,
  UserPlus,
  Users,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/utils"

const chatTabs = ["All", "Unread", "Favorites", "Groups"] as const

const chatItems = [
  {
    id: "medzy-amara",
    name: "Medzy Amara (You)",
    time: "7:49 PM",
    message: "https://www.instagram.com/reel/DrO7...",
    unread: 0,
  },
  {
    id: "pornstars-world",
    name: "Pornstar's World",
    time: "5:21 PM",
    message: "Fraternity: For real bro Mohammed aka med...",
    unread: 2,
    type: "group",
  },
  {
    id: "silvi-world",
    name: "Silvi's World ✨",
    time: "5:18 PM",
    message: "Deadman: Sticker",
    unread: 1,
    type: "group",
  },
  {
    id: "dedman-dead",
    name: "Dedman Dead",
    time: "5:17 PM",
    message: "Sticker",
    unread: 0,
  },
  {
    id: "isha-suma",
    name: "Isha Suma",
    time: "3:31 PM",
    message: "Sup",
    unread: 0,
  },
  {
    id: "jjay-prettiest",
    name: "JJay ❤️ Prettiest",
    time: "2:08 PM",
    message: "Yes",
    unread: 0,
  },
  {
    id: "jjay-prettiest",
    name: "JJay ❤️ Prettiest",
    time: "2:08 PM",
    message: "Yes",
    unread: 0,
  },
  {
    id: "jjay-prettiest",
    name: "JJay ❤️ Prettiest",
    time: "2:08 PM",
    message: "Yes",
    unread: 0,
  },
  {
    id: "jjay-prettiest",
    name: "JJay ❤️ Prettiest",
    time: "2:08 PM",
    message: "Yes",
    unread: 0,
  },
]

type SidebarProps = {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col gap-3 overflow-hidden px-2",
        className
      )}
    >
      <div className="sticky top-0 z-10 pt-4 backdrop-blur">
        <div className="flex items-center justify-between px-2">
          <div className="text-xl font-semibold tracking-tight">Clp Cloud</div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" aria-label="New group">
              <Users className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="New chat">
              <MessageCirclePlus className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Menu">
              <MoreVertical className="size-4" />
            </Button>
          </div>
        </div>

        <div className="relative mt-3 px-3">
          <Search className="pointer-events-none absolute left-7 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Ask Meta AI or Search"
            className="h-10 rounded-full bg-muted/50 pl-9"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2 pb-3 px-3">
          {chatTabs.map((tab, index) => (
            <button
              key={tab}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                index === 0
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-border bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-3 text-xs text-muted-foreground">
        <span>Archived</span>
        <Archive className="size-3.5" />
      </div>

      <nav className="-mx-2 flex flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2">
        {chatItems.map((item) => (
          <NavLink
            key={item.id}
            to={`/chat/${item.id}`}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                "hover:bg-muted/50",
                isActive && "bg-muted"
              )
            }
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-muted/60 text-sm font-semibold text-foreground">
              {item.type === "group" ? (
                <Users className="size-4 text-muted-foreground" />
              ) : (
                item.name
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate text-sm font-medium">
                  <span className="truncate">{item.name}</span>
                  {item.type === "group" ? (
                    <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Group
                    </span>
                  ) : null}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {item.time}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="truncate text-xs text-muted-foreground/80">
                  {item.message}
                </div>
                {item.unread > 0 ? (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {item.unread}
                  </span>
                ) : null}
              </div>
            </div>
          </NavLink>
        ))}
      </nav>

    </div>
  )
}
