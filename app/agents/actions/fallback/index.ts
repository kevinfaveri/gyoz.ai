import type { Tool } from '@anthropic-ai/sdk/resources/beta/tools/messages'

export const FALLBACK_ACTIONS_AGENT_NAME: Tool[] = [
  {
    "name": "fallbackAgent_searchCryptoWeb",
    "description": `This tool allows you to open a specified URL related to cryptocurrencies or blockchain technology in a web browser and search for information within that website. It is useful when the user wants to find specific content or explore a particular crypto-related website.
      To use this tool, provide the target URL as a string in the 'url' parameter. The tool will navigate to the given URL and load the website in the browser. If the URL is not explicitly related to cryptocurrencies or blockchain but can be inferred to be crypto-related, consider it valid and proceed with the search.
      However, if the provided URL is known to be unrelated to cryptocurrencies or blockchain, do not use this tool. Instead, use the 'fallbackAgent_fallbackChat' tool to inform the user that the requested website is not crypto-related and suggest exploring crypto-specific websites instead.
      This tool is only suited for scenarios where the user has explicitly mentioned a URL they want to search or explore within the context of cryptocurrencies or blockchain. It should not be used for general web searches without a specified website, as it does not have the capability to search the entire internet or determine the most relevant websites for a given query.
      When using this tool, ensure that the provided URL is valid, accessible, and related to cryptocurrencies or blockchain technology.`,
    "input_schema": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string",
          "description": "The target URL of the crypto-related website to open and search within. It should be a valid and accessible URL, starting with 'https://'. If the URL is not explicitly crypto-related but can be inferred to be relevant to cryptocurrencies or blockchain, consider it valid. If the URL is known to be unrelated to crypto, do not use this tool and instead use 'fallbackAgent_fallbackChat' to inform the user."
        }
      },
      "required": ["url"]
    }
  },
  {
    name: 'fallbackAgent_explainCryptoStuff',
    description:
      "This tool is designed to provide explanations and information about various cryptocurrency concepts, with a focus on the cryptocurrency ecosystem. It can help users understand the basics of cryptocurrency, its unique features, and how it differs from other blockchain platforms. The tool can also delve into more specific topics related to cryptocurrency, such as its native tokens, staking mechanisms, consensus algorithm, and the ecosystem of projects built on top of it. Additionally, it can provide insights into cryptocurrency-based NFTs (non-fungible tokens), explaining how they work, their benefits, and popular NFT projects on the cryptocurrency blockchain. When a user asks a question related to cryptocurrencies or blockchain technology this tool can be used to provide clear, concise, and informative explanations. However, it's important to note that the tool's knowledge is restricted to the cryptocurrency ecosystem and general crypto concepts. It must be focused, however, on cryptocurrency and blockchain concepts, not delving into explaining stuff about stocks that happen to be in the cryptocurrencies / blockchain space, rather focusing on teaching users about cryptocurrencies / blockchain technicals. The 'topic' parameter should provide a concise description of the user query for it to be sent to a LLM model that is a specialist in the field of cryptocurrency.",
    input_schema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description:
            'The cryptocurrency or blockchain-related topic to explain. It should be a concept or term or phrase related to the cryptocurrency ecosystem or general crypto concepts.',
        },
      },
      required: ['topic'],
    },
  },
  {
    name: 'fallbackAgent_fallbackChat',
    description:
      "This tool is used to provide a user-friendly response to the user when their request cannot be directly accomplished with the available tools or requires additional information or context. The 'userFriendlyMessage' parameter should contain a clear, concise, and easy-to-understand message that addresses the user's query or explains why their request cannot be fulfilled. If applicable, briefly mention the available actions or options, but focus on providing a direct answer to the user's query. Don't mention tool names, variable names, your possible capabilities in details, or other technical details that may confuse the user. Keep the response short and to the point, while still being informative and helpful.",
    input_schema: {
      type: 'object',
      properties: {
        // It may support building blocks in the future here to build an UI with other actions by returning a payload of information, and simple building blocks it could use.
        userFriendlyMessage: {
          type: 'string',
          description:
            "A clear, concise, and user-friendly response to the user's request or query, following the specified guidelines.",
        },
      },
      required: ['userFriendlyMessage'],
    },
  },
]
