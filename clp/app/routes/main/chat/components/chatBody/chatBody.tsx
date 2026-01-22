import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
  ChatBodyContextMenu,
  ChatBubble,
  ChatDivider,
  ChatSystemMessage,
  FloatingDateIndicator,
  buildChatItems,
  type ChatItem,
  type Message,
  type SystemMessage,
} from "./ChatBubbles"

const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
const threeDaysAgo = new Date(today)
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
const oneWeekAgo = new Date(today)
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
const twoWeeksAgo = new Date(today)
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

const conversationTexts = [
  "Hey, what's up?",
  "Not much, just chilling. You?",
  "Same here, working on some stuff",
  "Nice! What kind of stuff?",
  "Just some coding projects",
  "That's cool! I've been learning React lately",
  "React is awesome! How's it going?",
  "Pretty good, still figuring out hooks though 😅",
  "Hooks can be tricky at first",
  "Yeah, useEffect is confusing sometimes",
  "Once you get it, it clicks",
  "I hope so! Any tips?",
  "Just keep practicing and reading docs",
  "Will do! Thanks for the advice",
  "No problem! Happy to help",
  "So what are you building?",
  "A chat app actually",
  "Oh nice! Like WhatsApp?",
  "Yeah, trying to make it similar",
  "That's ambitious! Good luck with it",
]

function generateBulkMessages(count: number, startId: number): Message[] {
  const messages: Message[] = []
  const baseDate = new Date(twoWeeksAgo)
  
  for (let i = 0; i < count; i++) {
    const messageDate = new Date(baseDate)
    messageDate.setMinutes(messageDate.getMinutes() + i * 5)
    
    if (i > 0 && i % 20 === 0) {
      baseDate.setDate(baseDate.getDate() + 1)
    }
    
    const isOutgoing = i % 2 === 0
    const hour = (9 + Math.floor(i / 5)) % 12 || 12
    const minute = (i * 3) % 60
    const ampm = (9 + Math.floor(i / 5)) >= 12 ? "PM" : "AM"
    const timestamp = `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`
    
    messages.push({
      id: `gen-${startId + i}`,
      senderId: isOutgoing ? "me" : "quam",
      content: conversationTexts[i % conversationTexts.length],
      timestamp,
      date: new Date(messageDate),
      isOutgoing,
      status: isOutgoing ? "read" : undefined,
    })
  }
  
  return messages
}

const generatedMessages = generateBulkMessages(81, 100)

