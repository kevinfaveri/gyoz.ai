import OpenAI from 'openai'
import type { MessageParam } from 'types'

export async function callOpenAIAPIStreamWithTools(
  systemPrompt: string,
  prompt: string,
  messages: MessageParam[] = []
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const msg = await openai.chat.completions.create({
    stream: true,
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
      { role: 'user', content: prompt },
    ],
    max_tokens: 1024,
    temperature: 0.5,
  })
  return msg.toReadableStream()
}
