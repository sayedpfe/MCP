# Day 4: Prompts - Smart Templates & Context-Aware Assistance

**Duration**: 2-3 hours | **Difficulty**: Intermediate | **Prerequisites**: Days 1-3 completed

Welcome to Day 4! Today you'll learn to create intelligent prompt templates that help Claude provide better, more structured assistance. Prompts are pre-written templates that Claude can use to approach specific types of tasks with the right framework and context.

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Understand how MCP prompts differ from tools and resources
- ✅ Create 5 different prompt templates for various use cases
- ✅ Implement dynamic content generation based on arguments
- ✅ Build context-aware assistance systems
- ✅ Master argument validation for complex prompt parameters
- ✅ Create management tools for prompt organization

## 📚 What Are MCP Prompts?

### **Prompts vs Tools vs Resources**:

| Feature | **Tools** | **Resources** | **Prompts** |
|---------|-----------|---------------|-------------|
| **Purpose** | Execute actions | Provide data | Generate templates |
| **Output** | Results/calculations | File content | Structured instructions |
| **Use Case** | "Calculate X" | "Read file Y" | "Create framework for Z" |
| **Day Focus** | 1-2 | 3 | **4** |

### **Example Prompt Usage**:
```
User: "Use the code-review prompt for my TypeScript function"
Claude: Receives a structured template for code review analysis
Result: Comprehensive, framework-based code review
```

## 🛠️ Step 1: Environment Setup (5 minutes)

### 1A: Copy the Day 4 Starter File
```powershell
# Navigate to your MCP project
cd "D:\OneDrive\OneDrive - Microsoft\Documents\Learning Projects\MCP"

# Copy the starter file to your working directory
Copy-Item days/day-4/index-starter.ts src/index.ts

# Verify the copy
Get-Content src/index.ts | Select-Object -First 10
```

### 1B: Build and Test Initial Setup
```powershell
# Build the project
npm run build

# Test the server starts (should show todos)
npm start
# Press Ctrl+C to stop
```

**Expected Output**: Server starts with TODO placeholders for prompt handlers.

## 🔧 Step 2: Implement Prompt List Handler (15 minutes)

### 2A: Understanding Prompt Definitions

Open `src/index.ts` and find the first TODO comment in the `ListPromptsRequestSchema` handler.

Replace this section:
```typescript
// TODO: Return list of available prompts
// Each prompt should have: name, description, arguments

return {
  prompts: [
    // TODO: Add your 5 prompt definitions here
  ]
};
```

With this implementation:
```typescript
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
```

### 2B: Test Prompt Listing
```powershell
npm run build
npm start
```

**What you built**: A comprehensive prompt catalog that Claude can discover and use.

## 📝 Step 3: Implement Code Review Prompt (20 minutes)

### 3A: Add Validation Schemas

First, add these validation schemas after the constants section (around line 45):

```typescript
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
```

### 3B: Implement Code Review Prompt Handler

Find the `GetPromptRequestSchema` handler and replace the `case 'code-review':` section:

```typescript
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
```

### 3C: Test Code Review Prompt
```powershell
npm run build
npm start
```

**What you built**: A dynamic code review template that adapts to programming language, complexity level, and focus areas.

## ✍️ Step 4: Implement Writing Helper Prompt (15 minutes)

Replace the `case 'writing-helper':` section with:

```typescript
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
```

## 📋 Step 5: Implement Meeting Summary Prompt (15 minutes)

Replace the `case 'meeting-summary':` section with:

```typescript
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
```

## 🎓 Step 6: Implement Learning Tutor Prompt (15 minutes)

Replace the `case 'learning-tutor':` section with:

```typescript
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
```

## 📊 Step 7: Implement Project Planner Prompt (15 minutes)

Replace the `case 'project-planner':` section with:

```typescript
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
```

## 🛠️ Step 8: Implement Management Tools (15 minutes)

Replace the `CallToolRequestSchema` handler switch statement content with:

```typescript
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
    
    const sampleArgs = params.sample_args || {
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
      }
    }[params.prompt_name] || {};
    
    return {
      content: [
        {
          type: 'text',
          text: `# Prompt Preview: ${params.prompt_name}

## Sample Arguments:
${JSON.stringify(sampleArgs, null, 2)}

## Description:
This prompt would generate a structured template for ${params.prompt_name} with the provided arguments.

---
*This is a preview. Use the actual prompt with your specific parameters for real tasks.*`
        }
      ]
    };
  }
  
  default:
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
}
```

## 🧪 Step 9: Test Your Prompts (15 minutes)

### 9A: Build and Test
```powershell
npm run build
npm start
```

### 9B: Interactive Testing
```powershell
# In a new terminal
node interactive-test.js
```

Test these commands:
```javascript
// List available prompts
await client.request({ method: "prompts/list" }, {});

// Test code review prompt
await client.request({
  method: "prompts/get", 
  params: {
    name: "code-review",
    arguments: {
      language: "typescript",
      code: "function greet(name: string) { console.log('Hello ' + name); }",
      focus_areas: "performance, style",
      complexity: "simple"
    }
  }
}, {});

// Test management tool
await client.request({
  method: "tools/call",
  params: {
    name: "list-prompt-categories"
  }
}, {});
```

### 9C: Claude Desktop Testing

Configure Claude Desktop and test these prompts:
- "Use the code-review prompt for TypeScript code focusing on security"
- "Generate a writing-helper prompt for casual blog post to developers"
- "Create a meeting-summary template for retrospective meeting"
- "Use learning-tutor for beginner Python variables with visual learning style"
- "Generate project-planner for marketing campaign with 6-week timeline"

