export type ArgDefinition =
    | {
          type: "string";
          description: string;
          minLength?: number;
          maxLength?: number;
          pattern?: string;
          enum?: string[];
      }
    | {
          type: "number" | "integer";
          description: string;
          minimum?: number;
          maximum?: number;
          enum?: number[];
      }
    | {
          type: "boolean";
          description: string;
      };
export interface FunctionArgs {
    [key: string]: ArgDefinition;
}
/** Typed async-or-sync tool handler. */
export type ToolFunction<T = Record<string, any>, R = any> = (
    args: T
) => R | Promise<R>;
/** JSON Schema container type for tool parameters. */
export type ParameterType = "object" | "array";
export interface FunctionLayout {
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: {
            type: ParameterType;
            properties: Record<string, ArgDefinition>;
            required: string[];
        };
    };
}
export interface ToolCall<T = Record<string, any>> {
    name: string;
    args: T;
}
export class Tool<T extends Record<string, any>, R = any> {
    private readonly _name: string | undefined;
    private readonly description: string;
    private readonly args: FunctionArgs;
    private readonly handler: ToolFunction<T, R>;
    private readonly parameterType: ParameterType;
    private readonly required: string[];

    constructor(
        description: string,
        args: FunctionArgs,
        handler: ToolFunction<T, R>,
        parameterType: ParameterType = "object",
        required: string[] = [],
        name?: string
    ) {
        this._name = name;
        this.description = description;
        this.args = args;
        this.handler = handler;
        this.parameterType = parameterType;
        this.required = required;
    }

    /** Resolved name: explicit override → inferred from handler function name. */
    public get name(): string {
        return this._name ?? this.handler.name;
    }

    /** Invoke the tool with the given arguments. */
    public call(args: T): R | Promise<R> {
        return this.handler(args);
    }

    /** Serialise to the Anthropic / OpenAI function-calling wire format. */
    public json(): FunctionLayout {
        return {
            type: "function",
            function: {
                name: this.name,
                description: this.description,
                parameters: {
                    type: this.parameterType,
                    properties: this.args,
                    required: this.required,
                },
            },
        };
    }
}
export class ToolRegistry {
    private readonly tools = new Map<string, Tool<any, any>>();

    /**
     * Register a tool.
     * @throws if a tool with the same name is already registered.
     */
    public add<T extends Record<string, any>, R>(tool: Tool<T, R>): this {
        if (this.tools.has(tool.name)) {
            throw new Error(`Tool '${tool.name}' is already registered.`);
        }
        this.tools.set(tool.name, tool);
        return this;
    }

    /** All registered tools. */
    public get all(): Tool<any, any>[] {
        return [...this.tools.values()];
    }

    /** Serialised list of all tools for the model. */
    public list(): FunctionLayout[] {
        return this.all.map((tool) => tool.json());
    }

    /**
     * Dispatch a tool call by name.
     * @throws if no tool with that name is registered.
     */
    public dispatch<T extends Record<string, any>, R = any>(
        call: ToolCall<T>
    ): R | Promise<R> {
        const tool = this.tools.get(call.name) as Tool<T, R> | undefined;
        if (!tool) {
            throw new Error(`Tool '${call.name}' not found.`);
        }
        return tool.call(call.args);
    }
}