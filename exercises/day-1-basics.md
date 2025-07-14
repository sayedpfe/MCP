# Day 1: MCP Basics - Step by Step

Welcome to your first day of MCP learning! Today you'll understand the fundamentals and create your first custom tool.

## 🎯 Today's Goals
By the end of today, you'll have:
- ✅ Created your first custom tool
- ✅ Connected to Claude Desktop
- ✅ Understanding of MCP core concepts

---

## 📚 Step 1: Read MCP Documentation (15 minutes)

### What to Read
1. Open `docs/best-practices.md` in your workspace
2. Read the "Understanding MCP" section
3. Focus on the three core concepts:
   } else {
    return { mood: "balanced", emoji: "😊", description: "well-rounded" };
  } **Tools**: Functions Claude can call
   - **Resources**: Data Claude can read  
   - **Prompts**: Templates for specific tasks

### Quick Quiz (Test Yourself)
Before moving on, answer these:
- What's the difference between a tool and a resource?
- Why do tools need input validation?
- What transport method are we using? (Hint: stdio)

---

## 🔧 Step 2: Create Your First Tool (30 minutes)

### Exercise: Build a "Greeting" Tool

**Goal**: Create a tool that takes a name and returns a personalized greeting.

### Step 2A: Start with a Completely Clean Slate
1. **Copy the Day 1 starter file to create your working file**:
   ```powershell
   Copy-Item days/day-1/index-starter.ts src/index.ts
   ```
   
2. **Verify your src folder now has the starter file**:
   ```powershell
   Get-ChildItem src/
   # Should show: index.ts
   ```
   
3. **Open your new working file**:
   ```powershell
   code src/index.ts
   ```
   
4. **You should see a clean, minimal server with**:
   - Basic imports
   - Server configuration  
   - Empty server instance
   - TODO comment where you'll add your tool
   - No existing tools or complexity!

### Step 2B: Add Your First Tool
1. Find the comment `// TODO: Add your first tool here (Day 1 exercise)`
2. **Important**: You'll see bonus challenge comments below this - **ignore them for now**! Focus only on the basic exercise.
3. Replace the TODO comment with this complete tool:

