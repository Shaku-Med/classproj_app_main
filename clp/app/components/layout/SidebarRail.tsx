import { useEffect, useState } from "react"
import { CircleDot, MessageSquare, Settings, Users } from "lucide-react"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

const railItems = [
  { section: "chat", label: "Chats", icon: MessageSquare },
  { section: "status", label: "Status", icon: CircleDot },
  { section: "communities", label: "Communities", icon: Users },
] as const

type Section = (typeof railItems)[number]["section"] | "settings"

type SidebarRailProps = {
  orientation?: "vertical" | "horizontal"
  activeSection: Section
  onSelectSection: (section: Section) => void
  className?: string
}

export function SidebarRail({
  orientation = "vertical",
  activeSection,
  onSelectSection,
  className,
}: SidebarRailProps) {
  const isHorizontal = orientation === "horizontal"
  const [isBouncing, setIsBouncing] = useState(false)
  const itemSize = 36
  const gapSize = isHorizontal ? 24 : 8
  const indicatorIndex = railItems.findIndex(
    (item) => item.section === activeSection
  )
  const showIndicator = indicatorIndex >= 0

  useEffect(() => {
    setIsBouncing(true)
    const timeout = setTimeout(() => setIsBouncing(false), 220)
    return () => clearTimeout(timeout)
  }, [activeSection, orientation])

  const stretch = isBouncing ? 1.35 : 1
  const squash = isBouncing ? 0.7 : 1
  const translate = indicatorIndex * (itemSize + gapSize)
  const indicatorStyle = isHorizontal
    ? {
        transform: `translateX(${translate}px) scaleX(${stretch}) scaleY(${squash})`,
      }
    : {
        transform: `translateY(${translate}px) scaleX(${squash}) scaleY(${stretch})`,
      }
  return (
    <div
      className={cn(
        "flex items-center bg-muted/30",
        isHorizontal
          ? "h-14 w-full justify-around border-t border-border px-3"
          : "w-16 flex-col border-r border-border px-2 py-3",
        className
      )}
    >
      <div
        className={cn(
          "relative flex items-center",
          isHorizontal ? "gap-6" : "flex-col gap-2"
        )}
      >
        {showIndicator ? (
          <span
            aria-hidden="true"
            className={cn(
              "absolute origin-center transition-transform duration-300",
              "ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              isHorizontal
                ? "left-0 top-0 h-1 w-9 rounded-full bg-primary"
                : "left-0 top-0 h-9 w-1 rounded-full bg-primary"
            )}
            style={indicatorStyle}
          />
        ) : null}
        {railItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            size={isHorizontal ? "icon" : "icon"}
            className={cn(
              "text-muted-foreground hover:text-foreground",
              activeSection === item.section && "bg-muted text-foreground"
            )}
            aria-label={item.label}
            aria-pressed={activeSection === item.section}
            onClick={() => onSelectSection(item.section)}
          >
            <item.icon className="size-5" />
          </Button>
        ))}
      </div>

      <div className={cn(isHorizontal ? "" : "mt-auto")}>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "text-muted-foreground hover:text-foreground",
            activeSection === "settings" && "bg-muted text-foreground"
          )}
          aria-label="Settings"
          aria-pressed={activeSection === "settings"}
          onClick={() => onSelectSection("settings")}
        >
          <Settings className="size-5" />
        </Button>
      </div>
    </div>
  )
}
