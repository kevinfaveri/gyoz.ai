# Actions Agents

The Actions Agents system allows selecting the most appropriate action to take based on a user's request, using a set of available actions defined by multiple specialized agents.

## How it works

- There are multiple agents, each focused on a specific capability or domain (e.g. UI Actions Agent for website theme/appearance)
- Each agent defines a set of actions it can perform, with required arguments and example user requests to trigger each action  
- When a user makes a request, it is analyzed along with the current app state to determine the most relevant agent
- The best matching action from that agent is selected
- The selected action is returned in JSON format specifying the function name and arguments, which can then be executed

## Agents

### UI Actions Agent
- Handles actions related to the website's UI/theme

### Fallback Actions Agent 
- Handles cryptocurrency/NFT related requests, specifically for Solana

## Usage

The `executeActionPayload` function in `actions/index.ts` takes the parsed user request payload from the LLM and executes the specified agent action.

## Adding New Agents/Actions

1. Define the agent's actions in `actions/<agent-name>/index.ts`
2. Implement the action functions in `actions/<agent-name>/agent.ts` 
3. Add the new agent name to `AGENT_ACTION_NAMES` in `actions/types.ts`