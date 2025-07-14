# 🚀 Quick Start Guide: MCP & Copilot Studio Learning

Get up and running with your MCP learning environment in 5 minutes!

## ⚡ Immediate Setup

### 1. Verify Your Environment
```bash
# Check Node.js version (should be 16+)
node --version

# Check npm version  
npm --version

# Verify TypeScript compilation works
npm run build
```

### 2. Test the Basic Server
There are several ways to test your MCP server:

#### Option A: Basic Startup Test
```bash
# Start the MCP server
npm start

# You should see:
# mcp-learning-server v1.0.0 running on stdio
# Available capabilities:
# - Tools: calculate, text-utils
# - Resources: learning-guide://mcp-basics
# - Prompts: code-review
```

#### Option B: Automated Test Suite
```bash
# Run the automated test suite
npm test

# This will test all tools, resources, and prompts automatically
```

#### Option C: Manual Testing with Claude Desktop
1. Configure Claude Desktop (see section below)
2. Try these commands in Claude:
   - "Calculate 15 plus 27"
   - "Convert 'hello world' to uppercase"

### 3. Verify Server Health
If the server starts successfully, you should see:
- ✅ Server version and startup message
- ✅ List of available capabilities
- ✅ No error messages in the console

## 🎯 Your First 30 Minutes

### Minute 0-10: Explore the Code
1. Open `src/index.ts` 
2. Find the calculator tool implementation
3. Understand the structure: input schema → processing → output

### Minute 10-20: Make Your First Change
1. Add a new operation to the calculator (e.g., "power")
2. Build and test: `npm run build && npm start`
3. Verify it works

### Minute 20-30: Create Your First Tool
1. Copy the calculator tool pattern
2. Create a simple "greeting" tool that takes a name and returns "Hello, {name}!"
3. Test your new tool

## 🔧 Connect to Claude Desktop

### Windows Setup
1. Open: `%APPDATA%\Claude\claude_desktop_config.json`
2. Add your server:
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
3. Restart Claude Desktop
4. Look for the tools icon 🔧 in the interface

### Test in Claude Desktop
Try these prompts:
- "Calculate 15 plus 27"
- "Convert 'Hello World' to uppercase"
- "Show me the MCP learning guide"

## 📋 Common Issues & Solutions

### ❌ Server Won't Start
**Error**: `Cannot find module 'build/index.js'`
**Solution**: Run `npm run build` first

### ❌ Claude Desktop Can't Find Server
**Error**: Server not appearing in Claude
**Solution**: 
1. Check the absolute path in config
2. Restart Claude Desktop completely
3. Verify no JSON syntax errors

### ❌ TypeScript Compilation Errors
**Error**: Various TS errors
**Solution**: 
1. Check `tsconfig.json` syntax
2. Verify all imports use `.js` extensions
3. Run `npm install` to ensure dependencies

## 🎓 Learning Path (First Week)

> 💡 **Pro Tip**: Each day has detailed step-by-step instructions in the `exercises/` folder!

### Day 1: Basics
- [ ] **Complete tool creation exercise** → See `exercises/day-1-basics.md`
- [ ] **Test with Claude Desktop** → Follow setup guide below
- [ ] **Read MCP documentation** → Start with `docs/best-practices.md`

### Day 2: Tools Deep Dive  
- [ ] **Create 3 custom tools** → Detailed guide in `exercises/day-2-tools.md`
- [ ] **Add input validation** → Learn Zod patterns
- [ ] **Implement error handling** → Try/catch best practices

### Day 3: Resources
- [ ] **Create a dynamic resource** → Step-by-step in `exercises/day-3-resources.md`
- [ ] **Add static documentation resources** → File-based resources
- [ ] **Test resource access** → Claude Desktop testing

### Day 4: Prompts
- [ ] **Create context-aware prompts** → Guide in `exercises/day-4-prompts.md`
- [ ] **Test prompt generation** → Interactive testing
- [ ] **Experiment with different formats** → Template patterns

### Day 5: Integration
- [ ] **Connect to external API** → Real API examples in `exercises/day-5-integration.md`
- [ ] **Add environment configuration** → .env setup
- [ ] **Implement caching** → Memory and file caching

### Day 6: Best Practices
- [ ] **Add comprehensive logging** → Production logging in `exercises/day-6-best-practices.md`
- [ ] **Implement rate limiting** → Prevent abuse
- [ ] **Write unit tests** → Jest testing setup

### Day 7: Advanced Features
- [ ] **Create a complex workflow tool** → Multi-step tools in `exercises/day-7-advanced.md`
- [ ] **Add performance monitoring** → Metrics and health checks
- [ ] **Deploy and test** → Production deployment

### 🚀 Quick Start Each Day
Each morning, run:
```bash
# 1. Open the day's exercise file
code exercises/day-X-[topic].md

# 2. Make sure your server is ready
npm run build && npm test

# 3. Follow the step-by-step instructions!
```

## 📚 Key Files to Know

| File | Purpose | When to Edit |
|------|---------|--------------|
| `src/index.ts` | Main server code | Adding tools/resources/prompts |
| `package.json` | Project config | Adding dependencies |
| `tsconfig.json` | TypeScript config | Compilation issues |
| `.vscode/mcp.json` | VS Code MCP config | Testing in VS Code |
| `README.md` | Project documentation | Documenting changes |

## 🔗 Quick Reference Links

### Essential Documentation
- [MCP Specification](https://modelcontextprotocol.io/)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop Setup](https://claude.ai/docs)

### Code Examples
- `examples/weather-server.md` - API integration example
- `exercises/learning-exercises.md` - Hands-on exercises
- `docs/best-practices.md` - Production guidelines

### Help & Support
- Check `docs/` folder for detailed guides
- Look at working examples in `examples/`
- Review error logs in Claude Desktop

## 🎯 Next Steps

Once you're comfortable with the basics:

1. **Try the Learning Exercises**: Start with Exercise 1 in `exercises/learning-exercises.md`
2. **Build Something Real**: Create a tool for your actual workflow
3. **Explore Copilot Studio**: Check out `docs/copilot-studio-integration.md`
4. **Join the Community**: Participate in MCP discussions and share your learnings

## 💡 Pro Tips

- **Start Small**: Begin with simple tools and gradually add complexity
- **Test Often**: Build and test after each change
- **Read Logs**: Check Claude Desktop logs when things don't work
- **Experiment**: Try different tool patterns and approaches
- **Document**: Keep notes on what works and what doesn't

## 🎉 You're Ready!

Your learning environment is set up and ready to go. The journey to mastering MCP and Copilot Studio starts with understanding these fundamentals and then building progressively more complex integrations.

**Remember**: The best way to learn is by doing. Start building tools that solve real problems you face in your daily work!

Happy learning! 🚀
