# Day 3: MCP Resources

**Learn to create and manage MCP resources - file-like data that Claude can read and process!**

## 🎯 Today's Learning Goals

By the end of Day 3, you'll understand:
- ✅ What MCP resources are and how they work
- ✅ How to create both static and dynamic resources
- ✅ Resource listing and content reading
- ✅ Best practices for resource organization
- ✅ How Claude Desktop interacts with resources

## 📖 What Are MCP Resources?

Think of resources as **file-like data** that Claude can read (but not modify). Unlike tools that perform actions, resources provide information:

- **📄 Documentation**: Help guides, API docs, project information
- **⚙️ Configuration**: Settings, preferences, environment data  
- **📊 Data**: Reports, analytics, status information
- **📚 Content**: Templates, examples, reference materials

## 🏗️ Resource Architecture

```
Resource URI: "scheme://identifier"
     ↓
Resource Content: JSON, Markdown, Plain Text, etc.
     ↓  
Claude reads and processes the content
```

**Examples:**
- `project://info` → Project details as JSON
- `docs://getting-started` → Markdown guide
- `config://user-settings` → User preferences as JSON

## 🚀 Getting Started

### Step 1: Set Up Your Day 3 Environment

```powershell
# Copy the Day 3 starter template to your working file
Copy-Item days/day-3/index-starter.ts src/index.ts

# Build the project
npm run build

# Test the basic server (should start without errors)
npm start
# Press Ctrl+C to stop
```

### Step 2: Understanding the Starter Template

Open `src/index.ts` and examine the structure:

```typescript
// 1. Server setup with resources capability
const server = new Server(
  { name: 'mcp-learning-server', version: '1.0.0' },
  { capabilities: { resources: {}, tools: {} } }
);

// 2. TODO sections for your resources
// TODO: Add your resources here!
// TODO: Add your resource handler here!
// TODO: Add your read resource handler here!
```

**Key Points:**
- ✅ `capabilities: { resources: {} }` enables resource functionality
- ✅ Two main handlers: `ListResourcesRequestSchema` and `ReadResourceRequestSchema`
- ✅ Resources use URI schemes like `project://`, `config://`, `docs://`

## 📝 Step-by-Step Implementation

### Step 2A: Create Your First Resource (Project Info)

Replace the first TODO comment with this code:

```typescript
// Resource 1: Project Documentation Resource
// This will be a dynamic resource that provides project information
const projectInfo = {
  name: "MCP Learning Project",
  version: "1.0.0",
  description: "A comprehensive learning project for Model Context Protocol development",
  currentDay: 3,
  topic: "Resources",
  features: [
    "Step-by-step learning exercises",
    "Day-by-day progression", 
    "Hands-on tool building",
    "Resource management",
    "Claude Desktop integration"
  ],
  lastUpdated: new Date().toISOString()
};
```

### Step 2B: Add the Resource List Handler

Replace the second TODO with this handler:

```typescript
// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "project://info",
        name: "Project Information", 
        description: "General information about the MCP learning project",
        mimeType: "application/json"
      },
      {
        uri: "docs://getting-started",
        name: "Getting Started Guide",
        description: "Comprehensive guide to get started with MCP development", 
        mimeType: "text/markdown"
      }
    ],
  };
});
```

**Understanding the Code:**
- ✅ `uri`: Unique identifier for the resource
- ✅ `name`: Human-readable name displayed in Claude
- ✅ `description`: Explains what the resource contains
- ✅ `mimeType`: Content type (JSON, Markdown, plain text, etc.)

### Step 2C: Add the Resource Reader Handler

Replace the third TODO with this handler:

```typescript
// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  switch (uri) {
    case "project://info":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(projectInfo, null, 2)
          }
        ]
      };
    
    case "docs://getting-started":
      const gettingStartedGuide = `# MCP Getting Started Guide

## What is Model Context Protocol (MCP)?

MCP is a protocol that allows AI assistants like Claude to securely access external tools and data sources.

## Key Concepts

### Tools 🔧
Functions that AI can call to perform actions.

### Resources 📁  
File-like data that AI can read (you're learning this now!).

### Prompts 🧠
Pre-written templates for specific tasks.

## Your Progress So Far

- ✅ Day 1: Built your first greeting tool
- ✅ Day 2: Created advanced tools with validation
- 🔄 Day 3: Learning resources (current)

Keep up the great work! 🚀`;
      
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: gettingStartedGuide
          }
        ]
      };
    
    default:
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Resource not found: ${uri}`
      );
  }
});
```

**Understanding the Handler:**
- ✅ Receives a `uri` parameter specifying which resource to read
- ✅ Returns content with `uri`, `mimeType`, and `text` fields
- ✅ Handles different resource types with different content formats
- ✅ Throws proper errors for unknown resources

### Step 3: Build and Test Your Resources

```powershell
# Build your changes
npm run build

