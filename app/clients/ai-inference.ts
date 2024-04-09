import type { ToolsBetaContentBlock } from '@anthropic-ai/sdk/resources/beta/tools/messages'
import type { Message } from '~/hooks/useChatState'

interface APIMessage {
  contentBlocks: ToolsBetaContentBlock[]
  messageId: string
}
export const chatStream = async ({
  prompt,
  messages,
  onChunk,
}: {
  prompt: string
  messages: Message[]
  onChunk: (messages: APIMessage) => void
}): Promise<any> => {
  const response = await fetch('/api/ai-inference/chat', {
    method: 'POST',
    body: JSON.stringify({ prompt, messages }),
  })

  if (!response.body) throw new Error('chatStream - Failed to fetch LLM data')

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
  let apiMessage: APIMessage | null = null
  let buffer = ''

  while (true) {
    const stream = await reader.read()
    if (stream.done) break

    buffer += stream.value

    let newlineIndex
    while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
      const chunk = buffer.slice(0, newlineIndex)
      buffer = buffer.slice(newlineIndex + 1)

      if (chunk.trim().length === 0) continue

      try {
        const contentBlocksEvent: APIMessage = JSON.parse(chunk)
        onChunk(contentBlocksEvent)
        apiMessage = contentBlocksEvent
      } catch (error) {
        console.error('Error parsing JSON:', error)
      }
    }
  }

  return apiMessage
}
