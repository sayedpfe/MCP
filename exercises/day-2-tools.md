# Day 2: Advanced Tools - Step by Step

Today you'll master tool creation by building 3 different types of tools and learning professional input validation techniques.

## 🎯 Today's Goals
- ✅ Create 3 custom tools with different purposes
- ✅ Master Zod validation patterns
- ✅ Implement professional error handling

---

## 🛠️ Tool 1: File Operations Tool (40 minutes)

Let's create a tool that can analyze text files and provide insights.

### Step 1A: Add the Schema
Add this to your tools array in `src/index.ts`:

```typescript
{
  name: 'file-analyzer',
  description: 'Analyze text content for word count, reading time, and complexity',
  inputSchema: {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        description: 'Text content to analyze'
      },
      analysis_type: {
        type: 'string',
        enum: ['basic', 'detailed', 'readability'],
        description: 'Type of analysis to perform'
      }
    },
    required: ['content']
  }
}
```

### Step 1B: Create the Handler
Add this case to your switch statement:

```typescript
case 'file-analyzer':
  const fileArgs = args as { content: string; analysis_type?: string };
  const analysisType = fileArgs.analysis_type || 'basic';
  const content = fileArgs.content.trim();
  
  if (!content) {
    throw new Error('Content cannot be empty');
  }
  
  // Basic analysis
  const words = content.split(/\s+/).length;
  const chars = content.length;
  const sentences = content.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim()).length;
  const readingTime = Math.ceil(words / 200); // 200 WPM average
  
  let result = `📊 Text Analysis Results:\n`;
  result += `Words: ${words}\n`;
  result += `Characters: ${chars}\n`;
  result += `Sentences: ${sentences}\n`;
  result += `Paragraphs: ${paragraphs}\n`;
  result += `Estimated reading time: ${readingTime} minute(s)\n`;
  
  if (analysisType === 'detailed') {
    const avgWordsPerSentence = words / sentences;
    const avgCharsPerWord = chars / words;
    result += `\n📈 Detailed Metrics:\n`;
    result += `Average words per sentence: ${avgWordsPerSentence.toFixed(1)}\n`;
    result += `Average characters per word: ${avgCharsPerWord.toFixed(1)}\n`;
  }
  
  if (analysisType === 'readability') {
    const complexWords = content.split(/\s+/).filter(word => word.length > 6).length;
    const readabilityScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (complexWords / words));
    result += `\n📚 Readability Analysis:\n`;
    result += `Complex words (6+ chars): ${complexWords}\n`;
    result += `Flesch Reading Ease: ${readabilityScore.toFixed(1)}\n`;
    result += `Reading Level: ${readabilityScore > 90 ? 'Very Easy' : 
                              readabilityScore > 80 ? 'Easy' :
                              readabilityScore > 70 ? 'Fairly Easy' :
                              readabilityScore > 60 ? 'Standard' :
                              readabilityScore > 50 ? 'Fairly Difficult' :
                              readabilityScore > 30 ? 'Difficult' : 'Very Difficult'}\n`;
  }
  
  return {
    content: [{
      type: 'text',
      text: result
    }]
  };
```

### Step 1C: Test the Tool
```bash
npm run build
node interactive-test.js
```

Try in Claude: "Analyze this text for readability: [paste some text]"

---

## 🧮 Tool 2: Data Processing Tool (30 minutes)

Create a tool that can process arrays of numbers with statistical operations.

### Step 2A: Add the Schema
```typescript
{
  name: 'data-processor',
  description: 'Process arrays of numbers with statistical operations',
  inputSchema: {
    type: 'object',
    properties: {
      numbers: {
        type: 'array',
        items: { type: 'number' },
        description: 'Array of numbers to process'
      },
      operation: {
        type: 'string',
        enum: ['stats', 'sort', 'filter', 'transform'],
        description: 'Type of operation to perform'
      },
      options: {
        type: 'object',
        properties: {
          filter_condition: { type: 'string', enum: ['positive', 'negative', 'even', 'odd'] },
          transform_type: { type: 'string', enum: ['square', 'sqrt', 'double', 'abs'] },
          sort_order: { type: 'string', enum: ['asc', 'desc'] }
        },
        description: 'Options for the operation'
      }
    },
    required: ['numbers', 'operation']
  }
}
```

