# Copilot Studio Integration Guide

Learn how to integrate your MCP servers with Microsoft Copilot Studio for enhanced AI experiences.

## Overview

Copilot Studio allows you to create custom copilots that can use your MCP servers as data sources and tool providers. This guide covers the integration patterns and best practices.

## Key Concepts

### 1. Copilot Studio Architecture
- **Topics**: Conversation flows and logic
- **Entities**: Data types and structures
- **Actions**: Custom operations and integrations
- **Knowledge Sources**: External data and APIs

### 2. MCP Integration Points
- **Custom Connectors**: Bridge MCP servers to Copilot Studio
- **Power Automate Flows**: Orchestrate MCP tool calls
- **Web APIs**: Expose MCP functionality via REST endpoints
- **Direct Integration**: Native MCP protocol support (future)

## Integration Approaches

### Approach 1: REST API Wrapper

Create a REST API that wraps your MCP server:

```typescript
import express from 'express';
import { McpClient } from '@modelcontextprotocol/sdk/client/mcp.js';

const app = express();
app.use(express.json());

// Initialize MCP client
const mcpClient = new McpClient(/* your transport */);

// Expose MCP tools as REST endpoints
app.post('/api/tools/:toolName', async (req, res) => {
  try {
    const { toolName } = req.params;
    const { arguments: toolArgs } = req.body;
    
    const result = await mcpClient.callTool({
      name: toolName,
      arguments: toolArgs
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('MCP REST wrapper running on port 3000');
});
```

### Approach 2: Power Automate Flow

1. Create a Power Automate flow
2. Use HTTP connector to call your MCP REST wrapper
3. Parse responses and format for Copilot Studio
4. Return structured data

### Approach 3: Custom Connector

Create a custom connector in Copilot Studio:

```yaml
# OpenAPI definition for MCP tools
openapi: 3.0.0
info:
  title: MCP Learning Server API
  version: 1.0.0
paths:
  /api/tools/calculate:
    post:
      summary: Perform calculations
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                operation:
                  type: string
                  enum: [add, subtract, multiply, divide]
                a:
                  type: number
                b:
                  type: number
      responses:
        '200':
          description: Calculation result
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: number
```

## Step-by-Step Integration

### Step 1: Prepare Your MCP Server

Ensure your MCP server is robust and production-ready:

```typescript
// Add health check endpoint
server.tool(
  "health-check",
  "Check server health and status",
  {},
  async () => ({
    content: [{
      type: "text",
      text: JSON.stringify({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      })
    }]
  })
);

// Add CORS support for web integration
server.tool(
  "get-available-tools",
  "List all available tools",
  {},
  async () => {
    const tools = [
      { name: "calculate", description: "Perform basic arithmetic" },
      { name: "text-utils", description: "Text manipulation utilities" }
    ];
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(tools, null, 2)
      }]
    };
  }
);
```

### Step 2: Create REST Wrapper

Build a REST API to expose MCP functionality:

```typescript
import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';

const app = express();
app.use(cors());
app.use(express.json());

class McpRestWrapper {
  private mcpProcess: any;
  
  async startMcpServer() {
    this.mcpProcess = spawn('node', ['build/index.js'], {
      stdio: ['pipe', 'pipe', 'inherit']
    });
  }
  
  async callTool(toolName: string, args: any) {
    const request = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args
      }
    };
    
    return new Promise((resolve, reject) => {
      this.mcpProcess.stdin.write(JSON.stringify(request) + '\\n');
      
      this.mcpProcess.stdout.once('data', (data: Buffer) => {
        try {
          const response = JSON.parse(data.toString());
          resolve(response.result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

const wrapper = new McpRestWrapper();
wrapper.startMcpServer();

// Tool endpoints
app.post('/api/calculate', async (req, res) => {
  try {
    const result = await wrapper.callTool('calculate', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

### Step 3: Configure Copilot Studio

1. **Create New Topic**:
   - Name: "Calculate Numbers"
   - Trigger phrases: "calculate", "do math", "compute"

2. **Add Variables**:
   - operation: Text
   - numberA: Number
   - numberB: Number

3. **Create Action**:
   - Type: HTTP Request
   - URL: `https://your-api.com/api/calculate`
   - Method: POST
   - Body: 
   ```json
   {
     "operation": "{x:operation}",
     "a": {x:numberA},
     "b": {x:numberB}
   }
   ```

