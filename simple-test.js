#!/usr/bin/env node

/**
 * Simple MCP Server Manual Test
 * This demonstrates the server capabilities in a simple way
 */

import { spawn } from 'child_process';

async function testServer() {
    console.log('🧪 Manual MCP Server Test\n');
    
    console.log('🚀 Starting MCP server...');
    
    // Start the server
    const serverProcess = spawn('node', ['build/index.js'], {
        stdio: ['inherit', 'inherit', 'inherit'],
        cwd: process.cwd()
    });

    // Handle server exit
    serverProcess.on('exit', (code) => {
        console.log(`\n📊 Server exited with code: ${code}`);
        if (code === 0) {
            console.log('✅ Server ran successfully!');
            console.log('\n🎯 What you should see:');
            console.log('  - Server capabilities listing');
            console.log('  - Available tools: calculate, text-utils');  
            console.log('  - Available resources: learning-guide://mcp-basics');
            console.log('  - Available prompts: code-review');
            console.log('\n💡 This means your MCP server is working correctly!');
        } else {
            console.log('❌ Server encountered an error');
        }
    });

    // Handle errors
    serverProcess.on('error', (error) => {
        console.error('❌ Failed to start server:', error);
    });

    // Stop server after 3 seconds
    setTimeout(() => {
        console.log('\n⏹️  Stopping server...');
        serverProcess.kill('SIGTERM');
    }, 3000);
}

// Run the test
testServer().catch(console.error);
