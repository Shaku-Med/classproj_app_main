// app/page.tsx - Main Chat Application
'use client';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { ChevronLeft, Menu, MenuIcon, MoreVertical, Phone, PhoneCallIcon, VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
// import ThemeToggle from '@/components/ui/chat/ThemeToggle';
// import ChatInput from '@/components/ui/chat/ChatInput';
// import MessageBubble from '@/components/ui/chat/MessageBubble';
// import { Conversation, Message, User } from '@/utils/types';
// import { formatMessageTime } from '@/lib/utils';
import ThemeToggle from '../chat/ThemeToggle';
import { Conversation, Message, User } from '../utils/types';
import { formatMessageTime } from '../utils/utils';
import MessageBubble from '../chat/MessageBubble';
import ChatInput from '../chat/ChatInput';

// Sample data
const currentUser: User = {
  id: 'user1',
  name: 'Alex Morgan',
  avatar: '/api/placeholder/100/100',
  status: 'online'
};

const conversations: Conversation[] = [
  {
    id: 'conv1',
    type: 'direct',
    participants: [
      currentUser,
      {
        id: 'user2',
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/100/100',
        status: 'online'
      }
    ],
    unreadCount: 2,
    lastActive: new Date(),
    lastMessage: {
      id: 'msg5',
      conversationId: 'conv1',
      content: 'Are we still meeting tomorrow?',
      sender: {
        id: 'user2',
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/100/100'
      },
      timestamp: new Date(Date.now() - 900000),
      read: false
    }
  },
  {
    id: 'conv2',
    type: 'group',
    name: 'Tech Team',
    avatar: '/api/placeholder/100/100',
    participants: [
      currentUser,
      {
        id: 'user3',
        name: 'Mike Chen',
        avatar: '/api/placeholder/100/100',
        status: 'offline'
      },
      {
        id: 'user4',
        name: 'Anna Lee',
        avatar: '/api/placeholder/100/100',
        status: 'online'
      }
    ],
    unreadCount: 0,
    lastActive: new Date(Date.now() - 3600000),
    lastMessage: {
      id: 'msg12',
      conversationId: 'conv2',
      content: 'I just pushed the new updates',
      sender: {
        id: 'user3',
        name: 'Mike Chen',
        avatar: '/api/placeholder/100/100'
      },
      timestamp: new Date(Date.now() - 3600000),
      read: true
    }
  },
  {
    id: 'conv3',
    type: 'direct',
    participants: [
      currentUser,
      {
        id: 'user5',
        name: 'David Miller',
        avatar: '/api/placeholder/100/100',
        status: 'offline'
      }
    ],
    unreadCount: 0,
    lastActive: new Date(Date.now() - 86400000),
    lastMessage: {
      id: 'msg15',
      conversationId: 'conv3',
      content: 'Thanks for your help!',
      sender: {
        id: 'user5',
        name: 'David Miller',
        avatar: '/api/placeholder/100/100'
      },
      timestamp: new Date(Date.now() - 86400000),
      read: true
    }
  }
];

const sampleMessages: Record<string, Message[]> = {
  conv1: [
    {
      id: 'msg1',
      conversationId: 'conv1',
      content: 'Hey, how are you doing?',
      sender: {
        id: 'user2',
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/100/100'
      },
      timestamp: new Date(Date.now() - 3600000),
      read: true
    },
    {
      id: 'msg2',
      conversationId: 'conv1',
      content: "I'm good! Just working on that project we discussed.",
      sender: currentUser,
      timestamp: new Date(Date.now() - 3500000),
      read: true
    },
    {
      id: 'msg3',
      conversationId: 'conv1',
      content: 'Great to hear! How is the progress so far?',
      sender: {
        id: 'user2',
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/100/100'
      },
      timestamp: new Date(Date.now() - 3000000),
      read: true
    },
    {
      id: 'msg4',
      conversationId: 'conv1',
      content: "It's coming along nicely. I've finished the design phase and I'm now working on the implementation.",
      sender: currentUser,
      timestamp: new Date(Date.now() - 2800000),
      read: true
    },
    {
      id: 'msg5',
      conversationId: 'conv1',
      content: 'Are we still meeting tomorrow?',
      sender: {
        id: 'user2',
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/100/100'
      },
      timestamp: new Date(Date.now() - 900000),
      read: false
    },
    {
      id: 'msg6',
      conversationId: 'conv1',
      content: 'Are we still meeting tomorrow?',
      sender: {
        id: 'user2',
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/100/100'
      },
      timestamp: new Date(Date.now() - 900000),
      read: false
    },
    {
      id: 'msg7',
      conversationId: 'conv1',
      content: 'Are we still meeting tomorrow?',
      sender: {
        id: 'user2',
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/100/100'
      },
      timestamp: new Date(Date.now() - 900000),
      read: false
    },
    {
      id: 'msg9',
      conversationId: 'conv1',
      content: 'Are we still meeting tomorrow?',
      sender: {
        id: 'user1',
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/100/100'
      },
      timestamp: new Date(Date.now() - 900000),
      read: false,
      replyTo: {
        id: 'msg2',
        conversationId: 'conv1',
        content: `Yes I'll be there adnfldf yaodhfodhfdfdfdnfakdnfidnfdoifndkfndof naondfoidnfoi dfnoasodfdfaksk`,
        timestamp: new Date(Date.now() - 900000),
        read: false,
        sender: {
          id: 'user2',
          name: 'Alex Morgan',
          avatar: '/api/placeholder/100/100'
        }
      }
    }
  ]
};

export default function ChatApp() {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  // Set first conversation as active by default
  useLayoutEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
      setMessages(sampleMessages[conversations[0].id] || []);
    }
  }, []);
  
  // Handle conversation selection
  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    // Load messages for this conversation
    setMessages(sampleMessages[conversation.id] || []);
    
    // On mobile, auto-close sidebar when selecting a conversation
    if (isMobile) {
      setSidebarOpen(false);
    }
  };
  
  // Send a new message
  const handleSendMessage = (content: string) => {
    if (!activeConversation) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation.id,
      content,
      sender: currentUser,
      timestamp: new Date(),
      read: true
    };
    
    // Add message to the conversation
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate a reply after a delay
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const partner = activeConversation.participants.find((p: any) => p.id !== currentUser.id);
        
        if (partner) {
          const replyMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            conversationId: activeConversation.id,
            content: "Thanks for the message! I'll get back to you soon.",
            sender: partner,
            timestamp: new Date(),
            read: false
          };
          
          setMessages(prev => [...prev, replyMessage]);
        }
      }, 2000);
    }
  };
  
  // Handle attachment upload
  const handleAttachFile = () => {
    console.log('Attachment functionality would be implemented here');
    // This would typically open a file picker
  };
  
  return (
    <div className="flex md:py-3 md:px-1 transition-all p-0 h-full bg-muted">
      <div className="flex-1 md:border-2 border-foreground/10 border-none shadow-sm bg-background rounded-none md:rounded-lg overflow-hidden flex flex-col h-full">
        {/* Chat header */}
        {activeConversation ? (
          <div className=" px-4 transition-all py-[.68rem] md:border-l-1 md:border-l-foreground/10 border-b-1 border-b-foreground/10 bg-background flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)} className="mr-2 cursor-pointer bg-[transparent]">
                  <MenuIcon className="h-10 w-10" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {activeConversation.type === 'direct' ? (
                    <AvatarImage 
                      src={activeConversation.participants.find(p => p.id !== currentUser.id)?.avatar} 
                      alt="Contact" 
                      className="rounded-full"
                    />
                  ) : (
                    <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} className="rounded-full" />
                  )}
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium text-gray-900 dark:text-gray-100">
                    {activeConversation.type === 'direct' 
                      ? activeConversation.participants.find(p => p.id !== currentUser.id)?.name
                      : activeConversation.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activeConversation.type === 'direct' ? (
                      activeConversation.participants.find(p => p.id !== currentUser.id)?.status === 'online' 
                      ? 'Online'
                      : 'Offline'
                  ) : (
                    `${activeConversation.participants.length} members`
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className=' cursor-pointer hover:scale-[.98] transition-all' size="icon">
              <PhoneCallIcon className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className=' cursor-pointer hover:scale-[.98] transition-all' size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View profile</DropdownMenuItem>
                <DropdownMenuItem>Search in conversation</DropdownMenuItem>
                <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">Block user</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        <div className="px-4 transition-all py-[.68rem] border-b">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}
      
      {/* Messages area */}
      {activeConversation ? (
        <ScrollArea className="flex-1 md:p-4 p-2 overflow-hidden h-full sc_area">
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble 
                key={message.id}
                message={message}
                showAvatar={true}
                currentUser={currentUser}
                // isOwn={message.sender.id === currentUser.id}
              />
            ))}
            {messages.length === 0 && (
              <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
                No messages yet. Start the conversation!
              </div>
            )}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Select a conversation to start chatting
        </div>
      )}
      
      {/* Chat input */}
      {activeConversation && (
        <div className=" px-4 py-[0.6rem] border-t border-muted">
          <ChatInput onSend={handleSendMessage} onAttachFile={handleAttachFile} />
        </div>
      )}
    </div>
  </div>
);
}