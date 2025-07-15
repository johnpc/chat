'use client'

import { useState, KeyboardEvent, useRef, useEffect } from 'react'
import { Button } from '@aws-amplify/ui-react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  autoFocus?: boolean
}

export function ChatInput({ onSendMessage, disabled, autoFocus = true }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus the input when component mounts or when autoFocus changes
  useEffect(() => {
    if (autoFocus && textAreaRef.current && !disabled) {
      textAreaRef.current.focus()
    }
  }, [autoFocus, disabled])

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'
      textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message)
      setMessage('')
      // Re-focus after sending message
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.focus()
        }
      }, 100)
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <div className="chat-input-field">
          <textarea
            ref={textAreaRef}
            className="chat-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={disabled}
            rows={1}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="true"
          />
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={disabled || !message.trim()}
          className="send-button"
          variation="primary"
          size="large"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  )
}
