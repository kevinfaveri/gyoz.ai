import Anthropic from '@anthropic-ai/sdk'
import type { ToolsBetaContentBlock } from '@anthropic-ai/sdk/resources/beta/tools/messages'
import { type ActionFunctionArgs, json } from '@remix-run/node'
import type { MessageParam } from 'types'
import { generateActionsPrompt } from '~/agents/actions'
import { callOpenAIAPIStreamWithTools } from '~/utils/openai'
import { completeAndParseJSON } from '~/utils/string'
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
    response = await callOpenAIAPIStreamWithTools(
      generateActionsPrompt(['The the current theme is set to ' + activeTheme]),
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

  let contentBlockString = ''
  let contentBlocksObject: ToolsBetaContentBlock[] = []
  let messageId = ''
  const transformStream = new ReadableStream({
    async start(controller) {
      if (!response) {
        controller.error('Failed to fetch LLM data')
        return
      }
      const reader = response.getReader()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }
          const dataAsString = new TextDecoder().decode(value)
          const chunks = dataAsString
            .split('\n')
            .filter((c) => Boolean(c.length))
            .map((c) => JSON.parse(c))
          console.log(`chunks[i]?.choices`, chunks?.[0]?.choices)
          for (let i = 0; i < chunks.length; i++) {
            if (chunks[i]?.choices[0]?.delta?.content) {
              console.log(
                `chunks[i].choices[0].delta.content`,
                chunks[i].choices[0].delta.content
              )
              contentBlockString += chunks[i].choices[0].delta.content
              contentBlockString = contentBlockString.replaceAll('```', '')
              if (contentBlockString.startsWith('json')) {
                contentBlockString = contentBlockString.slice(4)
              }

              contentBlockString = contentBlockString.replaceAll('```', '')
              console.log(`contentBlockString`, contentBlockString)
              try {
                contentBlocksObject = completeAndParseJSON(contentBlockString)
                console.log(`contentBlocksObject>>`, contentBlocksObject)
              } catch (e) {
                console.error(e)
                // retry again return here
              }
            }
          }
          controller.enqueue(
            `${JSON.stringify({
              contentBlocks: contentBlocksObject,
              messageId,
            })}\n`
          )
        }
        controller.close()
      } catch (error) {
        console.error('Error transforming stream:', error)
        controller.error(error)
      }
    },
  })

  return new Response(transformStream, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
