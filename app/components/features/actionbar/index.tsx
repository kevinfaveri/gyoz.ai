import * as React from 'react'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../ui/command'
import { useQuickActions } from './useQuickActions'
import { useFetcher } from '@remix-run/react'
import usePrevious from '~/hooks/usePrevious'

const ActionBar = () => {
  const fetcher = useFetcher()
  const formRef = React.useRef(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const isFetcherLoading = fetcher.state === 'loading'
  const previousIsFetcherLoading = usePrevious(isFetcherLoading)
  React.useEffect(() => {
    if (!isFetcherLoading && previousIsFetcherLoading) {
      setCommand('')
      setIsLoading(false)
    }
  }, [isFetcherLoading, previousIsFetcherLoading])

  const [command, setCommand] = React.useState('')
  const handleSubmit = () => {
    if (formRef.current) {
      setIsLoading(true)
      fetcher.submit(formRef.current)
    }
  }

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

  return (
    <div className="absolute bottom-0 w-full flex justify-center">
      <Command
        className="rounded-lg border-l border-t border-r w-[70%] shadow-inner shadow-primary"
        filter={filterFnCB}
      >
        <CommandList
          hidden={command.length === 0}
          className="border-b border-dotted py-1"
        >
          {quickActions}
          <CommandItem keywords={['ask-ai']} onSelect={handleSubmit} className="mx-1">
            <span className="mr-2 h-4 w-4">🥟</span>
            <span>Talk to Gyoza OS</span>
          </CommandItem>
        </CommandList>
        <fetcher.Form method="post" ref={formRef}>
          <CommandInput
            placeholder="Ask about something you want to do or information you need"
            autoFocus
            value={command}
            onValueChange={setCommand}
            name="prompt"
            // TODO: Fix this, opacity not working as expected on this component
            disabled={isLoading}
          />
        </fetcher.Form>
      </Command>
    </div>
  )
}

export default ActionBar
