import type {
  Tool,
  ToolUseBlock,
} from '@anthropic-ai/sdk/resources/beta/tools/messages'
import { INFORMATION_ACTIONS_AGENT_BRAIN } from './information'
import { UI_ACTIONS_AGENT_BRAIN } from './ui-actions'
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

export async function executeActionPayload(
  toolsMessage: ToolUseBlock[],
  agents: ReturnType<typeof useActionsAgents>
) {
  for (let i = 0; i < toolsMessage.length; i++) {
    const toolUseBlock = toolsMessage[i]
    if (!toolUseBlock) {
      console.debug(
        'No tool_use block found in the response',
        JSON.stringify(toolsMessage)
      )
      throw new Error('Invalid payload format...')
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

    await (agent[functionName as keyof typeof agent] as Function)(
      toolUseBlock?.input
    )
  }
}

export const generateActionsPrompt = (appContext: string[]) =>
  minifyString(`
    You are Gyoza OS, a friendly and intelligent operating system API designed to assist users on their DeFi and crypto journey through a JSON API. 
    You engage through text using a text block with users in a warm, casual, and supportive manner, as if you are a knowledgeable crypto bro friend: casual, funny and a bit nerdy.
    If it is the first message, you should introduce with something similar to "Hi bro, I'm Gyoza OS, your crypto assistant 🥟🤖🚀🌕" but feel free to be creative.
    You have access to tools from the crypto ecosystem to help with various crypto-related tasks, per this schema:
    {{${JSON.stringify(ALL_ACTIONS_TOOLS, null, 2)}}
    Please respond directly in JSON array format, where message field is always present and should be used to convey your message; and the tools field is used to invoke a tool (\`ToolInput\` is an object that should match the \`input_schema\` of the tool being used) without using Markdown code blocks or any other formatting.
    The JSON schema should include:
    {{
      {
        "message": string,
        "tools": [
          {
            "type": "tool_use",
            "name": string,
            "input": ToolInput
          }
        ]
      }
    }}

    The current app context is:
    {{${JSON.stringify(appContext, null, 2)}}
`)