4. **Parse Response**:
   - Extract result from response
   - Format for user display

### Step 4: Test Integration

1. **Test REST API**:
   ```bash
   curl -X POST http://localhost:3000/api/calculate \\
     -H "Content-Type: application/json" \\
     -d '{"operation": "add", "a": 5, "b": 3}'
   ```

2. **Test in Copilot Studio**:
   - Use the test pane
   - Try phrases like "calculate 5 plus 3"
   - Verify response formatting

## Best Practices

### 1. Error Handling
```typescript
app.use((err: Error, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});
```

### 2. Input Validation
```typescript
import Joi from 'joi';

const calculateSchema = Joi.object({
  operation: Joi.string().valid('add', 'subtract', 'multiply', 'divide').required(),
  a: Joi.number().required(),
  b: Joi.number().required()
});

app.post('/api/calculate', async (req, res) => {
  const { error, value } = calculateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  // Process validated input
});
```

### 3. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

### 4. Authentication
```typescript
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

## Advanced Scenarios

### Multi-Tool Orchestration
```typescript
app.post('/api/workflow/analyze-text', async (req, res) => {
  const { text } = req.body;
  
  // Step 1: Get text statistics
  const stats = await wrapper.callTool('text-utils', {
    operation: 'count',
    text: text
  });
  
  // Step 2: Generate summary (hypothetical tool)
  const summary = await wrapper.callTool('summarize', {
    text: text,
    maxLength: 100
  });
  
  // Step 3: Analyze sentiment (hypothetical tool)
  const sentiment = await wrapper.callTool('analyze-sentiment', {
    text: text
  });
  
  res.json({
    statistics: stats,
    summary: summary,
    sentiment: sentiment
  });
});
```

### Dynamic Tool Discovery
```typescript
app.get('/api/tools', async (req, res) => {
  const tools = await wrapper.callTool('get-available-tools', {});
  res.json(tools);
});

app.post('/api/tools/:toolName', async (req, res) => {
  const { toolName } = req.params;
  const result = await wrapper.callTool(toolName, req.body);
  res.json(result);
});
```

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure CORS is properly configured
   - Check allowed origins and methods

2. **Authentication Failures**:
   - Verify API keys and tokens
   - Check Copilot Studio connector configuration

3. **Timeout Issues**:
   - Increase timeout values
   - Implement proper error handling
   - Add retry logic

### Debugging Tips

1. **Enable Detailed Logging**:
   ```typescript
   app.use((req, res, next) => {
     console.log(`${req.method} ${req.path}`, req.body);
     next();
   });
   ```

2. **Test Endpoints Individually**:
   - Use Postman or curl
   - Verify MCP server responses
   - Check data transformation

3. **Monitor Performance**:
   - Track response times
   - Monitor error rates
   - Use APM tools

## Next Steps

1. **Deploy to Production**:
   - Use cloud platforms (Azure, AWS, GCP)
   - Set up CI/CD pipelines
   - Configure monitoring and alerts

2. **Scale Your Integration**:
   - Implement caching
   - Add load balancing
   - Optimize database queries

3. **Enhance Security**:
   - Add OAuth2/OpenID Connect
   - Implement role-based access
   - Use HTTPS everywhere

4. **Extend Functionality**:
   - Add more MCP tools
   - Create complex workflows
   - Build custom UI components

## Resources

- [Copilot Studio Documentation](https://docs.microsoft.com/en-us/microsoft-copilot-studio/)
- [Power Platform Connectors](https://docs.microsoft.com/en-us/connectors/)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)

Happy integrating! 🚀
