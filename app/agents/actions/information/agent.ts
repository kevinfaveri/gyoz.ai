export function useInformationActionAgent() {
  return {
    searchCryptoWeb: ({ url }: { url: string }) => {
      // TODO: Fetch the HTML from the page; have LLM interpreter parse it and answer
    },
    explainCryptoStuff: ({ topic }: { topic: string }) => {
      // TODO: Using a Solana database, and crypto database, explain stuff using the builder llm that constructs the component of messages
    },
  }
}