'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EllipsisVertical } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MessageSquare, Phone, Users, Settings, Search, ChevronDown, PlusCircle, LogOut } from 'react-feather'; // Assuming you're using react-feather for icons

const conversations = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: `https://lh3.googleusercontent.com/a/ACg8ocLoZ1nImMTL24FcoDGSgGXrI8iHLjFXNMAAsyXQOzWFzdOklm8=s96-c`,
      lastMessage: 'Are we still meeting tomorrow?',
      timestamp: new Date('2025-03-02T10:30:00'),
      unread: 2,
      online: true,
    },
    {
      id: '2',
      name: 'Tech Team',
      avatar: `https://lh3.googleusercontent.com/a/ACg8ocLoZ1nImMTL24FcoDGSgGXrI8iHLjFXNMAAsyXQOzWFzdOklm8=s96-c`,
      lastMessage: 'I just pushed the new updates',
      timestamp: new Date('2025-03-01T18:45:00'),
      unread: 0,
      online: false,
      isGroup: true,
    },
    {
      id: '3',
      name: 'David Miller',
      avatar: `https://lh3.googleusercontent.com/a/ACg8ocLoZ1nImMTL24FcoDGSgGXrI8iHLjFXNMAAsyXQOzWFzdOklm8=s96-c`,
      lastMessage: 'Thanks for your help!',
      timestamp: new Date('2025-03-01T09:15:00'),
      unread: 0,
      online: true,
    },
    {
      id: '4',
      name: 'Emma Thompson',
      avatar: `https://lh3.googleusercontent.com/a/ACg8ocLoZ1nImMTL24FcoDGSgGXrI8iHLjFXNMAAsyXQOzWFzdOklm8=s96-c`,
      lastMessage: 'Check out this article',
      timestamp: new Date('2025-02-28T21:05:00'),
      unread: 5,
      online: false,
    },
    {
      id: '5',
      name: 'Emma Thompson',
      avatar: `https://lh3.googleusercontent.com/a/ACg8ocLoZ1nImMTL24FcoDGSgGXrI8iHLjFXNMAAsyXQOzWFzdOklm8=s96-c`,
      lastMessage: 'Check out this article',
      timestamp: new Date('2025-02-28T21:05:00'),
      unread: 5,
      online: false,
    },
    {
      id: '4',
      name: 'Emma Thompson',
      avatar: `https://lh3.googleusercontent.com/a/ACg8ocLoZ1nImMTL24FcoDGSgGXrI8iHLjFXNMAAsyXQOzWFzdOklm8=s96-c`,
      lastMessage: 'Check out this article',
      timestamp: new Date('2025-02-28T21:05:00'),
      unread: 5,
      online: false,
    },
    {
      id: '4',
      name: 'Emma Thompson',
      avatar: `https://lh3.googleusercontent.com/a/ACg8ocLoZ1nImMTL24FcoDGSgGXrI8iHLjFXNMAAsyXQOzWFzdOklm8=s96-c`,
      lastMessage: 'Check out this article',
      timestamp: new Date('2025-02-28T21:05:00'),
      unread: 5,
      online: false,
    },
    {
      id: '4',
      name: 'Emma Thompson',
      avatar: `https://lh3.googleusercontent.com/a/ACg8ocLoZ1nImMTL24FcoDGSgGXrI8iHLjFXNMAAsyXQOzWFzdOklm8=s96-c`,
      lastMessage: 'Check out this article',
      timestamp: new Date('2025-02-28T21:05:00'),
      unread: 5,
      online: false,
    },
    {
      id: '4',
      name: 'Emma Thompson',
      avatar: `https://lh3.googleusercontent.com/a/ACg8ocLoZ1nImMTL24FcoDGSgGXrI8iHLjFXNMAAsyXQOzWFzdOklm8=s96-c`,
      lastMessage: 'Check out this article',
      timestamp: new Date('2025-02-28T21:05:00'),
      unread: 100,
      online: false,
    },
  ];


  let Options = [
    {
      label: 'All Chats',
      value: 'all',
    },
    {
      label: 'Recent Chats',
      value: 'recent',
    },
    {
      label: 'Favorites',
      value: 'favorites',
    },
    {
      label: 'Contacts',
      value:'contacts',
    },
    {
      label: 'Non-Contacts',
      value: 'non_contacts',
    },
    {
      label: 'Groups',
      value: 'groups',
    },
    {
      label: 'Drafts',
      value: 'drafts',
    },
  ]

const Sidebar = () => {
  const [selectedOptions, setSelectedOptions] = useState<any>(Options[1])
  return (
    <div className="flex z-[100000000] flex-col justify-between h-full bg-muted">
      {/* Profile header */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>A</AvatarFallback>
              <AvatarImage src={`https://lh3.googleusercontent.com/a/ACg8ocLoZ1nImMTL24FcoDGSgGXrI8iHLjFXNMAAsyXQOzWFzdOklm8=s96-c`} alt="Your avatar" className="rounded-full" />
            </Avatar>
            <div>
              <h2 className="font-medium">Your Name</h2>
              <div className="flex items-center text-xs opacity-[.6]">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Online
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b dark:border-gray-700">
        <Button variant="ghost" className="flex-1 rounded-none py-4 text-blue-500 border-b-2 border-blue-500">
          <MessageSquare className="h-5 w-5 mr-2" />
          Chats
        </Button>
        <Button variant="ghost" className="flex-1 rounded-none py-4">
          <Phone className="h-5 w-5 mr-2" />
          Calls
        </Button>
        <Button variant="ghost" className="flex-1 rounded-none py-4">
          <Users className="h-5 w-5 mr-2" />
          Contacts
        </Button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-10 bg-background/50 border-0"
          />
        </div>
      </div>

      {/* Conversation filters */}
      <div className="px-4 py-2 flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger>
              <div className="flex items-center text-sm font-medium opacity-[.6] hover:opacity-[1] transition-all">
                {selectedOptions?.label}
              <ChevronDown className="ml-1 h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {
              (Options || []).map((v, k) => {
                return (
                  <DropdownMenuItem onClick={e => setSelectedOptions(v)} className={`${v.value === selectedOptions?.value ? ` bg-muted` : ``}`} key={k}>
                    {v.label}
                  </DropdownMenuItem>
                )
              })
            }
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="sm" className="text-blue-500">
          <PlusCircle className="h-4 w-4 mr-1" />
          New Chat
        </Button>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="px-2">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id}
              className="flex relative items-center p-3 hover:bg-background/20 rounded-lg cursor-pointer mb-1"
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{conversation.name.slice(0, 1)}</AvatarFallback>
                  <AvatarImage src={conversation.avatar} alt={conversation.name} className="rounded-full" />
                </Avatar>
                {conversation.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-100 dark:border-gray-800"></span>
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {conversation.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {conversation.unread > 99 ? `99+` : conversation.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Bottom actions */}
      <div className="p-4 border-t dark:border-gray-700">
        <Button variant="ghost" className="w-full justify-start text-red-500">
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
