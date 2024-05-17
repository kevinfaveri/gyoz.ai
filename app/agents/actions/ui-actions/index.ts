import { Theme } from '~/providers/theme-provider'
import type { Tool } from '@anthropic-ai/sdk/resources/beta/tools/messages'

export const UI_ACTIONS_AGENT_BRAIN: Tool[] = [
  {
    name: 'uiActionsAgent_changeWebsiteTheme',
    description: `This tool allows you to change the color scheme of the website between a dark theme and a light theme.
    The dark theme uses darker colors for the background and lighter colors for the text, creating a low-light environment suitable for nighttime or low-light conditions. 
    The light theme uses brighter colors for the background and darker colors for the text, creating a more vibrant and energetic feel.
    
    Return text only message "The theme is already selected" if user's query theme is the same as the current active theme.
    Return text only if user's query asks about the current active theme.
    Return text only if user's query theme is any other color value other than "dark" or "light" or "reverse" or "inverse" or "invert" or very similar values like "black" for dark mode or "white" for light mode.
    Since there are only two themes available, if the user request to change the theme without specifying, it will default to the opposite of the current active theme.

    To use this tool, provide the desired theme as the 'theme' input as either "${Theme.DARK}" for a dark theme or "${Theme.LIGHT}" for a light theme. The tool will then change the color scheme of the website accordingly.
    Return the tool if user's query theme is either "dark", "light" OR very similar values such as "black" for dark mode or "white" for light mode.
    Return the tool if user's query asks to revert theme OR invert OR "inverse" theme in which you should pick the exact opposite of the current active theme as the argument, e.g., if the current theme is dark, change it to light, and vice versa.

    Remember, this tool only affects the color scheme and does not alter the layout, content, or functionality of the website.`,
    input_schema: {
      type: 'object',
      properties: {
        theme: {
          type: 'string',
          enum: [Theme.DARK, Theme.LIGHT],
          description: `The desired color scheme for the website. Must be one of the available themes: "${Theme.DARK}" for a dark theme (or similar values like "black") or "${Theme.LIGHT}" for a light theme (or similar values like "white"). Other color values are not valid.`,
        },
      },
      required: ['theme'],
    },
  },
];