### Step 2B: Create the Handler
```typescript
case 'data-processor':
  const dataArgs = args as { 
    numbers: number[]; 
    operation: string; 
    options?: { 
      filter_condition?: string; 
      transform_type?: string; 
      sort_order?: string 
    } 
  };
  
  if (!Array.isArray(dataArgs.numbers) || dataArgs.numbers.length === 0) {
    throw new Error('Numbers array cannot be empty');
  }
  
  const numbers = dataArgs.numbers;
  const options = dataArgs.options || {};
  let result = '';
  
  switch (dataArgs.operation) {
    case 'stats':
      const sum = numbers.reduce((a, b) => a + b, 0);
      const mean = sum / numbers.length;
      const sorted = [...numbers].sort((a, b) => a - b);
      const median = sorted.length % 2 === 0 
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
      const variance = numbers.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) / numbers.length;
      const stdDev = Math.sqrt(variance);
      
      result = `📊 Statistical Analysis:\n`;
      result += `Count: ${numbers.length}\n`;
      result += `Sum: ${sum}\n`;
      result += `Mean: ${mean.toFixed(2)}\n`;
      result += `Median: ${median}\n`;
      result += `Min: ${Math.min(...numbers)}\n`;
      result += `Max: ${Math.max(...numbers)}\n`;
      result += `Standard Deviation: ${stdDev.toFixed(2)}\n`;
      break;
      
    case 'sort':
      const sortOrder = options.sort_order || 'asc';
      const sortedNumbers = [...numbers].sort((a, b) => sortOrder === 'asc' ? a - b : b - a);
      result = `🔢 Sorted (${sortOrder}): [${sortedNumbers.join(', ')}]`;
      break;
      
    case 'filter':
      const condition = options.filter_condition || 'positive';
      let filtered;
      switch (condition) {
        case 'positive': filtered = numbers.filter(n => n > 0); break;
        case 'negative': filtered = numbers.filter(n => n < 0); break;
        case 'even': filtered = numbers.filter(n => n % 2 === 0); break;
        case 'odd': filtered = numbers.filter(n => n % 2 !== 0); break;
        default: filtered = numbers;
      }
      result = `🔍 Filtered (${condition}): [${filtered.join(', ')}]`;
      break;
      
    case 'transform':
      const transformType = options.transform_type || 'square';
      let transformed;
      switch (transformType) {
        case 'square': transformed = numbers.map(n => n * n); break;
        case 'sqrt': transformed = numbers.map(n => Math.sqrt(Math.abs(n))); break;
        case 'double': transformed = numbers.map(n => n * 2); break;
        case 'abs': transformed = numbers.map(n => Math.abs(n)); break;
        default: transformed = numbers;
      }
      result = `🔄 Transformed (${transformType}): [${transformed.map(n => n.toFixed(2)).join(', ')}]`;
      break;
  }
  
  return {
    content: [{
      type: 'text',
      text: result
    }]
  };
```

---

## 🌐 Tool 3: URL Utilities Tool (25 minutes)

A tool for parsing and analyzing URLs.

### Step 3A: Add the Schema
```typescript
{
  name: 'url-utils',
  description: 'Parse and analyze URLs',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'URL to analyze'
      },
      operation: {
        type: 'string',
        enum: ['parse', 'validate', 'extract', 'build'],
        description: 'Operation to perform'
      },
      build_params: {
        type: 'object',
        properties: {
          protocol: { type: 'string' },
          host: { type: 'string' },
          path: { type: 'string' },
          query: { type: 'object' }
        },
        description: 'Parameters for building a URL'
      }
    },
    required: ['url', 'operation']
  }
}
```

