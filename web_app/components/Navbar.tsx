'use client'
import React, { useState } from 'react';
import { CustomIcons } from './icons';
import { Button } from './ui/button';
import { Heart, User, Bell, MessageCircle, Settings, Shield, LogOut, Menu, X } from 'lucide-react';
import { NotificationsDropdown } from './home/ui/NotificationsDropdown';
import { MessagesDropdown } from './home/ui/MessagesDropdown';
import { ProfileDropdown } from './home/ui/ProfileDropdown';
import Logo from './Logo';
import Link from 'next/link';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Dating', href: '/dating', icon: Heart },
    { name: 'Videos', href: '/videos', icon: null },
    { name: 'Matches', href: '/matches', icon: null },
  ];

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 sm:bg-card/92 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg 2xl:px-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-5">
            <div className="flex-shrink-0 w-10 h-10 transition-transform hover:scale-105">
              <Logo className="w-full h-full" gClassName="fill-foreground"/>
            </div>
            
            <div className="hidden xl:block">
              <div className="flex items-center gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent group"
                  >
                    <div className="flex items-center space-x-2">
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.name}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden xl:flex items-center space-x-2">
            <NotificationsDropdown />
            <MessagesDropdown />
            <ProfileDropdown />
          </div>

          <div className="xl:hidden flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <NotificationsDropdown />
              <MessagesDropdown />
              <ProfileDropdown />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-foreground hover:bg-accent ml-2"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className={`xl:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen 
          ? 'max-h-96 opacity-100 visible' 
          : 'max-h-0 opacity-0 invisible overflow-hidden'
      }`}>
        <div className="px-4 pt-2 pb-4 space-y-1 bg-background/98 backdrop-blur-xl border-t border-border">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-3 text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group"
            >
              {item.icon && <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
              <span>{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};