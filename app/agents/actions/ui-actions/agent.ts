import { useTheme } from '~/providers/theme-provider'
import type { Theme } from '~/providers/theme-provider'

export function useUIActionsAgent() {
  const [, setTheme] = useTheme()

  return {
    changeWebsiteTheme: ({ theme }: { theme: Theme }) => {
      // Add failure cases, where theme might have of a value other than Theme. In this case, should ignore the AI output, and return a text message like "the theme change requested is not valid. Valid values are X and Y"
      setTheme(theme)
    },
  }
}
