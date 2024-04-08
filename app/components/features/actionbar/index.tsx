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

  // const actionAgents = useActionsAgents()
  // React.useEffect(() => {
  //   // TODO: This effect is always triggered
  //   if (fetcher.data?.output && fetcher.state === 'idle') {
  //     executeActionPayload(
  //       fetcher.data.output as ToolsBetaContentBlock[],
  //       actionAgents
  //     )
  //   }
  // }, [actionAgents, fetcher.data?.output, fetcher.state, previousOutput])

  const {
    messages,
    addMessage,
    addMessageAndReplaceLast,
    isLoading,
    setIsLoading,
  } = useChatState()
  const chatWithAIActions = async () => {
    const prompt = command
    setCommand('')
    setIsLoading(true)
    addMessage({ role: 'user', content: [{ type: 'text', text: prompt }] })
    addMessage({ role: 'assistant', content: [{ type: 'text', text: '' }] })
    const response = await chatStream({
      prompt,
      messages,
      onChunk: (message) =>
        addMessageAndReplaceLast({
          role: 'assistant',
          content: [{ type: 'text', text: message }],
        }),
    }).catch((error) => {
      return null
    })
    if (!response) {
      console.debug('Failed to fetch LLM data')
      return
    }

    addMessageAndReplaceLast({
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: response,
        },
      ],
    })
    setIsLoading(false)
    commandInputRef.current?.focus()
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
