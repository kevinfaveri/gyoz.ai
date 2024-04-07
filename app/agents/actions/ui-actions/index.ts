import { Theme } from '~/providers/theme-provider'
import type { Tool } from '@anthropic-ai/sdk/resources/beta/tools/messages'

export const UI_ACTIONS_AGENT_BRAIN: Tool[] = [
  {
    name: 'uiActionsAgent_changeWebsiteTheme',
    description: `This tool allows you to change the color scheme of the website between a dark theme and a light theme. The dark theme uses darker colors for the background and lighter colors for the text, creating a low-light environment suitable for nighttime or low-light conditions. The light theme uses brighter colors for the background and darker colors for the text, creating a more vibrant and energetic feel.
      To use this tool, provide the desired theme as the 'theme' input, selecting either "dark" or "light", or extremely similar colors (like black and white, respectively). The tool will then apply the corresponding color palette to the website, updating the background, text, and other UI elements accordingly.
      However, before using this tool, you should check the 'activeTheme' from APP_CONTEXT to determine if the requested theme is already active. If the 'activeTheme' matches the requested 'theme', there is no need to use this tool. Instead, use the 'fallbackAgent_fallbackChat' tool to inform the user that their requested theme is already active.
      It's important to note that this tool only affects the color scheme and does not alter the layout, content, or functionality of the website.`,
    input_schema: {
      type: 'object',
      properties: {
        theme: {
          type: 'string',
          enum: [Theme.DARK, Theme.LIGHT],
          description: `The desired color scheme for the website. Must be one of the available themes: "${Theme.DARK}" for a low-light theme or "${Theme.LIGHT}" for a bright and vibrant theme.`,
        },
      },
      required: ['theme'],
    },
  },
];
