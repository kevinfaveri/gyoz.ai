import { z } from 'zod'

export enum MessageRole {
  assistant = 'assistant',
  system = 'system',
  user = 'user',
}
export type MessageParam = {
  role: MessageRole
  content: string
  tool_call_id?: string
}

export const AgentResponseSchema = z.object({
  message: z.string(),
  tools: z.any(),
})

export type AgentResponse = z.infer<typeof AgentResponseSchema>
