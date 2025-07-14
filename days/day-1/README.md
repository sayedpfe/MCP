# Day 1 Files Explained

This folder contains the files for Day 1 of your MCP learning journey.

## 📁 Files in This Folder

### `index-starter.ts` - Your Starting Point
- **Purpose**: Clean, minimal MCP server to begin with
- **Contains**: Basic server setup + TODO comment for your first tool
- **Use**: Copy this to `src/index.ts` to start Day 1 fresh

### `index-complete.ts` - Day 1 Finished
- **Purpose**: What your server should look like after completing Day 1
- **Contains**: Basic server + greeting tool (fully working)
- **Use**: Reference when stuck, or copy to see the final result

## 🔄 How to Use These Files

### **Starting Day 1**
```bash
# Copy the starter file to your main project
cp days/day-1/index-starter.ts src/index.ts

# Build and test
npm run build
npm start
```

### **If You Get Stuck**
```bash
# Compare your code with the complete version
code days/day-1/index-complete.ts
code src/index.ts
```

### **See the Final Result**
```bash
# Copy the complete version to see how it should work
cp days/day-1/index-complete.ts src/index.ts
npm run build
npm start
```

## 📝 TypeScript vs JavaScript Relationship

### **What You Write**: `index.ts` (TypeScript)
- Human-readable code with type safety
- Uses `z.string()`, `async/await`, modern syntax
- Cannot run directly in Node.js

### **What Gets Built**: `index.js` (JavaScript)
- Machine-readable code that Node.js can execute
- Generated from TypeScript during `npm run build`
- This is what actually runs your server

### **The Build Process**
```
src/index.ts  →  [npm run build]  →  build/index.js
    ↑                                      ↓
Your TypeScript                    What Node.js runs
```

## 🎯 Learning Tips

1. **Always edit** `.ts` files (TypeScript source)
2. **Always run** `npm run build` after changes
3. **Node.js runs** the `.js` files in the `build/` folder
4. **Never edit** `.js` files directly (they get overwritten)

## 🚀 Ready for Day 1?

1. Copy `index-starter.ts` to `src/index.ts`
2. Follow `exercises/day-1-basics.md`
3. Compare with `index-complete.ts` when done!
