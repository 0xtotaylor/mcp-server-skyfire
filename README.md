# mcp-server-skyfire

A Model Context Protocol (MCP) server implementation that interfaces with the Skyfire payment system. This server enables AI models to make payments through Skyfire's infrastructure using a standardized protocol.

## Overview

This server implements the Model Context Protocol to provide payment functionality via Skyfire's API. It exposes a single tool, `make_payment`, which allows authorized clients to initiate payments to Skyfire users.

## Prerequisites

- Node.js (ES2022 compatible)
- TypeScript
- A valid Skyfire API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mcp-server-skyfire
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Skyfire API key:
```env
SKYFIRE_API_KEY=your_api_key_here
```

## Building

To build the project:

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Make the output file executable
- Place the built files in the `./build` directory

## Features

The server exposes one tool through the MCP interface:

### make_payment

Makes a payment to a specified Skyfire user.

**Parameters:**
- `receiverUsername` (string): The username of the payment recipient
- `amount` (string): The payment amount

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Payment of [amount] successfully sent to [username]"
    }
  ]
}
```

## Error Handling

The server implements comprehensive error handling for various scenarios:

- Invalid tool name: Returns `MethodNotFound` error
- Missing or invalid parameters: Returns `InvalidParams` error
- Payment processing failures: Returns `InternalError` error

## Dependencies

Main dependencies include:
- `@modelcontextprotocol/sdk`: ^1.0.3
- `@skyfire-xyz/skyfire-sdk`: ^0.8.5
- `dotenv`: ^16.4.7
- `zod`: ^3.24.1

## Development

The project is set up with TypeScript and includes:
- Strict type checking
- ES2022 target
- Node16 module resolution
- Consistent file casing enforcement

## Running the Server

The server runs on standard input/output (stdio). After building, you can run it using:

```bash
./build/index.js
```

Or through the npm binary:

```bash
mcp-server-skyfire
```