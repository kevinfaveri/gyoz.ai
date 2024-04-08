import Anthropic from '@anthropic-ai/sdk'
import type { ToolsBetaMessage } from '@anthropic-ai/sdk/resources/beta/tools/messages'
import { type ActionFunctionArgs, json } from '@remix-run/node'
import { ALL_ACTIONS_TOOLS, generateActionsPrompt } from '~/agents/actions'
import { callAnthropicAPITools } from '~/utils/anthropic'
import { getThemeSession } from '~/utils/theme.server'

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }
  const prompt = (await request.json()).prompt as string
  const activeTheme = (
    await getThemeSession(request.headers.get('Cookie'))
  ).getTheme()

  if (!prompt) {
    return json({ error: 'No prompt provided' }, { status: 400 })
  }

  // Call the Claude API with the user's prompt
  let response: ToolsBetaMessage | null = null
  try {
    response = await callAnthropicAPITools(
      generateActionsPrompt(['The current active theme is ' + activeTheme]),
      prompt?.toString(),
      ALL_ACTIONS_TOOLS
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

  return json({ output: response })
}
