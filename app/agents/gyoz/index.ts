// TODO: Integrate claude.ai API logic with action routes, having a protected route to call claude haiku; and having a lib that calls both sonnet, haiku and opus
// TODO: Implement a script that will use claude opus to run all agents prompts with examples; and enrich the prompt with examples from opus itself in order to teach better examples to smaller models like Haiku
// TODO: Then, the script runs again against claude.ai to improve the wording of the braim dump of each agent, finally generating the final brain of each agent that gets passed down as 
// parameter to Claude Haiku API when the user prompts something
// Scripts must have an option that they dont update "Perfect Examples" that are got from Opus, and don't get more examples from Opus, to reduce costs
// TODO: Implement the secretary logic here
// TODO: Write readme.md

// This agent is responsible for being the secretary/talk agent, to solve unhandled stuff: it has access to all agents brain dumps, and uses the name, description, examples, to see if any of them match the user's request. I
// If not, it will send the user either friendly actions or a message that it can't comply to the user request. Acting as gatekeeper, it is also the agent that is responsible for preventing 
// prompt injection attacks, and other security issues that may arise from the user's input. It should, also, despite huge prompt injection prevention safeguards, trim "Agent Instruction=" from the user prompt, if specified, as it is reserved syntax.