## 🎉 Step 10: Verify Your Implementation (10 minutes)

### Success Checklist:
- ✅ **Prompt Discovery**: Claude can list all 5 available prompts
- ✅ **Dynamic Generation**: Each prompt adapts based on provided arguments
- ✅ **Validation**: Invalid arguments show helpful error messages
- ✅ **Context Awareness**: Prompts change based on complexity, style, type, etc.
- ✅ **Management Tools**: Can preview prompts and list categories
- ✅ **Real Usage**: Prompts work effectively in Claude Desktop

### Test All Prompts:
```powershell
# Test each prompt type with the interactive tester
node interactive-test.js
```

## 🌟 Bonus Challenges (45+ minutes)

### Bonus 1: Advanced Template System (15 minutes)
Uncomment and implement the `generateAdvancedPrompt` function with template variable substitution:

```typescript
function generateAdvancedPrompt(template: string, variables: Record<string, any>): string {
  let result = template;
  
  // Replace {{variable}} patterns
  for (const [key, value] of Object.entries(variables)) {
    const pattern = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(pattern, String(value));
  }
  
  // Handle conditional sections {{#if condition}}
  const conditionalRegex = /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g;
  result = result.replace(conditionalRegex, (match, condition, content) => {
    return variables[condition] ? content : '';
  });
  
  return result;
}
```

### Bonus 2: Prompt History Management (15 minutes)
Implement the `PromptManager` class:

```typescript
class PromptManager {
  private history: Array<{prompt: string; timestamp: Date; args: any}> = [];
  private favorites: Set<string> = new Set();
  
  addToHistory(prompt: string, args: any) {
    this.history.push({
      prompt,
      timestamp: new Date(),
      args
    });
    
    // Keep only last 100 entries
    if (this.history.length > 100) {
      this.history = this.history.slice(-100);
    }
  }
  
  addToFavorites(promptName: string) {
    this.favorites.add(promptName);
  }
  
  getStats() {
    const promptCounts = this.history.reduce((acc, h) => {
      acc[h.prompt] = (acc[h.prompt] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostUsed = Object.entries(promptCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    return {
      totalPrompts: this.history.length,
      uniquePrompts: new Set(this.history.map(h => h.prompt)).size,
      favorites: Array.from(this.favorites),
      mostUsed: Object.fromEntries(mostUsed),
      recentActivity: this.history.slice(-10)
    };
  }
}
```

### Bonus 3: Smart Prompt Suggestions (15 minutes)
Implement the `suggestPrompts` function:

```typescript
function suggestPrompts(context: {
  currentFile?: string;
  recentActivity?: string[];
  userPreferences?: any;
}) {
  const suggestions = [];
  
  // File-based suggestions
  if (context.currentFile) {
    const ext = context.currentFile.split('.').pop()?.toLowerCase();
    const codeExtensions = ['ts', 'js', 'py', 'java', 'cpp', 'cs'];
    
    if (codeExtensions.includes(ext || '')) {
      suggestions.push({
        prompt: 'code-review',
        reason: `Detected ${ext} file - perfect for code review`,
        confidence: 0.9
      });
    }
    
    if (['md', 'txt', 'doc'].includes(ext || '')) {
      suggestions.push({
        prompt: 'writing-helper',
        reason: 'Text document detected - writing assistance available',
        confidence: 0.8
      });
    }
  }
  
  // Activity-based suggestions
  if (context.recentActivity) {
    if (context.recentActivity.includes('meeting')) {
      suggestions.push({
        prompt: 'meeting-summary',
        reason: 'Recent meeting activity detected',
        confidence: 0.7
      });
    }
    
    if (context.recentActivity.includes('learning') || context.recentActivity.includes('tutorial')) {
      suggestions.push({
        prompt: 'learning-tutor',
        reason: 'Learning context detected',
        confidence: 0.7
      });
    }
  }
  
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}
```

## 🎯 Day 4 Completion

Congratulations! You've built a comprehensive prompt system with:

### ✅ What You Accomplished:
- **5 Smart Prompts**: Code review, writing helper, meeting summary, learning tutor, project planner
- **Dynamic Templates**: Context-aware content generation
- **Argument Validation**: Robust input handling with Zod
- **Management Tools**: Prompt organization and preview capabilities
- **Bonus Features**: Advanced templating, history management, smart suggestions

### 🚀 Key Skills Gained:
- **Prompt Architecture**: Understanding how to structure effective AI prompts
- **Template Design**: Creating reusable, parameterized templates
- **Context Awareness**: Building systems that adapt to user needs
- **User Experience**: Designing intuitive prompt interfaces

### 🔥 Real-World Applications:
- **Development Teams**: Standardized code review processes
- **Content Teams**: Consistent writing guidelines and improvement
- **Project Managers**: Structured planning and meeting documentation
- **Training Organizations**: Adaptive learning experiences
- **Consultants**: Reusable frameworks for client work

## 📚 What's Next?

**Day 5** will teach you:
- 🌐 **API Integration** - Connect to real-world data sources
- 🔐 **Authentication** - Secure API key management
- ⚡ **Caching** - Performance optimization for external calls
- 🔄 **Error Handling** - Robust network and API error management

Ready to connect your MCP server to the real world? Continue to Day 5!

---

*Fantastic work on mastering prompts! You've built intelligent templates that make Claude significantly more effective at structured tasks. These patterns will serve as the foundation for creating sophisticated AI assistance systems.*
