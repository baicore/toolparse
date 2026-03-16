# toolparse

Small TypeScript utility for defining AI tools, storing them in a registry array, and dispatching calls by tool name.

## Install

```bash
npm install toolparse
```

## Quick Start

```ts
import { Tool, ToolRegistry } from "toolparse";

const registry = new ToolRegistry();

const addTool = new Tool(
	"Add two numbers",
	{
		a: { type: "number", description: "First number" },
		b: { type: "number", description: "Second number" }
	},
	({ a, b }: { a: number; b: number }) => {
		return a + b;
	},
	"object",
	["a", "b"],
	"add_numbers"
);

registry.add(addTool);

const result = await registry.dispatch<{ a: number; b: number }, number>({
	name: "add_numbers",
	args: { a: 2, b: 3 }
});

console.log(result); // 5
```

## API

### `Tool`

- Encapsulates a tool handler function and schema metadata.
- `call(args)` runs the provided function.
- `json()` returns an OpenAI-style function tool layout.

### `ToolRegistry`

- Stores tools in an internal array.
- `add(tool)` registers a tool and prevents duplicate names.
- `all` returns the current tool array.
- `list()` returns all tool JSON layouts.
- `dispatch({ name, args })` finds a tool by name and runs it.