# Start the server
npm start
```

You should see "MCP Server running on stdio" without any errors.

### Step 4: Test with Claude Desktop

1. **Ensure Claude Desktop is configured** (from Day 1)
2. **Restart Claude Desktop** to pick up your changes
3. **Test your resources** with these prompts:

**Test Prompts:**
```
"What resources are available?"

"Read the project information resource"

"Show me the getting started guide"

"What's in the project://info resource?"
```

**Expected Results:**
- ✅ Claude should list your two resources
- ✅ Project info should show as formatted JSON
- ✅ Getting started guide should display as formatted markdown
- ✅ You should see the 📁 resources icon in Claude Desktop

## 🎯 Understanding What You Built

### Resource Flow Diagram
```
Claude Desktop Request
     ↓
1. List Resources → Shows available resources in UI
     ↓
2. User selects a resource 
     ↓
3. Read Resource → Returns actual content
     ↓
4. Claude processes and displays content
```

### Your Resource Architecture
```
project://info
├── Contains: Dynamic project data
├── Format: JSON
└── Updates: Real-time information

docs://getting-started  
├── Contains: Static documentation
├── Format: Markdown
└── Purpose: User guidance
```
  const uptime = process.uptime();
  const memory = process.memoryUsage();
  const platform = process.platform;
  const nodeVersion = process.version;
  const currentTime = new Date().toISOString();
  
  const statusContent = `# System Status Report
Generated: ${currentTime}

## Server Information
- Platform: ${platform}
- Node.js Version: ${nodeVersion}
- Process ID: ${process.pid}
- Uptime: ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s

