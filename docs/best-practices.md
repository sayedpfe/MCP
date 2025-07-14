# MCP Best Practices and Patterns

This document outlines best practices for developing MCP servers and integrating them effectively.

## 🏗️ Server Architecture

### 1. Modular Design
Organize your MCP server into logical modules:

```typescript
// tools/calculator.ts
export const calculatorTool = server.tool(
  "calculate",
  "Perform arithmetic operations",
  { /* schema */ },
  async ({ operation, a, b }) => { /* implementation */ }
);

// tools/text.ts
export const textUtilsTool = server.tool(
  "text-utils",
  "Text manipulation utilities",
  { /* schema */ },
  async ({ operation, text }) => { /* implementation */ }
);

// index.ts
import { calculatorTool } from './tools/calculator.js';
import { textUtilsTool } from './tools/text.js';
```

### 2. Error Handling Strategy
Implement comprehensive error handling:

```typescript
server.tool(
  "example-tool",
  "Example with proper error handling",
  { input: z.string() },
  async ({ input }) => {
    try {
      // Validate input
      if (!input || input.trim().length === 0) {
        throw new Error("Input cannot be empty");
      }
      
      // Process input
      const result = await processInput(input);
      
      return {
        content: [{ type: "text", text: result }]
      };
    } catch (error) {
      // Log error for debugging
      console.error(`Tool execution failed: ${error.message}`);
      
      // Return user-friendly error
      return {
        content: [{
          type: "text",
          text: `Error: ${error.message}`
        }],
        isError: true
      };
    }
  }
);
```

### 3. Input Validation with Zod
Use Zod for robust input validation:

```typescript
const EmailToolSchema = z.object({
  to: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  priority: z.enum(["low", "normal", "high"]).default("normal")
});

server.tool(
  "send-email",
  "Send an email",
  EmailToolSchema,
  async ({ to, subject, body, priority }) => {
    // All inputs are validated and typed correctly
  }
);
```

## 📚 Resource Management

### 1. Dynamic Resources
Create resources that adapt to context:

```typescript
server.resource(
  "logs://recent",
  "logs://recent",
  async () => {
    const recentLogs = await getRecentLogs(24); // Last 24 hours
    
    return {
      contents: [{
        uri: "logs://recent",
        text: recentLogs.map(log => 
          `[${log.timestamp}] ${log.level}: ${log.message}`
        ).join('\\n')
      }]
    };
  }
);
```

### 2. Templated Resources
Use URI templates for parameterized resources:

```typescript
server.resource(
  "user://{userId}/profile",
  "user://{userId}/profile",
  async (uri) => {
    const userId = extractUserId(uri);
    const userProfile = await getUserProfile(userId);
    
    return {
      contents: [{
        uri: uri,
        text: JSON.stringify(userProfile, null, 2)
      }]
    };
  }
);
```

## 🎯 Prompt Engineering

### 1. Contextual Prompts
Create prompts that adapt to the situation:

```typescript
server.prompt(
  "debug-code",
  "Generate debugging steps for code issues",
  {
    code: z.string().describe("The problematic code"),
    language: z.string().describe("Programming language"),
    error: z.string().optional().describe("Error message if any"),
    context: z.string().optional().describe("Additional context")
  },
  async ({ code, language, error, context }) => {
    let prompt = `Debug the following ${language} code:\\n\\n\`\`\`${language}\\n${code}\\n\`\`\`\\n\\n`;
    
    if (error) {
      prompt += `Error message: ${error}\\n\\n`;
    }
    
    if (context) {
      prompt += `Additional context: ${context}\\n\\n`;
    }
    
    prompt += `Please provide:\\n1. Identified issues\\n2. Step-by-step debugging approach\\n3. Suggested fixes\\n4. Prevention strategies`;
    
    return {
      description: "Debugging assistance for code issues",
      messages: [{
        role: "user",
        content: { type: "text", text: prompt }
      }]
    };
  }
);
```

## 🔒 Security Best Practices

### 1. Input Sanitization
Always sanitize and validate inputs:

```typescript
import DOMPurify from 'isomorphic-dompurify';

server.tool(
  "render-html",
  "Render HTML content safely",
  { html: z.string() },
  async ({ html }) => {
    // Sanitize HTML to prevent XSS
    const cleanHtml = DOMPurify.sanitize(html);
    
    return {
      content: [{ type: "text", text: cleanHtml }]
    };
  }
);
```

### 2. Rate Limiting
Implement rate limiting for expensive operations:

```typescript
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(toolName: string, limit: number = 10) {
  const now = Date.now();
  const key = toolName;
  const current = rateLimiter.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimiter.set(key, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }
  
  if (current.count >= limit) {
    throw new Error(`Rate limit exceeded for ${toolName}`);
  }
  
  current.count++;
  return true;
}
```

### 3. Secrets Management
Never hardcode secrets:

```typescript
// ❌ Bad
const API_KEY = "sk-abc123...";

// ✅ Good
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is required");
}
```

## 🚀 Performance Optimization

### 1. Caching Strategies
Implement intelligent caching:

```typescript
const cache = new Map<string, { value: any; expiry: number }>();

