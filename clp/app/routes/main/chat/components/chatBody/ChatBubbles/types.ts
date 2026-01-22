export type MessageStatus = "sent" | "delivered" | "read"

export type MessageReply = {
  senderName: string
  content: string
}

export type MessageMedia = {
  type: "image" | "gif" | "video"
  url: string
  caption?: string
}

export type MessageSticker = {
  url: string
  alt?: string
}

export type MessageAudio = {
  url: string
  duration: number
  waveform?: number[]
}

export type PollOption = {
  id: string
  text: string
  votes: number
  voters?: string[]
}

export type MessagePoll = {
  question: string
  options: PollOption[]
  totalVotes: number
  isMultipleChoice?: boolean
  isClosed?: boolean
  selectedOptionId?: string
}

export type MessageEvent = {
  title: string
  date: string
  time?: string
  location?: string
  description?: string
}

export type MessageContact = {
  name: string
  phone?: string
  avatar?: string
}

export type Message = {
  id: string
  content?: string
  timestamp: string
  date: Date
  isOutgoing: boolean
  senderId?: string
  senderName?: string
  senderColor?: string
  senderAvatar?: string
  status?: MessageStatus
  reply?: MessageReply
  media?: MessageMedia
  sticker?: MessageSticker
  audio?: MessageAudio
  poll?: MessagePoll
  event?: MessageEvent
  contact?: MessageContact
}

export type MessagePosition = "single" | "first" | "middle" | "last"

export type DividerVariant = "date" | "unread" | "custom"

export type SystemMessageType =
  | "join"
  | "leave"
  | "pin"
  | "unpin"
  | "group_name"
  | "group_icon"
  | "group_description"
  | "add_member"
  | "remove_member"
  | "admin_change"
  | "security"
  | "call_missed"
  | "call_ended"
  | "disappearing"
  | "custom"

export type SystemMessage = {
  id: string
  type: SystemMessageType
  text: string
  timestamp?: string
  icon?: "lock" | "phone" | "video" | "pin" | "user" | "users" | "shield" | "timer" | "edit"
}

export type ChatItem =
  | { type: "message"; data: Message; position: MessagePosition }
  | { type: "divider"; id: string; label: string; variant: DividerVariant }
  | { type: "system"; data: SystemMessage }
