import { cn } from "~/lib/utils"

type FloatingDateIndicatorProps = {
  label: string
  visible: boolean
}

export function FloatingDateIndicator({
  label,
  visible,
}: FloatingDateIndicatorProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 transition-all duration-300 ease-out",
        visible
          ? "top-3 opacity-100 scale-100"
          : "-top-2 opacity-0 scale-95"
      )}
    >
      <div className="rounded-lg bg-muted/90 px-3 py-1 text-xs text-muted-foreground shadow-md backdrop-blur-sm">
        {label}
      </div>
    </div>
  )
}