const specialMessages: Message[] = [
  {
    id: "1",
    senderId: "quam",
    content: "Hey, how's the project going?",
    timestamp: "2:30 PM",
    date: oneWeekAgo,
    isOutgoing: false,
  },
  {
    id: "2",
    senderId: "me",
    content: "Pretty good! Almost done with the UI",
    timestamp: "2:35 PM",
    date: oneWeekAgo,
    isOutgoing: true,
    status: "read",
  },
  {
    id: "3",
    senderId: "quam",
    content: "Let her stay, in 9months time u will start using ur paycheck for diapers and wipes",
    timestamp: "10:49 PM",
    date: threeDaysAgo,
    isOutgoing: false,
  },
  {
    id: "4",
    senderId: "me",
    content: "What did you sayyyy? 😂 That'll never happen. dat's Y i invest in Durex... 😂",
    timestamp: "10:49 PM",
    date: threeDaysAgo,
    isOutgoing: true,
    status: "read",
    media: {
      type: "gif",
      url: "https://media.giphy.com/media/3o7TKsQ8kBqk9g9g5O/giphy.gif",
    },
  },
  {
    id: "5",
    senderId: "quam",
    content: "I've heard of and watch that movie before..lol",
    timestamp: "10:50 PM",
    date: yesterday,
    isOutgoing: false,
  },
  {
    id: "6",
    senderId: "me",
    content: "which one, the gif I sent, It's called rick and morty or you're talking bout. Durex. 😂. It's not a movie.",
    timestamp: "10:51 PM",
    date: yesterday,
    isOutgoing: true,
    status: "read",
  },
  {
    id: "7",
    senderId: "quam",
    content: '"Investing in durex"',
    timestamp: "10:52 PM",
    date: yesterday,
    isOutgoing: false,
  },
  {
    id: "8",
    senderId: "quam",
    content: "Its a coded movie, u have to decode to understand",
    timestamp: "10:53 PM",
    date: yesterday,
    isOutgoing: false,
  },
  {
    id: "9",
    senderId: "quam",
    content: "Lol",
    timestamp: "10:53 PM",
    date: today,
    isOutgoing: false,
  },
  {
    id: "10",
    senderId: "me",
    content: "Sure 100%. I invest in it full time. I buy new episodes everytime I pass by shoprite or cosco.",
    timestamp: "10:54 PM",
    date: today,
    isOutgoing: true,
    status: "read",
    reply: {
      senderName: "Quam Emmanuel",
      content: "Its a coded movie, u have to decode to understand",
    },
  },
  {
    id: "11",
    senderId: "quam",
    content: "Goodluck mr investor",
    timestamp: "10:55 PM",
    date: today,
    isOutgoing: false,
  },
  {
    id: "12",
    senderId: "me",
    content: "Tnx 👍. Imma go study now. got exam tomorrow 😭. Thanks for letting me know bout sat schedule change boss.",
    timestamp: "10:57 PM",
    date: today,
    isOutgoing: true,
    status: "read",
  },
  {
    id: "13",
    senderId: "me",
    timestamp: "10:58 PM",
    date: today,
    isOutgoing: true,
    status: "read",
    sticker: {
      url: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
      alt: "Thumbs up sticker",
    },
  },
  {
    id: "14",
    senderId: "quam",
    timestamp: "11:00 PM",
    date: today,
    isOutgoing: false,
    poll: {
      question: "When should we meet for the group project?",
      options: [
        { id: "1", text: "Monday 2pm", votes: 3 },
        { id: "2", text: "Tuesday 4pm", votes: 5 },
        { id: "3", text: "Wednesday 6pm", votes: 2 },
      ],
      totalVotes: 10,
      selectedOptionId: "2",
    },
  },
  {
    id: "15",
    senderId: "quam",
    timestamp: "11:02 PM",
    date: today,
    isOutgoing: false,
    event: {
      title: "Study Group Session",
      date: "Saturday, Jan 25",
      time: "2:00 PM - 5:00 PM",
      location: "Library Room 204",
      description: "Bring your notes and laptop. We'll cover chapters 5-8.",
    },
  },
  {
    id: "16",
    senderId: "quam",
    content: "Here's the TA's contact in case you need help",
    timestamp: "11:05 PM",
    date: today,
    isOutgoing: false,
    contact: {
      name: "Dr. Sarah Johnson",
      phone: "+1 (555) 123-4567",
    },
  },
  {
    id: "17",
    senderId: "quam",
    senderName: "Quam Emmanuel",
    senderAvatar: "https://i.pravatar.cc/150?img=8",
    timestamp: "11:10 PM",
    date: today,
    isOutgoing: false,
    audio: {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: 29,
    },
  },
  {
    id: "18",
    senderId: "me",
    senderName: "Me",
    senderAvatar: "https://i.pravatar.cc/150?img=12",
    timestamp: "11:12 PM",
    date: today,
    isOutgoing: true,
    status: "read",
    audio: {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      duration: 41,
    },
  },
  {
    id: "19",
    senderId: "me",
    senderName: "Me",
    senderAvatar: "https://i.pravatar.cc/150?img=12",
    timestamp: "11:15 PM",
    date: today,
    isOutgoing: true,
    status: "read",
    audio: {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      duration: 18,
    },
    reply: {
      senderName: "Quam Emmanuel",
      content: "🎤 Voice message",
    },
  },
]

const sampleMessages: Message[] = [...generatedMessages, ...specialMessages]

