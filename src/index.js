#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var zod_1 = require("zod");
// Server configuration
var SERVER_INFO = {
    name: "mcp-learning-server",
    version: "1.0.0",
};
// Create server instance
var server = new mcp_js_1.McpServer({
    name: SERVER_INFO.name,
    version: SERVER_INFO.version,
    capabilities: {
        resources: {},
        tools: {},
        prompts: {},
    },
});
// Example Tool: Simple Calculator
server.tool("calculate", "Perform basic arithmetic calculations", {
    operation: zod_1.z.enum(["add", "subtract", "multiply", "divide"]).describe("The operation to perform"),
    a: zod_1.z.number().describe("First number"),
    b: zod_1.z.number().describe("Second number"),
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var result;
    var operation = _b.operation, a = _b.a, b = _b.b;
    return __generator(this, function (_c) {
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
                    throw new Error("Division by zero is not allowed");
                }
                result = a / b;
                break;
        }
        return [2 /*return*/, {
                content: [
                    {
                        type: "text",
                        text: "Result: ".concat(a, " ").concat(operation, " ").concat(b, " = ").concat(result),
                    },
                ],
            }];
    });
}); });
// Example Tool: Text Utilities
server.tool("text-utils", "Perform various text operations", {
    operation: zod_1.z.enum(["uppercase", "lowercase", "reverse", "count"]).describe("The text operation to perform"),
    text: zod_1.z.string().describe("The input text"),
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var result;
    var operation = _b.operation, text = _b.text;
    return __generator(this, function (_c) {
        switch (operation) {
            case "uppercase":
                result = text.toUpperCase();
                break;
            case "lowercase":
                result = text.toLowerCase();
                break;
            case "reverse":
                result = text.split("").reverse().join("");
                break;
            case "count":
                result = "Character count: ".concat(text.length, ", Word count: ").concat(text.split(/\s+/).filter(function (word) { return word.length > 0; }).length);
                break;
        }
        return [2 /*return*/, {
                content: [
                    {
                        type: "text",
                        text: "Operation: ".concat(operation, "\nInput: \"").concat(text, "\"\nResult: ").concat(result),
                    },
                ],
            }];
    });
}); });
// Example Resource: Learning Guide
server.resource("learning-guide://mcp-basics", "MCP Learning Guide - Basics", function () { return __awaiter(void 0, void 0, void 0, function () {
    var guide;
    return __generator(this, function (_a) {
        guide = "\n# MCP Learning Guide - Basics\n\n## What is MCP?\nModel Context Protocol (MCP) is an open protocol that enables AI assistants to securely connect to external data sources and tools.\n\n## Core Concepts\n\n### 1. Tools\nTools are functions that can be executed by AI assistants with user approval. They enable:\n- API calls to external services\n- File operations\n- Database queries\n- Complex computations\n\n### 2. Resources\nResources provide file-like data that can be read by clients:\n- Documentation\n- Configuration files\n- Data sources\n- API responses\n\n### 3. Prompts\nPrompts are pre-written templates that help users accomplish specific tasks:\n- Code generation templates\n- Analysis frameworks\n- Structured responses\n\n## Getting Started\n1. Set up your MCP server with the SDK\n2. Define your tools, resources, and prompts\n3. Configure transport (stdio for desktop apps)\n4. Test with Claude Desktop or other clients\n\n## Best Practices\n- Use TypeScript for type safety\n- Implement proper error handling\n- Validate inputs with Zod\n- Provide clear descriptions\n- Test thoroughly before deployment\n";
        return [2 /*return*/, {
                contents: [
                    {
                        type: "text",
                        text: guide,
                    },
                ],
            }];
    });
}); });
// Example Prompt: Code Review Template
server.prompt("code-review", "Generate a structured code review", {
    code: zod_1.z.string().describe("The code to review"),
    language: zod_1.z.string().optional().describe("Programming language"),
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var template;
    var code = _b.code, language = _b.language;
    return __generator(this, function (_c) {
        template = "\nPlease review the following ".concat(language || "code", ":\n\n```").concat(language || "", "\n").concat(code, "\n```\n\nProvide feedback on:\n1. **Code Quality**: Readability, maintainability, and best practices\n2. **Performance**: Potential optimizations and efficiency concerns\n3. **Security**: Potential vulnerabilities or security issues\n4. **Testing**: Suggestions for test coverage and test cases\n5. **Documentation**: Comments and documentation quality\n\nPlease be constructive and specific in your feedback.\n");
        return [2 /*return*/, {
                description: "Code review template with structured feedback sections",
                messages: [
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: template,
                        },
                    },
                ],
            }];
    });
}); });
// Main function to start the server
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var transport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transport = new stdio_js_1.StdioServerTransport();
                    return [4 /*yield*/, server.connect(transport)];
                case 1:
                    _a.sent();
                    // Log server start (to stderr so it doesn't interfere with stdio transport)
                    console.error("".concat(SERVER_INFO.name, " v").concat(SERVER_INFO.version, " running on stdio"));
                    console.error("Available capabilities:");
                    console.error("- Tools: calculate, text-utils");
                    console.error("- Resources: learning-guide://mcp-basics");
                    console.error("- Prompts: code-review");
                    return [2 /*return*/];
            }
        });
    });
}
// Error handling
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.error('\nShutting down server...');
        process.exit(0);
        return [2 /*return*/];
    });
}); });
process.on('uncaughtException', function (error) {
    console.error('Uncaught exception:', error);
    process.exit(1);
});
// Start the server
main().catch(function (error) {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
