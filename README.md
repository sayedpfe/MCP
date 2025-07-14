# MCP & Copilot Studio Learning Project

Welcome to your comprehensive learning journey with **Model Context Protocol (MCP)** and **Copilot Studio**! 🚀

## 🎯 Project Overview

This project provides hands-on experience with:
- **MCP Server Development** using TypeScript and the official SDK
- **Integration with Claude Desktop** and other MCP clients
- **Tool, Resource, and Prompt** implementation patterns
- **Best practices** for MCP development

## 🏗️ Project Structure

```
MCP/
├── .github/
│   └── copilot-instructions.md    # Custom Copilot instructions
├── .vscode/
│   ├── mcp.json                   # MCP configuration for VS Code
│   └── tasks.json                 # Build and development tasks
├── src/
│   └── index.ts                   # Main MCP server implementation
├── build/                         # Compiled JavaScript output
├── docs/                          # Learning documentation
├── examples/                      # Example implementations
├── package.json                   # Project configuration
└── tsconfig.json                  # TypeScript configuration
```

## 🛠️ Available Tools

### 1. Calculator Tool
Perform basic arithmetic operations:
- Addition, subtraction, multiplication, division
- Type-safe input validation with Zod
- Error handling for edge cases (e.g., division by zero)

### 2. Text Utilities Tool
Text manipulation operations:
- Convert to uppercase/lowercase
- Reverse text
- Count characters and words

## 📚 Available Resources

### Learning Guide
Access comprehensive MCP documentation at `learning-guide://mcp-basics`
- Core concepts explanation
- Getting started guide
- Best practices and patterns

## 📝 Available Prompts

### Code Review Template
Generate structured code reviews with:
- Code quality assessment
- Performance considerations
- Security analysis
- Testing recommendations

## 🚀 Getting Started

### 1. Build the Project
```bash
npm run build
```

### 2. Run the Server
```bash
npm start
```

### 3. Development Mode
```bash
npm run dev        # Build and run
npm run watch      # Watch mode for development
```

### 4. Connect to Claude Desktop

1. Open Claude Desktop configuration file:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add this server configuration:
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

4. Look for the tools icon 🔧 in Claude Desktop interface

## 🎓 Learning Path

### Phase 1: Understanding MCP Basics
- [x] Set up development environment
- [x] Create basic MCP server
- [x] Implement simple tools
- [ ] Test with Claude Desktop
- [ ] Explore resource patterns

### Phase 2: Advanced Features
- [ ] Add complex tools with external APIs
- [ ] Implement resource templates
- [ ] Create dynamic prompts
- [ ] Error handling and validation

### Phase 3: Copilot Studio Integration
- [ ] Understanding Copilot Studio architecture
- [ ] Building custom connectors
- [ ] Creating conversation flows
- [ ] Publishing and sharing

### Phase 4: Real-world Applications
- [ ] Build a weather service MCP server
- [ ] Create a file management tool
- [ ] Implement database integration
- [ ] Deploy to production

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the compiled server |
| `npm run dev` | Build and run in one command |
| `npm run watch` | Watch for changes and rebuild |
| `npm run clean` | Clean build directory |

## 📖 Learning Resources

### Official Documentation
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [TypeScript SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop Integration Guide](https://claude.ai/docs)

### Examples and Tutorials
- [Weather Server Example](https://github.com/modelcontextprotocol/quickstart-resources)
- [Building MCP with LLMs](https://modelcontextprotocol.io/tutorials/building-mcp-with-llms)
- [Debugging MCP Servers](https://modelcontextprotocol.io/docs/tools/debugging)

### Community Resources
- [MCP GitHub Discussions](https://github.com/modelcontextprotocol/specification/discussions)
- [Example Servers Gallery](https://modelcontextprotocol.io/examples)

## 🐛 Debugging

### Check Server Status
```bash
# Test if server starts correctly
npm start

# Check for TypeScript errors
npx tsc --noEmit
```

### Claude Desktop Logs
- **Windows**: `%LOCALAPPDATA%\Claude\logs`
- **macOS**: `~/Library/Logs/Claude`

Look for `mcp.log` and `mcp-server-mcp-learning-server.log`

### Common Issues
1. **Server not showing in Claude**: Check configuration file path and syntax
2. **Tools not working**: Verify server builds without errors
3. **Permission issues**: Ensure Node.js has execution permissions

## 🎯 Next Steps

1. **Test Your Server**: Connect to Claude Desktop and try the tools
2. **Explore Examples**: Check out the `examples/` directory for more implementations
3. **Build Your Own**: Create custom tools for your specific use cases
4. **Share & Learn**: Contribute back to the MCP community

## 🤝 Contributing

This is a learning project! Feel free to:
- Add new example tools and resources
- Improve documentation
- Share interesting use cases
- Report issues and bugs

## 📄 License

MIT License - Feel free to use this project as a foundation for your own MCP learning journey!

---

**Happy Learning!** 🎉

Ready to dive deeper into MCP and Copilot Studio? Start by testing the basic tools, then move on to building more complex integrations!
