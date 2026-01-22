import { Calendar, Clock, MapPin } from "lucide-react"
import type { MessageEvent } from "./types"

type ChatBubbleEventProps = {
  event: MessageEvent
}

export function ChatBubbleEvent({ event }: ChatBubbleEventProps) {
  const { title, date, time, location, description } = event

  return (
    <div className="min-w-[220px] max-w-[280px] rounded-lg border border-border bg-background/50 p-3">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Calendar className="size-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">Event</div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="size-3.5 shrink-0" />
          <span>{date}</span>
        </div>
        {time ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-3.5 shrink-0" />
            <span>{time}</span>
          </div>
        ) : null}
        {location ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        ) : null}
      </div>

      {description ? (
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}
