import * as React from "react"
import { useRef, useState } from "react"
import { Reply } from "lucide-react"
import { cn } from "~/lib/utils"

type SwipeToReplyProps = {
  children: React.ReactNode
  onReply?: () => void
  disabled?: boolean
}

const SWIPE_THRESHOLD = 80
const RESISTANCE = 0.5

export function SwipeToReply({
  children,
  onReply,
  disabled = false,
}: SwipeToReplyProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [translateX, setTranslateX] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const isSwipingRef = useRef(false)
  const hasTriggeredRef = useRef(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    isSwipingRef.current = false
    hasTriggeredRef.current = false
    setIsTransitioning(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || !touchStartRef.current) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y

    if (!isSwipingRef.current) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 10) {
        isSwipingRef.current = true
      } else if (Math.abs(deltaY) > 10) {
        touchStartRef.current = null
        return
      }
    }

    if (isSwipingRef.current) {
      e.preventDefault()
      const clampedX = Math.max(0, Math.min(deltaX * RESISTANCE, SWIPE_THRESHOLD * 1.2))
      setTranslateX(clampedX)

      if (clampedX >= SWIPE_THRESHOLD && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true
        if (navigator.vibrate) {
          navigator.vibrate(10)
        }
      }
    }
  }

  const handleTouchEnd = () => {
    if (disabled) return

    if (hasTriggeredRef.current && onReply) {
      onReply()
    }

    setIsTransitioning(true)
    setTranslateX(0)
    touchStartRef.current = null
    isSwipingRef.current = false

    setTimeout(() => {
      setIsTransitioning(false)
    }, 200)
  }

  const progress = Math.min(translateX / SWIPE_THRESHOLD, 1)
  const iconScale = 0.5 + progress * 0.5
  const iconOpacity = progress

  return (
    <div ref={containerRef} className="relative overflow-visible">
      <div
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center",
          "pointer-events-none"
        )}
        style={{
          opacity: iconOpacity,
          transform: `translateX(${Math.max(0, translateX - 40)}px) translateY(-50%) scale(${iconScale})`,
          transition: isTransitioning ? "all 0.2s ease-out" : "none",
        }}
      >
        <div
          className={cn(
            "flex size-8 items-center justify-center rounded-full",
            progress >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          <Reply className="size-4" />
        </div>
      </div>

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isTransitioning ? "transform 0.2s ease-out" : "none",
        }}
      >
        {children}
      </div>
    </div>
  )
}
