import type { ChatItem, Message, MessagePosition } from "./types"

export type MessageWithPosition = Message & {
  position: MessagePosition
}

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function formatDateLabel(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffTime = today.getTime() - messageDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "Today"
  }
  if (diffDays === 1) {
    return "Yesterday"
  }
  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" })
  }
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })
}

function getMessagePosition(
  message: Message,
  prevMessage: Message | undefined,
  nextMessage: Message | undefined,
  prevDateKey: string | undefined,
  nextDateKey: string | undefined,
  currentDateKey: string
): MessagePosition {
  const isSameDateAsPrev = prevDateKey === currentDateKey
  const isSameDateAsNext = nextDateKey === currentDateKey

  const isSameSenderAsPrev =
    isSameDateAsPrev &&
    prevMessage &&
    prevMessage.isOutgoing === message.isOutgoing &&
    prevMessage.senderId === message.senderId

  const isSameSenderAsNext =
    isSameDateAsNext &&
    nextMessage &&
    nextMessage.isOutgoing === message.isOutgoing &&
    nextMessage.senderId === message.senderId

  if (!isSameSenderAsPrev && !isSameSenderAsNext) {
    return "single"
  }
  if (!isSameSenderAsPrev && isSameSenderAsNext) {
    return "first"
  }
  if (isSameSenderAsPrev && isSameSenderAsNext) {
    return "middle"
  }
  return "last"
}

export function groupMessages(messages: Message[]): MessageWithPosition[] {
  return messages.map((message, index) => {
    const prevMessage = messages[index - 1]
    const nextMessage = messages[index + 1]

    const isSameSenderAsPrev =
      prevMessage &&
      prevMessage.isOutgoing === message.isOutgoing &&
      prevMessage.senderId === message.senderId

    const isSameSenderAsNext =
      nextMessage &&
      nextMessage.isOutgoing === message.isOutgoing &&
      nextMessage.senderId === message.senderId

    let position: MessagePosition

    if (!isSameSenderAsPrev && !isSameSenderAsNext) {
      position = "single"
    } else if (!isSameSenderAsPrev && isSameSenderAsNext) {
      position = "first"
    } else if (isSameSenderAsPrev && isSameSenderAsNext) {
      position = "middle"
    } else {
      position = "last"
    }

    return { ...message, position }
  })
}

export function buildChatItems(
  messages: Message[],
  unreadFromId?: string
): ChatItem[] {
  const items: ChatItem[] = []
  let lastDateKey: string | undefined

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    const prevMessage = messages[i - 1]
    const nextMessage = messages[i + 1]
    const currentDateKey = getDateKey(message.date)
    const prevDateKey = prevMessage ? getDateKey(prevMessage.date) : undefined
    const nextDateKey = nextMessage ? getDateKey(nextMessage.date) : undefined

    if (currentDateKey !== lastDateKey) {
      items.push({
        type: "divider",
        id: `date-${currentDateKey}`,
        label: formatDateLabel(message.date),
        variant: "date",
      })
      lastDateKey = currentDateKey
    }

    if (unreadFromId && message.id === unreadFromId) {
      items.push({
        type: "divider",
        id: "unread",
        label: "Unread messages",
        variant: "unread",
      })
    }

    const position = getMessagePosition(
      message,
      prevMessage,
      nextMessage,
      prevDateKey,
      nextDateKey,
      currentDateKey
    )

    items.push({
      type: "message",
      data: message,
      position,
    })
  }

  return items
}