## Memory Usage
- RSS (Resident Set Size): ${(memory.rss / 1024 / 1024).toFixed(2)} MB
- Heap Total: ${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB
- Heap Used: ${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB
- External: ${(memory.external / 1024 / 1024).toFixed(2)} MB

## Server Status
- Status: ✅ Running
- Available Tools: ${(await server.listTools()).tools.length}
- Available Resources: ${(await server.listResources()).resources.length}
- Available Prompts: ${(await server.listPrompts()).prompts.length}
`;

  return {
    contents: [{
      type: 'text',
      text: statusContent
    }]
  };

case 'system://performance':
  const perfData = process.resourceUsage();
  const loadAvg = process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0];
  
  const performanceContent = `# Performance Metrics
Updated: ${new Date().toISOString()}

## CPU Usage
- User CPU Time: ${perfData.userCPUTime / 1000}ms
- System CPU Time: ${perfData.systemCPUTime / 1000}ms
- Load Average: ${loadAvg.map(l => l.toFixed(2)).join(', ')} (1min, 5min, 15min)

## Memory Details
- Max RSS: ${(perfData.maxRSS / 1024).toFixed(2)} KB
- Shared Memory: ${(perfData.sharedMemorySize / 1024).toFixed(2)} KB
- Integral Shared Memory: ${(perfData.integralSharedMemorySize / 1024).toFixed(2)} KB

## I/O Statistics
- Filesystem Reads: ${perfData.fsRead}
- Filesystem Writes: ${perfData.fsWrite}
- Block Input Operations: ${perfData.blockInputOperations}
- Block Output Operations: ${perfData.blockOutputOperations}

## Context Switches
- Voluntary: ${perfData.voluntaryContextSwitches}
- Involuntary: ${perfData.involuntaryContextSwitches}
`;

  return {
    contents: [{
      type: 'text',
      text: performanceContent
    }]
  };
```

---

## 📖 Resource 2: API Documentation (Static) (25 minutes)

Create comprehensive documentation that Claude can reference.

### Step 2A: Add Documentation Resources
Add to your resources list:

```typescript
{
  uri: 'docs://api-reference',
  name: 'API Reference',
  description: 'Complete API documentation for all available tools',
  mimeType: 'text/markdown'
},
{
  uri: 'docs://examples',
  name: 'Usage Examples',
  description: 'Practical examples for each tool',
  mimeType: 'text/markdown'
}
```

### Step 2B: Create Documentation Content
Add these cases to your resource handler:

```typescript
case 'docs://api-reference':
  const apiDocs = `# MCP Server API Reference

## Available Tools

### 1. calculate
**Purpose**: Perform arithmetic calculations
**Parameters**:
- \`operation\` (required): 'add', 'subtract', 'multiply', 'divide', 'power', 'sqrt'
- \`a\` (required): First number
- \`b\` (optional): Second number (not needed for sqrt)

**Examples**:
\`\`\`json
{"operation": "add", "a": 5, "b": 3}
{"operation": "sqrt", "a": 16}
\`\`\`

### 2. text-utils
**Purpose**: Text manipulation operations
**Parameters**:
- \`operation\` (required): 'uppercase', 'lowercase', 'reverse', 'length', 'words'
- \`text\` (required): Text to process

**Examples**:
\`\`\`json
{"operation": "uppercase", "text": "hello world"}
{"operation": "words", "text": "count these words"}
\`\`\`

### 3. greeting
**Purpose**: Generate personalized greetings
**Parameters**:
- \`name\` (required): Person's name
- \`style\` (optional): 'formal', 'casual', 'enthusiastic'

### 4. file-analyzer
**Purpose**: Analyze text content
**Parameters**:
- \`content\` (required): Text to analyze
- \`analysis_type\` (optional): 'basic', 'detailed', 'readability'

### 5. data-processor
**Purpose**: Process number arrays
**Parameters**:
- \`numbers\` (required): Array of numbers
- \`operation\` (required): 'stats', 'sort', 'filter', 'transform'
- \`options\` (optional): Operation-specific options

### 6. url-utils
**Purpose**: URL parsing and manipulation
**Parameters**:
- \`url\` (required): URL to process
- \`operation\` (required): 'parse', 'validate', 'extract', 'build'
- \`build_params\` (optional): For build operation

## Error Handling
All tools return meaningful error messages for:
- Invalid input parameters
- Missing required fields
- Data processing errors
- Validation failures
`;

  return {
    contents: [{
      type: 'text',
      text: apiDocs
    }]
  };

case 'docs://examples':
  const examples = `# Practical Usage Examples

## Calculator Examples

### Basic Math
- "Calculate 15 plus 27"
- "What's 8 times 9?"
- "Find the square root of 144"

### Complex Calculations
- "Raise 2 to the power of 8"
- "Divide 100 by 3"

## Text Processing Examples

### String Manipulation
- "Convert 'Hello World' to uppercase"
- "Reverse this text: 'MCP is awesome'"
- "Count words in 'The quick brown fox'"

## File Analysis Examples

### Content Analysis
- "Analyze this article for readability: [paste text]"
- "Get detailed metrics for: [paste content]"
- "Check reading level of: [paste text]"

## Data Processing Examples

### Statistical Analysis
- "Calculate statistics for: [1, 2, 3, 4, 5]"
- "Sort these numbers descending: [9, 1, 5, 3, 7]"
- "Filter positive numbers from: [-2, 1, -3, 4, -5]"

### Data Transformation
- "Square these numbers: [2, 3, 4, 5]"
- "Get absolute values of: [-1, -2, 3, -4]"

## URL Processing Examples

### URL Analysis
- "Parse this URL: https://example.com/path?q=test"
- "Validate: https://invalid..url"
- "Extract components from: https://api.example.com/v1/users?page=1&limit=10"

## Greeting Examples

### Different Styles
- "Greet Alice formally"
- "Give an enthusiastic hello to Bob"
- "Casual greeting for Charlie"

## Combining Tools

### Workflow Examples
1. **Text Analysis Pipeline**:
   - First: "Analyze this text: [content]"
   - Then: "Count words in the same text"
   - Finally: "Convert to uppercase"

2. **Data Processing Pipeline**:
   - First: "Calculate stats for: [1,2,3,4,5]"
   - Then: "Sort the same numbers"
   - Finally: "Transform by squaring"

## Best Practices

### Tool Selection
- Use \`calculate\` for math operations
- Use \`text-utils\` for string processing
- Use \`file-analyzer\` for content insights
- Use \`data-processor\` for number arrays
- Use \`url-utils\` for web addresses

### Parameter Tips
- Always specify required parameters
- Use optional parameters for customization
- Check examples for proper format
- Combine tools for complex workflows
`;

  return {
    contents: [{
      type: 'text',
      text: examples
    }]
  };
```

---

## 🏗️ Resource 3: Configuration & Settings (Parameterized) (20 minutes)

Create resources that can show different content based on parameters.

### Step 3A: Add Configuration Resources
```typescript
{
  uri: 'config://server',
  name: 'Server Configuration',
  description: 'Current server configuration and settings',
  mimeType: 'application/json'
},
{
  uri: 'config://tools',
  name: 'Tool Configuration',
  description: 'Configuration details for each tool',
  mimeType: 'text/markdown'
}
```

### Step 3B: Create Configuration Handlers
```typescript
case 'config://server':
  const serverConfig = {
    server: {
      name: 'mcp-learning-server',
      version: '1.0.0',
      transport: 'stdio',
      started: new Date().toISOString()
    },
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
      logging: false
    },
    tools: {
      count: 6,
      names: ['calculate', 'text-utils', 'greeting', 'file-analyzer', 'data-processor', 'url-utils']
    },
    resources: {
      count: 7,
      types: ['system', 'documentation', 'configuration']
    },
    prompts: {
      count: 1,
      names: ['code-review']
    }
  };

  return {
    contents: [{
      type: 'text',
      text: JSON.stringify(serverConfig, null, 2)
    }]
  };

case 'config://tools':
  const toolsConfig = `# Tool Configuration Details

## Tool Categories

### Mathematical Tools
- **calculate**: Basic arithmetic operations
  - Supported operations: add, subtract, multiply, divide, power, sqrt
  - Input validation: Numbers only
  - Error handling: Division by zero, invalid operations

### Text Processing Tools
- **text-utils**: String manipulation
  - Supported operations: uppercase, lowercase, reverse, length, words
  - Input validation: String required
  - Performance: Optimized for large text

- **file-analyzer**: Content analysis
  - Analysis types: basic, detailed, readability
  - Metrics: word count, reading time, complexity
  - Algorithms: Flesch Reading Ease formula

### Data Tools
- **data-processor**: Statistical operations
  - Operations: stats, sort, filter, transform
  - Input validation: Array of numbers required
  - Output formats: Formatted text with metrics

### Utility Tools
- **url-utils**: URL manipulation
  - Operations: parse, validate, extract, build
  - Standards compliance: RFC 3986
  - Error handling: Malformed URL detection

- **greeting**: Personalization
  - Styles: formal, casual, enthusiastic
  - Customization: Name-based personalization
  - Locale: English only (extensible)

## Performance Characteristics
- **Memory usage**: Low (<10MB per operation)
- **Response time**: <100ms for most operations
- **Concurrency**: Thread-safe operations
- **Rate limiting**: Not implemented (development server)

## Security Features
- Input validation using schemas
- Error message sanitization
- No file system access from tools
- Sandboxed execution environment
`;

  return {
    contents: [{
      type: 'text',
      text: toolsConfig
    }]
  };
```

---

## ✅ Step 4: Test All Resources (15 minutes)

### Build and Test
```bash
npm run build
node interactive-test.js
```

### Test in Claude Desktop
Try these commands:

1. **System Resources**: "Show me the system status"
2. **Documentation**: "What's in the API reference?"
3. **Examples**: "Show me usage examples for the tools"
4. **Configuration**: "What's the server configuration?"

### Verify Resource Access
In Claude, try:
- "Read the system performance metrics"
- "Show me the tool configuration details"
- "What examples are available for data processing?"

---

## 🎓 Day 3 Wrap-Up

### What You Learned Today
- ✅ **Dynamic Resources**: Content that changes with each request
- ✅ **Static Resources**: Fixed documentation and references
- ✅ **Resource Organization**: Logical URI schemes (system://, docs://, config://)
- ✅ **Different Formats**: Plain text, Markdown, JSON

### Resource Patterns You Mastered
- **System Monitoring**: Real-time data collection
- **Documentation**: Structured reference materials
- **Configuration**: Server and tool settings
- **Examples**: Practical usage guides

### Resource Best Practices
- Use descriptive URIs with schemes
- Provide appropriate MIME types
- Keep content well-formatted
- Update dynamic resources with current data
- Organize by logical categories

### Tomorrow's Preview
Day 4: Prompts! You'll create context-aware prompt templates that help Claude perform specific tasks.

---

## 🚀 Bonus Challenges (Optional Advanced Features)

Ready to take your resources to the next level? Try these challenges:

### Bonus Challenge 1: User Configuration Resource

Add a resource that manages user preferences:

```typescript
// Add this to your resource data
let userConfig = {
  theme: 'light',
  language: 'en', 
  difficulty: 'beginner',
  showHints: true
};

// Add to your resources list
{
  uri: "config://user-settings",
  name: "User Configuration",
  description: "User preferences and settings",
  mimeType: "application/json"
}

// Add to your switch statement
case "config://user-settings":
  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(userConfig, null, 2)
      }
    ]
  };
