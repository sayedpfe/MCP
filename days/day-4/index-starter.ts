#!/usr/bin/env node

/**
 * MCP Learning Project - Day 4: Prompts (Starter Version)
 * 
 * Learning Objectives:
 * - Create smart prompt templates for different use cases
 * - Understand prompt arguments and dynamic content
 * - Build context-aware writing assistance
 * - Master prompt organization and management
 * 
 * Today you'll build 5 different prompt templates:
 * 1. Code Review Assistant - Smart code analysis prompts
 * 2. Writing Helper - Context-aware writing assistance
 * 3. Meeting Summarizer - Structured meeting summary formats
 * 4. Learning Tutor - Adaptive learning prompts
 * 5. Project Planner - Strategic planning templates
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// ============================================================================
// PROMPT TEMPLATES CONFIGURATION
// ============================================================================

// Available programming languages for code review
const PROGRAMMING_LANGUAGES = [
  'typescript', 'javascript', 'python', 'java', 'csharp', 'cpp', 
  'rust', 'go', 'swift', 'kotlin', 'php', 'ruby', 'other'
] as const;

// Writing styles for different contexts
const WRITING_STYLES = [
  'professional', 'casual', 'academic', 'creative', 'technical', 
  'persuasive', 'friendly', 'formal'
] as const;

// Meeting types for different summary formats
const MEETING_TYPES = [
  'standup', 'planning', 'retrospective', 'brainstorming', 
  'decision-making', 'status-update', 'client-meeting', 'all-hands'
] as const;

// Learning levels for adaptive tutoring
const LEARNING_LEVELS = [
  'beginner', 'intermediate', 'advanced', 'expert'
] as const;

// Project planning contexts
const PROJECT_CONTEXTS = [
  'software-development', 'marketing-campaign', 'research-project', 
  'business-initiative', 'creative-project', 'team-building', 'general'
] as const;

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================

const server = new Server(
  {
    name: 'mcp-day4-prompts-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      prompts: {},
      tools: {},
    },
  }
);

// ============================================================================
// PROMPT HANDLERS
// ============================================================================

// TODO: Implement prompt list handler
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  // TODO: Return list of available prompts
  // Each prompt should have: name, description, arguments
  
  // HINT: Return an object with prompts array containing:
  // - code-review: For analyzing and reviewing code
  // - writing-helper: For improving writing with context
  // - meeting-summary: For creating structured meeting summaries  
  // - learning-tutor: For adaptive learning assistance
  // - project-planner: For strategic project planning
  
  return {
    prompts: [
      // TODO: Add your 5 prompt definitions here
    ]
  };
});

// TODO: Implement get prompt handler
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  // TODO: Handle different prompt types based on name
  switch (name) {
    case 'code-review':
      // TODO: Generate code review prompt
      // Use args.language, args.code, args.focus_areas
      break;
      
    case 'writing-helper':
      // TODO: Generate writing assistance prompt
      // Use args.style, args.audience, args.purpose, args.content
      break;
      
    case 'meeting-summary':
      // TODO: Generate meeting summary prompt
      // Use args.meeting_type, args.participants, args.duration
      break;
      
    case 'learning-tutor':
      // TODO: Generate learning tutor prompt
      // Use args.topic, args.level, args.learning_style, args.goals
      break;
      
    case 'project-planner':
      // TODO: Generate project planning prompt
      // Use args.context, args.timeline, args.team_size, args.objectives
      break;
      
    default:
      throw new McpError(ErrorCode.InvalidRequest, `Unknown prompt: ${name}`);
  }
});

// ============================================================================
// MANAGEMENT TOOLS
// ============================================================================

// TODO: Implement tools for prompt management
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'list-prompt-categories':
      // TODO: Return organized list of prompt categories
      break;
      
    case 'preview-prompt':
      // TODO: Generate a preview of how a prompt would look
      break;
      
    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  }
});

// ============================================================================
// BONUS CHALLENGE HELPERS (Uncomment when ready)
// ============================================================================

/*
// Advanced prompt generation with templates
function generateAdvancedPrompt(template: string, variables: Record<string, any>): string {
  // TODO: Implement template variable substitution
  // Support {{variable}} syntax
  // Add conditional sections with {{#if condition}}
  return template;
}

// Prompt history and favorites
class PromptManager {
  private history: Array<{prompt: string; timestamp: Date; args: any}> = [];
  private favorites: Set<string> = new Set();
  
  // TODO: Implement prompt history tracking
  addToHistory(prompt: string, args: any) {
    // TODO: Add prompt to history with timestamp
  }
  
  // TODO: Implement favorites management
  addToFavorites(promptName: string) {
    // TODO: Add to favorites list
  }
  
  // TODO: Get usage statistics
  getStats() {
    // TODO: Return prompt usage statistics
    return {
      totalPrompts: this.history.length,
      uniquePrompts: new Set(this.history.map(h => h.prompt)).size,
      favorites: Array.from(this.favorites),
      mostUsed: {}
    };
  }
}

// Smart prompt suggestions based on context
function suggestPrompts(context: {
  currentFile?: string;
  recentActivity?: string[];
  userPreferences?: any;
}) {
  // TODO: Analyze context and suggest relevant prompts
  const suggestions = [];
  
  // Check file extension for code review suggestions
  if (context.currentFile?.endsWith('.ts') || context.currentFile?.endsWith('.js')) {
    suggestions.push('code-review');
  }
  
  // Check recent activity for writing assistance
  if (context.recentActivity?.includes('document') || context.recentActivity?.includes('email')) {
    suggestions.push('writing-helper');
  }
  
  return suggestions;
}

// Prompt templates with dynamic sections
const ADVANCED_TEMPLATES = {
  'code-review-advanced': `
    # Code Review Assistant

    {{#if language}}
    **Language**: {{language}}
    {{/if}}

    {{#if focus_areas}}
    **Focus Areas**: {{focus_areas}}
    {{/if}}

    ## Analysis Framework
    
    1. **Code Quality**
       - Readability and maintainability
       - Performance considerations
       - Security implications
    
    2. **Best Practices**
       - Language-specific conventions
       - Design patterns usage
       - Error handling
    
    3. **Improvements**
       - Optimization opportunities
       - Refactoring suggestions
       - Testing recommendations

    {{#if code}}
    ## Code to Review:
    \`\`\`{{language}}
    {{code}}
    \`\`\`
    {{/if}}

    Please provide a comprehensive review following this framework.
  `,
  
  'writing-helper-advanced': `
    # Writing Enhancement Assistant

    **Style**: {{style}}
    **Audience**: {{audience}}
    **Purpose**: {{purpose}}

    {{#if content}}
    ## Content to Improve:
    {{content}}
    {{/if}}

    ## Enhancement Areas:
    
    1. **Clarity & Structure**
       - Logical flow and organization
       - Paragraph and sentence structure
       - Transition effectiveness
    
    2. **Style & Tone**
       - Appropriate for {{audience}}
       - Consistent {{style}} voice
       - Engaging and purposeful
    
    3. **Content Quality**
       - Accuracy and completeness
       - Supporting evidence
       - Call-to-action clarity

    Please enhance the content focusing on these areas while maintaining the intended {{style}} style for {{audience}}.
  `
};

// Export for bonus challenges
const promptManager = new PromptManager();
*/

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Day 4 Prompts Server running on stdio');
}

main().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});
