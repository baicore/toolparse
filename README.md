# toolparse

Lightweight TypeScript utilities for defining model-callable tools and dispatching them by name.

## Requirements

- Node.js >= 14.17.6

## Installation

```bash
npm install toolparse
```

## Quick Start

```ts
import { Tool, ToolRegistry } from "toolparse";

type AddArgs = { a: number; b: number };

const registry = new ToolRegistry();

const addNumbers = new Tool<AddArgs, number>(
  "Add two numbers.",
  {
    a: { type: "number", description: "First number" },
    b: { type: "number", description: "Second number" }
  },
  ({ a, b }) => a + b,
  "object",
  ["a", "b"],
  "add_numbers"
);

registry.add(addNumbers);

const result = await registry.dispatch<AddArgs, number>({
  name: "add_numbers",
  args: { a: 2, b: 3 }
});

console.log(result); // 5
console.log(registry.list()); // function-calling layouts
```

## Core Concepts

### Tool

`Tool<TArgs, TResult>` wraps:

- A tool description
- Argument schema (`FunctionArgs`)
- A handler function `(args) => result`
- Optional parameter container type (`"object" | "array"`)
- Optional required argument keys
- Optional explicit tool name

If no explicit name is provided, the handler function name is used.

### Tool Registry

`ToolRegistry` manages tool registration and dispatch.

- `add(tool)` registers a tool by name and rejects duplicates
- `all` returns all registered tools as an array
- `list()` returns serialized function layouts
- `dispatch({ name, args })` finds and executes a tool

## Types

The package exports all major types from its main entrypoint, including:

- `ArgDefinition`
- `FunctionArgs`
- `ToolFunction`
- `ParameterType`
- `FunctionLayout`
- `ToolCall`

`ArgDefinition` supports:

- `string` with `minLength`, `maxLength`, `pattern`, and `enum`
- `number` or `integer` with `minimum`, `maximum`, and `enum`
- `boolean`

## Errors

- Registering a duplicate tool name throws an error.
- Dispatching an unknown tool name throws an error.

## Build

```bash
npm run build
```

## License

MIT (see `LICENSE`)