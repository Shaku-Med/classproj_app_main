import React from 'react';
import { Bell, Clock, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

const notifications: Notification[] = [
  { id: 1, title: 'New Match!', message: 'You have a new match with Sarah', time: '2m ago', unread: true },
  { id: 2, title: 'Event Reminder', message: 'Speed Dating tonight at 7 PM', time: '1h ago', unread: true },
  { id: 3, title: 'Profile View', message: 'Someone viewed your profile', time: '3h ago', unread: false },
  { id: 4, title: 'Like Received', message: 'You received a new like', time: '5h ago', unread: false },
];

export const NotificationsDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-6 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
            3
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-background/90 backdrop-blur-xl border-white/10 text-white" align="end">
        <DropdownMenuLabel className="text-gray-300 flex items-center justify-between">
          <span>Notifications</span>
          <Button variant="ghost" size="sm" className="text-xs text-purple-400 hover:text-purple-300">
            Mark all read
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="hover:bg-white/10 cursor-pointer p-3 flex-col items-start">
              <div className="flex justify-between w-full items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{notification.title}</span>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-500 text-xs">{notification.time}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="hover:bg-white/10 cursor-pointer justify-center text-purple-400">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 