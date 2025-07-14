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

// Tool 1: Calculator
server.tool(
  "calculator",
  "Perform basic mathematical operations",
  {
    operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("Mathematical operation to perform"),
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
    precision: z.number().min(0).max(10).optional().describe("Number of decimal places (0-10)")
  },
  async ({ operation, a, b, precision = 2 }) => {
    let result: number;
    
    // Perform the calculation
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
          return {
            content: [{
              type: "text",
              text: "❌ Error: Cannot divide by zero!"
            }]
          };
        }
        result = a / b;
        break;
    }
    
    // Format the result with specified precision
    const formattedResult = Number(result.toFixed(precision));
    
    return {
      content: [{
        type: "text",
        text: `🧮 ${a} ${operation === "add" ? "+" : operation === "subtract" ? "-" : operation === "multiply" ? "×" : "÷"} ${b} = ${formattedResult}`
      }]
    };
  }
);

// Tool 2: Text Analyzer
server.tool(
  "text_analyzer",
  "Analyze text and provide detailed statistics",
  {
    text: z.string().min(1).describe("Text to analyze"),
    includeWords: z.boolean().optional().describe("Include word frequency analysis"),
    includeSentiment: z.boolean().optional().describe("Include basic sentiment analysis")
  },
  async ({ text, includeWords = false, includeSentiment = false }) => {
    // Basic statistics
    const charCount = text.length;
    const charCountNoSpaces = text.replace(/\s/g, '').length;
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphCount = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    let analysis = `📊 **Text Analysis Results:**
    
📝 **Basic Statistics:**
- Characters: ${charCount} (${charCountNoSpaces} without spaces)
- Words: ${wordCount}
- Sentences: ${sentenceCount}
- Paragraphs: ${paragraphCount}
- Average words per sentence: ${sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : 0}`;

    // Word frequency analysis (optional)
    if (includeWords && wordCount > 0) {
      const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2); // Only words longer than 2 characters
      
      const wordFreq: Record<string, number> = {};
      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
      
      const topWords = Object.entries(wordFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
      
      analysis += `\n\n🔤 **Top 5 Words:**`;
      topWords.forEach(([word, count], index) => {
        analysis += `\n${index + 1}. "${word}" (${count} times)`;
      });
    }
    
    // Basic sentiment analysis (optional)
    if (includeSentiment) {
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy', 'joy', 'perfect'];
      const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'sad', 'angry', 'horrible', 'disgusting', 'worst', 'failure'];
      
      const lowerText = text.toLowerCase();
      const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
      const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
      
      let sentiment = "😐 Neutral";
      if (positiveCount > negativeCount) {
        sentiment = "😊 Positive";
      } else if (negativeCount > positiveCount) {
        sentiment = "😔 Negative";
      }
      
      analysis += `\n\n💭 **Sentiment Analysis:**
- Overall sentiment: ${sentiment}
- Positive indicators: ${positiveCount}
- Negative indicators: ${negativeCount}`;
    }
    
    return {
      content: [{
        type: "text",
        text: analysis
      }]
    };
  }
);

// Tool 3: Random Generator
server.tool(
  "random_generator",
  "Generate various types of random data",
  {
    type: z.enum(["number", "string", "password", "color", "uuid"]).describe("Type of random data to generate"),
    count: z.number().min(1).max(20).optional().describe("Number of items to generate (1-20)"),
    // Number-specific options
    min: z.number().optional().describe("Minimum value (for numbers)"),
    max: z.number().optional().describe("Maximum value (for numbers)"),
    // String/Password-specific options
    length: z.number().min(1).max(100).optional().describe("Length of string/password (1-100)"),
    includeSymbols: z.boolean().optional().describe("Include symbols in password")
  },
  async ({ type, count = 1, min = 0, max = 100, length = 8, includeSymbols = false }) => {
    const results: string[] = [];
    
    for (let i = 0; i < count; i++) {
      let result: string;
      
      switch (type) {
        case "number":
          const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
          result = randomNum.toString();
          break;
          
        case "string":
          const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
          result = Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
          break;
          
        case "password":
          let passChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          if (includeSymbols) {
            passChars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
          }
          result = Array.from({ length }, () => passChars.charAt(Math.floor(Math.random() * passChars.length))).join('');
          break;
          
        case "color":
          const r = Math.floor(Math.random() * 256);
          const g = Math.floor(Math.random() * 256);
          const b = Math.floor(Math.random() * 256);
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          result = `${hex} (RGB: ${r}, ${g}, ${b})`;
          break;
          
        case "uuid":
          result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
          break;
          
        default:
          result = "Unknown type";
      }
      
      results.push(result);
    }
    
    const emoji = type === "number" ? "🔢" : type === "string" ? "🔤" : type === "password" ? "🔐" : type === "color" ? "🎨" : "🆔";
    
    let output = `${emoji} **Random ${type.charAt(0).toUpperCase() + type.slice(1)}${count > 1 ? 's' : ''}:**\n\n`;
    
    if (count === 1) {
      output += results[0];
    } else {
      results.forEach((result, index) => {
        output += `${index + 1}. ${result}\n`;
      });
    }
    
    // Add generation details
    if (type === "number") {
      output += `\n*Range: ${min} to ${max}*`;
    } else if (type === "string" || type === "password") {
      output += `\n*Length: ${length} characters${type === "password" && includeSymbols ? " (with symbols)" : ""}*`;
    }
    
    return {
      content: [{
        type: "text",
        text: output
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
  console.error("- Tools: calculator, text_analyzer, random_generator");
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
