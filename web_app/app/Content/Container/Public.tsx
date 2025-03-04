'use client'

import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LockOpen, Mic, Camera, Video, ImageIcon, File, X, ChevronUp, Menu, MenuIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

function Public() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey there! How's it going?", sender: "them", timestamp: "12:01 PM" },
    { id: 2, text: "Hi! I'm doing well, thanks for asking. How about you?", sender: "me", timestamp: "12:02 PM" },
    { id: 3, text: "I'm good too! Just wanted to check in.", sender: "them", timestamp: "12:03 PM" },
    { id: 4, text: "Have you finished that project we discussed?", sender: "them", timestamp: "12:03 PM" },
    { id: 5, text: "Yes, I just completed it this morning. I'll send you the files later today.", sender: "me", timestamp: "12:05 PM" },
    { id: 6, text: "That's great! Looking forward to seeing it.", sender: "them", timestamp: "12:06 PM" },
    { id: 7, type: "voice", duration: "0:32", sender: "me", timestamp: "12:10 PM" },
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingStartY, setRecordingStartY] = useState(0);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [showCancelRecording, setShowCancelRecording] = useState(false);
  
  const scrollRef = useRef<any>(null);
  const recordingInterval = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
        // Generate random wave heights for visualization
        setWaveform(prevWave => {
          const newWave = [...prevWave];
          newWave.push(Math.random() * 50 + 10);
          if (newWave.length > 30) newWave.shift();
          return newWave;
        });
      }, 100);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
        setRecordingDuration(0);
        setWaveform([]);
      }
    }

    return () => {
      if (recordingInterval.current) clearInterval(recordingInterval.current);
    };
  }, [isRecording]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;
    
    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleStartRecording = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRecording(true);
    setRecordingStartY(e.clientY);
  };

  const handleMicDrag = (e: React.MouseEvent) => {
    if (!isRecording) return;
    
    const diff = recordingStartY - e.clientY;
    
    // If dragged up more than 50px, show cancel option
    setShowCancelRecording(diff > 50);
  };

  const handleMicRelease = () => {
    if (!isRecording) return;
    
    if (showCancelRecording) {
      // Cancel recording
      setIsRecording(false);
      setShowCancelRecording(false);
    } else {
      // Finish and send voice message
      const duration = Math.floor(recordingDuration / 10);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      const formattedDuration = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
      
      const newVoiceMessage = {
        id: messages.length + 1,
        type: "voice",
        duration: formattedDuration,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, newVoiceMessage]);
      setIsRecording(false);
    }
  };

  const formatRecordingTime = () => {
    const totalSeconds = Math.floor(recordingDuration / 10);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };


//   


const groupMessages = (messages: any[]) => {
    return messages.reduce((acc: any[], msg, index) => {
      const prevMsg = messages[index - 1];
      const sameSender = prevMsg?.sender === msg.sender;
      const sameTime = prevMsg?.timestamp === msg.timestamp;
  
      if (sameSender && sameTime) {
        acc[acc.length - 1].push(msg);
      } else {
        acc.push([msg]);
      }
  
      return acc;
    }, []);
  };
  
  const groupedMessages = groupMessages(messages);  

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-muted/30 md:px-4 md:py-[1.4rem] p-4 shadow-sm">
        <div className="flex items-center">
          <button onClick={e => {
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
        }} className="text-blue-500 mr-2 md:hidden hover:bg-muted h-6 w-6 flex items-center justify-center rounded-md cursor-pointer">
            <MenuIcon/>
          </button>
          <div title={`This is an opened chat room. No one has control over this chat. Any message sent here will be seen by anyone using this app.`} className="flex-1 flex justify-center items-center gap-2 text-red-600">
            <h1 className="text-lg font-semibold text-red-600">Open Chat</h1>
            <LockOpen/>
          </div>
          <button className="text-blue-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 overflow-auto" ref={scrollRef}>
        {groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4">
                <div className={` w-full text-center py-2 px-2 bg-muted mb-2`}>Hello</div>
                {group.map((msg: any, index: number) => {
                    const isFirstInGroup = index === 0;
                    const isLastInGroup = index === group.length - 1;

                    return (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-1`}>
                        <div className={`max-w-xs md:max-w-md`}>
                        {msg.type === 'voice' ? (
                            <div className={`p-3 rounded-2xl transition-all ${msg.sender === 'me'
                            ? `bg-blue-500 text-white ${isFirstInGroup ? ` rounded-bl-2xl rounded-br-sm rounded-tr-2xl rounded-tl-2xl` : ``} ${isLastInGroup ? ` ${isFirstInGroup ? `` : `rounded-tr-sm`} ` : ``}`
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                            <div className="flex items-center">
                                <div className="mr-2">
                                <Mic size={16} />
                                </div>
                                <div className="flex-1 flex items-center">
                                {Array(15).fill(0).map((_, i) => (
                                    <div
                                    key={i}
                                    className={`w-1 mx-0.5 ${msg.sender === 'me' ? 'bg-blue-200' : 'bg-gray-400'}`}
                                    style={{
                                        height: `${5 + Math.sin(i / 2) * 10}px`
                                    }}
                                    />
                                ))}
                                </div>
                                <div className="ml-2 whitespace-nowrap text-sm">
                                {msg.duration}
                                </div>
                            </div>
                            </div>
                        ) : (
                            <div className={`p-3 rounded-2xl transition-all ${msg.sender === 'me'
                            ? `bg-blue-500 text-white ${isFirstInGroup ? ` rounded-bl-2xl rounded-br-sm rounded-tr-2xl rounded-tl-2xl` : ``} ${isLastInGroup ? ` ${isFirstInGroup ? `` : `rounded-tr-sm`} ` : ``}`
                            : `bg-gray-500 text-white ${isFirstInGroup ? ` rounded-br-2xl rounded-bl-sm rounded-tl-2xl rounded-tr-2xl` : ``} ${isLastInGroup ? ` ${isFirstInGroup ? `` : `rounded-tl-sm`} ` : ``}`}`}>
                            {msg.text}
                            </div>
                        )}
                        {isLastInGroup && (
                            <div className={`text-xs text-gray-500 mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                            {msg.timestamp}
                            </div>
                        )}
                        </div>
                    </div>
                    );
                })}
            </div>
        ))}
      </ScrollArea>


      {/* Recording UI (shown when recording) */}
      {isRecording && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
          <div className="text-white mb-4">
            {showCancelRecording ? (
              <div className="flex flex-col items-center">
                <X size={48} className="text-red-500 mb-2" />
                <div className="text-red-400">Release to cancel</div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ChevronUp size={24} className="mb-2 animate-bounce" />
                <div className="text-gray-200 mb-2">Slide up to cancel</div>
              </div>
            )}
          </div>
          
          <div className="bg-white/10 rounded-full p-4 backdrop-blur mb-4">
            <Mic size={32} className="text-red-500 animate-pulse" />
          </div>
          
          <div className="text-xl text-white font-bold mb-6">
            {formatRecordingTime()}
          </div>
          
          <div className="flex items-end h-16 space-x-1 mb-20">
            {waveform.map((height, i) => (
              <div 
                key={i}
                className="w-1 bg-blue-500 rounded-full"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-muted/30 md:px-4 md:py-[.90rem] p-2 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="p-2 rounded-full text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" side="top">
              <div className="grid grid-cols-2 gap-2 p-2">
                <button className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded-lg">
                  <Camera size={20} className="text-blue-500 mb-2" />
                  <span className="text-sm">Camera</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded-lg">
                  <ImageIcon size={20} className="text-green-500 mb-2" />
                  <span className="text-sm">Photos</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded-lg">
                  <Video size={20} className="text-red-500 mb-2" />
                  <span className="text-sm">Video</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded-lg">
                  <File size={20} className="text-purple-500 mb-2" />
                  <span className="text-sm">Files</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
          
          <input
            type="text"
            className="flex-1 border rounded-full py-2 px-4 mx-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="iMessage"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
          
          {message.trim() === '' ? (
            <button 
              type="button" 
              className={cn(
                "p-2 bg-gray-200 text-blue-500 rounded-full transition-all",
                isRecording && "bg-red-500 text-white"
              )}
              onMouseDown={handleStartRecording}
              onMouseMove={handleMicDrag}
              onMouseUp={handleMicRelease}
              onMouseLeave={handleMicRelease}
              onTouchStart={handleStartRecording as any}
              onTouchMove={handleMicDrag as any}
              onTouchEnd={handleMicRelease}
            >
              <Mic size={22} />
            </button>
          ) : (
            <button 
                type="submit" 
                className="p-2 text-blue-500"
                >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
            </button>
          )}
        </form>
        </div>
    </div>
  );
}

export default Public;