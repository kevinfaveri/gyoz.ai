export type AgentActionArgs = any[]

export const AGENT_ACTION_NAMES = ['uiActionsAgent', 'fallbackActionsAgent'] as const;

export type AgentActionFunction = {
  agentObjectName?: typeof AGENT_ACTION_NAMES[number],
  function: string
  args?: AgentActionArgs
  userRequest?: string
}

export type AgentAction = {
  name: string
  description: string
  examplePrompts: string[]
  action: AgentActionFunction
}
