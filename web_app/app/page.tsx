'use client'
import React, { useState } from 'react';
import { Video, User, MessageSquare, MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'react-feather';

const GridIcons = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const items = [
    { id: 1, title: 'Live Streams', description: 'Watch and interact with live events.', icon: <Video size={24} className="" />, route: '/live' },
    { id: 2, title: 'Profile', description: 'Manage your personal information.', icon: <User size={24} className="text-emerald-500" />, route: '/profile' },
    { id: 3, title: 'Public Chat', description: 'Join and discuss in open conversations.', icon: <MessageSquare size={24} className="text-amber-500" />, route: '/public' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className=" h-full overflow-auto bg-gradient-to-b  flex flex-col">
      {/* Header */}
      <header className="w-full sticky top-0 left-0 z-[10000000] p-4 md:py-[1.4rem] md:px-4 flex justify-between items-center bg-background sm:bg-muted shadow-sm ">
        <div className="font-bold text-xl">
          <Link href="/" className="hover:opacity-80 transition-opacity">Chatzy</Link>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </Button>
        
        <nav className="hidden md:flex gap-4">
          {items.map((item) => (
            <Link 
              key={item.id} 
              href={item.route} 
              className=" bg-muted dark:hover:text-blue-500 transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-muted shadow-md z-50 md:hidden">
            <div className="flex flex-col p-4">
              {items.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.route} 
                  className="py-2 text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    {React.cloneElement(item.icon, { size: 16 })}
                    {item.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-200">
          Welcome to Chatzy
        </h1>
        <p className="mt-4 text-lg opacity-[.6] max-w-md">
          A place to connect, share, and express yourself freely.
        </p>
        <Button onClick={e => {
          let xpo = document.querySelector(`.xpo`)
          let dim = document.querySelector(`.dim`)
          // 
          if(xpo && dim){
            // alert('hi')
            xpo.classList.add('act')
            dim.classList.add('act')
            // 
            dim.addEventListener('click', () =>{
              xpo.classList.remove('act')
              dim.classList.remove('act')
            })
          }
        }} variant={`outline`} className="mt-8 md:hidden flex cursor-pointer px-6 py-2 bg-blue-500 text-white rounded-full shadow-lg">
          Get Started
        </Button>
      </div>

      {/* Features Section */}
      <div className="w-full px-4 py-12 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Discover Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {items.map((item) => (
              <Link key={item.id} href={item.route} className="no-underline">
                <Card className="h-full transition-all hover:shadow-md hover:scale-105 border-none bg-card">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="p-3 rounded-full bg-muted mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="mt-2 opacity-[.6] text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full p-6 bg-muted text-center opacity-[.6] text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} Chatzy. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-blue-500 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-blue-500 transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-blue-500 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GridIcons;