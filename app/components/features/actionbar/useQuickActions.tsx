import { GearIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { Theme, Themed, useTheme } from '~/providers/theme-provider'
import { CommandItem, CommandGroup } from '../../ui/command'
import { useChatState } from '~/hooks/useChatState'

export function useQuickActions(
  setCommand: (command: string) => void,
  disable: boolean = false
) {
  const [, setTheme] = useTheme()

  const { addMessage } = useChatState()

  const toggleTheme = (event: any) => {
    if (disable) return
    console.log(event)
    addMessage({
      role: 'user',
      content: [{ type: 'text', text: 'Toggle theme' }],
    })
    setTheme((prevTheme) => {
      return prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    })
    setCommand('')
  }

  return (
    <CommandGroup
      heading={
        <div className="flex">
          <GearIcon className="mr-2 h-4 w-4" />
          <span>Quick Actions</span>
        </div>
      }
    >
      <CommandItem onSelect={(event) => toggleTheme(event)}>
        <Themed
          dark={
            <>
              <SunIcon className="mr-2 h-4 w-4" />
              <span>Enable Light Mode</span>
            </>
          }
          light={
            <>
              <MoonIcon className="mr-2 h-4 w-4" />
              <span>Enable Dark Mode</span>
            </>
          }
        />
      </CommandItem>
    </CommandGroup>
  )
}
