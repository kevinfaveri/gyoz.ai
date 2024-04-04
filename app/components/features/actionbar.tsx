import * as React from 'react'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import { useQuickActions } from './useQuickActions'

interface ActionBarProps {
  // Add any necessary props here
}

const ActionBar: React.FC<ActionBarProps> = (props) => {
  const [command, setCommand] = React.useState('')
  const filterFnCB = React.useCallback(
    (value: string, search: string, keywords?: string[]) => {
      const joinedKeywords = keywords?.join(' ') || ''
      if (joinedKeywords.startsWith('ask-ai')) return 1
      const extendValue = value.toLowerCase() + ' ' + joinedKeywords.toLowerCase()
      if (extendValue.startsWith(search)) return 1
      return 0
    },
    []
  );

  const quickActions = useQuickActions(setCommand);

  return (
    <div className="absolute bottom-5 w-full flex justify-center">
      <Command
        className="rounded-lg border shadow-md w-[calc(40%)]"
        filter={filterFnCB}
      >
        <CommandList hidden={command.length === 0}>
          {quickActions}
          <CommandItem
            keywords={['ask-ai']}
            onSelect={() => console.log('asking AI...')}
          >
            <span className="mr-2 h-4 w-4">🥟</span>
            <span>Talk to GyozAI</span>
          </CommandItem>
        </CommandList>
        <CommandInput
          placeholder="Type your command..."
          autoFocus
          value={command}
          onValueChange={setCommand}
        />
      </Command>
    </div>
  )
}

export default ActionBar
