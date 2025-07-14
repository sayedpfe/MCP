# Day 3: Resources Mastery - Step by Step

Today you'll learn to create both static and dynamic resources that Claude can read and reference during conversations.

## 🎯 Today's Goals
- ✅ Create dynamic resources that change based on current data
- ✅ Add static documentation resources
- ✅ Test resource access patterns in Claude Desktop

---

## 📚 Understanding Resources

**Resources** are like files that Claude can read during conversations. Unlike tools (which DO things), resources PROVIDE information.

### Resource Types We'll Build:
1. **Static Resources**: Fixed documentation or reference materials
2. **Dynamic Resources**: Content that changes (current time, system status, etc.)
3. **Parameterized Resources**: Resources that accept parameters

---

## 🔧 Resource 1: System Status (Dynamic) (30 minutes)

Let's create a resource that shows current system information.

### Step 1A: Add to Resources List
Find the `listResources` handler in `src/index.ts` and add:

```typescript
// Add this to your existing resources array
{
  uri: 'system://status',
  name: 'System Status',
  description: 'Current system information and server status',
  mimeType: 'text/plain'
},
{
  uri: 'system://performance',
  name: 'Performance Metrics',
  description: 'Real-time performance metrics',
  mimeType: 'text/plain'
}
```

### Step 1B: Create the Resource Handler
Find the `readResource` handler and add these cases:

```typescript
case 'system://status':
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

## 🎯 Bonus Challenges (Optional)

1. **Log Resource**: Create a resource that shows recent server activity
2. **Help System**: Build an interactive help resource
3. **Metrics Dashboard**: Create a real-time metrics resource
4. **File Browser**: Resource to explore the project structure

*Remember: Resources should provide valuable information that enhances Claude's ability to help users!*
