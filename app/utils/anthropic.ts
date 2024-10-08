import Anthropic from '@anthropic-ai/sdk'
import type { MessageParam } from '@anthropic-ai/sdk/resources'
import type { Tool } from '@anthropic-ai/sdk/resources/beta/tools/messages'

const OPUS_MODEL = 'claude-3-opus-20240229'
const SONNET_MODEL = 'claude-3-sonnet-20240229'
const HAIKU_MODEL = 'claude-3-haiku-20240307'
const MODELS = {
  opus: OPUS_MODEL,
  sonnet: SONNET_MODEL,
  haiku: HAIKU_MODEL,
}

// Those are server-side functions only
export async function callAnthropicAPITools(
  systemPrompt: string,
  prompt: string,
  tools: Tool[]
) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })
  const msg = await anthropic.beta.tools.messages.create({
    model: MODELS.haiku,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
    metadata: {
      // TODO: Change to use user wallet address
      user_id: 'system_os',
    },
    tools,
    temperature: 0,
  })
  return msg
}

export async function callAnthropicAPIStream(
  systemPrompt: string,
  prompt: string,
  messages: MessageParam[] = []
) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })
  const msg = await anthropic.messages.stream({
    model: MODELS.haiku,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [...messages, { role: 'user', content: prompt }],
    metadata: {
      // TODO: Change to use user wallet address
      user_id: 'system_os',
    },
    temperature: 0.5,
  })
  return msg.toReadableStream()
}

export async function callAnthropicAPIStreamWithTools(
  systemPrompt: string,
  prompt: string,
  messages: MessageParam[] = []
) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })
  const msg = await anthropic.messages.stream({
    model: MODELS.haiku,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      ...messages,
      { role: 'user', content: [{ type: 'text', text: prompt }] },
      {
        role: 'assistant',
        content: [
          { type: 'text', text: `Here's the JSON Tools format response: [{` },
        ],
      },
    ],
    stop_sequences: [']'],
    metadata: {
      // TODO: Change to use user wallet address
      user_id: 'system_os',
    },
    temperature: 0.5,
  })
  return msg.toReadableStream()
}
