import type {
  Tool,
  ToolsBetaContentBlock,
  ToolUseBlock,
} from '@anthropic-ai/sdk/resources/beta/tools/messages'
import { INFORMATION_ACTIONS_AGENT_BRAIN } from './information'
import { UI_ACTIONS_AGENT_BRAIN } from './ui-actions'
import type { TextBlock } from '@anthropic-ai/sdk/resources'
import { useUIActionsAgent } from './ui-actions/agent'
import { minifyString } from '~/utils/string'
import { useInformationActionAgent } from './information/agent'

export const ALL_ACTIONS_TOOLS: Tool[] = [
  ...UI_ACTIONS_AGENT_BRAIN,
  ...INFORMATION_ACTIONS_AGENT_BRAIN,
].map((tool) => ({
  name: tool.name,
  description: `${minifyString(tool.description || '')}`,
  input_schema: {
    ...tool.input_schema,
    properties: {
      ...(tool.input_schema.properties as any),
      ...(Object.values(tool.input_schema.properties || {}).map(
        (property: any) => ({
          ...property,
          description: minifyString(property.description),
        })
      ) as any),
    },
  },
}))

export function useActionsAgents() {
  const informationAgent = useInformationActionAgent()
  const uiActionsAgent = useUIActionsAgent()
  return {
    uiActionsAgent,
    informationAgent,
  }
}

export function executeActionPayload(
  toolsMessage: ToolsBetaContentBlock[],
  agents: ReturnType<typeof useActionsAgents>
) {
  console.log(toolsMessage)
  const textBlock: TextBlock | undefined = toolsMessage.find(
    (block) => block.type === 'text'
  ) as TextBlock | undefined
  const toolUseBlock: ToolUseBlock | undefined = toolsMessage.find(
    (block) => block.type === 'tool_use'
  ) as ToolUseBlock | undefined
  if (!textBlock && !toolUseBlock) {
    console.debug(
      'No text and tool_use block found in the response',
      JSON.stringify(toolsMessage)
    )
    throw new Error('Invalid payload format...')
  }

  const isTextOnly = !toolUseBlock && textBlock
  if (isTextOnly) {
    // Call the chat agent that talks to the user
  }

  const [agentName, functionName] = toolUseBlock?.name.split('_') || []

  if (!agentName || !functionName || toolUseBlock?.input === undefined) {
    console.debug(
      'Invalid tool_use block found in the response',
      JSON.stringify(toolUseBlock)
    )
    throw new Error('Invalid payload format...')
  }

  const agent = agents[agentName as keyof typeof agents]

  return (agent[functionName as keyof typeof agent] as Function)(
    toolUseBlock?.input
  )
}

export const generateActionsPrompt = (appContext: string[]) =>
  minifyString(`Context: ${appContext.join(', ')}

  Your actions are limited to the provided capabilities. You cannot perform any other functions.
  If the user's request does not match any available actions or is outside your scope as an action selection assistant, you should return a helpful message on a friendly tone and not too formal, being more casual while still being polite.
  
  You can't say you are an AI or an AI assistant. 
  You should always refer to yourself as Gyoza OS, an assistant designed to help users interact with various tools and actions within the Gyoza OS environment.
  Never used a prefix "Gyoza OS:" in your messages since the user is already aware they are interacting with Gyoza OS.

  Never talk about tools or actions, just perform them. If needed, talk about capabilities you have rather than naming specific parameters or tools.
`)
