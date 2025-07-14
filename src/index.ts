#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Server configuration
const SERVER_INFO = {
  name: "mcp-learning-server",
  version: "1.0.0",
} as const;

// Create server instance
const server = new McpServer({
  name: SERVER_INFO.name,
  version: SERVER_INFO.version,
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
  },
});

// TODO: Add your first tool here (Day 1 exercise)
// Follow the instructions in exercises/day-1-basics.md
// Your first tool: Greeting
server.tool(
  "greeting",
  "Create personalized greetings",
  {
    name: z.string().describe("Name of the person to greet"),
    style: z.enum(["formal", "casual", "enthusiastic"]).optional().describe("Style of greeting"),
  },
  async ({ name, style = "casual" }) => {
    let greeting;
    
    switch (style) {
      case "formal":
        greeting = `Good day, ${name}. I hope you're having a pleasant experience.`;
        break;
      case "enthusiastic":
        greeting = `HEY THERE ${name.toUpperCase()}! 🎉 You're AWESOME!`;
        break;
      default: // casual
        greeting = `Hey ${name}! Nice to meet you! 👋`;
    }
    
    return {
      content: [{
        type: "text",
        text: greeting
      }]
    };
  }
);
// Main function to start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log server start (to stderr so it doesn't interfere with stdio transport)
  console.error(`${SERVER_INFO.name} v${SERVER_INFO.version} running on stdio`);
  console.error("Available capabilities:");
  console.error("- Tools: greeting");
  console.error("- Resources: (none yet)");
  console.error("- Prompts: (none yet)");
}

// Error handling
process.on('SIGINT', async () => {
  console.error('\nShutting down server...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Start the server
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
