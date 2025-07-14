# Day 3: MCP Resources Overview

**Learn to create and manage MCP resources - file-like data that Claude can read and process!**

## 🎯 What You'll Learn Today

Resources are a fundamental part of MCP that allow AI assistants to access information without performing actions. Think of them as "files" that Claude can read.

### Key Concepts:
- **📄 Static Resources**: Documentation, guides, reference materials
- **📊 Dynamic Resources**: Real-time data, configuration, status information  
- **🔗 URI Schemes**: Custom addressing like `project://`, `config://`, `docs://`
- **📝 Content Types**: JSON data, Markdown docs, plain text

## 🏗️ What You'll Build

### Core Resources (Required):
1. **Project Information Resource** (`project://info`)
   - Dynamic project metadata
   - Current learning status
   - Feature list and progress

2. **Getting Started Documentation** (`docs://getting-started`)
   - Comprehensive MCP guide
   - Learning journey overview
   - Next steps and resources

### Bonus Resources (Optional):
- **User Configuration** (`config://user-settings`) - Personalized settings
- **Learning Progress Tracker** (`progress://learning-status`) - Journey tracking
- **Code Examples Library** (`examples://code-library`) - Reusable patterns
- **Resource Analytics** (`analytics://resource-usage`) - Usage insights

## 🚀 Getting Started

1. **Copy the starter file**: `Copy-Item days/day-3/index-starter.ts src/index.ts`
2. **Follow the exercise**: Open `exercises/day-3-resources.md` for detailed steps
3. **Build and test**: `npm run build && npm start`
4. **Test in Claude Desktop**: Try the resource prompts

## 📚 Learning Flow

```
Day 3 Learning Path:
├── 1. Understanding Resources (15 min)
├── 2. Implementing List Handler (20 min)
├── 3. Creating Read Handler (25 min)
├── 4. Testing in Claude Desktop (15 min)
└── 5. Bonus Challenges (Optional)
```

## 🎯 Success Criteria

By the end of Day 3, you should be able to:
- ✅ Create both static and dynamic resources
- ✅ Implement proper resource handlers
- ✅ Test resources in Claude Desktop
- ✅ Understand resource URI schemes
- ✅ Handle different content types (JSON, Markdown)

## 📁 Files for Today

| File | Purpose |
|------|---------|
| `days/day-3/index-starter.ts` | Starting template with TODOs |
| `days/day-3/index-complete.ts` | Complete implementation with bonus features |
| `exercises/day-3-resources.md` | Detailed step-by-step guide |

## 🔗 What's Next?

After completing Day 3, you'll be ready for:
- **Day 4: Smart Prompts** - Pre-written templates for specific tasks
- **Day 5: API Integration** - Connecting to external data sources
- **Day 6: Best Practices** - Production-ready patterns

## 💡 Pro Tips

- **Start simple**: Begin with the basic project info resource
- **Test frequently**: Build and test after each step
- **Experiment with URIs**: Try different scheme patterns
- **Read the complete file**: Reference `index-complete.ts` when stuck

**Ready to dive in?** Open `exercises/day-3-resources.md` and start building! 🚀
