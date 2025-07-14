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

// Resource data storage (in real apps, this would be a database)
interface ProjectInfo {
  name: string;
  version: string;
  description: string;
  features: string[];
  lastUpdated: Date;
}

const projectData: ProjectInfo = {
  name: "MCP Learning Project",
  version: "1.0.0", 
  description: "A comprehensive learning project for Model Context Protocol development",
  features: [
    "Step-by-step learning exercises",
    "Day-by-day progression",
    "Hands-on tool building",
    "Resource management",
    "Claude Desktop integration"
  ],
  lastUpdated: new Date()
};

interface UserConfig {
  theme: 'light' | 'dark';
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  preferences: {
    showHints: boolean;
    enableBonusChallenges: boolean;
    autoSave: boolean;
  };
}

let userConfig: UserConfig = {
  theme: 'light',
  language: 'en',
  difficulty: 'beginner',
  preferences: {
    showHints: true,
    enableBonusChallenges: false,
    autoSave: true
  }
};

interface LearningProgress {
  currentDay: number;
  completedDays: number[];
  totalDays: number;
  skillsLearned: string[];
  challengesCompleted: string[];
  timeSpent: number; // in minutes
}

let learningProgress: LearningProgress = {
  currentDay: 3,
  completedDays: [1, 2],
  totalDays: 7,
  skillsLearned: [
    "MCP server setup",
    "Basic tool creation", 
    "Input validation with Zod",
    "Error handling",
    "Multi-tool development"
  ],
  challengesCompleted: [
    "greeting-tool-basic",
    "greeting-tool-time-aware",
    "calculator-with-validation",
    "text-analyzer-advanced"
  ],
  timeSpent: 180
};

// Code examples library
const codeExamples = {
  "basic-tool": `server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === "example-tool") {
    return {
      content: [
        {
          type: "text",
          text: "Tool executed successfully!"
        }
      ]
    };
  }
  
  throw new McpError(ErrorCode.MethodNotFound, \`Tool \${name} not found\`);
});`,
  "resource-handler": `server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  if (uri === "example://resource") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: "Resource content here"
        }
      ]
    };
  }
  
  throw new McpError(ErrorCode.InvalidRequest, \`Resource \${uri} not found\`);
});`,
  "validation-schema": `const InputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().int().min(0, "Age must be positive"),
  email: z.string().email("Invalid email format").optional()
});

// Usage in tool
const validatedInput = InputSchema.parse(args);`
};

// Resource access analytics
let resourceAccessLog: Array<{
  uri: string;
  timestamp: Date;
  accessCount: number;
}> = [];

