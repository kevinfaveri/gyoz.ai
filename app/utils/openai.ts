import OpenAI from 'openai'
import type { MessageParam } from '~/types'
import { minifyString } from './string'

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
      { role: 'system', content: minifyString(systemPrompt) },
      ...messages.map((message) => ({
        role: message.role,
        content: minifyString(message.content),
      })),
      { role: 'user', content: minifyString(prompt) },
    ],
    logit_bias: {
      198: -100,
      271: -100,
      1432: -100,
      1734: -100,
    },
    max_tokens: 1024,
    temperature: 0,
    response_format: {
      type: 'json_object',
    },
  }).catch((error) => {
    console.error('Error calling OpenAI API:', error)
    throw error
  })
  return msg.toReadableStream()
}
