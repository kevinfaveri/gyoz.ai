import { Theme } from '~/utils/theme-provider'
import type { AgentAction } from '../types'

// For building the brain, check agent.ts
export const UI_ACTIONS_AGENT_BRAIN: AgentAction[] = [
  {
    name: 'Change Website Theme',
    description: 'Change the website theme between dark and light',
    examplePrompts: [
      'Change the website theme to dark',
      'Change the website theme to light',
      'Change the website theme',
      'Change the theme to dark',
      'Change the theme to light',
      'Change the theme',
    ],
    action: {
      function: 'changeWebsiteTheme',
      args: [[Theme.LIGHT, Theme.LIGHT]],
    },
  },
]

export const UI_ACTION_AGENT_PROMPT =  `
<Agent>
  <Name>uiActionsAgent</Name>
  <Description>
  The UI Action Agent is designed to assist users in performing various actions on a website's user interface by selecting the most appropriate AgentAction based on the user's request.
  </Description>

  <Inputs>
  $ACTIONS_AGENT_BRAIN=${JSON.stringify(UI_ACTIONS_AGENT_BRAIN, null, 2)}
  </Inputs>

  <Instructions>
  You are the UI Action Agent, an AI assistant that helps users perform actions on a website's user interface. Here are a couple examples:

  <example>
  User request: Switch to a bright theme
  <thinkingsteps>
  1. Keywords: switch, bright, theme. Intent: change the theme to a light color scheme.
  2. The "Change Website Theme" action matches this intent.
  3. Only one matching action, so no need to choose between multiple.
  4. The user wants a "bright" theme, which maps to the "light" theme option.
  </thinkingsteps>
  <response>
  {
    "agentObjectName": "uiActionsAgent",
    "function": "changeWebsiteTheme",
    "args": ["light"],
    "userRequest": "$USER_REQUEST"
  } 
  </response>
  </example>

  <example>
  User request: I prefer darker colors
  <thinkingsteps>
  1. Keywords: prefer, darker, colors. Intent: change to a dark color scheme.
  2. The "Change Website Theme" action matches.
  3. Only one matching action.
  4. User prefers "darker colors", so the "dark" theme should be selected.
  </thinkingsteps>
  <response>
  {
    "agentObjectName": "uiActionsAgent",
    "function": "changeWebsiteTheme", 
    "args": ["dark"],
    "userRequest": "$USER_REQUEST"
  }
  </response>
  </example>
  </Instructions>
</Agent>`
