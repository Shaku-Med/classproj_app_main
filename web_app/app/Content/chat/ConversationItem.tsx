import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Conversation, User } from '../utils/types';

interface ConversationItemProps {
  conversation: Conversation;
  currentUser: User;
  isActive?: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  currentUser,
  isActive = false,
  onClick,
}) => {
  // Get the partner in direct chat
  const partner = conversation.type === 'direct' 
    ? conversation.participants.find(user => user.id !== currentUser.id)
    : null;
  
  const displayName = conversation.type === 'direct' 
    ? partner?.name 
    : conversation.name;
  
  const displayAvatar = conversation.type === 'direct'
    ? partner?.avatar
    : conversation.avatar;
  
  const isOnline = conversation.type === 'direct'
    ? partner?.status === 'online'
    : false;

  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date > today) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date > yesterday) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div 
      className={cn(
        "flex items-center p-3 rounded-lg cursor-pointer mb-1",
        isActive ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-200 dark:hover:bg-gray-700"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <img src={displayAvatar} alt={displayName} className="rounded-full" />
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-100 dark:border-gray-800"></span>
        )}
        {conversation.type === 'group' && (
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-100 dark:border-gray-800 flex items-center justify-center">
            <span className="text-white text-xs font-bold">+</span>
          </span>
        )}
      </div>
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <h3 className={cn(
            "font-medium truncate",
            isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"
          )}>
            {displayName}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {conversation.lastMessage?.content}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
