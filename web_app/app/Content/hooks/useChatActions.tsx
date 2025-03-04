import { useState, useCallback } from 'react';
import { Message, Conversation, User, Attachment } from '../utils/types';


export const useChatActions = (currentUser: User) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  
  const sendMessage = useCallback((conversationId: string, content: string, attachments?: Attachment[], replyToMessageId?: string) => {
    // Find reply message if provided
    let replyTo: Message | undefined;
    if (replyToMessageId && messages[conversationId]) {
      replyTo = messages[conversationId].find(msg => msg.id === replyToMessageId);
    }
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      content,
      sender: currentUser,
      timestamp: new Date(),
      read: false,
      attachments,
      replyTo,
    };
    
    // Update messages state
    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));
    
    // Update conversation last message
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: newMessage,
          lastActive: new Date(),
        };
      }
      return conv;
    }));
    
    // Here you would typically make an API call to send the message
    
    return newMessage;
  }, [currentUser, messages]);
  
  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
        };
      }
      return conv;
    }));
    
    // Here you would typically make an API call to mark messages as read
  }, []);
  
  const createConversation = useCallback((participants: User[], type: 'direct' | 'group' = 'direct', name?: string) => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      type,
      participants: [...participants, currentUser],
      unreadCount: 0,
      lastActive: new Date(),
      name: type === 'group' ? name : undefined,
    };
    
    setConversations(prev => [...prev, newConversation]);
    setActiveConversationId(newConversation.id);
    
    // Here you would typically make an API call to create the conversation
    
    return newConversation;
  }, [currentUser]);
  
  const addReaction = useCallback((messageId: string, conversationId: string, emoji: string) => {
    setMessages(prev => {
      const conversationMessages = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: conversationMessages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              reactions: [
                ...(msg.reactions || []),
                { emoji, userId: currentUser.id }
              ]
            };
          }
          return msg;
        })
      };
    });
    
    // Here you would typically make an API call to add the reaction
  }, [currentUser.id]);
  
  const getActiveConversation = useCallback(() => {
    if (!activeConversationId) return null;
    return conversations.find(conv => conv.id === activeConversationId) || null;
  }, [activeConversationId, conversations]);
  
  const getConversationMessages = useCallback((conversationId: string) => {
    return messages[conversationId] || [];
  }, [messages]);
  
  return {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    markAsRead,
    createConversation,
    addReaction,
    getActiveConversation,
    getConversationMessages,
  };
};