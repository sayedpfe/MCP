# Day 2: Advanced Tools - Multiple Tools & Complex Validation

Welcome to Day 2! Today you'll build multiple interconnected tools and learn advanced MCP patterns.

## 🎯 Today's Goals
By the end of today, you'll have:
- ✅ Created 3 different tools in one server
- ✅ Implemented complex input validation
- ✅ Used tools that work together
- ✅ Mastered error handling patterns

---

## 📚 Step 1: Review Day 1 & Setup (10 minutes)

### What You Should Have from Day 1
- ✅ Working greeting tool in Claude Desktop
- ✅ Understanding of basic MCP structure
- ✅ Successful build and test process

### Quick Review Quiz
Before starting, answer these:
- How do you add a new parameter to a tool schema?
- What's the difference between required and optional parameters?
- How do you test a tool without Claude Desktop?

### Step 1A: Prepare Day 2 Workspace
1. **Copy the Day 2 starter file to create your working file**:
   ```powershell
   Copy-Item days/day-2/index-starter.ts src/index.ts
   ```
   
2. **Verify the file was copied**:
   ```powershell
   Get-ChildItem src/
   # Should show: index.ts (updated with Day 2 starter)
   ```
   
3. **Open your new working file**:
   ```powershell
   code src/index.ts
   ```

4. **You should see**:
   - Import statements for Day 2
   - Server configuration
   - TODO comments for 3 different tools
   - Bonus challenge helpers (ignore for now)

---

## 🔧 Step 2: Build Your First Advanced Tool - Calculator (25 minutes)

### Exercise: Build a "Calculator" Tool

**Goal**: Create a tool that performs mathematical operations with proper validation.

### Step 2A: Add the Calculator Tool
1. Find the comment `// TODO: Tool 1 - Calculator (Day 2 exercise)`
2. **Important**: You'll see bonus challenge comments - **ignore them for now**!
3. Replace the TODO comment with this complete tool:

```typescript
// Tool 1: Calculator
server.tool(
  "calculator",
  "Perform basic mathematical operations",
  {
    operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("Mathematical operation to perform"),
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
    precision: z.number().min(0).max(10).optional().describe("Number of decimal places (0-10)")
  },
  async ({ operation, a, b, precision = 2 }) => {
    let result: number;
    
    // Perform the calculation
    switch (operation) {
      case "add":
        result = a + b;
        break;
      case "subtract":
        result = a - b;
        break;
      case "multiply":
        result = a * b;
        break;
      case "divide":
        if (b === 0) {
          return {
            content: [{
              type: "text",
              text: "❌ Error: Cannot divide by zero!"
            }]
          };
        }
        result = a / b;
        break;
    }
    
    // Format the result with specified precision
    const formattedResult = Number(result.toFixed(precision));
    
    return {
      content: [{
        type: "text",
        text: `🧮 ${a} ${operation === "add" ? "+" : operation === "subtract" ? "-" : operation === "multiply" ? "×" : "÷"} ${b} = ${formattedResult}`
      }]
    };
  }
);
```

### Step 2B: Update Server Capabilities
1. Find this line in the `main()` function:
   ```typescript
   console.error("- Tools: (none yet - add your tools!)");
   ```
2. Replace it with:
   ```typescript
   console.error("- Tools: calculator");
   ```

### Step 2C: Test Your Calculator Tool
1. **Build your code**:
   ```powershell
   npm run build
   ```

2. **Test the server starts**:
   ```powershell
   npm start
   ```
   You should see:
   ```
   mcp-learning-server v1.0.0 running on stdio
   Available capabilities:
   - Tools: calculator
   ```

3. **Stop the server** (Ctrl+C) and test interactively:
   ```powershell
   node interactive-test.js
   ```

4. **Test in Claude Desktop**: "Use the calculator tool to add 15 and 27"

**✅ Checkpoint**: Calculator tool working with basic math operations and error handling for division by zero.

---

## 📊 Step 3: Build Your Second Tool - Text Analyzer (25 minutes)

### Exercise: Build a "Text Analyzer" Tool

**Goal**: Create a tool that analyzes text and provides detailed statistics.

### Step 3A: Add the Text Analyzer Tool
1. Find the comment `// TODO: Tool 2 - Text Analyzer (Day 2 exercise)`
2. Replace it with this complete tool:

```typescript
// Tool 2: Text Analyzer
server.tool(
  "text_analyzer",
  "Analyze text and provide detailed statistics",
  {
    text: z.string().min(1).describe("Text to analyze"),
    includeWords: z.boolean().optional().describe("Include word frequency analysis"),
    includeSentiment: z.boolean().optional().describe("Include basic sentiment analysis")
  },
  async ({ text, includeWords = false, includeSentiment = false }) => {
    // Basic statistics
    const charCount = text.length;
    const charCountNoSpaces = text.replace(/\s/g, '').length;
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphCount = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    let analysis = `📊 **Text Analysis Results:**
    
📝 **Basic Statistics:**
- Characters: ${charCount} (${charCountNoSpaces} without spaces)
- Words: ${wordCount}
- Sentences: ${sentenceCount}
- Paragraphs: ${paragraphCount}
- Average words per sentence: ${sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : 0}`;

    // Word frequency analysis (optional)
    if (includeWords && wordCount > 0) {
      const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2); // Only words longer than 2 characters
      
      const wordFreq: Record<string, number> = {};
      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
      
      const topWords = Object.entries(wordFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
      
      analysis += `\n\n🔤 **Top 5 Words:**`;
      topWords.forEach(([word, count], index) => {
        analysis += `\n${index + 1}. "${word}" (${count} times)`;
      });
    }
    
    // Basic sentiment analysis (optional)
    if (includeSentiment) {
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy', 'joy', 'perfect'];
      const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'sad', 'angry', 'horrible', 'disgusting', 'worst', 'failure'];
      
      const lowerText = text.toLowerCase();
      const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
      const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
      
      let sentiment = "😐 Neutral";
      if (positiveCount > negativeCount) {
        sentiment = "😊 Positive";
      } else if (negativeCount > positiveCount) {
        sentiment = "😔 Negative";
      }
      
      analysis += `\n\n💭 **Sentiment Analysis:**
- Overall sentiment: ${sentiment}
- Positive indicators: ${positiveCount}
- Negative indicators: ${negativeCount}`;
    }
    
    return {
      content: [{
        type: "text",
        text: analysis
      }]
    };
  }
);
```

### Step 3B: Update Server Capabilities
1. Update the console log to include both tools:
   ```typescript
   console.error("- Tools: calculator, text_analyzer");
   ```

### Step 3C: Test Your Text Analyzer
1. **Build and test**:
   ```powershell
   npm run build
   npm start
   ```

2. **Test in Claude Desktop**: "Use the text analyzer to analyze this text: 'This is a wonderful day! I love learning new things. The weather is great and I feel amazing.'"

**✅ Checkpoint**: Text analyzer working with basic statistics and optional features.

---

## 🎲 Step 4: Build Your Third Tool - Random Generator (25 minutes)

### Exercise: Build a "Random Generator" Tool

**Goal**: Create a tool that generates various types of random data with validation.

### Step 4A: Add the Random Generator Tool
1. Find the comment `// TODO: Tool 3 - Random Generator (Day 2 exercise)`
2. Replace it with this complete tool:

