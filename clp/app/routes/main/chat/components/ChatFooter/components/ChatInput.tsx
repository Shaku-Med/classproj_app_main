import { useEffect, useRef, useState } from "react"
import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from "lucide-react"
import { cn } from "~/lib/utils"

type ChatInputProps = {
  placeholder?: string
  className?: string
  onMultilineChange?: (isMultiline: boolean) => void
  onHasTextChange?: (hasText: boolean) => void
}

export function ChatInput({ placeholder, className, onMultilineChange, onHasTextChange }: ChatInputProps) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [hasText, setHasText] = useState(false)
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)
  const prevMultiline = useRef(false)
  const prevHasText = useRef(false)

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = document.getSelection()
      const editor = editorRef.current
      const container = containerRef.current
      if (!selection || !editor || !container) {
        setMenuPos(null)
        return
      }

      if (!editor.contains(selection.anchorNode)) {
        setMenuPos(null)
        return
      }

      if (selection.isCollapsed) {
        setMenuPos(null)
        return
      }

      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      if (!rect || rect.width === 0) {
        setMenuPos(null)
        return
      }

      setMenuPos({
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top - containerRect.top - 8,
      })
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
    }
  }, [])

  const handleInput = () => {
    const editor = editorRef.current
    if (!editor) return
    const text = editor.textContent?.trim() ?? ""
    const textExists = text.length > 0
    setHasText(textExists)

    if (textExists !== prevHasText.current) {
      prevHasText.current = textExists
      onHasTextChange?.(textExists)
    }

    const isMultiline = editor.scrollHeight > 40
    if (isMultiline !== prevMultiline.current) {
      prevMultiline.current = isMultiline
      onMultilineChange?.(isMultiline)
    }
  }

  const execFormat = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value)
    editorRef.current?.focus()
  }

  const formatActions = [
    { icon: Bold, cmd: "bold", label: "Bold" },
    { icon: Italic, cmd: "italic", label: "Italic" },
    { icon: Strikethrough, cmd: "strikeThrough", label: "Strikethrough" },
    { icon: Code, cmd: "formatBlock", value: "pre", label: "Code" },
    { icon: ListOrdered, cmd: "insertOrderedList", label: "Ordered List" },
    { icon: List, cmd: "insertUnorderedList", label: "Unordered List" },
    { icon: Quote, cmd: "formatBlock", value: "blockquote", label: "Quote" },
  ]

  return (
    <div ref={containerRef} className={cn("relative flex-1", className)}>
      {menuPos ? (
        <div
          className="absolute z-50 flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-lg"
          style={{
            left: menuPos.x,
            top: menuPos.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          {formatActions.map((action) => (
            <button
              key={action.cmd + (action.value ?? "")}
              type="button"
              className="flex size-8 items-center justify-center rounded-md text-foreground hover:bg-muted"
              onClick={() => execFormat(action.cmd, action.value)}
              title={action.label}
            >
              <action.icon className="size-4" />
            </button>
          ))}
        </div>
      ) : null}

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        onInput={handleInput}
        className={cn(
          "min-h-[24px] max-h-32 w-full overflow-y-auto bg-transparent py-2 text-sm outline-none",
          "text-foreground"
        )}
      />
      {!hasText ? (
        <span className="pointer-events-none absolute left-0 top-2 text-sm text-muted-foreground">
          {placeholder}
        </span>
      ) : null}
    </div>
  )
}