function logResourceAccess(uri: string) {
  const existing = resourceAccessLog.find(log => log.uri === uri);
  if (existing) {
    existing.accessCount++;
    existing.timestamp = new Date();
  } else {
    resourceAccessLog.push({
      uri,
      timestamp: new Date(),
      accessCount: 1
    });
  }
}

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "project://info",
        name: "Project Information",
        description: "General information about the MCP learning project",
        mimeType: "application/json"
      },
      {
        uri: "config://user-settings",
        name: "User Configuration",
        description: "User preferences and settings for the learning environment",
        mimeType: "application/json"
      },
      {
        uri: "progress://learning-status",
        name: "Learning Progress",
        description: "Track your progress through the MCP learning journey",
        mimeType: "application/json"
      },
      {
        uri: "examples://code-library",
        name: "Code Examples",
        description: "Collection of MCP code examples and patterns",
        mimeType: "application/json"
      },
      {
        uri: "docs://getting-started",
        name: "Getting Started Guide",
        description: "Comprehensive guide to get started with MCP development",
        mimeType: "text/markdown"
      },
      {
        uri: "analytics://resource-usage",
        name: "Resource Usage Analytics",
        description: "Analytics data for resource access patterns",
        mimeType: "application/json"
      }
    ],
  };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  // Log the access
  logResourceAccess(uri);
  
  switch (uri) {
    case "project://info":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(projectData, null, 2)
          }
        ]
      };
    
    case "config://user-settings":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(userConfig, null, 2)
          }
        ]
      };
    
    case "progress://learning-status":
      const progressPercentage = Math.round((learningProgress.completedDays.length / learningProgress.totalDays) * 100);
      const enhancedProgress = {
        ...learningProgress,
        progressPercentage,
        nextMilestone: learningProgress.currentDay <= learningProgress.totalDays ? 
          `Complete Day ${learningProgress.currentDay}` : "All days completed!",
        estimatedTimeRemaining: (learningProgress.totalDays - learningProgress.completedDays.length) * 60 // minutes
      };
      
      return {
        contents: [
          {
            uri,
            mimeType: "application/json", 
            text: JSON.stringify(enhancedProgress, null, 2)
          }
        ]
      };
    
    case "examples://code-library":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(codeExamples, null, 2)
          }
        ]
      };
    
    case "docs://getting-started":
      const gettingStartedGuide = `# MCP Getting Started Guide

## What is Model Context Protocol (MCP)?

MCP is a protocol that allows AI assistants like Claude to securely access external tools and data sources. Think of it as a bridge between AI and the tools you use every day.

## Key Concepts

### Tools 🔧
- Functions that AI can call (with your permission)
- Examples: calculators, text processors, API clients
- Tools perform actions and return results

### Resources 📁  
- File-like data that AI can read
- Examples: documentation, configuration files, data exports
- Resources provide information without executing code

### Prompts 🧠
- Pre-written templates for specific tasks
- Examples: code review templates, writing assistants
- Prompts help AI understand context and requirements

## Your Learning Journey

### Day 1: Basic Tools
Learn to create simple tools that perform single actions.

### Day 2: Advanced Tools  
Build complex tools with validation and error handling.

### Day 3: Resources (You are here!)
Create resources that provide data and documentation.

### Day 4-7: Advanced Topics
Prompts, API integration, best practices, and deployment.

## Next Steps

1. Follow the daily exercises in the \`exercises/\` folder
2. Build and test each day's project
3. Experiment with the bonus challenges
4. Join the MCP community to share your creations!

Happy learning! 🚀`;
      
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: gettingStartedGuide
          }
        ]
      };
    
    case "analytics://resource-usage":
      const analytics = {
        totalAccesses: resourceAccessLog.reduce((sum, log) => sum + log.accessCount, 0),
        uniqueResources: resourceAccessLog.length,
        mostAccessedResource: resourceAccessLog.sort((a, b) => b.accessCount - a.accessCount)[0]?.uri || "none",
        accessLog: resourceAccessLog.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10),
        generatedAt: new Date().toISOString()
      };
      
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(analytics, null, 2)
          }
        ]
      };
    
    default:
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Resource not found: ${uri}`
      );
  }
});

// Optional: Add a tool to update user configuration
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === "update-config") {
    const UpdateConfigSchema = z.object({
      theme: z.enum(['light', 'dark']).optional(),
      language: z.string().optional(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
      preferences: z.object({
        showHints: z.boolean().optional(),
        enableBonusChallenges: z.boolean().optional(),
        autoSave: z.boolean().optional()
      }).optional()
    });
    
    try {
      const updates = UpdateConfigSchema.parse(args);
      
      // Apply updates to userConfig
      if (updates.theme) userConfig.theme = updates.theme;
      if (updates.language) userConfig.language = updates.language;
      if (updates.difficulty) userConfig.difficulty = updates.difficulty;
      if (updates.preferences) {
        userConfig.preferences = { ...userConfig.preferences, ...updates.preferences };
      }
      
      return {
        content: [
          {
            type: "text",
            text: `Configuration updated successfully! New settings:\n${JSON.stringify(userConfig, null, 2)}`
          }
        ]
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid configuration: ${error.errors.map(e => e.message).join(', ')}`
        );
      }
      throw error;
    }
  }
  
  if (name === "mark-day-complete") {
    const MarkCompleteSchema = z.object({
      day: z.number().int().min(1).max(7),
      skillsLearned: z.array(z.string()).optional(),
      timeSpent: z.number().min(0).optional()
    });
    
    try {
      const { day, skillsLearned = [], timeSpent = 0 } = MarkCompleteSchema.parse(args);
      
      // Update progress
      if (!learningProgress.completedDays.includes(day)) {
        learningProgress.completedDays.push(day);
      }
      learningProgress.skillsLearned.push(...skillsLearned);
      learningProgress.timeSpent += timeSpent;
      learningProgress.currentDay = Math.max(day + 1, learningProgress.currentDay);
      
      const progressPercentage = Math.round((learningProgress.completedDays.length / learningProgress.totalDays) * 100);
      
      return {
        content: [
          {
            type: "text",
            text: `🎉 Day ${day} marked as complete!\n\nProgress: ${progressPercentage}% (${learningProgress.completedDays.length}/${learningProgress.totalDays} days)\nTotal skills learned: ${learningProgress.skillsLearned.length}\nTotal time invested: ${learningProgress.timeSpent} minutes\n\nKeep up the great work!`
          }
        ]
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid parameters: ${error.errors.map(e => e.message).join(', ')}`
        );
      }
      throw error;
    }
  }
  
  throw new McpError(ErrorCode.MethodNotFound, `Tool ${name} not found`);
});

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
