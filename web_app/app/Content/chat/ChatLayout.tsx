// components/ui/chat/ChatLayout.tsx
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Mic, Image, Smile } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
  }[];
  messages: Message[];
  lastActive: Date;
}

interface ChatLayoutProps {
  currentUser: {
    id: string;
    name: string;
    avatar: string;
  };
  activeConversation: Conversation | null;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ currentUser, activeConversation }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {activeConversation ? (
        <>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <img 
                  src={activeConversation.participants.find(p => p.id !== currentUser.id)?.avatar} 
                  alt="Contact" 
                  className="rounded-full"
                />
              </Avatar>
              <div>
                <h2 className="font-medium text-gray-900 dark:text-gray-100">
                  {activeConversation.participants.find(p => p.id !== currentUser.id)?.name}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last active {activeConversation.lastActive.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Mic className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Image className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col gap-4">
              {activeConversation.messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-xs md:max-w-md ${message.sender.id === currentUser.id ? 'flex-row-reverse' : ''}`}>
                    {message.sender.id !== currentUser.id && (
                      <Avatar className="h-8 w-8">
                        <img src={message.sender.avatar} alt="Avatar" className="rounded-full" />
                      </Avatar>
                    )}
                    <div 
                      className={`px-4 py-2 rounded-2xl ${
                        message.sender.id === currentUser.id 
                          ? 'bg-blue-500 text-white rounded-br-none' 
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                      }`}
                    >
                      <p>{message.content}</p>
                      <div className="flex justify-end mt-1">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input 
                placeholder="Type a message..." 
                className="rounded-full bg-gray-100 dark:bg-gray-800 border-0"
              />
              <Button variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </Button>
              <Button size="icon" className="rounded-full bg-blue-500 hover:bg-blue-600">
                <Send className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              No conversation selected
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Choose a conversation from the sidebar to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLayout;