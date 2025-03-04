import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Smile, Send, Mic, X } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onAttachFile: () => void;
  isRecording?: boolean;
  onStartRecording?: () => void;
  onCancelRecording?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onAttachFile,
  isRecording = false,
  onStartRecording,
  onCancelRecording,
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="">
      {isRecording ? (
        <div className="flex items-center gap-2 rounded-full">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Recording...</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500 hover:text-red-500"
            onClick={onCancelRecording}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500"
            onClick={onAttachFile}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..." 
            className="rounded-full border-0"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500"
          >
            <Smile className="h-5 w-5" />
          </Button>
          {message.trim() ? (
            <Button 
              size="icon" 
              className="rounded-full bg-blue-500 hover:bg-blue-600"
              onClick={handleSend}
            >
              <Send className="h-5 w-5 text-white" />
            </Button>
          ) : (
            <Button 
              size="icon" 
              className="rounded-full bg-blue-500 hover:bg-blue-600"
              onClick={onStartRecording}
            >
              <Mic className="h-5 w-5 text-white" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatInput;