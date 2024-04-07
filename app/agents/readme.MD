# Prompting guide to max performance using smaller models

After huge exploration using https://docs.anthropic.com/claude/docs/tool-use, I found a couple edge cases with initial agents.

Opus is capable of giving 99% right answers even with minimal prompting and description for the tools.

Sonnet is capable of giving 99% right answers with good prompting and description for the tools; but the system prompt must not be crowded, otherwise Sonnet bricks tools: https://github.com/anthropics/anthropic-sdk-typescript/issues/381

Haiku is the dumbest model of all. For it to work effectively, the description of the tool must always give clearly, very detailed answers, to those three scenarios:
```
Scenario 1: User asks for an action that directly matches a tool and its possible params
- If the user's request clearly matches one of the available tools and provides the necessary parameters, select that tool and pass the appropriate arguments.

Scenario 2: User asks for an action that directly matches a tool but does not match its argument type (string, number, or enum) OR is logically incorrect given the context
- If the user's request matches a tool but the provided arguments do not match the expected type (string, number, or enum), use the 'fallbackAgent_fallbackChat' tool to inform the user about the correct argument type and provide an example of how to use the tool.

Scenario 3: User asks for something completely out of the tools' scope
- If the user's request does not match any of the available tools or is clearly outside the scope of your capabilities, use the 'fallbackAgent_fallbackChat' tool to politely inform the user that their request cannot be fulfilled and suggest alternative actions based on the available tools.
```

So, the formula for crafting a good prompt (each point being a paragraph) that works 80%+ with Haiku on a single trip is to do this:

1 - Tell what the tool allow you to do in a very detailed manner.

2 - How to use this tool in a very detailed manner.

> Here, for Haiku to work, you *need* to be as detailed as possible, even reinforcing the options available, even tho they are specified in the tool input_schema. Conditionals of what are invalid values for parameters of the input schema must also be enforced here (check example below, where it tells that ANY OTHER colors, explictly, make it use the fallback chat tool)

3 - Conditionals before using this tool in a very detailed manner, explaining specials conditions in which the tool can be used or not.
> Here specify which variables from the global context, and specific conditionals, must be checked as absolute rules before considering this tool a match.

4 - Add "If" conditionals for giving examples of scenario 2 and 3, in a very detailed manner. A good way to do this, is to tell what happens if scenario 2 is found (in the example below, use fallback chat); and what happens in scenario 3.

5 - Finally, to finish the prompt, reinforce scenarios that might be similar (for example, changing layout is similar to changing UI theme, same context, UI manipulation) to make the LLM consider the prompt straight invalid to match this tool in those cases.

This is a good example of a prompt to change user theme, that is very detailed, and follows the formula above:
```Javascript
{
    name: 'uiActionsAgent_changeWebsiteTheme',
    description: `This tool allows you to change the color scheme of the website between a dark theme and a light theme. The dark theme uses darker colors for the background and lighter colors for the text, creating a low-light environment suitable for nighttime or low-light conditions. The light theme uses brighter colors for the background and darker colors for the text, creating a more vibrant and energetic feel.
  
      To use this tool, provide the desired theme as the 'theme' input. The 'theme' argument must be either "dark", "light", or very similar values such as "black" for dark mode or "white" for light mode. ANY OTHER color values other than dark/light/black/white are not valid options and should not be used. The tool will apply the corresponding color palette to the website, updating the background, text, and other UI elements accordingly.
      
      Before using this tool, check the 'activeTheme' from APP_CONTEXT to determine if the requested theme is already active. If the 'activeTheme' matches the requested 'theme', there is no need to use this tool. Instead, use the 'fallbackAgent_fallbackChat' tool to inform the user that their requested theme is already active.
      
      If the user's request matches the tool but the provided 'theme' argument is not "dark", "light", or a very similar value, use the 'fallbackAgent_fallbackChat' tool to inform the user about the valid theme options and provide examples.
      If the user's request is outside the scope of this tool given all conditions, do not use this tool.
      
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
  ***Formula Step 1***

  This tool allows you to change the color scheme of the website between a dark theme and a light theme. The dark theme uses darker colors for the background and lighter colors for the text, creating a low-light environment suitable for nighttime or low-light conditions. The light theme uses brighter colors for the background and darker colors for the text, creating a more vibrant and energetic feel.

  ***Formula Step 2***
  To use this tool, provide the desired theme as the 'theme' input. The 'theme' argument must be either "dark", "light", or very similar values such as "black" for dark mode or "white" for light mode. ANY OTHER color values other than dark/light/black/white are not valid options and should not be used. The tool will apply the corresponding color palette to the website, updating the background, text, and other UI elements accordingly.
  
  ***Formula Step 3***
  Before using this tool, check the 'activeTheme' from APP_CONTEXT to determine if the requested theme is already active. If the 'activeTheme' matches the requested 'theme', there is no need to use this tool. Instead, use the 'fallbackAgent_fallbackChat' tool to inform the user that their requested theme is already active.
  
  ***Formula Step 4***
  If the user's request matches the tool but the provided 'theme' argument is not "dark", "light", or a very similar value, use the 'fallbackAgent_fallbackChat' tool to inform the user about the valid theme options and provide examples.
  If the user's request is outside the scope of this tool given all conditions, do not use this tool.
  
  ***Formula Step 5***
  Remember, this tool only affects the color scheme and does not alter the layout, content, or functionality of the website.
```