```typescript
// Tool 3: Random Generator
server.tool(
  "random_generator",
  "Generate various types of random data",
  {
    type: z.enum(["number", "string", "password", "color", "uuid"]).describe("Type of random data to generate"),
    count: z.number().min(1).max(20).optional().describe("Number of items to generate (1-20)"),
    // Number-specific options
    min: z.number().optional().describe("Minimum value (for numbers)"),
    max: z.number().optional().describe("Maximum value (for numbers)"),
    // String/Password-specific options
    length: z.number().min(1).max(100).optional().describe("Length of string/password (1-100)"),
    includeSymbols: z.boolean().optional().describe("Include symbols in password")
  },
  async ({ type, count = 1, min = 0, max = 100, length = 8, includeSymbols = false }) => {
    const results: string[] = [];
    
    for (let i = 0; i < count; i++) {
      let result: string;
      
      switch (type) {
        case "number":
          const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
          result = randomNum.toString();
          break;
          
        case "string":
          const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
          result = Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
          break;
          
        case "password":
          let passChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          if (includeSymbols) {
            passChars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
          }
          result = Array.from({ length }, () => passChars.charAt(Math.floor(Math.random() * passChars.length))).join('');
          break;
          
        case "color":
          const r = Math.floor(Math.random() * 256);
          const g = Math.floor(Math.random() * 256);
          const b = Math.floor(Math.random() * 256);
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          result = `${hex} (RGB: ${r}, ${g}, ${b})`;
          break;
          
        case "uuid":
          result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
          break;
          
        default:
          result = "Unknown type";
      }
      
      results.push(result);
    }
    
    const emoji = type === "number" ? "🔢" : type === "string" ? "🔤" : type === "password" ? "🔐" : type === "color" ? "🎨" : "🆔";
    
    let output = `${emoji} **Random ${type.charAt(0).toUpperCase() + type.slice(1)}${count > 1 ? 's' : ''}:**\n\n`;
    
    if (count === 1) {
      output += results[0];
    } else {
      results.forEach((result, index) => {
        output += `${index + 1}. ${result}\n`;
      });
    }
    
    // Add generation details
    if (type === "number") {
      output += `\n*Range: ${min} to ${max}*`;
    } else if (type === "string" || type === "password") {
      output += `\n*Length: ${length} characters${type === "password" && includeSymbols ? " (with symbols)" : ""}*`;
    }
    
    return {
      content: [{
        type: "text",
        text: output
      }]
    };
  }
);
```

### Step 4B: Update Server Capabilities
1. Update the console log to include all three tools:
   ```typescript
   console.error("- Tools: calculator, text_analyzer, random_generator");
   ```

### Step 4C: Test Your Random Generator
1. **Build and test**:
   ```powershell
   npm run build
   npm start
   ```

2. **Test in Claude Desktop**: "Use the random generator to create 3 passwords with length 12 and include symbols"

**✅ Checkpoint**: All three tools working independently.

---

## 🔗 Step 5: Test Tools Working Together (15 minutes)

### Exercise: Use Multiple Tools in Sequence

**Goal**: Demonstrate how Claude can use multiple tools to accomplish complex tasks.

### Step 5A: Test Tool Combinations
**Try these complex commands in Claude Desktop:**

1. **Math + Analysis Combo**:
   ```
   First, use the calculator to multiply 15 by 8. Then use the text analyzer to analyze the phrase "Mathematics is absolutely wonderful and I love solving complex problems!"
   ```

2. **Generate + Analyze Combo**:
   ```
   Generate a random string of length 50, then analyze that string with the text analyzer including word frequency
   ```

3. **All Three Tools**:
   ```
   Generate 2 random numbers between 1 and 100, use the calculator to add them together, then analyze this sentence: "The sum of random numbers creates interesting mathematical patterns"
   ```

### Step 5B: Verify Multi-Tool Functionality
- [ ] Claude can call multiple tools in one conversation
- [ ] Each tool returns proper results
- [ ] Tools don't interfere with each other
- [ ] Complex workflows complete successfully

**✅ Checkpoint**: Multiple tools working together seamlessly.

---

## ✅ Step 6: Error Handling & Edge Cases (10 minutes)

### Exercise: Test Error Scenarios

**Goal**: Verify your tools handle errors gracefully.

### Step 6A: Test Error Conditions
**Try these error scenarios in Claude Desktop:**

1. **Calculator Errors**:
   - "Use the calculator to divide 10 by 0"
   - "Use the calculator to add 'hello' and 5" (should be caught by schema validation)

