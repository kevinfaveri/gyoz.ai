import type Anthropic from '@anthropic-ai/sdk'
import * as React from 'react'

export type Message = {
  role: 'user' | 'assistant'
  content: (
    | Anthropic.Messages.TextBlockParam
    | Anthropic.Messages.ImageBlockParam
    | Anthropic.Beta.Tools.ToolsBetaContentBlock
  )[]
}

interface ChatStateContextValue {
  messages: Message[]
  addMessage: (message: Message) => void
  addMessageAndReplaceLast: (message: Message) => void
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

  const addMessageAndReplaceLast = (message: Message) => {
    setMessages((prevMessages) => {
      if (prevMessages.length === 0) {
        return [message]
      } else {
        const newMessages = [...prevMessages]
        newMessages[newMessages.length - 1] = message
        return newMessages
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
      addMessageAndReplaceLast,
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
