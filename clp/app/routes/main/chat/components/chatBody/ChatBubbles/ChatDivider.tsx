import { cn } from "~/lib/utils"

type ChatDividerProps = {
  label: string
  variant?: "date" | "unread" | "custom"
}

export function ChatDivider({ label, variant = "date" }: ChatDividerProps) {
  return (
    <div className="flex items-center justify-center py-2">
      <div
        className={cn(
          "rounded-lg px-3 py-1 text-xs",
          variant === "unread"
            ? "bg-primary/20 text-primary"
            : "bg-muted/80 text-muted-foreground"
        )}
      >
        {label}
      </div>
    </div>
  )
}
