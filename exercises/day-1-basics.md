# Day 1: MCP Basics - Step by Step

Welcome to your first day of MCP learning! Today you'll understand the fundamentals and create your first custom tool.

## 🎯 Today's Goals
By the end of today, you'll have:
- ✅ Created your first custom tool
- ✅ Connected to Claude Desktop
- ✅ Understanding of MCP core concepts

---

## 📚 Step 1: Read MCP Documentation (15 minutes)

### What to Read
1. Open `docs/best-practices.md` in your workspace
2. Read the "Understanding MCP" section
3. Focus on the three core concepts:
   - **Tools**: Functions Claude can call
   - **Resources**: Data Claude can read  
   - **Prompts**: Templates for specific tasks

### Quick Quiz (Test Yourself)
Before moving on, answer these:
- What's the difference between a tool and a resource?
- Why do tools need input validation?
- What transport method are we using? (Hint: stdio)

---

## 🔧 Step 2: Create Your First Tool (30 minutes)

### Exercise: Build a "Greeting" Tool

**Goal**: Create a tool that takes a name and returns a personalized greeting.

### Step 2A: Add the Tool Schema
1. Open `src/index.ts`
2. Find the existing tools section (around line 30)
3. Add this tool definition after the existing tools:

```typescript
// Add this after the text-utils tool
{
  name: 'greeting',
  description: 'Create personalized greetings',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the person to greet'
      },
      style: {
        type: 'string',
        enum: ['formal', 'casual', 'enthusiastic'],
        description: 'Style of greeting'
      }
    },
    required: ['name']
  }
}
```

### Step 2B: Add the Tool Handler
1. Find the tool handling section (around line 80)
2. Add this case to the switch statement:

```typescript
case 'greeting':
  const greetingArgs = args as { name: string; style?: string };
  const style = greetingArgs.style || 'casual';
  
  let greeting;
  switch (style) {
    case 'formal':
      greeting = `Good day, ${greetingArgs.name}. I hope you're having a pleasant experience.`;
      break;
    case 'enthusiastic':
      greeting = `HEY THERE ${greetingArgs.name.toUpperCase()}! 🎉 You're AWESOME!`;
      break;
    default: // casual
      greeting = `Hey ${greetingArgs.name}! Nice to meet you! 👋`;
  }
  
  return {
    content: [{
      type: 'text',
      text: greeting
    }]
  };
```

### Step 2C: Test Your Tool
1. Build your changes:
   ```bash
   npm run build
   ```

2. Test with the interactive test:
   ```bash
   node interactive-test.js
   ```

3. **Verify**: You should see "greeting" in the list of available tools!

---

## 🖥️ Step 3: Connect to Claude Desktop (20 minutes)

### Step 3A: Find Your Config File
**Windows**: Press `Win + R`, type `%APPDATA%\Claude`, press Enter
**macOS**: `~/Library/Application Support/Claude`

### Step 3B: Edit Configuration
1. Open or create `claude_desktop_config.json`
2. Add this exact content (update the path to match your location):

```json
{
  "mcpServers": {
    "mcp-learning-server": {
      "command": "node",
      "args": ["D:\\OneDrive\\OneDrive - Microsoft\\Documents\\Learning Projects\\MCP\\build\\index.js"]
    }
  }
}
```

**⚠️ Important**: 
- Use YOUR actual folder path
- Use double backslashes (`\\`) on Windows
- Check that `build/index.js` exists in your folder

### Step 3C: Restart and Test
1. **Completely close** Claude Desktop
2. Start Claude Desktop again
3. Look for the 🔧 tools icon in the interface
4. Try this prompt: "Use the greeting tool to say hello to Alice in an enthusiastic style"

---

## ✅ Step 4: Verify Everything Works (10 minutes)

### Checklist
- [ ] Greeting tool appears in Claude Desktop
- [ ] Can call the tool with different names and styles
- [ ] Interactive test shows 3 tools (calculate, text-utils, greeting)
- [ ] No error messages in console

### Test Commands in Claude Desktop
Try each of these:
1. "Greet me formally as John"
2. "Use the greeting tool for Sarah with casual style"
3. "Give an enthusiastic greeting to Mike"

---

## 🎓 Day 1 Wrap-Up

### What You Learned Today
- ✅ **Tool Structure**: Schema definition + handler function
- ✅ **Input Validation**: Required fields and enums
- ✅ **Claude Integration**: Configuration and testing
- ✅ **Development Workflow**: Edit → Build → Test

### Common Issues & Solutions

**Problem**: "Tool not showing in Claude"
**Solution**: 
1. Check config file path is correct
2. Restart Claude completely
3. Verify `npm run build` succeeded

**Problem**: "Error when calling tool"
**Solution**:
1. Check console for error messages
2. Verify all required fields are provided
3. Test with `interactive-test.js` first

### Tomorrow's Preview
Day 2: You'll create 3 more tools and learn advanced input validation patterns!

---

## 🎯 Bonus Challenge (Optional)

If you finish early, try adding:
1. **Time-aware greeting**: Different greetings for morning/afternoon/evening
2. **Language option**: Support for different languages
3. **Mood detection**: Analyze the name length to suggest mood 😄

**Hint**: You'll need to modify both the schema and the handler function!

---

*Need help? Check the error logs or look at the working examples in the `examples/` folder.*
