# Prompting guide to max performance using smaller models

After huge exploration using https://docs.anthropic.com/claude/docs/tool-use, I found a couple edge cases with initial agents.

Opus is capable of giving 99% right answers even with minimal prompting and description for the tools.

Sonnet is capable of giving 99% right answers with good prompting and description for the tools; but the system prompt must not be crowded, otherwise Sonnet bricks tools: https://github.com/anthropics/anthropic-sdk-typescript/issues/381

Haiku is the dumbest model of all. For it to work effectively, the description of the tool must always give clearly, very detailed answers, to those three scenarios:
```
Scenario 1: User asks for an action that directly matches a tool and its possible params
- If the user's request clearly matches one of the available tools and provides the necessary parameters, select that tool and pass the appropriate arguments.

Scenario 2: User asks for an action that directly matches a tool but does not match its argument type (string, number, or enum) OR is logically incorrect given the context
- If the user's request matches a tool but the provided arguments do not match the expected type (string, number, or enum), return a user friendly error message that explains the expected input and provides examples. If the user's request is logically incorrect given the context, return a user friendly error message that explains why the request cannot be fulfilled and suggests alternative actions.

Scenario 3: User asks for something completely out of the tools' scope
- If the user's request does not match any of the available tools or is clearly outside the scope of your capabilities, return a user friendly error message that explains why the request cannot be fulfilled and suggests alternative actions.
```

So, the formula for crafting a good prompt (each point being a paragraph) that works 80%+ with Haiku on a single trip is to do this:

1 - Tell what the tool allow you to do in a very detailed manner.

2 - Add the gate conditionals in a very detailed manner, with every hypothetical scenario in which the tool is not matched, want what to do.

3 - Explain in detail how to use the tool and in which scenarios it succeeds.

4 - Finally, to finish the prompt, reinforce scenarios that might be similar (for example, changing layout is similar to changing UI theme, same context, UI manipulation) to make the LLM consider the prompt straight invalid to match this tool in those cases.

This is a good example of a prompt to change user theme, that is very detailed, and follows the formula above:
```Javascript
{
    name: 'uiActionsAgent_changeWebsiteTheme',
    description: `This tool allows you to change the color scheme of the website between a dark theme and a light theme.
    The dark theme uses darker colors for the background and lighter colors for the text, creating a low-light environment suitable for nighttime or low-light conditions. 
    The light theme uses brighter colors for the background and darker colors for the text, creating a more vibrant and energetic feel.
    
    Return text only message "The theme is already selected" if user's query theme is the same as the current active theme.
    Return text only if user's query asks about the current active theme.
    Return text only if user's query theme is any other color value other than "dark" or "light" or "reverse" or "inverse" or "invert" or very similar values like "black" for dark mode or "white" for light mode.

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
  }
```

Prompt example, linked to the formula:
```
1
This tool allows you to change the color scheme of the website between a dark theme and a light theme.
The dark theme uses darker colors for the background and lighter colors for the text, creating a low-light environment suitable for nighttime or low-light conditions. 
The light theme uses brighter colors for the background and darker colors for the text, creating a more vibrant and energetic feel.

2
Return text only message "The theme is already selected" if user's query theme is the same as the current active theme.
Return text only if user's query asks about the current active theme.
Return text only if user's query theme is any other color value other than "dark" or "light" or "reverse" or "inverse" or "invert" or very similar values like "black" for dark mode or "white" for light mode.

3
To use this tool, provide the desired theme as the 'theme' input as either "${Theme.DARK}" for a dark theme or "${Theme.LIGHT}" for a light theme. The tool will then change the color scheme of the website accordingly.
Return the tool if user's query theme is either "dark", "light" OR very similar values such as "black" for dark mode or "white" for light mode.
Return the tool if user's query asks to revert theme OR invert OR "inverse" theme in which you should pick the exact opposite of the current active theme as the argument, e.g., if the current theme is dark, change it to light, and vice versa.

4
Remember, this tool only affects the color scheme and does not alter the layout, content, or functionality of the website.
```