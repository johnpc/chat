'use client'

import { Message } from '@/types/chat'
import { User, Bot } from 'lucide-react'

interface ChatMessageProps {
  message: Message
  isStreaming?: boolean
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className="message-content">
        <div className="message-author">
          {isUser ? 'You' : 'Assistant'}
        </div>

        <div className="message-text">
          {message.content}
          {isStreaming && <span className="streaming-cursor" />}
        </div>

        <div className="message-time">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