function withCache<T>(
  key: string, 
  fn: () => Promise<T>, 
  ttl: number = 300000 // 5 minutes
): Promise<T> {
  const cached = cache.get(key);
  
  if (cached && Date.now() < cached.expiry) {
    return Promise.resolve(cached.value);
  }
  
  return fn().then(value => {
    cache.set(key, { value, expiry: Date.now() + ttl });
    return value;
  });
}
```

### 2. Async Operations
Handle async operations properly:

```typescript
server.tool(
  "batch-process",
  "Process multiple items concurrently",
  { items: z.array(z.string()) },
  async ({ items }) => {
    // Process items concurrently with controlled concurrency
    const results = await Promise.allSettled(
      items.map(async (item, index) => {
        // Add delay to prevent overwhelming external services
        await new Promise(resolve => setTimeout(resolve, index * 100));
        return processItem(item);
      })
    );
    
    const successful = results
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<any>).value);
      
    const failed = results
      .filter(r => r.status === 'rejected')
      .map(r => (r as PromiseRejectedResult).reason);
    
    return {
      content: [{
        type: "text",
        text: `Processed ${successful.length}/${items.length} items successfully`
      }]
    };
  }
);
```

## 🧪 Testing Strategies

### 1. Unit Testing Tools
```typescript
import { describe, it, expect } from 'vitest';

describe('Calculator Tool', () => {
  it('should add two numbers correctly', async () => {
    const result = await calculatorTool.execute({
      operation: 'add',
      a: 5,
      b: 3
    });
    
    expect(result.content[0].text).toContain('8');
  });
  
  it('should handle division by zero', async () => {
    const result = await calculatorTool.execute({
      operation: 'divide',
      a: 5,
      b: 0
    });
    
    expect(result.content[0].text).toContain('Division by zero');
  });
});
```

### 2. Integration Testing
```typescript
import { McpClient } from '@modelcontextprotocol/sdk/client/mcp.js';

describe('MCP Server Integration', () => {
  let client: McpClient;
  
  beforeAll(async () => {
    // Start server in test mode
    client = await startTestServer();
  });
  
  afterAll(async () => {
    await client.close();
  });
  
  it('should list available tools', async () => {
    const tools = await client.listTools();
    expect(tools.tools).toHaveLength(2);
    expect(tools.tools.map(t => t.name)).toContain('calculate');
  });
});
```

## 📊 Monitoring and Logging

### 1. Structured Logging
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'mcp-server.log' })
  ]
});

server.tool(
  "example-tool",
  "Example with logging",
  { input: z.string() },
  async ({ input }) => {
    logger.info('Tool execution started', {
      tool: 'example-tool',
      inputLength: input.length
    });
    
    try {
      const result = await processInput(input);
      
      logger.info('Tool execution completed', {
        tool: 'example-tool',
        success: true,
        outputLength: result.length
      });
      
      return { content: [{ type: "text", text: result }] };
    } catch (error) {
      logger.error('Tool execution failed', {
        tool: 'example-tool',
        error: error.message,
        stack: error.stack
      });
      
      throw error;
    }
  }
);
```

### 2. Health Checks
```typescript
server.tool(
  "health-check",
  "Check server health and diagnostics",
  {},
  async () => {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      nodeVersion: process.version
    };
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(health, null, 2)
      }]
    };
  }
);
```

## 🔄 CI/CD and Deployment

### 1. Docker Configuration
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY build/ ./build/

USER node

CMD ["node", "build/index.js"]
```

### 2. Environment Configuration
```typescript
interface Config {
  port: number;
  apiKey: string;
  databaseUrl: string;
  logLevel: string;
}

function loadConfig(): Config {
  return {
    port: parseInt(process.env.PORT || '3000'),
    apiKey: process.env.API_KEY || (() => {
      throw new Error('API_KEY is required');
    })(),
    databaseUrl: process.env.DATABASE_URL || 'sqlite:memory:',
    logLevel: process.env.LOG_LEVEL || 'info'
  };
}
```

## 📈 Scaling Considerations

### 1. Horizontal Scaling
- Design stateless tools
- Use external storage for session data
- Implement proper load balancing

### 2. Resource Management
- Monitor memory usage
- Implement connection pooling
- Use streaming for large data

### 3. Monitoring Metrics
- Track tool execution times
- Monitor error rates
- Measure resource utilization

## 🎯 Common Pitfalls to Avoid

1. **Blocking Operations**: Use async/await properly
2. **Memory Leaks**: Clean up resources and listeners
3. **Unhandled Errors**: Always catch and handle exceptions
4. **Poor Input Validation**: Validate all inputs thoroughly
5. **Hardcoded Values**: Use configuration and environment variables
6. **Insufficient Logging**: Log important events and errors
7. **No Rate Limiting**: Protect against abuse
8. **Insecure Practices**: Follow security best practices

## 🔗 Additional Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [TypeScript SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [Zod Documentation](https://zod.dev/)
- [Winston Logging](https://github.com/winstonjs/winston)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

Remember: Building reliable MCP servers requires attention to detail, proper error handling, and thorough testing. Start simple and incrementally add complexity as needed!