```typescript
// Your first tool: Greeting
server.tool(
  "greeting",
  "Create personalized greetings",
  {
    name: z.string().describe("Name of the person to greet"),
    style: z.enum(["formal", "casual", "enthusiastic"]).optional().describe("Style of greeting"),
  },
  async ({ name, style = "casual" }) => {
    let greeting;
    
    switch (style) {
      case "formal":
        greeting = `Good day, ${name}. I hope you're having a pleasant experience.`;
        break;
      case "enthusiastic":
        greeting = `HEY THERE ${name.toUpperCase()}! 🎉 You're AWESOME!`;
        break;
      default: // casual
        greeting = `Hey ${name}! Nice to meet you! 👋`;
    }
    
    return {
      content: [{
        type: "text",
        text: greeting
      }]
    };
  }
);
```

### Step 2C: Update the Server Capabilities Log
1. Find this line in the `main()` function:
   ```typescript
   console.error("- Tools: (none yet - add your first tool!)");
   ```
2. Replace it with:
   ```typescript
   console.error("- Tools: greeting");
   ```

**✅ Checkpoint**: Your `src/index.ts` should now have:
- ✅ The greeting tool with name and style parameters
- ✅ Switch statement with formal, casual, and enthusiastic cases
- ✅ Updated console log showing "greeting" tool
- ✅ All bonus challenge helpers commented out (ignore these for now)

### Step 2D: Test Your Tool
1. **Build your TypeScript code** (converts `.ts` to `.js` and creates build folder):
   ```bash
   npm run build
   ```
   You should see the TypeScript compiler create a `build/` folder with `index.js`.

2. **Test that the server starts**:
   ```bash
   npm start
   ```
   You should see:
   ```
   mcp-learning-server v1.0.0 running on stdio
   Available capabilities:
   - Tools: greeting
   - Resources: (none yet)
   - Prompts: (none yet)
   ```

3. **Stop the server** (Ctrl+C) and test with the interactive test:
   ```bash
   node interactive-test.js
   ```

4. **Verify**: You should see "greeting" in the list of available tools!

### 💡 Understanding TypeScript → JavaScript
- **You edit**: `src/index.ts` (TypeScript - human readable)
- **npm run build creates**: `build/index.js` (JavaScript - Node.js runs this)
- **Never edit**: `.js` files directly (they get overwritten!)
- **First build**: Creates the `build/` folder automatically

### 🆘 If You Get Stuck
Compare your code with the complete version:
```bash
code days/day-1/index-complete.ts
```

---

## 🖥️ Step 3: Connect to Claude Desktop (20 minutes)

### Step 3A: Find Your Claude Desktop Config Folder

The Claude configuration folder may not exist yet. Let's find or create it:

#### **Option 1: Check if Claude folder exists**
1. **Windows**: Press `Win + R`, type `%APPDATA%`, press Enter
2. Look for a folder named `Claude`
3. If it exists, open it and skip to Step 3B

#### **Option 2: If Claude folder doesn't exist**
1. **Make sure Claude Desktop is installed** from https://claude.ai/download
2. **Run Claude Desktop at least once** (it creates the config folder)
3. **Close Claude Desktop completely**
4. **Check again**: Press `Win + R`, type `%APPDATA%\Claude`, press Enter

#### **Option 3: Create the folder manually**
If the folder still doesn't exist:
1. **Open Command Prompt** or **PowerShell**
2. **Create the folder**:
   ```bash
   mkdir "%APPDATA%\Claude"
   ```
3. **Navigate to it**:
   ```bash
   cd "%APPDATA%\Claude"
   ```

#### **Verify the path**
The full path should be something like:
`C:\Users\[YourUsername]\AppData\Roaming\Claude`

### Step 3B: Create or Edit the Configuration File
1. **In the Claude folder**, create or open `claude_desktop_config.json`
2. **If the file doesn't exist**, create it with a text editor
3. **Add this exact content** (update the path to match your actual project location):

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

**⚠️ Critical Steps**: 
- **Replace the path** with YOUR actual project folder path
- **Use double backslashes** (`\\`) on Windows
- **Make sure** `build/index.js` exists in your project (run `npm run build` first)
- **Save the file** as `claude_desktop_config.json` (not .txt)

#### **How to find your correct path**:
1. **In your MCP project folder**, run:
   ```bash
   pwd
   # Shows: D:\OneDrive\OneDrive - Microsoft\Documents\Learning Projects\MCP
   ```
2. **Your args path should be**: `D:\\OneDrive\\OneDrive - Microsoft\\Documents\\Learning Projects\\MCP\\build\\index.js`
3. **Remember**: Replace single `\` with double `\\` in the JSON file

### Step 3C: Restart and Test Claude Desktop
1. **Completely close** Claude Desktop (check system tray/task manager)
2. **Start Claude Desktop** again
3. **Look for the 🔧 tools icon** in the interface
4. **Try this prompt**: "Use the greeting tool to say hello to Alice in an enthusiastic style"

#### **Troubleshooting Claude Desktop Connection**

**Problem**: "No tools icon appears"
**Solutions**:
1. **Check the config file path**: Make sure you're in the right `%APPDATA%\Claude` folder
2. **Verify JSON syntax**: Use a JSON validator or check for missing commas/brackets
3. **Restart Claude completely**: Close from system tray, not just the window
4. **Check server builds**: Run `npm run build` and verify `build/index.js` exists

**Problem**: "Tools icon appears but tool fails"
**Solutions**:
1. **Check file path**: Make sure the path in JSON points to your actual `build/index.js`
2. **Test server manually**: Run `npm start` to see if the server works
3. **Check for errors**: Look at Claude Desktop's error messages

**Problem**: "Can't find Claude Desktop"
**Solutions**:
1. **Download from**: https://claude.ai/download
2. **Install and run once** to create config folders
3. **Make sure it's the desktop app**, not the web version

#### **Alternative: Test Your Server First**
Before connecting to Claude Desktop, verify your server works:
```bash
# In your project folder:
npm run build
npm start

# You should see:
# mcp-learning-server v1.0.0 running on stdio
# Available capabilities:
# - Tools: greeting
```

If this works, your server is ready for Claude Desktop!

---

## ✅ Step 4: Test Your Custom Tool with Claude AI (10 minutes)

### What This Step Does
You've built a custom "greeting" tool. Now we're testing that **Claude AI can actually use it**.

Think of it like this:
- **You built**: A calculator 🧮
- **Claude Desktop**: The person who will use your calculator
- **Step 4**: Testing that Claude can successfully use your calculator

### Why Use Claude Desktop?
Claude Desktop is an AI assistant that can:
1. **See your custom tools** (like your greeting tool)
2. **Call them when needed** (when you ask for greetings)
3. **Show you the results** (the personalized greeting)

Without Claude Desktop, your tool just sits there unused - like building a calculator but having no one to use it!

### How to Test Your Tool

#### 4A: Open Claude Desktop
1. **Launch Claude Desktop** (the app you installed)
2. **Look for a 🔧 tools icon** in the interface
   - If you see it: ✅ Your tool is connected!
   - If you don't see it: ❌ Go back to Step 3 configuration

#### 4B: Test Your Greeting Tool
**Copy and paste each of these messages into Claude Desktop:**

1. **Test 1 - Basic greeting:**
   ```
   Please use the greeting tool to greet someone named "Alex"
   ```
   
2. **Test 2 - Formal style:**
   ```
   Use the greeting tool to give a formal greeting to "Sarah"
   ```
   
3. **Test 3 - Enthusiastic style:**
   ```
   Use the greeting tool to give an enthusiastic greeting to "Mike"
   ```

#### 4C: What You Should See
When Claude uses your tool, you should see:
- **Claude says**: "I'll use the greeting tool..."
- **Then shows**: The personalized greeting your tool created
- **Example**: "Hey Alex! Nice to meet you! 👋"

### Success Checklist
- [ ] 🔧 Tools icon appears in Claude Desktop
- [ ] Claude can call your greeting tool without errors
- [ ] You get different greetings for different styles (casual, formal, enthusiastic)
- [ ] Each greeting includes the person's name you provided

### What This Proves
✅ **Your custom tool works!**  
✅ **Claude can use tools you build!**  
✅ **You understand the MCP workflow!**

---

## 🎓 Day 1 Wrap-Up

### The Big Picture - What You Just Built
Think of what you accomplished today like this:

🏭 **You're a Tool Factory Owner**
- **Your factory** = Your MCP server (`src/index.ts`)
- **Your products** = Custom tools (today: greeting tool)
- **Your customer** = Claude AI
- **The delivery truck** = MCP protocol (connects your tools to Claude)

**Today you:**
1. ✅ **Built a factory** (MCP server)
2. ✅ **Created a product** (greeting tool)  
3. ✅ **Set up delivery** (Claude Desktop configuration)
4. ✅ **Tested the whole system** (Claude using your tool)

### Real-World Applications
Now that you understand the basics, imagine building tools for:
- 📊 **Data analysis**: "Analyze this spreadsheet"
- 🌐 **API integration**: "Get weather for my location"  
- 📁 **File operations**: "Organize my documents"
- 🔍 **Web scraping**: "Find information about this topic"

**Claude can use ANY tool you build!**

### What You Learned Today
- ✅ **Tool Structure**: Schema definition + handler function
- ✅ **Input Validation**: Required fields and enums
- ✅ **Claude Integration**: Configuration and testing
- ✅ **Development Workflow**: Edit → Build → Test

### Common Issues & Solutions

**Problem**: "Tool not showing in Claude"
**Solution**: 
1. Check config file path is correct
2. Restart Claude completely
3. Verify `npm run build` succeeded

**Problem**: "Error when calling tool"
**Solution**:
1. Check console for error messages
2. Verify all required fields are provided
3. Test with `interactive-test.js` first

### Tomorrow's Preview
Day 2: You'll create 3 more tools and learn advanced input validation patterns!

---

## 🎯 Bonus Challenge (Optional)

Ready to take your greeting tool to the next level? Choose any of these challenges to practice advanced MCP concepts!

### Challenge 1: Time-Aware Greeting 🕐
**Goal**: Make greetings change based on the current time of day.

#### Step-by-Step Implementation:

**1A: Update the Tool Schema**
Add a new optional parameter for time awareness:
```typescript
server.tool(
  "greeting",
  "Create personalized greetings with time awareness",
  {
    name: z.string().describe("Name of the person to greet"),
    style: z.enum(["formal", "casual", "enthusiastic"]).optional().describe("Style of greeting"),
    timeAware: z.boolean().optional().describe("Include time-based greeting (morning/afternoon/evening)")
  },
  // ... handler function
);
```

**1B: Add Time Detection Logic**
Inside your handler function, add this before the switch statement:
```typescript
async ({ name, style = "casual", timeAware = false }) => {
  let timePrefix = "";
  
  if (timeAware) {
    const hour = new Date().getHours();
    if (hour < 12) {
      timePrefix = "Good morning, ";
    } else if (hour < 17) {
      timePrefix = "Good afternoon, ";
    } else {
      timePrefix = "Good evening, ";
    }
  }
  
  let greeting;
  // ... rest of your existing switch statement
```

**1C: Update Your Greeting Messages**
Modify each case to include the time prefix:
```typescript
switch (style) {
  case "formal":
    greeting = `${timePrefix}${name}. I hope you're having a pleasant ${hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'}.`;
    break;
  case "enthusiastic":
    greeting = `${timePrefix.toUpperCase()}${name.toUpperCase()}! 🎉 You're AWESOME!`;
    break;
  default: // casual
    greeting = `${timePrefix}${name}! Nice to meet you! 👋`;
}
```

**Test**: "Use the greeting tool for Alice with time awareness enabled"

---

### Challenge 2: Multi-Language Support 🌍
**Goal**: Support greetings in different languages.

#### Step-by-Step Implementation:

**2A: Update the Schema**
Add a language parameter:
```typescript
server.tool(
  "greeting",
  "Create personalized greetings in multiple languages",
  {
    name: z.string().describe("Name of the person to greet"),
    style: z.enum(["formal", "casual", "enthusiastic"]).optional().describe("Style of greeting"),
    language: z.enum(["english", "spanish", "french", "german"]).optional().describe("Language for the greeting")
  },
  // ... handler function
);
```

**2B: Create Language Templates**
Add this object before your handler function:
```typescript
const greetingTemplates = {
  english: {
    formal: "Good day, {name}. I hope you're having a pleasant experience.",
    casual: "Hey {name}! Nice to meet you! 👋",
    enthusiastic: "HEY THERE {name}! 🎉 You're AWESOME!"
  },
  spanish: {
    formal: "Buenos días, {name}. Espero que tengas una experiencia agradable.",
    casual: "¡Hola {name}! ¡Mucho gusto! 👋",
    enthusiastic: "¡¡HOLA {name}!! 🎉 ¡Eres INCREÍBLE!"
  },
  french: {
    formal: "Bonjour, {name}. J'espère que vous passez une agréable journée.",
    casual: "Salut {name}! Ravi de te rencontrer! 👋",
    enthusiastic: "SALUT {name}! 🎉 Tu es FANTASTIQUE!"
  },
  german: {
    formal: "Guten Tag, {name}. Ich hoffe, Sie haben eine angenehme Erfahrung.",
    casual: "Hallo {name}! Schön dich kennenzulernen! 👋",
    enthusiastic: "HALLO {name}! 🎉 Du bist GROSSARTIG!"
  }
};
```

**2C: Update Handler Logic**
Replace your switch statement with:
```typescript
async ({ name, style = "casual", language = "english" }) => {
  const template = greetingTemplates[language][style];
  const greeting = template.replace('{name}', style === "enthusiastic" ? name.toUpperCase() : name);
  
  return {
    content: [{
      type: "text",
      text: greeting
    }]
  };
}
```

**Test**: "Greet Maria in Spanish with enthusiastic style"

---

### Challenge 3: Mood Detection 😄
**Goal**: Analyze the name to suggest mood and adjust greeting accordingly.

#### Step-by-Step Implementation:

**3A: Add Mood Parameter**
Update your schema:
```typescript
server.tool(
  "greeting",
  "Create personalized greetings with mood detection",
  {
    name: z.string().describe("Name of the person to greet"),
    style: z.enum(["formal", "casual", "enthusiastic"]).optional().describe("Style of greeting"),
    detectMood: z.boolean().optional().describe("Analyze name characteristics to suggest mood")
  },
  // ... handler function
);
```

**3B: Create Mood Detection Function**
Add this function before your handler:
```typescript
function detectMoodFromName(name: string) {
  const nameLength = name.length;
  const hasRepeatedLetters = /(.)\1/.test(name.toLowerCase());
  const hasVowelPattern = /[aeiou]{2,}/i.test(name);
  
  if (nameLength <= 3) {
    return { mood: "energetic", emoji: "⚡", description: "short and punchy" };
  } else if (nameLength >= 8) {
    return { mood: "sophisticated", emoji: "🎩", description: "elegant and refined" };
  } else if (hasRepeatedLetters) {
    return { mood: "playful", emoji: "🤪", description: "fun-loving" };
  } else if (hasVowelPattern) {
    return { mood: "melodic", emoji: "🎵", description: "harmonious" };
  } else {
    return { mood: "balanced", emoji: "�", description: "well-rounded" };
  }
}
```

**3C: Integrate Mood Detection**
Update your handler:
```typescript
async ({ name, style = "casual", detectMood = false }) => {
  let greeting;
  let moodNote = "";
  
  if (detectMood) {
    const mood = detectMoodFromName(name);
    moodNote = ` ${mood.emoji} (I detect a ${mood.description} energy from your name!)`;
  }
  
  switch (style) {
    case "formal":
      greeting = `Good day, ${name}. I hope you're having a pleasant experience.${moodNote}`;
      break;
    case "enthusiastic":
      greeting = `HEY THERE ${name.toUpperCase()}! 🎉 You're AWESOME!${moodNote}`;
      break;
    default: // casual
      greeting = `Hey ${name}! Nice to meet you! 👋${moodNote}`;
  }
  
  return {
    content: [{
      type: "text",
      text: greeting
    }]
  };
}
```

**Test**: "Use the greeting tool for Beethoven with mood detection enabled"

---

### 🏆 Super Challenge: Combine All Features!

If you complete all three challenges, try combining them:
```typescript
server.tool(
  "greeting",
  "Create advanced personalized greetings with time, language, and mood detection",
  {
    name: z.string().describe("Name of the person to greet"),
    style: z.enum(["formal", "casual", "enthusiastic"]).optional(),
    language: z.enum(["english", "spanish", "french", "german"]).optional(),
    timeAware: z.boolean().optional(),
    detectMood: z.boolean().optional()
  },
  // Combine all the logic from above!
);
```

### Testing Your Bonus Features

**After implementing any challenge:**
1. **Build**: `npm run build`
2. **Test locally**: `npm start` (check for errors)
3. **Test in Claude**: "Use the greeting tool for [name] with [your new features]"

**Example test commands:**
- "Greet Sophie in French with time awareness"
- "Give an enthusiastic greeting to Bob with mood detection"
- "Formally greet Isabella in Spanish with both time and mood detection"

### 💡 Learning Points
- **Schema flexibility**: How optional parameters expand functionality
- **Data processing**: Analyzing input to generate intelligent responses  
- **Internationalization**: Supporting multiple languages in tools
- **Creative logic**: Using simple algorithms for interesting features

**Ready for Day 2?** Tomorrow you'll learn about multiple tools working together!

---

*Need help? Check the error logs or look at the working examples in the `examples/` folder.*
