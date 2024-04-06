export function useFallbackActionsAgent() {
  return {
    searchWeb: (userRequest: string) => {
      // TODO: Fetch the HTML from the page; have LLM interpreter parse it and answer
    },
    explainCryptoStuff: (userRequest: string) => {
      // TODO: Using a Solana database, and crypto database, explain stuff using the builder llm that constructs the component of messages
    },
    notSupported: (userRequest: string) => {
      // TODO: Just answer that the request is not supported using the message component
    },
  }
}