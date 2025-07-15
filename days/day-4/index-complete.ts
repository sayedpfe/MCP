#!/usr/bin/env node

/**
 * MCP Learning Project - Day 4: Prompts (Complete Implementation)
 * 
 * This implementation demonstrates:
 * ✅ 5 different prompt templates for various use cases
 * ✅ Dynamic prompt generation with arguments
 * ✅ Context-aware writing assistance
 * ✅ Management tools for prompt organization
 * ✅ Smart prompt suggestions and templates
 * 
 * Prompts Included:
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
// VALIDATION SCHEMAS
// ============================================================================

const CodeReviewArgsSchema = z.object({
  language: z.enum(PROGRAMMING_LANGUAGES),
  code: z.string().min(1, "Code content is required"),
  focus_areas: z.string().optional(),
  complexity: z.enum(['simple', 'moderate', 'complex']).default('moderate'),
});

const WritingHelperArgsSchema = z.object({
  style: z.enum(WRITING_STYLES),
  audience: z.string().min(1, "Target audience is required"),
  purpose: z.string().min(1, "Writing purpose is required"), 
  content: z.string().min(1, "Content to improve is required"),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
});

const MeetingSummaryArgsSchema = z.object({
  meeting_type: z.enum(MEETING_TYPES),
  participants: z.string().min(1, "Participant list is required"),
  duration: z.string().min(1, "Meeting duration is required"),
  key_topics: z.string().optional(),
  action_items: z.string().optional(),
});

const LearningTutorArgsSchema = z.object({
  topic: z.string().min(1, "Learning topic is required"),
  level: z.enum(LEARNING_LEVELS),
  learning_style: z.enum(['visual', 'auditory', 'kinesthetic', 'reading']).default('reading'),
  goals: z.string().min(1, "Learning goals are required"),
  time_available: z.string().optional(),
});

const ProjectPlannerArgsSchema = z.object({
  context: z.enum(PROJECT_CONTEXTS),
  timeline: z.string().min(1, "Project timeline is required"),
  team_size: z.string().min(1, "Team size is required"),
  objectives: z.string().min(1, "Project objectives are required"),
  constraints: z.string().optional(),
  budget: z.string().optional(),
});

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

// List all available prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'code-review',
        description: 'Generate comprehensive code review prompts with analysis framework',
        arguments: [
          {
            name: 'language',
            description: 'Programming language of the code',
            required: true,
          },
          {
            name: 'code', 
            description: 'Code content to review',
            required: true,
          },
          {
            name: 'focus_areas',
            description: 'Specific areas to focus on (e.g., "performance, security")',
            required: false,
          },
          {
            name: 'complexity',
            description: 'Code complexity level (simple, moderate, complex)',
            required: false,
          },
        ],
      },
      {
        name: 'writing-helper',
        description: 'Create context-aware writing assistance prompts',
        arguments: [
          {
            name: 'style',
            description: 'Writing style (professional, casual, academic, etc.)',
            required: true,
          },
          {
            name: 'audience',
            description: 'Target audience for the writing',
            required: true,
          },
          {
            name: 'purpose',
            description: 'Purpose of the writing (inform, persuade, entertain, etc.)',
            required: true,
          },
          {
            name: 'content',
            description: 'Content to improve or enhance',
            required: true,
          },
          {
            name: 'length',
            description: 'Desired content length (short, medium, long)',
            required: false,
          },
        ],
      },
      {
        name: 'meeting-summary',
        description: 'Generate structured meeting summary templates',
        arguments: [
          {
            name: 'meeting_type',
            description: 'Type of meeting (standup, planning, retrospective, etc.)',
            required: true,
          },
          {
            name: 'participants',
            description: 'List of meeting participants',
            required: true,
          },
          {
            name: 'duration',
            description: 'Meeting duration',
            required: true,
          },
          {
            name: 'key_topics',
            description: 'Key topics discussed',
            required: false,
          },
          {
            name: 'action_items',
            description: 'Action items from the meeting',
            required: false,
          },
        ],
      },
      {
        name: 'learning-tutor',
        description: 'Create adaptive learning assistance prompts',
        arguments: [
          {
            name: 'topic',
            description: 'Subject or topic to learn',
            required: true,
          },
          {
            name: 'level',
            description: 'Learning level (beginner, intermediate, advanced, expert)',
            required: true,
          },
          {
            name: 'learning_style',
            description: 'Preferred learning style (visual, auditory, kinesthetic, reading)',
            required: false,
          },
          {
            name: 'goals',
            description: 'Specific learning goals',
            required: true,
          },
          {
            name: 'time_available',
            description: 'Available time for learning',
            required: false,
          },
        ],
      },
      {
        name: 'project-planner',
        description: 'Generate strategic project planning templates',
        arguments: [
          {
            name: 'context',
            description: 'Project context (software-development, marketing-campaign, etc.)',
            required: true,
          },
          {
            name: 'timeline',
            description: 'Project timeline or deadline',
            required: true,
          },
          {
            name: 'team_size',
            description: 'Size and composition of the team',
            required: true,
          },
          {
            name: 'objectives',
            description: 'Main project objectives',
            required: true,
          },
          {
            name: 'constraints',
            description: 'Project constraints or limitations',
            required: false,
          },
          {
            name: 'budget',
            description: 'Budget considerations',
            required: false,
          },
        ],
      },
    ],
  };
});

// Generate specific prompts based on type and arguments
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  
  switch (name) {
    case 'code-review': {
      const params = CodeReviewArgsSchema.parse(args);
      
      const focusSection = params.focus_areas 
        ? `\n**Focus Areas**: ${params.focus_areas}\n`
        : '';
      
      const complexityGuidance = {
        simple: 'Focus on basic code quality and readability.',
        moderate: 'Provide balanced analysis of code quality, performance, and best practices.',
        complex: 'Deep dive into architecture, performance optimization, and advanced patterns.'
      };
      
      return {
        description: `Code review prompt for ${params.language} code`,
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text',
              text: `# Code Review Assistant

**Language**: ${params.language}
**Complexity**: ${params.complexity}${focusSection}

## Analysis Framework

${complexityGuidance[params.complexity]}

1. **Code Quality & Readability**
   - Variable and function naming
   - Code organization and structure  
   - Comments and documentation
   - Consistency with conventions

2. **Functionality & Logic**
   - Correctness of implementation
   - Edge case handling
   - Error handling and validation
   - Algorithm efficiency

3. **Best Practices**
   - Language-specific idioms
   - Design patterns usage
   - Security considerations
   - Performance implications

4. **Maintainability**
   - Code reusability
   - Testing considerations
   - Future extensibility
   - Technical debt assessment

## Code to Review:
\`\`\`${params.language}
${params.code}
\`\`\`

Please provide a comprehensive review following this framework. Include specific suggestions for improvement and highlight both strengths and areas for enhancement.`
            }
          }
        ]
      };
    }
    
    case 'writing-helper': {
      const params = WritingHelperArgsSchema.parse(args);
      
      const lengthGuidance = {
        short: 'Keep responses concise and impactful.',
        medium: 'Provide balanced detail and clarity.',
        long: 'Include comprehensive analysis and detailed suggestions.'
      };
      
      return {
        description: `Writing assistance for ${params.style} style targeting ${params.audience}`,
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text',
              text: `# Writing Enhancement Assistant

**Style**: ${params.style}
**Audience**: ${params.audience}  
**Purpose**: ${params.purpose}
**Target Length**: ${params.length}

## Enhancement Framework

${lengthGuidance[params.length]}

1. **Content & Structure**
   - Logical flow and organization
   - Key message clarity
   - Supporting evidence
   - Conclusion effectiveness

2. **Style & Tone**
   - Appropriate for ${params.audience}
   - Consistent ${params.style} voice
   - Engaging and purposeful language
   - Clarity and readability

3. **Technical Quality**
   - Grammar and syntax
   - Word choice and vocabulary
   - Sentence variety and flow
   - Paragraph structure

4. **Audience Alignment**
   - Meets ${params.audience} expectations
   - Achieves ${params.purpose} effectively
   - Appropriate complexity level
   - Call-to-action clarity

## Content to Enhance:
${params.content}

Please enhance this content focusing on the framework above while maintaining the intended ${params.style} style for ${params.audience}. Provide both the improved version and specific feedback on changes made.`
            }
          }
        ]
      };
    }
    
    case 'meeting-summary': {
      const params = MeetingSummaryArgsSchema.parse(args);
      
      const meetingTemplates = {
        standup: 'Yesterday\'s Progress, Today\'s Plans, Blockers',
        planning: 'Objectives, Tasks, Timeline, Resources',
        retrospective: 'What Went Well, What Could Improve, Action Items',
        brainstorming: 'Ideas Generated, Themes, Next Steps',
        'decision-making': 'Options Discussed, Decision Made, Rationale',
        'status-update': 'Progress, Challenges, Next Milestones',
        'client-meeting': 'Requirements, Feedback, Deliverables',
        'all-hands': 'Announcements, Updates, Q&A'
      };
      
      const keyTopicsSection = params.key_topics 
        ? `\n**Key Topics Discussed**: ${params.key_topics}`
        : '';
        
      const actionItemsSection = params.action_items 
        ? `\n**Action Items**: ${params.action_items}`
        : '';
      
      return {
        description: `Meeting summary template for ${params.meeting_type} meeting`,
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text',
              text: `# Meeting Summary Assistant

**Meeting Type**: ${params.meeting_type}
**Participants**: ${params.participants}
**Duration**: ${params.duration}${keyTopicsSection}${actionItemsSection}

## Summary Framework for ${params.meeting_type}

Focus Areas: ${meetingTemplates[params.meeting_type]}

1. **Meeting Overview**
   - Date, time, and duration
   - Attendees and roles
   - Main objectives

2. **Key Discussion Points**
   - Primary topics covered
   - Important decisions made
   - Outstanding questions

3. **Action Items & Next Steps**
   - Specific tasks assigned
   - Owners and deadlines
   - Follow-up meetings needed

4. **Summary & Outcomes**
   - Key achievements
   - Blockers identified
   - Success metrics

Please create a comprehensive meeting summary following this structure. Include all relevant details while keeping it concise and actionable for follow-up.`
            }
          }
        ]
      };
    }
    
    case 'learning-tutor': {
      const params = LearningTutorArgsSchema.parse(args);
      
      const styleAdaptations = {
        visual: 'Include diagrams, charts, and visual representations',
        auditory: 'Focus on verbal explanations and discussion points',
        kinesthetic: 'Emphasize hands-on practice and interactive exercises',
        reading: 'Provide detailed written explanations and resources'
      };
      
      const levelGuidance = {
        beginner: 'Start with fundamentals and build up gradually',
        intermediate: 'Connect to existing knowledge and introduce complexity',
        advanced: 'Focus on nuanced understanding and application',
        expert: 'Explore edge cases and advanced theoretical concepts'
      };
      
      const timeSection = params.time_available 
        ? `\n**Time Available**: ${params.time_available}`
        : '';
      
      return {
        description: `Learning assistance for ${params.topic} at ${params.level} level`,
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text',
              text: `# Learning Tutor Assistant

**Topic**: ${params.topic}
**Level**: ${params.level}
**Learning Style**: ${params.learning_style}
**Goals**: ${params.goals}${timeSection}

## Learning Framework

**Adaptation**: ${styleAdaptations[params.learning_style]}
**Approach**: ${levelGuidance[params.level]}

1. **Foundation Building**
   - Key concepts and terminology
   - Prerequisites review
   - Learning objectives clarification

2. **Core Content Delivery**
   - Main topic explanation
   - Examples and applications
   - Common misconceptions

3. **Practice & Application**
   - Hands-on exercises
   - Real-world scenarios
   - Problem-solving opportunities

4. **Assessment & Progress**
   - Knowledge check questions
   - Skill demonstration
   - Next learning steps

Please create a comprehensive learning experience for ${params.topic} that:
- Matches the ${params.level} level
- Adapts to ${params.learning_style} learning style  
- Achieves the specified goals: ${params.goals}
- Provides engaging and effective instruction

Include specific activities, examples, and assessment methods.`
            }
          }
        ]
      };
    }
    
    case 'project-planner': {
      const params = ProjectPlannerArgsSchema.parse(args);
      
      const contextTemplates = {
        'software-development': 'Requirements, Architecture, Development, Testing, Deployment',
        'marketing-campaign': 'Strategy, Creative, Channels, Launch, Measurement',
        'research-project': 'Literature Review, Methodology, Data Collection, Analysis, Reporting',
        'business-initiative': 'Planning, Resource Allocation, Execution, Monitoring, Evaluation',
        'creative-project': 'Concept, Design, Production, Review, Launch',
        'team-building': 'Assessment, Planning, Activities, Implementation, Follow-up',
        'general': 'Planning, Execution, Monitoring, Evaluation, Closure'
      };
      
      const constraintsSection = params.constraints 
        ? `\n**Constraints**: ${params.constraints}`
        : '';
        
      const budgetSection = params.budget 
        ? `\n**Budget**: ${params.budget}`
        : '';
      
      return {
        description: `Project planning template for ${params.context} project`,
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text',
              text: `# Project Planning Assistant

**Context**: ${params.context}
**Timeline**: ${params.timeline}
**Team Size**: ${params.team_size}
**Objectives**: ${params.objectives}${constraintsSection}${budgetSection}

## Planning Framework for ${params.context}

Key Phases: ${contextTemplates[params.context]}

1. **Project Definition**
   - Clear scope and deliverables
   - Success criteria and metrics
   - Stakeholder identification

2. **Resource Planning**
   - Team roles and responsibilities
   - Required skills and expertise
   - Tools and infrastructure needs

3. **Timeline & Milestones**
   - Phase breakdown and dependencies
   - Key milestone definitions
   - Risk assessment and mitigation

4. **Execution Strategy**
   - Communication plan
   - Progress tracking methods
   - Quality assurance approach

5. **Success Measurement**
   - KPIs and success metrics
   - Review and evaluation process
   - Lessons learned capture

Please create a comprehensive project plan that:
- Addresses the specific objectives: ${params.objectives}
- Works within the timeline: ${params.timeline}
- Utilizes the team effectively: ${params.team_size}
- Considers all constraints and budget factors

Include specific tasks, timelines, and success criteria.`
            }
          }
        ]
      };
    }
    
    default:
      throw new McpError(ErrorCode.InvalidRequest, `Unknown prompt: ${name}`);
  }
});

// ============================================================================
// MANAGEMENT TOOLS
// ============================================================================

// Tools for prompt management and organization
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'list-prompt-categories': {
      return {
        content: [
          {
            type: 'text',
            text: `# Prompt Categories

## 📊 Analysis & Review
- **code-review**: Comprehensive code analysis and improvement suggestions
- **meeting-summary**: Structured meeting documentation and action items

## ✍️ Writing & Communication  
- **writing-helper**: Context-aware writing enhancement and style improvement

## 🎓 Learning & Development
- **learning-tutor**: Adaptive learning assistance and educational guidance

## 📋 Planning & Strategy
- **project-planner**: Strategic project planning and execution frameworks

## Usage Examples:
- Use code-review for pull request analysis
- Use writing-helper for emails, documents, presentations
- Use meeting-summary for consistent meeting documentation  
- Use learning-tutor for skill development and training
- Use project-planner for initiative planning and management

Each prompt includes customizable arguments to tailor the output to your specific needs.`
          }
        ]
      };
    }
    
    case 'preview-prompt': {
      const PreviewArgsSchema = z.object({
        prompt_name: z.string(),
        sample_args: z.record(z.any()).optional(),
      });
      
      const params = PreviewArgsSchema.parse(args);
      
      // Generate a preview with sample arguments
      const sampleArgs = params.sample_args || getSampleArgs(params.prompt_name);
      
      try {
        const previewRequest = {
          params: {
            name: params.prompt_name,
            arguments: sampleArgs
          }
        };
        
        // This would normally call the get prompt handler
        const preview = await generatePreview(params.prompt_name, sampleArgs);
        
        return {
          content: [
            {
              type: 'text',
              text: `# Prompt Preview: ${params.prompt_name}

## Sample Arguments:
${JSON.stringify(sampleArgs, null, 2)}

## Generated Prompt:
${preview}

---
*This is a preview using sample arguments. Use the actual prompt with your specific parameters for real tasks.*`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error generating preview for ${params.prompt_name}: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
    
    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getSampleArgs(promptName: string): Record<string, any> {
  const samples = {
    'code-review': {
      language: 'typescript',
      code: 'function add(a: number, b: number) { return a + b; }',
      focus_areas: 'performance, readability',
      complexity: 'simple'
    },
    'writing-helper': {
      style: 'professional',
      audience: 'technical team',
      purpose: 'inform about new process',
      content: 'We are implementing a new deployment process.',
      length: 'medium'
    },
    'meeting-summary': {
      meeting_type: 'planning',
      participants: 'Alice, Bob, Charlie',
      duration: '1 hour',
      key_topics: 'Sprint planning, resource allocation',
      action_items: 'Update documentation, schedule follow-up'
    },
    'learning-tutor': {
      topic: 'TypeScript interfaces',
      level: 'intermediate',
      learning_style: 'reading',
      goals: 'Understand advanced interface patterns',
      time_available: '2 hours'
    },
    'project-planner': {
      context: 'software-development',
      timeline: '3 months',
      team_size: '5 developers',
      objectives: 'Build new customer portal',
      constraints: 'Legacy system integration required',
      budget: '$50,000'
    }
  };
  
  return samples[promptName as keyof typeof samples] || {};
}

async function generatePreview(promptName: string, args: Record<string, any>): Promise<string> {
  // Simplified preview generation
  switch (promptName) {
    case 'code-review':
      return `Code Review Assistant for ${args.language} code focusing on ${args.focus_areas || 'general quality'}`;
    case 'writing-helper':
      return `Writing enhancement in ${args.style} style for ${args.audience}`;
    case 'meeting-summary':
      return `${args.meeting_type} meeting summary for ${args.duration} with ${args.participants}`;
    case 'learning-tutor':
      return `${args.level} level tutoring for ${args.topic} using ${args.learning_style} approach`;
    case 'project-planner':
      return `${args.context} project plan for ${args.timeline} with team of ${args.team_size}`;
    default:
      return `Preview for ${promptName} with provided arguments`;
  }
}

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
