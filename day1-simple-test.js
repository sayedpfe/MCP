#!/usr/bin/env node

/**
 * Simple Test for Day 1
 * Tests if your greeting tool works
 */

import { spawn } from 'child_process';

async function testBasicServer() {
    console.log('🧪 Day 1 Simple Test\n');
    
    console.log('🚀 Starting your MCP server...');
    
    // Start the server and check output
    const serverProcess = spawn('node', ['build/index.js'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: process.cwd()
    });

    let output = '';
    let errorOutput = '';

    serverProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    serverProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.log(data.toString().trim());
    });

    // Wait a moment for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Stop the server
    serverProcess.kill();

    console.log('\n📊 Test Results:');
    
    // Check if server started successfully
    if (errorOutput.includes('mcp-learning-server v1.0.0 running on stdio')) {
        console.log('✅ Server started successfully');
    } else {
        console.log('❌ Server failed to start');
    }

    // Check if greeting tool is mentioned
    if (errorOutput.includes('greeting')) {
        console.log('✅ Greeting tool detected');
    } else {
        console.log('❌ Greeting tool not found');
    }

    // Check for errors
    if (errorOutput.includes('Error') || errorOutput.includes('error')) {
        console.log('⚠️  Some errors detected - check the output above');
    } else {
        console.log('✅ No errors detected');
    }

    console.log('\n🎯 Next Steps:');
    console.log('1. If all tests passed: Continue to Claude Desktop setup in Day 1 exercise');
    console.log('2. If tests failed: Check your code in src/index.ts');
    console.log('3. Run "npm run build" if you made changes');
}

// Run the test
testBasicServer().catch(console.error);
