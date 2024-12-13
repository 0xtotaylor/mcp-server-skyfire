import dotenv from "dotenv";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { SkyfireClient } from "@skyfire-xyz/skyfire-sdk";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

dotenv.config();

const SKYFIRE_API_KEY = process.env.SKYFIRE_API_KEY;
if (!SKYFIRE_API_KEY) {
  throw new Error("SKYFIRE_API_KEY environment variable is required");
}

const skyfire = new SkyfireClient({
  apiKey: SKYFIRE_API_KEY,
});

const server = new Server(
  {
    name: "mcp-server-skyfire",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "make_payment",
        description: "Make a payment via Skyfire",
        inputSchema: {
          type: "object",
          properties: {
            receiverUsername: {
              type: "string",
              description: "Username of payment receiver",
            },
            amount: {
              type: "string",
              description: "Payment amount",
            },
          },
          required: ["receiverUsername", "amount"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "make_payment") {
    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${request.params.name}`
    );
  }

  const { receiverUsername, amount } = request.params.arguments || {};

  if (!receiverUsername || typeof receiverUsername !== "string") {
    throw new McpError(
      ErrorCode.InvalidParams,
      "receiverUsername parameter is required and must be a string"
    );
  }

  if (!amount || typeof amount !== "string") {
    throw new McpError(
      ErrorCode.InvalidParams,
      "amount parameter is required and must be a string"
    );
  }

  try {
    await skyfire.payments.makePaymentStandalone({
      payments: [
        {
          receiverUsername: receiverUsername,
          amount: amount,
        },
      ],
    });

    return {
      content: [
        {
          type: "text",
          text: `Payment of ${amount} successfully sent to ${receiverUsername}`,
        },
      ],
    };
  } catch (error) {
    throw new McpError(ErrorCode.InternalError, `Payment failed: ${error}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Skyfire MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
