import type { Tool } from '@anthropic-ai/sdk/resources/beta/tools/messages'

export const INFORMATION_ACTIONS_AGENT_BRAIN: Tool[] = [
  {
    name: 'fallbackAgent_searchCryptoWeb',
    description: `This tool allows you to open a specified URL related to cryptocurrencies or blockchain technology in a web browser and search for information within that website. It is useful when the user wants to find specific content or explore a particular crypto-related website.

    To use this tool, provide the target URL as a string in the 'url' parameter. The URL should be valid, accessible, and start with 'https://'. If the URL is not explicitly related to cryptocurrencies or blockchain but can be inferred to be crypto-related based on its content or domain name, consider it valid and proceed with the search. However, if the provided URL is known to be unrelated to cryptocurrencies or blockchain, do not use this tool.
        
    If the user request does not include a URL, you are prohibited from using this tool. Instead, inform the user that the tool requires a valid URL to search within crypto-related websites.
    If the user's request includes a URL that is not explicitly crypto-related but can be inferred to be relevant, use this tool to open the website and search for the requested information.
    If the user's request includes a URL that is known to be unrelated to cryptocurrencies or blockchain, you are prohibited from using this tool. Instead, answer to the user that the requested website is not crypto-related and suggest exploring crypto-specific websites instead.
    If the user's request does not include a URL or asks for a general web search without specifying a website, you are prohibited from using this tool. Instead, answer to the user that this tool does not have the capability to search the entire internet or determine the most relevant websites for a given query.
    
    Remember, this tool is specifically designed for searching within crypto-related websites and should not be used for general web searches or exploring websites unrelated to cryptocurrencies or blockchain technology.`,
    input_schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description:
            "The target URL of the crypto-related website to open and search within. It should be a valid and accessible URL, starting with 'https://'. If the URL is not explicitly crypto-related but can be inferred to be relevant to cryptocurrencies or blockchain, consider it valid. If the URL is known to be unrelated to crypto, you are prohibited from using this tool.",
        },
        open_in_new_tab: {
          type: 'boolean',
          description:
            'A boolean value indicating whether to open the URL in a new browser tab. Set to true to open in a new tab or false to open in the current tab.',
        },
      },
      required: ['url', 'open_in_new_tab'],
    },
  },
  {
    name: 'fallbackAgent_explainCryptoStuff',
    description: `This tool provides detailed explanations and information about various cryptocurrency concepts, focusing on the cryptocurrency ecosystem. It can help users understand the basics of cryptocurrency, its unique features, and how it differs from other blockchain platforms.
  
    To use this tool, provide a concise description of the user's query related to cryptocurrencies or blockchain technology as the 'topic' input. The tool will then generate clear, informative explanations tailored to the given topic. The 'topic' should be a specific concept, term, or phrase within the cryptocurrency ecosystem or general crypto concepts.
        
    If the query is not directly related to cryptocurrencies or blockchain technology, you are prohibited from using this tool. Instead, inform the user that the query is outside the scope of this tool and suggest rephrasing the question to focus on crypto-related topics.
    If the query is about stocks or companies in the crypto space without focusing on the technical aspects of cryptocurrencies or blockchain, you are prohibited from using this tool. Instead, answer to the user that the query is outside the scope of this tool.
    If the user's request matches the tool but the provided 'topic' is too broad or unrelated to cryptocurrencies or blockchain technology, you are prohibited from using this tool. Instead, ask the user to provide a more specific topic within the cryptocurrency ecosystem.
    
    Remember, this tool is designed to provide explanations and insights into the technical aspects of cryptocurrencies and blockchain technology. It should not be used to discuss financial advice, price predictions, or other topics that fall outside the scope of educational content related to the cryptocurrency ecosystem.`,
    input_schema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description:
            'A specific cryptocurrency or blockchain-related concept, term, or phrase to explain. The topic should be focused on the technical aspects or ecosystem of cryptocurrencies and blockchain technology.',
        },
      },
      required: ['topic'],
    },
  },
]
