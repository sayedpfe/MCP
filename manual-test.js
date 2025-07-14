#!/usr/bin/env node

/**
 * Interactive MCP Server Tester
 * A simple way to test your MCP server manually
 */

console.log('🧪 MCP Server Manual Testing Guide\n');

console.log('To test your MCP server, you have several options:\n');

console.log('1️⃣  BASIC STARTUP TEST');
console.log('   Run: npm start');
console.log('   Expected output:');
console.log('   ✅ mcp-learning-server v1.0.0 running on stdio');
console.log('   ✅ Available capabilities list\n');

console.log('2️⃣  CLAUDE DESKTOP INTEGRATION TEST');
console.log('   a) Configure Claude Desktop with your server');
console.log('   b) Look for the 🔧 tools icon in Claude interface');
console.log('   c) Try these prompts:');
console.log('      • "Calculate 25 + 17"');
console.log('      • "Convert \\'HELLO\\' to lowercase"');
console.log('      • "Show me the MCP learning guide"\n');

console.log('3️⃣  VERIFY CAPABILITIES');
console.log('   Your server should expose:');
console.log('   🔧 Tools: calculate, text-utils');
console.log('   📚 Resources: learning-guide://mcp-basics');
console.log('   💭 Prompts: code-review\n');

console.log('4️⃣  TROUBLESHOOTING');
console.log('   If server won\\'t start:');
console.log('   • Run: npm run build');
console.log('   • Check for TypeScript errors');
console.log('   • Verify Node.js version (16+)\n');

console.log('   If Claude Desktop can\\'t find server:');
console.log('   • Check claude_desktop_config.json syntax');
console.log('   • Verify absolute path to build/index.js');
console.log('   • Restart Claude Desktop completely\n');

console.log('🎯 Quick Test Commands:');
console.log('   npm start        # Start the server');
console.log('   npm run build    # Rebuild TypeScript');
console.log('   npm run dev      # Build and start');
console.log('   npm run watch    # Watch mode for development\n');

console.log('📍 Your server location:');
console.log(`   ${process.cwd()}\\build\\index.js\n`);

console.log('🔗 Use this path in Claude Desktop config:\n');
console.log('   {');
console.log('     "mcpServers": {');
console.log('       "mcp-learning-server": {');
console.log('         "command": "node",');
console.log(`         "args": ["${process.cwd().replace(/\\/g, '\\\\')}\\\\build\\\\index.js"]`);
console.log('       }');
console.log('     }');
console.log('   }\n');

console.log('🚀 Ready to test! Start with: npm start');
