#!/usr/bin/env node

/**
 * Simple MCP Server Test Script
 * This script demonstrates how to test MCP server tools manually
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

class McpTester {
  constructor() {
    this.client = null;
    this.serverProcess = null;
  }

  async startServer() {
    console.log('🚀 Starting MCP server...');
    
    // Start the MCP server process
    this.serverProcess = spawn('node', ['build/index.js'], {
      stdio: ['pipe', 'pipe', 'inherit'],
      cwd: process.cwd()
    });

    // Create transport and client
    const transport = new StdioClientTransport({
      stdin: this.serverProcess.stdin,
      stdout: this.serverProcess.stdout,
    });

    this.client = new Client({
      name: 'test-client',
      version: '1.0.0',
    }, {
      capabilities: {},
    });

    // Connect to the server
    await this.client.connect(transport);
    console.log('✅ Connected to MCP server');
  }

  async testListTools() {
    console.log('\n📋 Testing: List Available Tools');
    try {
      const result = await this.client.listTools();
      console.log('Available tools:');
      result.tools.forEach(tool => {
        console.log(`  - ${tool.name}: ${tool.description}`);
      });
      return true;
    } catch (error) {
      console.error('❌ Error listing tools:', error.message);
      return false;
    }
  }

  async testCalculator() {
    console.log('\n🧮 Testing: Calculator Tool');
    try {
      const result = await this.client.callTool({
        name: 'calculate',
        arguments: {
          operation: 'add',
          a: 15,
          b: 27
        }
      });
      
      console.log('Calculator result:', result.content[0]?.text);
      return true;
    } catch (error) {
      console.error('❌ Error testing calculator:', error.message);
      return false;
    }
  }

  async testTextUtils() {
    console.log('\n📝 Testing: Text Utils Tool');
    try {
      const result = await this.client.callTool({
        name: 'text-utils',
        arguments: {
          operation: 'uppercase',
          text: 'hello world'
        }
      });
      
      console.log('Text utils result:', result.content[0]?.text);
      return true;
    } catch (error) {
      console.error('❌ Error testing text utils:', error.message);
      return false;
    }
  }

  async testResources() {
    console.log('\n📚 Testing: Resources');
    try {
      const result = await this.client.listResources();
      console.log('Available resources:');
      result.resources.forEach(resource => {
        console.log(`  - ${resource.uri}: ${resource.name}`);
      });

      // Try to read a resource
      if (result.resources.length > 0) {
        const resourceContent = await this.client.readResource({
          uri: result.resources[0].uri
        });
        console.log(`First resource content preview: ${resourceContent.contents[0]?.text?.substring(0, 100)}...`);
      }
      return true;
    } catch (error) {
      console.error('❌ Error testing resources:', error.message);
      return false;
    }
  }

  async testPrompts() {
    console.log('\n💭 Testing: Prompts');
    try {
      const result = await this.client.listPrompts();
      console.log('Available prompts:');
      result.prompts.forEach(prompt => {
        console.log(`  - ${prompt.name}: ${prompt.description}`);
      });
      return true;
    } catch (error) {
      console.error('❌ Error testing prompts:', error.message);
      return false;
    }
  }

  async runAllTests() {
    console.log('🧪 Running MCP Server Tests\n');
    
    await this.startServer();
    
    const tests = [
      this.testListTools.bind(this),
      this.testCalculator.bind(this),
      this.testTextUtils.bind(this),
      this.testResources.bind(this),
      this.testPrompts.bind(this)
    ];

    let passed = 0;
    let total = tests.length;

    for (const test of tests) {
      const success = await test();
      if (success) passed++;
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
    }

    console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! Your MCP server is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Check the error messages above.');
    }

    await this.cleanup();
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up...');
    if (this.client) {
      await this.client.close();
    }
    if (this.serverProcess) {
      this.serverProcess.kill();
    }
    console.log('✅ Cleanup complete');
  }
}

// Run the tests
const tester = new McpTester();
tester.runAllTests().catch(console.error);
