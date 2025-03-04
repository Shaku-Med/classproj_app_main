import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';
import { Message, User } from '../utils/types';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"


interface MessageBubbleProps {
  message: Message;
  currentUser: User;
  showAvatar?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUser,
  showAvatar = true,
}) => {
  const isCurrentUser = message.sender.id === currentUser.id;
  
  return (
   <>
     <ContextMenu>
       <ContextMenuTrigger>
            <div 
            className={cn(
              "flex items-end gap-3 px-2 select-none",
              isCurrentUser ? "flex-row-reverse ml-auto" : "mr-auto"
            )}
          >
            {showAvatar && !isCurrentUser && (
              <Avatar className="h-8 w-8 z-[100000]">
                <AvatarImage src={message.sender.avatar} alt={message.sender.name} className="rounded-full" />
                <AvatarFallback>{message?.sender?.name?.slice(0, 1)} {message?.sender?.name?.split(/\s+/)[message?.sender?.name?.split(/\s+/).length - 1].slice(0, 1)}</AvatarFallback>
              </Avatar>
            )}
            {!showAvatar && !isCurrentUser && <div className="w-8"></div>}
            
            <div className="flex flex-col w-full">
              {message.replyTo && (
                <div 
                  className={cn(
                    "px-3 py-1 text-xs max-w-xs truncate opacity-75 mb-1 rounded-3xl overflow-hidden",
                    isCurrentUser 
                      ? "bg-blue-600 text-blue-100 rounded-tl-xl" 
                      : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 ",
                    "border-b border-white/10"
                  )}
                >
                  <span className="font-medium">{message.replyTo.sender.name}</span>: {message.replyTo.content}
                </div>
              )}
              
              <div 
                className={cn(
                  "px-4 py-2 break-words text-sm container_chat w-fit max-w-[70%]",
                  isCurrentUser 
                    ? "bg-blue-500 from-me text-white rounded-tl-2xl rounded-t-2xl rounded-br-none rounded-bl-2xl" 
                    : " from-them  text-gray-900 dark:text-gray-100 rounded-t-2xl rounded-r-2xl",
                  message.replyTo 
                    ? (isCurrentUser ? "rounded-tl-none" : "rounded-tr-none") 
                    : ""
                )}
              >
                {message.content}
                
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {message.attachments.map(attachment => (
                      <div key={attachment.id} className="rounded overflow-hidden">
                        {attachment.type === 'image' && (
                          <img src={attachment.url} alt={attachment.name} className="w-full h-full object-cover" />
                        )}
                        {attachment.type === 'file' && (
                          <div className="bg-gray-100 dark:bg-gray-700 p-2 text-xs flex items-center">
                            <span className="truncate">{attachment.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className={`flex ${isCurrentUser ? `justify-end` : `justify-start`} items-center gap-1 mt-1`}>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isCurrentUser && (
                    message.read 
                      ? <CheckCheck className="h-3 w-3 opacity-70" /> 
                      : <Check className="h-3 w-3 opacity-70" />
                  )}
                </div>
              </div>
              
              {message.reactions && message.reactions.length > 0 && (
                <div className="flex mt-1 gap-1">
                  {[...new Set(message.reactions.map(r => r.emoji))].map(emoji => {
                    const count = message.reactions?.filter(r => r.emoji === emoji).length || 0;
                    return (
                      <div key={emoji} className="bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5 text-xs flex items-center">
                        <span>{emoji}</span>
                        {count > 1 && <span className="ml-1">{count}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
       </ContextMenuTrigger>
       <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem>Subscription</ContextMenuItem>
      </ContextMenuContent>
     </ContextMenu>
   </>
  );
};

export default MessageBubble;