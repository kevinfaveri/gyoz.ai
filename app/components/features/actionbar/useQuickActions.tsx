import { GearIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { Theme, Themed, useTheme } from '~/providers/theme-provider'
import { CommandItem, CommandGroup } from '../../ui/command'

export function useQuickActions(setCommand: (command: string) => void) {
  const [, setTheme] = useTheme()

  const toggleTheme = () => {
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
      <CommandItem onSelect={toggleTheme}>
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
