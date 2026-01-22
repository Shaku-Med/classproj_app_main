import { useState, useRef, useEffect } from "react"
import { Mic, Pause, Play } from "lucide-react"
import { cn } from "~/lib/utils"
import type { MessageAudio } from "./types"

type ChatBubbleAudioProps = {
  audio: MessageAudio
  isOutgoing: boolean
  senderAvatar?: string
  senderName?: string
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function generateWaveform(length: number = 40): number[] {
  return Array.from({ length }, () => Math.random() * 0.8 + 0.2)
}

export function ChatBubbleAudio({
  audio,
  isOutgoing,
  senderAvatar,
  senderName,
}: ChatBubbleAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const waveform = audio.waveform ?? generateWaveform()

  useEffect(() => {
    const audioEl = new Audio(audio.url)
    audioRef.current = audioEl

    audioEl.addEventListener("timeupdate", () => {
      setCurrentTime(audioEl.currentTime)
      setProgress((audioEl.currentTime / audioEl.duration) * 100)
    })

    audioEl.addEventListener("ended", () => {
      setIsPlaying(false)
      setProgress(0)
      setCurrentTime(0)
    })

    return () => {
      audioEl.pause()
      audioEl.remove()
    }
  }, [audio.url])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    audioRef.current.currentTime = percentage * audio.duration
    setProgress(percentage * 100)
  }

  const initials = senderName
    ?.split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const displayTime = isPlaying || progress > 0 ? currentTime : audio.duration

  return (
    <div
      className={cn(
        "flex items-center gap-2 min-w-[200px] max-w-[280px]",
        isOutgoing ? "flex-row" : "flex-row"
      )}
    >
      <button
        type="button"
        onClick={togglePlay}
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full transition-colors",
          isOutgoing
            ? "bg-primary text-primary-foreground"
            : "bg-foreground/10 text-foreground"
        )}
      >
        {isPlaying ? (
          <Pause className="size-5" />
        ) : (
          <Play className="size-5 ml-0.5" />
        )}
      </button>

      <div className="flex flex-1 flex-col gap-1">
        <div
          className="relative flex h-8 cursor-pointer items-center gap-px"
          onClick={handleWaveformClick}
        >
          {waveform.map((height, i) => {
            const barProgress = (i / waveform.length) * 100
            const isActive = barProgress <= progress

            return (
              <div
                key={i}
                className={cn(
                  "w-1 rounded-full transition-colors",
                  isActive
                    ? isOutgoing
                      ? "bg-primary"
                      : "bg-foreground"
                    : "bg-foreground/30"
                )}
                style={{
                  height: `${height * 100}%`,
                  minHeight: "4px",
                }}
              />
            )
          })}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {formatDuration(displayTime)}
        </span>
      </div>

      {senderAvatar ? (
        <div className="relative shrink-0">
          <img
            src={senderAvatar}
            alt={senderName ?? "Sender"}
            className="size-10 rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary">
            <Mic className="size-3 text-primary-foreground" />
          </div>
        </div>
      ) : initials ? (
        <div className="relative shrink-0">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary">
            <Mic className="size-3 text-primary-foreground" />
          </div>
        </div>
      ) : null}
    </div>
  )
}
