export enum MessageRole {
  assistant = 'assistant',
  system = 'system',
  user = 'user'
}
export type MessageParam = {
  role: MessageRole
  content: string
  tool_call_id?: string
}

