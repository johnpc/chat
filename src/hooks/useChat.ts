'use client'

import { useState, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Message, Conversation } from '@/types/chat'

const STORAGE_KEY = 'chat-conversations'

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string>('')

  // Load conversations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    let loadedConversations: Conversation[] = []
    
    if (stored) {
      try {
        loadedConversations = JSON.parse(stored)
        setConversations(loadedConversations)
      } catch (error) {
        console.error('Failed to parse stored conversations:', error)
      }
    }
    
    // Create a new conversation if none exist, or set the most recent one as current
    if (loadedConversations.length === 0) {
      const newConversation: Conversation = {
        id: uuidv4(),
        title: 'New Conversation',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setConversations([newConversation])
      setCurrentConversationId(newConversation.id)
    } else {
      // Set the most recent conversation as current
      const mostRecent = loadedConversations.reduce((latest, current) => 
        current.updatedAt > latest.updatedAt ? current : latest
      )
      setCurrentConversationId(mostRecent.id)
    }
  }, [])

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
    }
  }, [conversations])

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    
    setConversations(prev => [newConversation, ...prev])
    setCurrentConversationId(newConversation.id)
    return newConversation.id
  }, [])

  const getCurrentConversation = useCallback(() => {
    return conversations.find(conv => conv.id === currentConversationId)
  }, [conversations, currentConversationId])

  const addMessage = useCallback((conversationId: string, message: Message) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, message],
            updatedAt: Date.now(),
            // Update title if this is the first user message
            title: conv.messages.length === 0 && message.role === 'user' 
              ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
              : conv.title
          }
        : conv
    ))
  }, [])

  const updateMessage = useCallback((conversationId: string, messageId: string, content: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? {
            ...conv,
            messages: conv.messages.map(msg => 
              msg.id === messageId ? { ...msg, content } : msg
            ),
            updatedAt: Date.now(),
          }
        : conv
    ))
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const conversationId = currentConversationId || createNewConversation()
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    }

    // Add user message
    addMessage(conversationId, userMessage)
    setIsLoading(true)

    // Create assistant message placeholder
    const assistantMessageId = uuidv4()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }
    addMessage(conversationId, assistantMessage)
    setStreamingMessageId(assistantMessageId)

    try {
      // Get the current conversation with the user message included
      const currentConversation = conversations.find(c => c.id === conversationId)
      const messages = currentConversation ? [...currentConversation.messages, userMessage] : [userMessage]

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter(line => line.trim())

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                setStreamingMessageId('')
                break
              }

              try {
                const parsed = JSON.parse(data)
                
                if (parsed.content) {
                  accumulatedContent += parsed.content
                  updateMessage(conversationId, assistantMessageId, accumulatedContent)
                } else if (parsed.error) {
                  throw new Error(parsed.error)
                }
              } catch (e) {
                console.error('Failed to parse streaming data:', e)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      updateMessage(conversationId, assistantMessageId, 'Sorry, I encountered an error while processing your message. Please try again.')
    } finally {
      setIsLoading(false)
      setStreamingMessageId('')
    }
  }, [currentConversationId, conversations, isLoading, createNewConversation, addMessage, updateMessage])

  const selectConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId)
  }, [])

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId))
    if (currentConversationId === conversationId) {
      const remaining = conversations.filter(conv => conv.id !== conversationId)
      if (remaining.length > 0) {
        setCurrentConversationId(remaining[0].id)
      } else {
        createNewConversation()
      }
    }
  }, [conversations, currentConversationId, createNewConversation])

  const clearAllConversations = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY)
    
    // Create a fresh new conversation
    const newConversation: Conversation = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    
    // Reset state with just the new conversation
    setConversations([newConversation])
    setCurrentConversationId(newConversation.id)
    setStreamingMessageId('')
  }, [])

  return {
    conversations,
    currentConversation: getCurrentConversation(),
    isLoading,
    streamingMessageId,
    sendMessage,
    createNewConversation,
    selectConversation,
    deleteConversation,
    clearAllConversations,
  }
}
