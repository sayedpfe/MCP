#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Server setup
const server = new Server(
  {
    name: 'mcp-learning-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// TODO: Add your resources here!
// Resource 1: Project Documentation Resource
// This will be a dynamic resource that provides project information

// TODO: Add your resource handler here!
// server.setRequestHandler(ListResourcesRequestSchema, async () => {
//   return {
//     resources: [
//       // Add your resources here
//     ],
//   };
// });

// TODO: Add your read resource handler here!
// server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
//   const { uri } = request.params;
//   
//   // Handle different resource URIs
//   // Return the resource content
// });

// BONUS CHALLENGE HELPERS (Uncomment when ready for bonus challenges!)

// Bonus 1: Configuration Management Resource
// TODO: Create a resource that manages application settings
// const configurationResource = {
//   uri: "config://app-settings",
//   name: "Application Configuration",
//   description: "Manage application settings and preferences",
//   mimeType: "application/json"
// };

// Bonus 2: Dynamic Content Generator
// TODO: Create a resource that generates content based on templates
// const templateResource = {
//   uri: "template://content-generator",
//   name: "Content Generator Templates",
//   description: "Dynamic content generation templates",
//   mimeType: "text/markdown"
// };

// Bonus 3: Learning Progress Tracker
// TODO: Create a resource that tracks learning progress
// const progressResource = {
//   uri: "progress://learning-tracker",
//   name: "Learning Progress",
//   description: "Track your MCP learning journey progress",
//   mimeType: "application/json"
// };

// Bonus 4: Code Examples Library
// TODO: Create a resource that provides code examples
// const examplesResource = {
//   uri: "examples://code-library",
//   name: "Code Examples",
//   description: "Collection of MCP code examples and patterns",
//   mimeType: "text/plain"
// };

// Bonus 5: Resource Analytics
// TODO: Add analytics to track resource access patterns
// let resourceAccessLog: Array<{
//   uri: string;
//   timestamp: Date;
//   accessCount: number;
// }> = [];

// Main function
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
