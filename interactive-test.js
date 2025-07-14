#!/usr/bin/env node

/**
 * Interactive MCP Server Test
 * Tests individual MCP server functionality
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function runInteractiveTest() {
    console.log('🧪 Interactive MCP Server Test\n');
    
    try {
        // Create transport that will start the server
        const transport = new StdioClientTransport({
            command: 'node',
            args: ['build/index.js']
        });

        // Create client
        const client = new Client({
            name: 'test-client',
            version: '1.0.0',
        }, {
            capabilities: {},
        });

        console.log('🔌 Connecting to MCP server...');
        await client.connect(transport);
        console.log('✅ Connected successfully!\n');

        // Test 1: List available tools
        console.log('📋 Testing: List Available Tools');
        const tools = await client.listTools();
        console.log('Available tools:');
        tools.tools.forEach(tool => {
            console.log(`  ✓ ${tool.name}: ${tool.description}`);
        });

        // Test 2: Use calculator tool
        console.log('\n🧮 Testing: Calculator Tool');
        const calcResult = await client.callTool({
            name: 'calculate',
            arguments: {
                operation: 'multiply',
                a: 7,
                b: 8
            }
        });
        console.log('Calculator result:', calcResult.content[0]?.text);

        // Test 3: Use text utils tool
        console.log('\n📝 Testing: Text Utils Tool');
        const textResult = await client.callTool({
            name: 'text-utils',
            arguments: {
                operation: 'reverse',
                text: 'MCP is awesome!'
            }
        });
        console.log('Text utils result:', textResult.content[0]?.text);

        // Test 4: List resources
        console.log('\n📚 Testing: List Resources');
        const resources = await client.listResources();
        console.log('Available resources:');
        resources.resources.forEach(resource => {
            console.log(`  ✓ ${resource.name} (${resource.uri})`);
        });

        // Test 5: Read a resource
        if (resources.resources.length > 0) {
            console.log('\n📖 Testing: Read Resource');
            const resourceContent = await client.readResource({
                uri: resources.resources[0].uri
            });
            const content = resourceContent.contents[0]?.text;
            console.log(`Resource content preview: ${content?.substring(0, 150)}...`);
        }

        // Test 6: List prompts
        console.log('\n💭 Testing: List Prompts');
        const prompts = await client.listPrompts();
        console.log('Available prompts:');
        prompts.prompts.forEach(prompt => {
            console.log(`  ✓ ${prompt.name}: ${prompt.description}`);
        });

        console.log('\n🎉 All tests completed successfully!');
        console.log('Your MCP server is fully functional and ready to use.');

        // Cleanup
        await client.close();

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run the interactive test
runInteractiveTest();
