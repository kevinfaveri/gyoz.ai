import Anthropic from '@anthropic-ai/sdk'
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

  const msg = await anthropic.beta.tools.messages.create(
    {
      model: MODELS.sonnet,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
      metadata: {
        // TODO: Change to use user wallet address
        user_id: 'system_os',
      },
      tools,
      temperature: 0.1,
    },
  )

  // TODO: Sometimes, the model may allucinate and put the tool inside a text. We should extract it.

  return msg
}
