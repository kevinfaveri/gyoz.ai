import * as React from 'react'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../ui/command'
import { useQuickActions } from './useQuickActions'
import { useChatState } from '~/hooks/useChatState'
import { chatStream } from '~/clients/ai-inference'
import { nanoid } from 'nanoid'
import { executeActionPayload, useActionsAgents } from '~/agents/actions'
import type { ToolUseBlock } from '@anthropic-ai/sdk/resources/beta/tools/messages'
import scrollToBottom from '~/utils/scrollToBottom'

const ActionBar = () => {
  const [command, setCommand] = React.useState('')
  const commandInputRef = React.useRef<HTMLInputElement>(null)

  const filterFnCB = React.useCallback(
    (value: string, search: string, keywords?: string[]) => {
      const joinedKeywords = keywords?.join(' ') || ''
      if (joinedKeywords.startsWith('ask-ai')) return 1
      const extendValue =
        value.toLowerCase() + ' ' + joinedKeywords.toLowerCase()
      if (extendValue.includes(search)) return 1
      return 0
    },
    []
  )

  const quickActions = useQuickActions(setCommand)

  const actionAgents = useActionsAgents()

  const {
    messages,
    addMessage,
    addMessageAndReplace,
    isLoading,
    setIsLoading,
  } = useChatState()
  const chatWithAIActions = async () => {
    const prompt = command
    setCommand('')
    setIsLoading(true)
    addMessage({
      role: 'user',
      id: nanoid(),
      content: [{ type: 'text', text: prompt }],
    })
    scrollToBottom()
    addMessage({
      role: 'assistant',
      id: 'placeholder_id',
      content: [{ type: 'text', text: '' }],
    })
    const response = await chatStream({
      prompt,
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content.filter((block) => block.type === 'text'),
      })),
      onChunk: (message) => {
        scrollToBottom()
        addMessageAndReplace({
          role: 'assistant',
          id: message.messageId,
          content: message.contentBlocks,
        })
      },
    }).catch((e) => {
      console.error(e)
      return null
    })
    if (!response) {
      console.debug('Failed to fetch LLM data')
      return
    }

    const tools = response.contentBlocks.filter(
      (block) => block.type === 'tool_use'
    ) as ToolUseBlock[]
    await executeActionPayload(tools, actionAgents)

    setIsLoading(false)
    setTimeout(() => {
      commandInputRef.current?.focus()
    }, 100)
  }

  return (
    <div className="w-full flex justify-center">
      <Command
        className="rounded-lg border-l border-t border-r shadow-inner shadow-primary"
        filter={filterFnCB}
      >
        <CommandList
          hidden={command.length === 0}
          className="border-b border-dotted py-1"
        >
          {quickActions}
          <CommandItem
            keywords={['ask-ai']}
            onSelect={chatWithAIActions}
            className="mx-1"
          >
            <span className="mr-2 h-4 w-4">🥟</span>
            <span>Talk to Gyoza OS</span>
          </CommandItem>
        </CommandList>
        <CommandInput
          ref={commandInputRef}
          placeholder="Ask about something you want to do or information you need"
          autoFocus
          value={command}
          onValueChange={setCommand}
          name="prompt"
          disabled={isLoading}
        />
      </Command>
    </div>
  )
}

export default ActionBar