```

### Bonus Challenge 2: Learning Progress Tracker

Create a resource that tracks your learning journey:

```typescript
// Add progress tracking data
const learningProgress = {
  currentDay: 3,
  completedDays: [1, 2],
  totalDays: 7,
  skillsLearned: [
    "MCP server setup",
    "Basic tool creation",
    "Input validation", 
    "Resource management"
  ],
  timeSpent: 180, // minutes
  progressPercentage: Math.round((2/7) * 100)
};
```

### Bonus Challenge 3: Code Examples Library

Add a resource with reusable code examples:

```typescript
const codeExamples = {
  "basic-tool": `server.setRequestHandler(CallToolRequestSchema, async (request) => {
    // Tool implementation
  });`,
  "resource-handler": `server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    // Resource implementation  
  });`,
  "validation": `const schema = z.object({ name: z.string() });`
};
```

### Bonus Challenge 4: Resource Analytics

Track which resources are accessed most:

```typescript
let resourceAccessLog = [];

function logResourceAccess(uri) {
  resourceAccessLog.push({
    uri,
    timestamp: new Date(),
    userAgent: 'Claude Desktop'
  });
}

// Call in your read handler
logResourceAccess(uri);
```

### Bonus Challenge 5: Dynamic Content Generation

Create resources that generate content based on current state:

```typescript
// Dynamic status resource
case "status://server":
  const serverStatus = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    platform: process.platform,
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  };
  
  return {
    contents: [{
      uri,
      mimeType: "application/json", 
      text: JSON.stringify(serverStatus, null, 2)
    }]
  };
