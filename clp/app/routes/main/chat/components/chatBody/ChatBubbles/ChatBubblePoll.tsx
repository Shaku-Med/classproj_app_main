import { BarChart3, Check } from "lucide-react"
import { cn } from "~/lib/utils"
import type { MessagePoll } from "./types"

type ChatBubblePollProps = {
  poll: MessagePoll
  onVote?: (optionId: string) => void
}

export function ChatBubblePoll({ poll, onVote }: ChatBubblePollProps) {
  const { question, options, totalVotes, isMultipleChoice, isClosed, selectedOptionId } = poll

  return (
    <div className="min-w-[240px] max-w-[300px]">
      <div className="mb-3 flex items-start gap-2">
        <BarChart3 className="mt-0.5 size-4 shrink-0 text-primary" />
        <span className="text-sm font-medium">{question}</span>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
          const isSelected = selectedOptionId === option.id

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => !isClosed && onVote?.(option.id)}
              disabled={isClosed}
              className={cn(
                "relative overflow-hidden rounded-lg border border-border p-2 text-left transition-colors",
                !isClosed && "hover:border-primary/50",
                isSelected && "border-primary"
              )}
            >
              <div
                className="absolute inset-y-0 left-0 bg-primary/10 transition-all"
                style={{ width: `${percentage}%` }}
              />
              <div className="relative flex items-center justify-between gap-2">
                <span className="text-sm">{option.text}</span>
                <div className="flex items-center gap-1">
                  {isSelected ? (
                    <Check className="size-3.5 text-primary" />
                  ) : null}
                  <span className="text-xs text-muted-foreground">{percentage}%</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{totalVotes} vote{totalVotes !== 1 ? "s" : ""}</span>
        {isMultipleChoice ? <span>Multiple choice</span> : null}
        {isClosed ? <span className="text-destructive">Closed</span> : null}
      </div>
    </div>
  )
}
