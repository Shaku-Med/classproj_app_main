import { useStackNavigator } from "~/contexts"
import { X, ArrowLeft, Pencil } from "lucide-react"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

type StackViewProps = {
  onClose: () => void
  showEditButton?: boolean
  onEdit?: () => void
}

export function StackView({ onClose, showEditButton, onEdit }: StackViewProps) {
  const { stack, currentScreen, canGoBack, pop, direction, isAnimating } = useStackNavigator()

  if (!currentScreen) return null

  return (
    <div className="flex h-full flex-col bg-background overflow-hidden">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={canGoBack ? pop : onClose}
            aria-label={canGoBack ? "Back" : "Close"}
          >
            {canGoBack ? (
              <ArrowLeft className="size-5" />
            ) : (
              <X className="size-5" />
            )}
          </Button>
          <span className="text-base font-medium">{currentScreen.title}</span>
        </div>
        {showEditButton && !canGoBack && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={onEdit}
            aria-label="Edit"
          >
            <Pencil className="size-5" />
          </Button>
        )}
      </header>
      
      <div className="relative flex-1 overflow-hidden">
        {stack.map((screen, index) => {
          const isCurrentScreen = index === stack.length - 1
          const isPreviousScreen = index === stack.length - 2
          
          const shouldShow = isCurrentScreen || (isPreviousScreen && isAnimating)
          if (!shouldShow) return null
          
          let animationClass = ""
          
          if (isCurrentScreen) {
            if (direction === "push" && isAnimating) {
              animationClass = "animate-slide-in-right"
            } else if (direction === "pop" && isAnimating) {
              animationClass = "animate-slide-out-right"
            }
          } else if (isPreviousScreen && isAnimating) {
            if (direction === "push") {
              animationClass = "animate-slide-out-left"
            } else if (direction === "pop") {
              animationClass = "animate-slide-in-left"
            }
          }
          
          return (
            <div
              key={screen.id}
              className={cn(
                "absolute inset-0 overflow-y-auto bg-background",
                animationClass,
                !isAnimating && !isCurrentScreen && "hidden"
              )}
              style={{ zIndex: index }}
            >
              {screen.component}
            </div>
          )
        })}
      </div>
    </div>
  )
}
