import { User } from "lucide-react"
import type { MessageContact } from "./types"

type ChatBubbleContactProps = {
  contact: MessageContact
  onClick?: () => void
}

export function ChatBubbleContact({ contact, onClick }: ChatBubbleContactProps) {
  const { name, phone, avatar } = contact

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-[180px] max-w-[240px] items-center gap-3 text-left transition-opacity hover:opacity-80"
    >
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="size-11 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
          {initials ? (
            <span className="text-sm font-semibold text-primary">{initials}</span>
          ) : (
            <User className="size-5 text-primary" />
          )}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{name}</div>
        {phone ? (
          <div className="truncate text-xs text-muted-foreground">{phone}</div>
        ) : null}
        <div className="text-xs text-primary">Contact</div>
      </div>
    </button>
  )
}