const sampleSystemMessages: SystemMessage[] = [
  {
    id: "sys-1",
    type: "security",
    text: "Messages are end-to-end encrypted. No one outside of this chat can read them.",
    icon: "lock",
  },
  {
    id: "sys-2",
    type: "pin",
    text: "Quam Emmanuel pinned a message",
    icon: "pin",
  },
  {
    id: "sys-3",
    type: "call_missed",
    text: "Missed voice call",
    icon: "phone",
    timestamp: "10:30 PM",
  },
  {
    id: "sys-4",
    type: "disappearing",
    text: "Disappearing messages turned on. Messages will disappear after 24 hours.",
    icon: "timer",
  },
  {
    id: "sys-5",
    type: "group_name",
    text: "Quam Emmanuel changed the group name to \"Study Squad 📚\"",
    icon: "edit",
  },
]

type FlatItem = 
  | { type: "message"; data: Message; position: ChatItem extends { type: "message"; position: infer P } ? P : never; dateLabel?: string }
  | { type: "divider"; id: string; label: string; variant: "date" | "unread" | "custom"; dateLabel?: string }
  | { type: "system"; data: SystemMessage; dateLabel?: string }

function flattenItems(items: ChatItem[]): FlatItem[] {
  const flat: FlatItem[] = []
  let currentDateLabel = ""

  for (const item of items) {
    if (item.type === "divider" && item.variant === "date") {
      currentDateLabel = item.label
    }
    flat.push({ ...item, dateLabel: currentDateLabel } as FlatItem)
  }

  return flat
}

function insertSystemMessages(items: ChatItem[], systemMessages: SystemMessage[]): ChatItem[] {
  const result: ChatItem[] = [
    ...items.slice(0, 2),
    { type: "system", data: systemMessages[0] },
    ...items.slice(2, 5),
    { type: "system", data: systemMessages[1] },
    ...items.slice(5, 8),
    { type: "system", data: systemMessages[2] },
    ...items.slice(8, 12),
    { type: "system", data: systemMessages[3] },
    ...items.slice(12),
    { type: "system", data: systemMessages[4] },
  ]
  return result
}

const ChatBody = () => {
  const chatItems = useMemo(() => {
    const items = buildChatItems(sampleMessages, "9")
    return insertSystemMessages(items, sampleSystemMessages)
  }, [])
  const flatItems = useMemo(() => flattenItems(chatItems), [chatItems])

  const scrollRef = useRef<HTMLDivElement>(null)
  const [floatingDate, setFloatingDate] = useState("")
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const virtualizer = useVirtualizer({
    count: flatItems.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) => {
      const item = flatItems[index]
      if (item.type === "divider") return 40
      if (item.type === "system") return 36
      return 60
    },
    overscan: 10,
  })

  const handleScroll = useCallback(() => {
    setIsScrolling(true)

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 1500)

    const virtualItems = virtualizer.getVirtualItems()
    if (virtualItems.length > 0) {
      const firstVisibleItem = flatItems[virtualItems[0].index]
      if (firstVisibleItem?.dateLabel) {
        setFloatingDate(firstVisibleItem.dateLabel)
      }
    }
  }, [virtualizer, flatItems])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    container.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => {
      container.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [handleScroll])

  useEffect(() => {
    setTimeout(() => {
      virtualizer.scrollToIndex(flatItems.length - 1, { align: "end" })
    }, 100)
  }, [])

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div className="relative h-full overflow-hidden">
      <FloatingDateIndicator label={floatingDate} visible={isScrolling} />
      <ChatBodyContextMenu>
        <div ref={scrollRef} className="h-full px-10 overflow-y-auto overflow-x-hidden">
          <div
            className="relative w-full"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
          >
            <div
              className="absolute left-0 top-0 w-full px-4"
              style={{
                transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
              }}
            >
              {virtualItems.map((virtualRow) => {
                const item = flatItems[virtualRow.index]

                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    className="py-0.5"
                  >
                    {item.type === "divider" ? (
                      <ChatDivider
                        label={item.label}
                        variant={item.variant}
                      />
                    ) : item.type === "system" ? (
                      <ChatSystemMessage message={item.data} />
                    ) : (
                      <ChatBubble
                        message={item.data}
                        position={item.position}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </ChatBodyContextMenu>
    </div>
  )
}

export default ChatBody
