import { twMerge } from 'tailwind-merge'
import Loading from '~/components/ui/loading'
import { useChatState } from '~/hooks/useChatState'

// make it be fixed to the top, just like the action bar is fixed at the bottom
export const Chatbox = () => {
  const { messages, isLoading } = useChatState()
  return (
    <ul className="flex flex-col space-y-2 my-5 max-h-[calc(100%-40px)] pr-3 overflow-y-auto">
      {messages.map((message, index) =>
        message.content.map((content) =>
          content.type === 'text' ? (
            <li
              key={`${message.id}-${index}`}
              className={twMerge(
                message.role === 'user' ? 'justify-end' : 'justify-start',
                'w-full flex'
              )}
            >
              <div
                className={twMerge(
                  message.role === 'user'
                    ? 'border-2 border-primary rounded-xl shadow-inner shadow-primary'
                    : 'justify-start',
                  'w-fit flex items-center p-2'
                )}
              >
                <span>
                  {message.role === 'assistant' && (
                    <Loading
                      animated={isLoading && index === messages.length - 1}
                    />
                  )}
                </span>
                <span>{content.text}</span>
              </div>
            </li>
          ) : null
        )
      )}
    </ul>
  )
}
