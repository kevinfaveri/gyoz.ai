import { Theme } from '~/utils/theme-provider'

type UIActionArgs = any[]

type UIActionfunction = {
  function: string
  args?: UIActionArgs
}

type UIAction = {
  name: string
  description: string
  examplePrompts: string[]
  action: UIActionfunction
}

export const AGENT_INSTRUCTION = `UIActions are functions that can be called to change the UI of the website. 
The UI Action Agent must take into consideration all objects from the brain dump array as if it is the source of truth for it to take a decision and always select a single UIAction to answer the user.
The Agent must take into consideration the name, description, and examplePrompts of the UIAction to determine the correct action to take.
For UI Actions, the Agent must have in mind that the format is as follows: function, which is the name or function of the object to be called; and args, 
in which it is an array of arguments, and inside each one are all the options the agent may choose from it.
In addition to that, the Agent must return the UI Action to be take in the format of a parsable JSON string like this: "{ "function": "FUNCTION_NAME", "args": ["ARGS_SEPARATED_BY_COMMA", "ARGS_SEPARATED_BY_COMMA", ...]}". 
Important that the agent should obey that if the provided action has "args" which is an empty array "[]" it means that the function does not require any arguments.
Straightforward prompt example (in which the user is very clear about the ask): if the Agent checks that the user action requests "hey change my theme to dark", it should call the function "changeWebsiteTheme" 
with one of the two available arguments (in this example, either "dark" or "light", which are available in the array of the "Change Website Theme" UIAction).
In said example, the return format should be: { "function": "changeWebsiteTheme", "args": ["dark"] }.
The Agent should be intelligent enough to understand the user's request and select the correct action to take even if the ask is ambiguous, but still right, example:
"hey change the theme" should be enough for the agent to understand that the user wants to change the theme to the reverse of the current one. 
The agent can know the current theme by using the "Agent Instruction=instruction text" text available in the brain dump. 
If the instruction says "Agent Instruction=The current theme is dark", the agent should understand that the user wants to change the theme to "light".
And then automatically return the correct action to take in the specified format, in this case, { "function": "changeWebsiteTheme", "args": ["light"] }.
`

// For building the brain, check ui-actions-hooks.ts
export const UI_ACTIONS_AGENT_BRAIN: UIAction[] = [
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

// This function is responsible for executing the UIAction based off the provided return of the UIActions Agent
export function executeUIAction(obj: any, action: UIActionfunction, args?: any[]) {
  return obj[action.function as any](...(args ? args[0] : []))
}