### Step 3B: Create the Handler
```typescript
case 'url-utils':
  const urlArgs = args as { 
    url: string; 
    operation: string; 
    build_params?: { protocol?: string; host?: string; path?: string; query?: object } 
  };
  
  let urlResult = '';
  
  try {
    switch (urlArgs.operation) {
      case 'parse':
        const parsedUrl = new URL(urlArgs.url);
        urlResult = `🔍 URL Components:\n`;
        urlResult += `Protocol: ${parsedUrl.protocol}\n`;
        urlResult += `Host: ${parsedUrl.host}\n`;
        urlResult += `Hostname: ${parsedUrl.hostname}\n`;
        urlResult += `Port: ${parsedUrl.port || 'default'}\n`;
        urlResult += `Pathname: ${parsedUrl.pathname}\n`;
        urlResult += `Search: ${parsedUrl.search || 'none'}\n`;
        urlResult += `Hash: ${parsedUrl.hash || 'none'}\n`;
        break;
        
      case 'validate':
        try {
          new URL(urlArgs.url);
          urlResult = `✅ Valid URL: ${urlArgs.url}`;
        } catch {
          urlResult = `❌ Invalid URL: ${urlArgs.url}`;
        }
        break;
        
      case 'extract':
        const extractUrl = new URL(urlArgs.url);
        const params = new URLSearchParams(extractUrl.search);
        urlResult = `📤 Extracted Data:\n`;
        urlResult += `Domain: ${extractUrl.hostname}\n`;
        urlResult += `Path segments: ${extractUrl.pathname.split('/').filter(Boolean).join(', ')}\n`;
        urlResult += `Query parameters:\n`;
        for (const [key, value] of params) {
          urlResult += `  ${key}: ${value}\n`;
        }
        break;
        
      case 'build':
        const buildParams = urlArgs.build_params;
        if (!buildParams || !buildParams.protocol || !buildParams.host) {
          throw new Error('Build operation requires protocol and host in build_params');
        }
        
        let builtUrl = `${buildParams.protocol}//${buildParams.host}`;
        if (buildParams.path) {
          builtUrl += buildParams.path.startsWith('/') ? buildParams.path : '/' + buildParams.path;
        }
        if (buildParams.query) {
          const queryString = Object.entries(buildParams.query)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join('&');
          builtUrl += '?' + queryString;
        }
        urlResult = `🔨 Built URL: ${builtUrl}`;
        break;
    }
  } catch (error) {
    throw new Error(`URL operation failed: ${error.message}`);
  }
  
  return {
    content: [{
      type: 'text',
      text: urlResult
    }]
  };
```

---

## ✅ Step 4: Test All Tools (15 minutes)

### Build and Test
```bash
npm run build
node interactive-test.js
```

### Test in Claude Desktop
Try these commands:

1. **File Analyzer**: "Analyze this text for readability: 'The quick brown fox jumps over the lazy dog. This is a simple sentence for testing purposes.'"

2. **Data Processor**: "Calculate statistics for these numbers: [1, 5, 3, 9, 2, 7, 4, 8, 6]"

3. **URL Utils**: "Parse this URL: https://example.com/path?query=test&page=1"

---

## 🎓 Day 2 Wrap-Up

### What You Learned Today
- ✅ **Complex Input Handling**: Arrays, objects, optional parameters
- ✅ **Error Handling**: Validation and meaningful error messages
- ✅ **Data Processing**: Statistical calculations and transformations
- ✅ **Real-world Tools**: File analysis, data processing, URL handling

### Advanced Patterns You Used
- **Conditional Logic**: Different operations based on input
- **Array Processing**: Map, filter, reduce operations
- **Object Validation**: Checking required properties
- **Error Boundaries**: Try/catch for robust tools

### Tomorrow's Preview
Day 3: Resources! You'll learn to create dynamic and static resources that Claude can read and reference.

---

## 🎯 Bonus Challenges (Optional)

1. **Add CSV Processing**: Extend file-analyzer to handle CSV data
2. **Create Math Utils**: Tool for advanced mathematical operations
3. **Build JSON Validator**: Tool to validate and format JSON strings

*Remember: Each tool should have clear input validation and helpful error messages!*
