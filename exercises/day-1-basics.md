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

### Step 2A: Start with a Completely Clean Slate
1. **Copy the Day 1 starter file to create your working file**:
   ```bash
   cp days/day-1/index-starter.ts src/index.ts
   ```
   
2. **Verify your src folder now has the starter file**:
   ```bash
   ls src/
   # Should show: index.ts
   ```
   
3. **Open your new working file**:
   ```bash
   code src/index.ts
   ```
   
4. **You should see a clean, minimal server with**:
   - Basic imports
   - Server configuration  
   - Empty server instance
   - TODO comment where you'll add your tool
   - No existing tools or complexity!

### Step 2B: Add Your First Tool
1. Find the comment `// TODO: Add your first tool here (Day 1 exercise)`
2. Replace it with this complete tool:

```typescript
// Your first tool: Greeting
server.tool(
  "greeting",
  "Create personalized greetings",
  {
    name: z.string().describe("Name of the person to greet"),
    style: z.enum(["formal", "casual", "enthusiastic"]).optional().describe("Style of greeting"),
  },
  async ({ name, style = "casual" }) => {
    let greeting;
    
    switch (style) {
      case "formal":
        greeting = `Good day, ${name}. I hope you're having a pleasant experience.`;
        break;
      case "enthusiastic":
        greeting = `HEY THERE ${name.toUpperCase()}! 🎉 You're AWESOME!`;
        break;
      default: // casual
        greeting = `Hey ${name}! Nice to meet you! 👋`;
    }
    
    return {
      content: [{
        type: "text",
        text: greeting
      }]
    };
  }
);
```

### Step 2C: Update the Server Capabilities Log
1. Find this line in the `main()` function:
   ```typescript
   console.error("- Tools: (none yet - add your first tool!)");
   ```
2. Replace it with:
   ```typescript
   console.error("- Tools: greeting");
   ```

### Step 2D: Test Your Tool
1. **Build your TypeScript code** (converts `.ts` to `.js` and creates build folder):
   ```bash
   npm run build
   ```
   You should see the TypeScript compiler create a `build/` folder with `index.js`.

2. **Test that the server starts**:
   ```bash
   npm start
   ```
   You should see:
   ```
   mcp-learning-server v1.0.0 running on stdio
   Available capabilities:
   - Tools: greeting
   - Resources: (none yet)
   - Prompts: (none yet)
   ```

3. **Stop the server** (Ctrl+C) and test with the interactive test:
   ```bash
   node interactive-test.js
   ```

4. **Verify**: You should see "greeting" in the list of available tools!

### 💡 Understanding TypeScript → JavaScript
- **You edit**: `src/index.ts` (TypeScript - human readable)
- **npm run build creates**: `build/index.js` (JavaScript - Node.js runs this)
- **Never edit**: `.js` files directly (they get overwritten!)
- **First build**: Creates the `build/` folder automatically

### 🆘 If You Get Stuck
Compare your code with the complete version:
```bash
code days/day-1/index-complete.ts
```

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
- [ ] Interactive test shows 1 tool (greeting)
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
