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

// Example Tool: Simple Calculator
server.tool(
  "calculate",
  "Perform basic arithmetic calculations",
  {
    operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("The operation to perform"),
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  },
  async ({ operation, a, b }) => {
    let result: number;
    
    switch (operation) {
      case "add":
        result = a + b;
        break;
      case "subtract":
        result = a - b;
        break;
      case "multiply":
        result = a * b;
        break;
      case "divide":
        if (b === 0) {
          throw new Error("Division by zero is not allowed");
        }
        result = a / b;
        break;
    }

    return {
      content: [
        {
          type: "text",
          text: `Result: ${a} ${operation} ${b} = ${result}`,
        },
      ],
    };
  }
);

// Example Tool: Text Utilities
server.tool(
  "text-utils",
  "Perform various text operations",
  {
    operation: z.enum(["uppercase", "lowercase", "reverse", "count"]).describe("The text operation to perform"),
    text: z.string().describe("The input text"),
  },
  async ({ operation, text }) => {
    let result: string;
    
    switch (operation) {
      case "uppercase":
        result = text.toUpperCase();
        break;
      case "lowercase":
        result = text.toLowerCase();
        break;
      case "reverse":
        result = text.split("").reverse().join("");
        break;
      case "count":
        result = `Character count: ${text.length}, Word count: ${text.split(/\s+/).filter(word => word.length > 0).length}`;
        break;
    }

    return {
      content: [
        {
          type: "text",
          text: `Operation: ${operation}\nInput: "${text}"\nResult: ${result}`,
        },
      ],
    };
  }
);

// Example Resource: Learning Guide
server.resource(
  "learning-guide://mcp-basics",
  "learning-guide://mcp-basics",
  async () => {
    const guide = `
# MCP Learning Guide - Basics

## What is MCP?
Model Context Protocol (MCP) is an open protocol that enables AI assistants to securely connect to external data sources and tools.

## Core Concepts

### 1. Tools
Tools are functions that can be executed by AI assistants with user approval. They enable:
- API calls to external services
- File operations
- Database queries
- Complex computations

### 2. Resources
Resources provide file-like data that can be read by clients:
- Documentation
- Configuration files
- Data sources
- API responses

### 3. Prompts
Prompts are pre-written templates that help users accomplish specific tasks:
- Code generation templates
- Analysis frameworks
- Structured responses

## Getting Started
1. Set up your MCP server with the SDK
2. Define your tools, resources, and prompts
3. Configure transport (stdio for desktop apps)
4. Test with Claude Desktop or other clients

## Best Practices
- Use TypeScript for type safety
- Implement proper error handling
- Validate inputs with Zod
- Provide clear descriptions
- Test thoroughly before deployment
`;

    return {
      contents: [
        {
          uri: "learning-guide://mcp-basics",
          text: guide,
        },
      ],
    };
  }
);

// Example Prompt: Code Review Template
server.prompt(
  "code-review",
  "Generate a structured code review",
  {
    code: z.string().describe("The code to review"),
    language: z.string().optional().describe("Programming language"),
  },
  async ({ code, language }) => {
    const template = `
Please review the following ${language || "code"}:

\`\`\`${language || ""}
${code}
\`\`\`

Provide feedback on:
1. **Code Quality**: Readability, maintainability, and best practices
2. **Performance**: Potential optimizations and efficiency concerns
3. **Security**: Potential vulnerabilities or security issues
4. **Testing**: Suggestions for test coverage and test cases
5. **Documentation**: Comments and documentation quality

Please be constructive and specific in your feedback.
`;

    return {
      description: "Code review template with structured feedback sections",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: template,
          },
        },
      ],
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
  console.error("- Tools: calculate, text-utils");
  console.error("- Resources: learning-guide://mcp-basics");
  console.error("- Prompts: code-review");
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
