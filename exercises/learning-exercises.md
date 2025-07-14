# Learning Exercises: Build Your Own MCP Tools

These hands-on exercises will help you master MCP development by building increasingly complex tools and integrations.

## 🎯 Exercise 1: Basic Tool Development

### Goal
Create a simple file system tool that can list directory contents.

### Requirements
- Tool name: `list-files`
- Input: `path` (string) - directory path to list
- Output: Formatted list of files and directories
- Error handling for invalid paths

### Solution Template
```typescript
server.tool(
  "list-files",
  "List files and directories in a given path",
  {
    path: z.string().describe("Directory path to list")
  },
  async ({ path }) => {
    try {
      // Your implementation here
      
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error.message}`
        }]
      };
    }
  }
);
```

### Test Cases
1. List files in current directory
2. List files in a subdirectory
3. Handle non-existent paths
4. Handle permission errors

---

## 🎯 Exercise 2: API Integration Tool

### Goal
Create a weather tool that fetches current weather data from a public API.

### Requirements
- Tool name: `get-weather`
- Input: `city` (string) - city name
- Use OpenWeatherMap API (free tier)
- Return formatted weather information
- Handle API errors gracefully

### API Setup
1. Register at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Set environment variable: `WEATHER_API_KEY`

### Solution Template
```typescript
server.tool(
  "get-weather",
  "Get current weather for a city",
  {
    city: z.string().describe("City name")
  },
  async ({ city }) => {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      throw new Error("Weather API key not configured");
    }
    
    try {
      // Your implementation here
      
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error fetching weather: ${error.message}`
        }]
      };
    }
  }
);
```

### Bonus Challenges
- Add temperature unit conversion (Celsius/Fahrenheit)
- Include weather forecast (5-day)
- Cache API responses to avoid rate limits

---

## 🎯 Exercise 3: Resource Implementation

### Goal
Create a dynamic resource that provides system information.

### Requirements
- Resource URI: `system://info`
- Include: OS, CPU, memory, disk usage
- Update information in real-time
- Format as JSON

### Solution Template
```typescript
server.resource(
  "system://info",
  "system://info",
  async () => {
    try {
      // Your implementation here using 'os' module
      
    } catch (error) {
      throw new Error(`Failed to get system info: ${error.message}`);
    }
  }
);
```

### Test Cases
1. Verify JSON format
2. Check all required fields are present
3. Test on different operating systems

---

## 🎯 Exercise 4: Advanced Prompt Engineering

### Goal
Create an intelligent code review prompt that adapts to different programming languages.

### Requirements
- Prompt name: `smart-code-review`
- Inputs: `code`, `language`, `focus_area` (optional)
- Generate language-specific review criteria
- Include security, performance, and best practices

### Solution Template
```typescript
server.prompt(
  "smart-code-review",
  "Generate intelligent code review based on language and context",
  {
    code: z.string().describe("Code to review"),
    language: z.string().describe("Programming language"),
    focus_area: z.enum(["security", "performance", "maintainability", "all"])
      .default("all")
      .describe("Specific area to focus on")
  },
  async ({ code, language, focus_area }) => {
    // Your implementation here
  }
);
```

### Language-Specific Criteria
- **JavaScript/TypeScript**: ESLint rules, async/await patterns
- **Python**: PEP 8, type hints, security issues
- **Java**: Memory management, concurrency
- **C#**: SOLID principles, async patterns

---

## 🎯 Exercise 5: Multi-Tool Workflow

### Goal
Create a tool that orchestrates multiple operations in sequence.

### Requirements
- Tool name: `analyze-project`
- Input: `project_path` (string)
- Perform: file counting, dependency analysis, code metrics
- Combine results into comprehensive report

### Solution Template
```typescript
server.tool(
  "analyze-project",
  "Perform comprehensive project analysis",
  {
    project_path: z.string().describe("Path to project directory")
  },
  async ({ project_path }) => {
    try {
      // Step 1: Count files by type
      // Step 2: Analyze dependencies (package.json, requirements.txt, etc.)
      // Step 3: Calculate code metrics
      // Step 4: Generate report
      
    } catch (error) {
      throw new Error(`Project analysis failed: ${error.message}`);
    }
  }
);
```

### Metrics to Include
- Total lines of code
- File type distribution
- Dependency count and types
- Estimated complexity

---

## 🎯 Exercise 6: Real-time Data Tool

### Goal
Create a tool that monitors log files in real-time.

### Requirements
- Tool name: `tail-logs`
- Input: `file_path`, `lines` (optional, default 10)
- Return last N lines from a log file
- Handle file rotation

### Solution Template
```typescript
server.tool(
  "tail-logs",
  "Get last N lines from a log file",
  {
    file_path: z.string().describe("Path to log file"),
    lines: z.number().default(10).describe("Number of lines to return")
  },
  async ({ file_path, lines }) => {
    try {
      // Your implementation here
      
    } catch (error) {
      throw new Error(`Failed to read log file: ${error.message}`);
    }
  }
);
```

### Bonus Features
- Filter logs by severity level
- Search for specific patterns
- Parse structured logs (JSON)

---

## 🎯 Exercise 7: Database Integration

### Goal
Create tools for basic database operations.

### Requirements
- Tools: `db-query`, `db-insert`, `db-update`
- Use SQLite for simplicity
- Proper SQL injection prevention
- Transaction support

### Setup Database
```typescript
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
  filename: './database.db',
  driver: sqlite3.Database
});

// Create sample table
await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
```

### Solution Template
```typescript
server.tool(
  "db-query",
  "Execute a SELECT query",
  {
    sql: z.string().describe("SQL SELECT query"),
    params: z.array(z.any()).default([]).describe("Query parameters")
  },
  async ({ sql, params }) => {
    // Validate query is SELECT only
    if (!sql.trim().toLowerCase().startsWith('select')) {
      throw new Error("Only SELECT queries are allowed");
    }
    
    try {
      // Your implementation here
      
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }
);
```

---

## 🎯 Exercise 8: Error Handling & Resilience

### Goal
Create a robust tool that demonstrates advanced error handling patterns.

### Requirements
- Tool name: `resilient-fetch`
- Fetch data from unreliable API with retries
- Exponential backoff
- Circuit breaker pattern
- Comprehensive error reporting

### Solution Template
```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private threshold = 5,
    private timeout = 60000
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Your circuit breaker implementation here
  }
}

server.tool(
  "resilient-fetch",
  "Fetch data with retry logic and circuit breaker",
  {
    url: z.string().url().describe("URL to fetch"),
    max_retries: z.number().default(3).describe("Maximum retry attempts")
  },
  async ({ url, max_retries }) => {
    // Your implementation here
  }
);
```

---

## 🎯 Exercise 9: Custom Protocol Handler

### Goal
Create a tool that handles custom URI schemes for your application.

### Requirements
- Handle URIs like: `myapp://action/param1/param2`
- Support multiple actions: `get`, `set`, `delete`
- Parse parameters correctly
- Return appropriate responses

### Solution Template
```typescript
server.tool(
  "handle-uri",
  "Handle custom protocol URIs",
  {
    uri: z.string().describe("Custom protocol URI")
  },
  async ({ uri }) => {
    try {
      const parsed = new URL(uri);
      
      if (parsed.protocol !== 'myapp:') {
        throw new Error("Unsupported protocol");
      }
      
      // Your implementation here
      
    } catch (error) {
      throw new Error(`URI handling failed: ${error.message}`);
    }
  }
);
```

---

## 🎯 Exercise 10: Performance Optimization

### Goal
Create a tool that demonstrates various performance optimization techniques.

### Requirements
- Tool name: `process-large-dataset`
- Handle datasets with 100k+ records
- Implement streaming processing
- Memory-efficient algorithms
- Progress reporting

### Solution Template
```typescript
server.tool(
  "process-large-dataset",
  "Process large datasets efficiently",
  {
    file_path: z.string().describe("Path to data file"),
    operation: z.enum(["count", "sum", "average", "filter"]).describe("Operation to perform"),
    batch_size: z.number().default(1000).describe("Batch size for processing")
  },
  async ({ file_path, operation, batch_size }) => {
    try {
      // Your streaming implementation here
      
    } catch (error) {
      throw new Error(`Dataset processing failed: ${error.message}`);
    }
  }
);
```

---

## 🏆 Final Challenge: Complete MCP Server

### Goal
Combine everything you've learned into a complete, production-ready MCP server.

### Requirements
1. **Multiple Tools**: At least 5 different tools
2. **Resources**: Dynamic and static resources
3. **Prompts**: Context-aware prompts
4. **Error Handling**: Comprehensive error management
5. **Testing**: Unit and integration tests
6. **Documentation**: Complete API documentation
7. **Configuration**: Environment-based configuration
8. **Logging**: Structured logging
9. **Metrics**: Performance monitoring
10. **Security**: Input validation and rate limiting

### Suggested Project: "DevOps Assistant"
A comprehensive MCP server for development and operations tasks:

#### Tools
- `deploy-app`: Deploy applications to different environments
- `check-logs`: Monitor application logs
- `run-tests`: Execute test suites
- `backup-database`: Create database backups
- `monitor-resources`: Check system resources

#### Resources
- `config://environment/{env}`: Environment configurations
- `docs://api/{service}`: API documentation
- `metrics://performance/{service}`: Performance metrics

#### Prompts
- `deployment-checklist`: Generate deployment checklists
- `incident-response`: Guide incident response procedures
- `code-review`: Automated code review prompts

### Evaluation Criteria
1. **Functionality**: All features work as specified
2. **Code Quality**: Clean, readable, maintainable code
3. **Error Handling**: Graceful error handling and recovery
4. **Performance**: Efficient resource usage
5. **Security**: Proper input validation and security measures
6. **Testing**: Comprehensive test coverage
7. **Documentation**: Clear and complete documentation

---

## 📚 Learning Resources

### Books and Articles
- "Clean Code" by Robert C. Martin
- "Designing Data-Intensive Applications" by Martin Kleppmann
- "Building Microservices" by Sam Newman

### Online Courses
- Node.js performance optimization
- TypeScript advanced patterns
- API design best practices

### Tools and Libraries
- **Testing**: Jest, Vitest, Supertest
- **Validation**: Zod, Joi, Yup
- **Logging**: Winston, Pino
- **Monitoring**: Prometheus, Grafana

### Community
- [MCP GitHub Discussions](https://github.com/modelcontextprotocol/specification/discussions)
- [TypeScript Community](https://www.typescriptlang.org/community)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🎉 Conclusion

These exercises progress from basic tool creation to advanced server development. Take your time with each exercise, and don't hesitate to experiment with additional features. The key to mastering MCP development is practice and continuous learning.

Remember:
- Start simple and iterate
- Test thoroughly at each step
- Focus on user experience
- Document your work
- Share your learnings with the community

Happy coding! 🚀
