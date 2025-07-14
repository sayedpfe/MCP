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

// TODO: Tool 1 - Calculator (Day 2 exercise)
// Follow the instructions in exercises/day-2-advanced-tools.md
//
// BASIC EXERCISE: Replace this comment with your calculator tool
// The exercise will guide you step-by-step to add:
//   server.tool("calculator", "Perform basic mathematical operations", { ... }, async ({ operation, a, b }) => { ... });

// TODO: Tool 2 - Text Analyzer (Day 2 exercise)
// Replace this comment with your text analyzer tool
// The exercise will guide you step-by-step to add:
//   server.tool("text_analyzer", "Analyze text and provide detailed statistics", { ... }, async ({ text, includeWords, includeSentiment }) => { ... });

// TODO: Tool 3 - Random Generator (Day 2 exercise)
// Replace this comment with your random generator tool
// The exercise will guide you step-by-step to add:
//   server.tool("random_generator", "Generate various types of random data", { ... }, async ({ type, count, options }) => { ... });

// 🎯 BONUS CHALLENGE HELPERS (Optional - for after completing basic exercises)
// Uncomment and use these sections if you're doing the bonus challenges!

// 🧮 BONUS Challenge 1: Enhanced Calculator Functions
// Add these helper functions before your calculator tool if doing the advanced math challenge:
/*
function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function power(base: number, exponent: number): number {
  return Math.pow(base, exponent);
}

function squareRoot(n: number): number {
  if (n < 0) return NaN;
  return Math.sqrt(n);
}

// Calculation history storage
const calculationHistory: Array<{operation: string, result: number, timestamp: Date}> = [];

function addToHistory(operation: string, result: number) {
  calculationHistory.push({
    operation,
    result,
    timestamp: new Date()
  });
  // Keep only last 10 calculations
  if (calculationHistory.length > 10) {
    calculationHistory.shift();
  }
}
*/

// 🧠 BONUS Challenge 2: Smart Text Analysis Functions
// Add these helper functions before your text analyzer tool if doing the smart analysis challenge:
/*
function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const syllables = countSyllables(text);
  
  // Simplified Flesch-Kincaid Grade Level
  if (sentences === 0 || words === 0) return 0;
  return 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
}

function countSyllables(text: string): number {
  const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  let totalSyllables = 0;
  
  words.forEach(word => {
    if (word.length === 0) return;
    let syllables = word.match(/[aeiouy]+/g)?.length || 1;
    if (word.endsWith('e') && syllables > 1) syllables--;
    totalSyllables += Math.max(1, syllables);
  });
  
  return totalSyllables;
}

function detectLanguage(text: string): string {
  // Simple language detection based on common words
  const commonWords = {
    english: ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'that', 'it', 'with'],
    spanish: ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se'],
    french: ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir'],
    german: ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich']
  };
  
  const words = text.toLowerCase().split(/\s+/);
  const scores: Record<string, number> = {};
  
  Object.entries(commonWords).forEach(([lang, langWords]) => {
    scores[lang] = words.filter(word => langWords.includes(word)).length;
  });
  
  const detectedLang = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];
  return detectedLang.charAt(0).toUpperCase() + detectedLang.slice(1);
}
*/

// 🎲 BONUS Challenge 3: Advanced Random Generators
// Add these generators before your random tool if doing the advanced generation challenge:
/*
const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Cedar Ln', 'Elm Dr', 'Maple Way', 'Park Blvd', 'First St', 'Second Ave', 'Third Rd'];
const cities = ['Springfield', 'Franklin', 'Georgetown', 'Madison', 'Washington', 'Lincoln', 'Jefferson', 'Roosevelt', 'Wilson', 'Jackson'];

function generateRandomName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

function generateRandomAddress(): string {
  const number = Math.floor(Math.random() * 9999) + 1;
  const street = streets[Math.floor(Math.random() * streets.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const zip = Math.floor(Math.random() * 90000) + 10000;
  return `${number} ${street}, ${city} ${zip}`;
}

function generateLoremIpsum(sentences: number): string {
  const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];
  let result = '';
  
  for (let i = 0; i < sentences; i++) {
    const sentenceLength = Math.floor(Math.random() * 10) + 5;
    const sentence = Array.from({ length: sentenceLength }, () => 
      words[Math.floor(Math.random() * words.length)]
    ).join(' ');
    result += sentence.charAt(0).toUpperCase() + sentence.slice(1) + '. ';
  }
  
  return result.trim();
}
*/

// 🔗 BONUS Challenge 4: Workflow Orchestration
// Add this workflow system if doing the integration challenge:
/*
interface WorkflowStep {
  tool: string;
  parameters: Record<string, any>;
  description: string;
}

async function executeWorkflow(steps: WorkflowStep[]): Promise<string> {
  let results: string[] = [];
  let workflowData: Record<string, any> = {};
  
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    results.push(`Step ${i + 1}: ${step.description}`);
    
    // Here you would actually call the other tools
    // This is a simplified version for demonstration
    switch (step.tool) {
      case 'calculator':
        results.push(`Calculator result: [simulated calculation]`);
        break;
      case 'text_analyzer':
        results.push(`Analysis result: [simulated analysis]`);
        break;
      case 'random_generator':
        results.push(`Generated: [simulated generation]`);
        break;
    }
  }
  
  return results.join('\n');
}
*/

// ⬇️ BONUS HELPERS: Code snippets for advanced features ⬇️

// 🧮 Enhanced Calculator Features:
// Add to calculator schema: advancedOp: z.enum(["power", "sqrt", "factorial"]).optional()
// Add to calculator handler: if (advancedOp) { /* handle advanced operations */ }

// 🧠 Smart Text Analysis Features:
// Add to text_analyzer schema: includeReadability: z.boolean().optional(), detectLanguage: z.boolean().optional()
// Add to text_analyzer handler: if (includeReadability) { /* add readability score */ }

// 🎲 Advanced Random Features:
// Add to random_generator schema: subtype: z.enum(["name", "address", "lorem"]).optional()
// Add to random_generator handler: if (type === "custom" && subtype) { /* handle advanced types */ }

// 🔗 Workflow Integration:
// Create new tool: "workflow_executor" that takes a workflow definition and executes multiple tools in sequence

// Main function to start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log server start (to stderr so it doesn't interfere with stdio transport)
  console.error(`${SERVER_INFO.name} v${SERVER_INFO.version} running on stdio`);
  console.error("Available capabilities:");
  console.error("- Tools: (none yet - add your tools!)");
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
