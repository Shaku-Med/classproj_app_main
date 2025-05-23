import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

interface Message {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar: string;
  unread: boolean;
}

const messages: Message[] = [
  { id: 1, name: 'Emma Wilson', message: 'Hey! How are you doing?', time: '5m ago', avatar: 'EW', unread: true },
  { id: 2, name: 'Alex Johnson', message: 'Thanks for the great conversation!', time: '20m ago', avatar: 'AJ', unread: true },
  { id: 3, name: 'Sophie Chen', message: 'Would love to meet up sometime', time: '2h ago', avatar: 'SC', unread: true },
  { id: 4, name: 'Mike Davis', message: 'That movie recommendation was perfect!', time: '1d ago', avatar: 'MD', unread: false },
];

export const MessagesDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative ">
          <MessageCircle className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white font-bold">3</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-black/90 backdrop-blur-xl border-white/10 text-white" align="end">
        <DropdownMenuLabel className="text-gray-300 flex items-center justify-between">
          <span>Messages</span>
          <Button variant="ghost" size="sm" className="text-xs text-purple-400 hover:text-purple-300">
            View all
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <div className="max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <DropdownMenuItem key={message.id} className="hover:bg-white/10 cursor-pointer p-3 flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {message.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate">{message.name}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500 text-xs">{message.time}</span>
                    {message.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-1 truncate">{message.message}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="hover:bg-white/10 cursor-pointer justify-center text-purple-400">
          Open Messages
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 