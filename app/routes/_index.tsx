import Anthropic from '@anthropic-ai/sdk'
import type { ToolsBetaMessage } from '@anthropic-ai/sdk/resources/beta/tools/messages'
import {
  type ActionFunctionArgs,
  json,
  type MetaFunction,
} from '@remix-run/node'
import { ALL_ACTIONS_TOOLS, generateActionsPrompt } from '~/agents/actions'
import ActionBar from '~/components/features/actionbar'
import Topbar from '~/components/features/topbar'
import { callAnthropicAPITools } from '~/utils/anthropic'
import { getThemeSession } from '~/utils/theme.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'Gyoza OS' },
    {
      name: 'description',
      content: 'Chat around, find out. Defi made simple.',
    },
  ]
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const prompt = formData.get('prompt')?.toString()
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
  console.debug(response)
  return json({ output: response.content })
}

export default function Index() {
  return (
    <div>
      <Topbar />
      <ActionBar />
    </div>
  )
}