2. **Text Analyzer Errors**:
   - "Use the text analyzer on an empty string" (should be caught by schema validation)

3. **Random Generator Errors**:
   - "Generate 25 random numbers" (should be limited to 20)
   - "Generate a password with length 150" (should be limited to 100)

### Step 6B: Verify Error Handling
- [ ] Division by zero shows proper error message
- [ ] Schema validation prevents invalid inputs
- [ ] Range limits are enforced
- [ ] Error messages are user-friendly

**✅ Checkpoint**: Robust error handling implemented.

---

## 🎓 Day 2 Wrap-Up

### The Big Picture - What You Built Today
Think of what you accomplished:

🏭 **You're Now a Tool Suite Owner**
- **Your suite** = Three interconnected tools
- **Your capabilities** = Math, analysis, and generation
- **Your expertise** = Complex validation and error handling
- **Your integration** = Multi-tool workflows

**Today you:**
1. ✅ **Built three different tool types** (computational, analytical, generative)
2. ✅ **Implemented complex validation** (ranges, enums, conditional parameters)
3. ✅ **Added proper error handling** (graceful failures and user-friendly messages)
4. ✅ **Created tool workflows** (using multiple tools together)

### Real-World Applications
Now you can build tool suites for:
- 🔧 **Development workflows**: "Format code, run tests, deploy"
- 📊 **Data processing**: "Import, analyze, visualize data"
- 🌐 **Content management**: "Generate, edit, publish content"
- 🎯 **Business automation**: "Calculate, report, notify stakeholders"

### What You Learned Today
- ✅ **Multi-tool architecture**: How to organize multiple tools in one server
- ✅ **Advanced validation**: Complex schemas with conditional logic
- ✅ **Error handling patterns**: Graceful failures and user feedback
- ✅ **Tool composition**: How tools can work together in workflows

### Common Patterns You Mastered
- **Input validation**: Using Zod for robust parameter checking
- **Error handling**: Returning user-friendly error messages
- **Optional parameters**: Providing sensible defaults
- **Conditional logic**: Different behaviors based on parameters
- **Output formatting**: Creating readable, structured responses

### Tomorrow's Preview
Day 3: You'll learn about **Resources** and **Prompts** - the other two core MCP concepts!

---

## 🎯 Bonus Challenge (Optional)

Ready to take your tools to the next level? Choose any of these challenges:

### Challenge 1: Enhanced Calculator 🧮
Add support for:
- **Advanced operations**: power, square root, factorial
- **History tracking**: Remember previous calculations
- **Expression parsing**: Handle "2 + 3 * 4" strings

### Challenge 2: Smart Text Analyzer 🧠
Add features like:
- **Readability scoring**: Flesch-Kincaid level
- **Language detection**: Identify the text language
- **Keyword extraction**: Find the most important terms

### Challenge 3: Advanced Random Generator 🎲
Add generators for:
- **Names**: Random first/last names
- **Addresses**: Fake addresses for testing
- **Lorem ipsum**: Placeholder text generation

### Challenge 4: Tool Integration 🔗
Create a **workflow tool** that:
- Takes a workflow description
- Automatically calls other tools in sequence
- Combines results into a final report

### Testing Your Bonus Features

**After implementing any challenge:**
1. **Build**: `npm run build`
2. **Test locally**: `npm start` (check for errors)
3. **Test in Claude**: Try your enhanced features

**Example advanced test commands:**
- "Calculate the square root of 144 and keep a history"
- "Analyze this text and detect its language and readability level"
- "Generate a workflow that creates random numbers, analyzes them, and calculates their average"

### 💡 Learning Points
- **Tool expansion**: How to add features without breaking existing functionality
- **Advanced algorithms**: Implementing complex calculations and analysis
- **Workflow orchestration**: Tools that coordinate other tools
- **User experience**: Making complex features intuitive

**Ready for Day 3?** Tomorrow you'll master Resources and Prompts!

---

*Need help? Check the error logs, compare with `days/day-2/index-complete.ts`, or look at the working examples in the `examples/` folder.*
