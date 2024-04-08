import type { Message } from '~/hooks/useChatState'

export const chatStream = async ({
  prompt,
  messages,
  onChunk,
}: {
  prompt: string
  messages: Message[]
  onChunk: (message: string) => void
}) => {
  const response = await fetch('/api/ai-inference/chat', {
    method: 'POST',
    body: JSON.stringify({ prompt, messages }),
  })

  if (!response.body) throw new Error('Failed to fetch LLM data')

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
  let contentBlock = ''

  while (true) {
    const stream = await reader.read()
    if (stream.done) break

    const chunks = stream?.value
      .split('\n')
      .filter((c) => Boolean(c.length))
      .map((c) => JSON.parse(c))

    for (let chunk of chunks) {
      if (chunk.type === 'content_block_delta') {
        contentBlock += chunk.delta.text
        onChunk(contentBlock as any)
      }
    }
  }

  return contentBlock
}

export const toolChat = async ({ prompt }: { prompt: string }) => {
  const response = await fetch('/api/ai-inference/tool', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  })

  if (!response.body) throw new Error('Failed to fetch LLM data')
  return await response.json()
}
