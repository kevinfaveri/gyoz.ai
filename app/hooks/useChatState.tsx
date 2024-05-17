import * as React from 'react'
import type { MessageRole } from '~/types'

export type Message = {
  id?: string
  role: MessageRole
  content: string
}

interface ChatStateContextValue {
  messages: Message[]
  addMessage: (message: Message) => void
  addMessageAndReplace: (newMessage: Message) => void
  clearMessages: () => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

const ChatStateContext = React.createContext<ChatStateContextValue | undefined>(
  undefined
)

export const ChatStateProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message])
  }

  const addMessageAndReplace = (newMessage: Message) => {
    setMessages((prevMessages) => {
      const existingMessageIndex = prevMessages.findIndex(
        (prevMessage) =>
          prevMessage.id === newMessage.id ||
          prevMessage.id === 'placeholder_id'
      )
      if (existingMessageIndex !== -1) {
        const updatedMessages = [...prevMessages]
        if (newMessage.content === '') {
          updatedMessages.splice(existingMessageIndex, 1)
        } else {
          updatedMessages[existingMessageIndex] = newMessage
        }
        return updatedMessages
      } else {
        return [...prevMessages, newMessage]
      }
    })
  }
  const clearMessages = () => {
    setMessages([])
  }

  const value = React.useMemo(
    () => ({
      messages,
      addMessage,
      addMessageAndReplace,
      clearMessages,
      isLoading,
      setIsLoading,
    }),
    [messages, isLoading]
  )

  return (
    <ChatStateContext.Provider value={value}>
      {children}
    </ChatStateContext.Provider>
  )
}

export const useChatState = () => {
  const context = React.useContext(ChatStateContext)
  if (context === undefined) {
    throw new Error('useChatState must be used within a ChatStateProvider')
  }
  return context
}
