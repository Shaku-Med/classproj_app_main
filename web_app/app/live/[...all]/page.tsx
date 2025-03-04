'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Heart, Share2, MessageSquare, Users, ChevronRight, Send, Smile, MoreHorizontal } from 'lucide-react';

function StreamPage() {
  // Stream info state
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(1245);
  const [viewsCount, setViewsCount] = useState(5782);
  const [liveViewers, setLiveViewers] = useState(2347);
  const [showChatMobile, setShowChatMobile] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState([
    { id: 1, user: "GamingNinja23", content: "This boss fight is insane!", timestamp: "2 min ago", isSubscriber: true, isModerator: false },
    { id: 2, user: "StreamMod", content: "Remember to follow the channel rules everyone!", timestamp: "1 min ago", isSubscriber: true, isModerator: true },
    { id: 3, user: "CasualViewer", content: "First time watching, loving the content so far!", timestamp: "1 min ago", isSubscriber: false, isModerator: false },
    { id: 4, user: "ProGamer99", content: "Try using the fire spell against this enemy", timestamp: "Just now", isSubscriber: true, isModerator: false },
    { id: 5, user: "ChillFan", content: "Joined just in time for the best part!", timestamp: "Just now", isSubscriber: false, isModerator: false }
  ]);
  const [newMessage, setNewMessage] = useState("");
  
  const chatEndRef = useRef<any>(null);
  
  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    
    // Here you would typically emit this message to your server
    // instead of directly adding it to the state
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      user: "You",
      content: newMessage,
      timestamp: "Just now",
      isSubscriber: true,
      isModerator: false
    }]);
    
    setNewMessage("");
    
    // Your server communication would go here
    // Example: socket.emit('send_message', { content: newMessage });
  };
  
  return (
    <div className=" h-full overflow-auto">
      {/* Header */}
      <header className=" bg-muted shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">StreamHub</h1>
            <button className="md:hidden bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg flex items-center gap-1" onClick={() => setShowChatMobile(!showChatMobile)}>
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Content */}
          <div className={`flex-1 ${showChatMobile ? 'hidden' : 'block'} md:block`}>
            {/* Stream Video */}
            <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
              <img 
                src="https://th.bing.com/th/id/OIP.c2WZQrwIUTWpk-EpfkQr8AHaFj?rs=1&pid=ImgDetMain" 
                alt="Stream content" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span>LIVE</span>
              </div>
              <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{liveViewers.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Stream Details */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold">Sunday Gaming Marathon: Final Boss Challenge</h1>
              <div className="flex items-center mt-2">
                <img 
                  src="/api/placeholder/80/80" 
                  alt="Streamer avatar" 
                  className="w-10 h-10 rounded-full border-2 border-blue-500"
                />
                <div className="ml-3">
                  <h3 className="font-bold">GamerPro99</h3>
                  <p className=" opacity-[.6] text-sm">3.2M followers</p>
                </div>
                <button className="ml-auto bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">Follow</button>
              </div>
            </div>
            
            {/* Engagement Stats */}
            <div className="mt-6 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <button 
                  className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-300'}`}
                  onClick={handleLike}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <span>{likesCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="w-6 h-6 text-gray-300" />
                <span>Share</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-gray-300" />
                <span>{viewsCount.toLocaleString()} total views</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 bg-red-500 rounded-full"></span>
                <span>{liveViewers.toLocaleString()} watching now</span>
              </div>
            </div>
            
            {/* Stream Description */}
            <div className="mt-6 bg-secondary/40 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">About this stream</h3>
              <p className="mt-2 text-gray-300">
                Join me as I attempt to defeat the final boss in Elden Ring! This is my third attempt after 
                nearly 100 hours of gameplay. We'll be using the build you all voted for last week, and I'll 
                be sharing tips and strategies for anyone else stuck on this boss. Thanks for watching!
              </p>
              <p className="mt-2 text-gray-300">
                💰 Donations go toward new game releases and better streaming equipment.
              </p>
              <p className="mt-2 text-gray-400">
                #EldenRing #Gaming #FinalBoss
              </p>
            </div>
          </div>
          
          {/* Chat Section - Hidden on mobile by default, toggleable */}
          <div className={`w-full lg:w-80 flex h-full max-h-[500px] items-center justify-between flex-col bg-secondary/30 rounded-lg overflow-hidden`}>
            <div className="flex justify-between w-full items-center p-3 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-semibold">Live Chat</h3>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Users className="w-4 h-4 mr-1" />
                <span>{liveViewers.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Messages */}
            <div className="h-full overflow-y-auto p-3 w-full" style={{ scrollBehavior: 'smooth' }}>
              {messages.map(message => (
                <div key={message.id} className="mb-3">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <span className={`font-bold ${message.user === "You" ? "text-blue-400" : message.isModerator ? "text-green-400" : message.isSubscriber ? "text-blue-400" : "text-gray-200"}`}>
                          {message.user}
                        </span>
                        {message.isModerator && (
                          <span className="bg-green-800 text-green-200 text-xs px-1 rounded">MOD</span>
                        )}
                        {message.isSubscriber && !message.isModerator && (
                          <span className="bg-blue-800 text-blue-200 text-xs px-1 rounded">SUB</span>
                        )}
                      </div>
                      <p className="text-gray-300 break-words">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{message.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            {/* Chat Input */}
            <div className="p-3 border-t w-full">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Send a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full bg-gray-700 rounded-lg py-2 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreamPage;