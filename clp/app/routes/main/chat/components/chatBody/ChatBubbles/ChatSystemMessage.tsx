import {
  Lock,
  Phone,
  Pin,
  Pencil,
  Shield,
  Timer,
  User,
  Users,
  Video,
} from "lucide-react"
import type { SystemMessage } from "./types"

type ChatSystemMessageProps = {
  message: SystemMessage
}

const iconMap = {
  lock: Lock,
  phone: Phone,
  video: Video,
  pin: Pin,
  user: User,
  users: Users,
  shield: Shield,
  timer: Timer,
  edit: Pencil,
}

export function ChatSystemMessage({ message }: ChatSystemMessageProps) {
  const { text, icon, timestamp } = message
  const Icon = icon ? iconMap[icon] : null

  return (
    <div className="flex items-center justify-center py-1">
      <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5 text-center">
        {Icon ? <Icon className="size-3 shrink-0 text-muted-foreground" /> : null}
        <span className="text-xs text-muted-foreground">{text}</span>
        {timestamp ? (
          <span className="text-[10px] text-muted-foreground/70">{timestamp}</span>
        ) : null}
      </div>
    </div>
  )
}
