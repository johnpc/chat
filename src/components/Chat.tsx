'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@/hooks/useChat'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { ConversationList } from './ConversationList'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { PWAInstaller } from './PWAInstaller'
import { ThemeToggle } from './ThemeToggle'

export function Chat() {
  const {
    conversations,
    currentConversation,
    isLoading,
    streamingMessageId,
    sendMessage,
    createNewConversation,
    selectConversation,
    deleteConversation,
    clearAllConversations,
  } = useChat()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentConversation?.messages, streamingMessageId])

  const handleSelectConversation = (id: string) => {
    selectConversation(id)
    setIsSidebarOpen(false) // Close sidebar on mobile after selection
  }

  const handleNewConversation = () => {
    createNewConversation()
    setIsSidebarOpen(false) // Close sidebar on mobile after creating new conversation
  }

  return (
    <div className="chat-container">
      <ConversationList
        conversations={conversations}
        currentConversationId={currentConversation?.id}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={deleteConversation}
        onClearAllConversations={clearAllConversations}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="main-content">
        {/* Mobile header with menu button */}
        <div className="mobile-header">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
            className="menu-button"
          >
            <Menu size={20} />
          </Button>
          <h1 className="mobile-title" style={{ color: 'var(--chat-text)' }}>jpc.chat</h1>
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="chat-header">
          <h1 className="chat-title">
            {currentConversation?.title || 'New Conversation'}
          </h1>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {currentConversation?.messages.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-title">
                Welcome to jpc.chat
              </div>
              <div className="welcome-subtitle">
                Start a conversation by typing a message below
              </div>
            </div>
          ) : (
            currentConversation?.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isStreaming={streamingMessageId === message.id}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          key={currentConversation?.id} // Re-render when conversation changes
          onSendMessage={sendMessage}
          disabled={isLoading}
          autoFocus={true}
        />
      </div>
      
      {/* PWA Install Prompt */}
      <PWAInstaller />
    </div>
  )
}
