export interface User {
    id: string;
    name: string;
    avatar: string;
    status?: 'online' | 'offline' | 'away';
    lastSeen?: Date;
}

export interface Message {
    id: string;
    conversationId: string;
    content: string;
    sender: User;
    timestamp: Date;
    read: boolean;
    attachments?: Attachment[];
    reactions?: Reaction[];
    replyTo?: Message;
  }
  
  export interface Attachment {
    id: string;
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
    name: string;
    size?: number;
    thumbnail?: string;
  }
  
  export interface Reaction {
    emoji: string;
    userId: string;
  }
  
  export interface Conversation {
    id: string;
    type: 'direct' | 'group';
    participants: User[];
    lastMessage?: Message;
    unreadCount: number;
    lastActive: Date;
    name?: string; // For group chats
    avatar?: string; // For group chats
    isPinned?: boolean;
    isArchived?: boolean;
    isBlocked?: boolean;
    isMuted?: boolean;
  }