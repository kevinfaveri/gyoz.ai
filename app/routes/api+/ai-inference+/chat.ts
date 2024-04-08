import Anthropic from '@anthropic-ai/sdk'
import type { MessageParam } from '@anthropic-ai/sdk/resources'
import { type ActionFunctionArgs, json } from '@remix-run/node'
import { generateActionsPrompt } from '~/agents/actions'
import { callAnthropicAPIStream } from '~/utils/anthropic'
import { getThemeSession } from '~/utils/theme.server'

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }
  const { prompt, messages } = (await request.json()) as {
    prompt: string
    messages: MessageParam[]
  }
  const activeTheme = (
    await getThemeSession(request.headers.get('Cookie'))
  ).getTheme()

  if (!prompt) {
    return json({ error: 'No prompt provided' }, { status: 400 })
  }

  // Call the Claude API with the user's prompt
  let response: ReadableStream | null = null
  try {
    response = await callAnthropicAPIStream(
      generateActionsPrompt(['The current active theme is ' + activeTheme]),
      prompt?.toString(),
      messages
    )
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return json({ error: error.message }, { status: error.status })
    } else {
      throw json({ error: 'Failed to fetch LLM data' }, { status: 500 })
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (!response) {
    return json({ error: 'Failed to fetch LLM data' }, { status: 500 })
  }

  return new Response(response, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
