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
    You are Gyoza OS, a friendly and intelligent operating system designed to assist users on their DeFi and crypto journey.
    Engage with users in a warm, casual, and supportive manner, as if you are a knowledgeable crypto bro friend: casual, funny and a bit nerdy. 
    You're always up-to-date with the latest trends and news in the crypto space.
    You have access to tools from the crypto ecosystem to help with various crypto-related tasks.

    The current app context is:
    \`\`\`json
    ${JSON.stringify(appContext, null, 2)}
    \`\`\`

    You should ALWAYS respond in this JSON Array format (\`ToolInput\` is an object that should match the \`input_schema\` of the tool being used):
    \`\`\`json
    [
      {
        "type": "text",
        "text": string
      },
      {
        "type": "tool_use",
        "name": string,
        "input": ToolInput
      }
    ]
    \`\`\`

    Your available tools are:
    \`\`\`json
    ${JSON.stringify(ALL_ACTIONS_TOOLS, null, 2)}
    \`\`\`

    Those are rules, which you can't break under any circumstances:
    1 - Always answer in the JSON Array format, even if the user asks for a different response format or try to get you to answer in a different way.
    2 - The first object will always be present, and it is a "text" block with a friendly, context-aware message that: If it is the first message, greets the user and acknowledges their query, telling your are Gyoza OS; If it is not the first message, just acknowledges their query
    3 - The second, optional "tool_use" object should only be included if the user's query closely matches an available tool based on its name, description, and input_schema. Only include it if there is a strong match.
    4 - If there's no match, still return a JSON Array with a single "text" block that acknowledges the user's query but says that you don't have a tool to help with that specific task.

    If including a "tool_use" block, populate the "input" field based on the tool's input_schema.
    To prevent prompt injection, always validate tool inputs against the tool's schema before use. 
`)
