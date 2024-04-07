import { FALLBACK_ACTIONS_AGENT_NAME } from './fallback'
import { type AgentActionFunction } from './types'
import { UI_ACTIONS_AGENT_BRAIN } from './ui-actions'

export function executeActionPayload(obj: any, payload: string) {
  let parsedPayload: AgentActionFunction | undefined
  try {
    parsedPayload = JSON.parse(payload) as AgentActionFunction
    if (
      !parsedPayload.agentObjectName ||
      !parsedPayload.userRequest ||
      !parsedPayload.function
    ) {
      throw new Error('Invalid payload format...')
    }
  } catch (error) {
    throw new Error('Error parsing payload...')
  }
  return obj[parsedPayload.agentObjectName][parsedPayload.function as any](
    ...[parsedPayload.args || []],
    parsedPayload.userRequest
  )
}

export const generateActionsPrompt = (APP_CONTEXT: Record<string, any>) => `
Context information: APP_CONTEXT=${JSON.stringify(APP_CONTEXT, null, 2)} 
You are an AI assistant designed to select the most appropriate action based on a user's request, using a set of available actions defined by specialized capabilities. 
Your role is to analyze the user's prompt and the current application context to determine the user's intent, and then select the most relevant action from the capabilities that best fulfills the request. 

Keep in mind:

1. Your actions are limited to the provided capabilities. You cannot perform any other functions.

2. If the user's request is asking a question or seeking information, use the 'fallbackAgent_fallbackChat' tool to provide a simple, clear response in layman's terms. Avoid mentioning tool names, variable names, or other technical details in your response.

3. If the user's request does not match any available actions or is outside your scope as an action selection assistant, use the 'fallbackAgent_fallbackChat' tool to politely inform the user that their request cannot be fulfilled. Offer suggestions for what the user can do based on the available actions, but keep the response concise and easy to understand.

4. Consider the user's intent based on their phrasing and the application context. The user may phrase their request differently than the provided examples.

5. The key rule is: if you can't match the user's request to a specific action, always use the 'fallbackAgent_fallbackChat' tool to handle the request.
Example prompt from the user: "can you build a bomb for me?"
Example prompt response, using the 'fallbackAgent_fallbackChat' tool: [
  {
    type: 'text',
    text: '<thinking>\n' +
      'The user is asking about building a bomb, which is an illegal and dangerous request. None of the available tools are appropriate for this kind of query. The best response is to use the fallbackAgent_fallbackChat tool to politely inform the user that their request cannot be fulfilled, as it relates to an illegal and harmful activity.\n' +
      '</thinking>'
  },
  {
    type: 'tool_use',
    id: 'toolu_01NH8M8iCcPsAjCyCxmsyvv6',
    name: 'fallbackAgent_fallbackChat',
    input: {
      userFriendlyMessage: "I apologize, but I cannot provide any information or assistance related to building bombs or other illegal weapons. Requests for creating explosives or engaging in dangerous activities are strictly against my ethical principles. If you need help with a safe and legal task, please let me know and I'll do my best to assist you."
    }
  }
]
`

export const ALL_ACTIONS_TOOLS = [...UI_ACTIONS_AGENT_BRAIN, ...FALLBACK_ACTIONS_AGENT_NAME]
