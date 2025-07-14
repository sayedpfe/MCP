# Day 2: Advanced Tools - Multiple Tools & Complex Validation

Welcome to Day 2 of your MCP learning journey! Today you'll master advanced tool creation patterns.

## 🎯 What You'll Build Today

### 3 Powerful Tools:
1. **🧮 Calculator Tool**
   - Basic math operations (add, subtract, multiply, divide)
   - Error handling for division by zero
   - Configurable precision for results
   
2. **📊 Text Analyzer Tool**
   - Character, word, sentence, paragraph counts
   - Optional word frequency analysis
   - Optional sentiment analysis
   - Advanced text statistics
   
3. **🎲 Random Generator Tool**
   - Multiple data types (numbers, strings, passwords, colors, UUIDs)
   - Configurable parameters for each type
   - Bulk generation capabilities
   - Input validation and limits

## 📁 Files in This Directory

- **`index-starter.ts`** - Your starting point with TODO comments and bonus helpers
- **`index-complete.ts`** - Complete reference implementation
- **`README.md`** - This file

## 🚀 How to Use These Files

### For the Basic Exercise:
1. Copy `index-starter.ts` to `src/index.ts`
2. Follow the step-by-step instructions in `exercises/day-2-advanced-tools.md`
3. Replace each TODO comment with the provided code
4. Test each tool as you build it

### For Bonus Challenges:
- Uncomment the helper functions in the starter file
- Follow the bonus challenge instructions
- Extend your tools with advanced features

### If You Get Stuck:
- Compare your code with `index-complete.ts`
- Check the exercise file for detailed explanations
- Test individual components step by step

## 🔧 Key Learning Concepts

### Advanced Validation Patterns:
```typescript
// Enum constraints
operation: z.enum(["add", "subtract", "multiply", "divide"])

// Range validation
precision: z.number().min(0).max(10)

// Conditional parameters
length: z.number().min(1).max(100).optional()
```

### Error Handling:
```typescript
if (b === 0) {
  return {
    content: [{
      type: "text",
      text: "❌ Error: Cannot divide by zero!"
    }]
  };
}
```

### Optional Features:
```typescript
// Optional analysis features
includeWords: z.boolean().optional()
includeSentiment: z.boolean().optional()
```

## 🧪 Testing Your Tools

### In Interactive Mode:
```bash
node interactive-test.js
```

### In Claude Desktop:
- "Use the calculator to multiply 15 by 8"
- "Analyze this text with word frequency: 'Hello world hello'"
- "Generate 3 random passwords with length 12 and symbols"

### Multi-Tool Workflows:
- "Generate 2 random numbers, then add them with the calculator"
- "Create a random string and analyze it with the text analyzer"

## 🎯 Success Criteria

By the end of Day 2, you should have:
- ✅ 3 working tools with different purposes
- ✅ Complex input validation using Zod
- ✅ Proper error handling and user feedback
- ✅ Tools working together in workflows
- ✅ Understanding of optional parameters and defaults

## 🚀 What's Next?

**Day 3** will introduce:
- 📚 **Resources** - File-like data that tools can read
- 🎯 **Prompts** - Pre-written templates for specific tasks
- 🔗 **Integration** - Combining tools, resources, and prompts

---

*Ready to build some powerful tools? Start with the exercise file and let's create something amazing!*