```

## 🔍 Testing Your Bonus Features

For each bonus challenge you implement:

1. **Add the resource** to your `ListResourcesRequestSchema` handler
2. **Add the URI case** to your `ReadResourceRequestSchema` handler  
3. **Build and test**: `npm run build && npm start`
4. **Test in Claude Desktop** with prompts like:
   - "Show me my user configuration"
   - "What's my learning progress?"
   - "Give me some code examples"
   - "Show resource analytics"

## ❗ Common Issues & Solutions

### ❌ "Resource not found" Error
**Problem**: URI mismatch between list and read handlers
**Solution**: Ensure exact URI matching in both handlers

### ❌ "Invalid JSON" in Claude Desktop  
**Problem**: Malformed JSON in resource content
**Solution**: Use `JSON.stringify()` for all JSON responses

### ❌ Resources not showing in Claude Desktop
**Problem**: Server not restarted or configuration issue
**Solution**: 
1. Stop server (Ctrl+C)
2. Build: `npm run build`
3. Restart: `npm start`
4. Restart Claude Desktop

### ❌ Empty resource content
**Problem**: Resource handler not returning content properly
**Solution**: Verify the `contents` array structure:
```typescript
return {
  contents: [
    {
      uri: request.params.uri,
      mimeType: "application/json",
      text: "your content here"
    }
  ]
};
```

## 🎉 Day 3 Complete!

**Congratulations!** You've successfully learned MCP resources! Here's what you accomplished:

### ✅ Skills Mastered Today:
- **Resource Architecture**: Understanding URI schemes and content types
- **Dynamic Resources**: Creating resources with real-time data
- **Static Resources**: Providing documentation and guides
- **Resource Handlers**: Implementing list and read functionality
- **Content Formats**: Working with JSON, Markdown, and plain text
- **Error Handling**: Proper resource error management

### 🎯 Key Concepts Learned:
- **Resources vs Tools**: Resources provide data, tools perform actions
- **URI Schemes**: Custom schemes like `project://`, `config://`, `docs://`
- **Content Types**: JSON for data, Markdown for documentation
- **Claude Integration**: How Claude Desktop displays and uses resources

### 🚀 Ready for Day 4?
Tomorrow you'll learn about **MCP Prompts** - pre-written templates that make Claude more effective at specific tasks!

**Next Steps:**
1. ✅ Experiment with the bonus challenges
2. ✅ Try creating your own custom resources  
3. ✅ Think about what kind of prompts might be useful
4. ✅ Get ready for Day 4: Smart Prompts!

## 💡 Pro Tips for Resources

- **📁 Organize by purpose**: Use clear URI schemes (`docs://`, `config://`, `data://`)
- **📊 Keep data fresh**: Update dynamic resources with current information
- **📝 Document everything**: Include clear descriptions for each resource
- **🔧 Test frequently**: Verify resources work in Claude Desktop
- **📈 Monitor usage**: Track which resources are most valuable

**Great job today!** You're building a solid foundation in MCP development. Resources are a powerful way to give Claude access to the information it needs to help you more effectively! 🎉
