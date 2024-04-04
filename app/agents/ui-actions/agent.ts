import { useTheme } from '~/utils/theme-provider'
import type { Theme } from '~/utils/theme-provider'

export function useUIActionsAgent() {
  const [, setTheme] = useTheme()

  return {
    changeWebsiteTheme: (theme: Theme) => {
      setTheme(theme)
    },
  }
}
