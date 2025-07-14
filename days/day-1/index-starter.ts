#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Server configuration
const SERVER_INFO = {
  name: "mcp-learning-server",
  version: "1.0.0",
} as const;

// Create server instance
const server = new McpServer({
  name: SERVER_INFO.name,
  version: SERVER_INFO.version,
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
  },
});

// TODO: Add your first tool here (Day 1 exercise)
// Follow the instructions in exercises/day-1-basics.md
//
// BASIC EXERCISE: Replace this comment with your greeting tool
// The exercise will guide you step-by-step to add:
//   server.tool("greeting", "Create personalized greetings", { ... }, async ({ name, style }) => { ... });

// 🎯 BONUS CHALLENGE HELPERS (Optional - for after completing basic exercise)
// Uncomment and use these sections if you're doing the bonus challenges!

// 📝 BONUS Challenge 2: Multi-Language Templates
// Add this object before your tool if doing the language challenge:
/*
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
*/

// 🧠 BONUS Challenge 3: Mood Detection Function
// Add this function before your tool if doing the mood challenge:
/*
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
    return { mood: "balanced", emoji: "😊", description: "well-rounded" };
  }
}
*/

// ⬇️ BONUS HELPERS: Advanced features for after you complete the basic exercise ⬇️

// 🕐 Time-Aware Logic (Challenge 1):
// let timePrefix = "";
// if (timeAware) {
//   const hour = new Date().getHours();
//   if (hour < 12) timePrefix = "Good morning, ";
//   else if (hour < 17) timePrefix = "Good afternoon, ";
//   else timePrefix = "Good evening, ";
// }

// 🧠 Mood Detection Logic (Challenge 3):
// let moodNote = "";
// if (detectMood) {
//   const mood = detectMoodFromName(name);
//   moodNote = ` ${mood.emoji} (I detect a ${mood.description} energy from your name!)`;
// }

// 🌍 Language Template Logic (Challenge 2):
// const template = greetingTemplates[language][style];
// const greeting = template.replace('{name}', style === "enthusiastic" ? name.toUpperCase() : name);

// Main function to start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log server start (to stderr so it doesn't interfere with stdio transport)
  console.error(`${SERVER_INFO.name} v${SERVER_INFO.version} running on stdio`);
  console.error("Available capabilities:");
  console.error("- Tools: (none yet - add your first tool!)");
  console.error("- Resources: (none yet)");
  console.error("- Prompts: (none yet)");
}

// Error handling
process.on('SIGINT', async () => {
  console.error('\nShutting down server...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Start the server
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
