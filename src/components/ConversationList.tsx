'use client'

import { Conversation } from '@/types/chat'
import { Button } from '@/components/ui/button'
import { MessageSquare, Plus, Trash2, X, RotateCcw } from 'lucide-react'

interface ConversationListProps {
  conversations: Conversation[]
  currentConversationId?: string
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onDeleteConversation: (id: string) => void
  onClearAllConversations: () => void
  isOpen: boolean
  onClose: () => void
}

export function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onClearAllConversations,
  isOpen,
  onClose,
}: ConversationListProps) {
  const handleClearAll = () => {
    if (conversations.length === 0) return
    
    const confirmed = window.confirm(
      `Are you sure you want to clear all ${conversations.length} conversation${conversations.length === 1 ? '' : 's'}? This action cannot be undone.`
    )
    
    if (confirmed) {
      onClearAllConversations()
      onClose() // Close sidebar on mobile after clearing
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-actions">
            <Button 
              onClick={onNewConversation}
              variant="ghost"
              className="new-conversation-button"
            >
              <Plus size={16} />
              New Chat
            </Button>
            
            <Button
              onClick={handleClearAll}
              variant="ghost"
              className="clear-all-button"
              disabled={conversations.length === 0}
              title="Clear all conversations"
            >
              <RotateCcw size={16} />
            </Button>
          </div>
          
          {/* Close button - only visible on mobile */}
          <button className="sidebar-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="sidebar-content">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${currentConversationId === conversation.id ? 'active' : ''}`}
              onClick={() => {
                onSelectConversation(conversation.id)
                onClose() // Close sidebar on mobile after selection
              }}
            >
              <MessageSquare size={16} />
              
              <div className="conversation-info">
                <div className="conversation-title">
                  {conversation.title}
                </div>
                <div className="conversation-meta">
                  {conversation.messages.length} messages
                </div>
              </div>
              
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteConversation(conversation.id)
                }}
                title="Delete conversation"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          
          {conversations.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666666', fontSize: '14px', padding: '16px' }}>
              No conversations yet
            </div>
          )}
        </div>
      </div>
    </>
  )
}
