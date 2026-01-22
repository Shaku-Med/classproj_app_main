import { useState } from "react"
import { Timer } from "lucide-react"
import { cn } from "~/lib/utils"

type DurationOption = {
  id: string
  label: string
  description?: string
}

const durationOptions: DurationOption[] = [
  { id: "off", label: "Off" },
  { id: "24h", label: "24 hours" },
  { id: "7d", label: "7 days" },
  { id: "90d", label: "90 days" },
]

export function DisappearingMessagesScreen() {
  const [selected, setSelected] = useState("off")

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center py-8 px-6">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Timer className="size-8 text-primary" />
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          When turned on, new messages sent in this chat will disappear after the selected duration.
        </p>
      </div>

      <div className="border-t border-border">
        {durationOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelected(option.id)}
            className={cn(
              "flex w-full items-center justify-between px-4 py-4 hover:bg-muted/50 transition-colors",
              selected === option.id && "bg-muted/30"
            )}
          >
            <span className="text-sm">{option.label}</span>
            <div
              className={cn(
                "size-5 rounded-full border-2 transition-colors",
                selected === option.id
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              )}
            >
              {selected === option.id && (
                <div className="flex size-full items-center justify-center">
                  <div className="size-2 rounded-full bg-background" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="px-4 py-4">
        <p className="text-xs text-muted-foreground">
          This setting will apply to all participants in this chat. Anyone can change it.
        </p>
      </div>
    </div>
  )
}
