# Day 4: Prompts - Smart Templates & Context-Aware Assistance

Welcome to Day 4 of your MCP learning journey! Today you'll master prompt creation and dynamic template generation.

## 🎯 What You'll Build Today

### 5 Powerful Prompt Templates:
1. **🔍 Code Review Assistant**
   - Language-specific analysis frameworks
   - Customizable focus areas (performance, security, readability)
   - Complexity-aware feedback (simple to expert level)
   
2. **✍️ Writing Helper**
   - Style-aware content enhancement (professional, casual, academic)
   - Audience-targeted improvements
   - Purpose-driven writing assistance
   
3. **📋 Meeting Summarizer**
   - Meeting type templates (standup, planning, retrospective)
   - Structured documentation formats
   - Action item tracking and follow-up
   
4. **🎓 Learning Tutor**
   - Adaptive learning based on skill level
   - Learning style customization (visual, auditory, kinesthetic)
   - Goal-oriented educational guidance
   
5. **📊 Project Planner**
   - Context-specific planning frameworks
   - Timeline and resource management
   - Strategic execution templates

## 📁 Files in This Directory

- **`index-starter.ts`** - Your starting point with TODO comments and extensive bonus helpers
- **`index-complete.ts`** - Complete reference implementation with all 5 prompts
- **`README.md`** - This file

## 🚀 How to Use These Files

### For the Basic Exercise:
1. Copy `index-starter.ts` to `src/index.ts`
2. Follow the step-by-step instructions in `exercises/day-4-prompts.md`
3. Implement each prompt handler using the provided frameworks
4. Test each prompt with different argument combinations

### For Bonus Challenges:
- Uncomment the advanced helper functions in the starter file
- Implement template variable substitution
- Add prompt history and favorites management
- Create smart prompt suggestion system

### If You Get Stuck:
- Compare your implementation with `index-complete.ts`
- Check the exercise file for detailed code examples
- Test individual prompts step by step

## 🔧 Key Learning Concepts

### Prompt Structure:
```typescript
// Basic prompt definition
{
  name: 'prompt-name',
  description: 'What this prompt does',
  arguments: [
    {
      name: 'param1',
      description: 'Parameter description',
      required: true,
    }
  ]
}
```

### Dynamic Content Generation:
```typescript
// Context-aware prompt generation
const prompt = `# ${title}
**Context**: ${context}
**Goal**: ${goal}

## Framework
${generateFramework(context, complexity)}

## Content
${content}

Please ${action} following this framework.`;
```

### Argument Validation:
```typescript
// Robust input validation
const ParamsSchema = z.object({
  style: z.enum(['professional', 'casual', 'academic']),
  content: z.string().min(1, "Content is required"),
  audience: z.string().min(1, "Audience is required"),
});
```

## 🧪 Testing Your Prompts

### In Interactive Mode:
```bash
node interactive-test.js
```

### In Claude Desktop:
Try these prompt requests:
- "Use the code-review prompt for TypeScript code focusing on performance"
- "Generate a writing-helper prompt for professional email to executives"
- "Create a meeting-summary template for sprint planning session"
- "Use learning-tutor for intermediate JavaScript async/await concepts"
- "Generate project-planner for software development with 6-month timeline"

### Advanced Testing:
- "Preview the code-review prompt with sample arguments"
- "List all available prompt categories"
- "Show me writing-helper options for different audiences"

## 🎯 Success Criteria

By the end of Day 4, you should have:
- ✅ 5 working prompt templates with different purposes
- ✅ Dynamic argument-based content generation
- ✅ Context-aware prompt customization
- ✅ Proper argument validation and error handling
- ✅ Management tools for prompt organization
- ✅ Understanding of prompt design patterns

## 🌟 Understanding Prompts vs Tools vs Resources

### **Prompts** (Day 4):
- **Purpose**: Template generation for Claude
- **When to use**: Creating structured instructions, frameworks, templates
- **Example**: "Generate a code review framework for Python focusing on security"

### **Tools** (Days 1-2):
- **Purpose**: Execute actions and return results
- **When to use**: Performing calculations, analysis, data processing
- **Example**: "Calculate 15 × 8" → Returns "120"

### **Resources** (Day 3):
- **Purpose**: Provide readable data and information
- **When to use**: Storing documentation, configuration, reference material
- **Example**: "Read project documentation" → Returns file content

## 🚀 What's Next?

**Day 5** will introduce:
- 🌐 **API Integration** - Connect to real-world data sources
- 🔐 **Authentication** - Secure API key management
- ⚡ **Caching** - Performance optimization for external calls
- 🔄 **Error Handling** - Robust network and API error management

Learn to build MCP servers that connect with external services and provide real-time data to Claude!

---

*Ready to create intelligent prompt templates? Start with the exercise file and let's build some smart assistance systems!*
