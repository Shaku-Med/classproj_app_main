import { Link } from "react-router"
import { ArrowLeft, MoreVertical, Search } from "lucide-react"
import { Button } from "~/components/ui/button"
import { ChatMenuDropdown } from "./chatMenuDropdown/ChatMenuDropdown"

type ChatHeaderProps = {
  title: string
  subtitle?: string
  backHref?: string
  onAvatarClick?: () => void
}

export function ChatHeader({ title, subtitle, backHref, onAvatarClick }: ChatHeaderProps) {
  const initials = title
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")

  return (
    <header className="flex items-center justify-between border-b border-border bg-card/40 px-4 py-3 backdrop-blur">
      <div className="flex min-w-0 items-center gap-3">
        {backHref ? (
          <Button asChild variant="ghost" size="icon-sm" className="md:hidden rounded-full">
            <Link to={backHref} aria-label="Back">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
        ) : null}

        <button
          onClick={onAvatarClick}
          className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity"
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
            {initials || "?"}
          </div>

          <div className="min-w-0 text-left">
            <div className="truncate text-sm font-semibold text-foreground">
              {title}
            </div>
            {subtitle ? (
              <div className="truncate text-xs text-muted-foreground">
                {subtitle}
              </div>
            ) : null}
          </div>
        </button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          aria-label="Search"
        >
          <Search className="size-5" />
        </Button>
        <ChatMenuDropdown>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            aria-label="Menu"
          >
            <MoreVertical className="size-5" />
          </Button>
        </ChatMenuDropdown>
      </div>
    </header>
  )
}
