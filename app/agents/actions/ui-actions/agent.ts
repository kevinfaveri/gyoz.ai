import { useTheme } from '~/providers/theme-provider'
import type { Theme } from '~/providers/theme-provider'

export function useUIActionsAgent() {
  const [, setTheme] = useTheme()

  return {
    changeWebsiteTheme: (theme: Theme) => {
      setTheme(theme)
    },
  }
}
