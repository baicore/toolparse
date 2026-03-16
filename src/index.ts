import type { F, FT, FunctionArgs, FunctionLayout, ToolCall } from "./interfaces.js";

export * from "./interfaces.js";
export class Tool<T extends Record<string, any>, R = any> {
    private fn: string | null | undefined;
    private fd: string;
    private fa: FunctionArgs;
    private fs: F<T, R>;
    private ft: FT;
    private fr: string[];
    constructor(
        function_description: string,
        function_args: FunctionArgs,
        function_self: F<T, R>,
        function_type: FT = "object",
        function_required: string[] = [],
        function_name?: string
    ) {
        this.fn = function_name;
        this.fd = function_description;
        this.fa = function_args;
        this.fs = function_self;
        this.ft = function_type;
        this.fr = function_required;
    }

    public get name(): string {
        return this.fn ?? this.fs.name;
    }

    public call(args: T): Promise<R> | R {
        return this.fs(args);
    }

    public json(): FunctionLayout {
        return {
            type: "function",
            function: {
                name: this.name,
                description: this.fd,
                parameters: {
                    type: this.ft,
                    properties: this.fa,
                    required: this.fr
                }
            }
        }
    }
}

export class ToolRegistry {
    private tools: Tool<any, any>[] = [];

    public add<T extends Record<string, any>, R>(tool: Tool<T, R>): this {
        if (this.tools.some((t) => t.name === tool.name)) {
            throw new Error(`Tool '${tool.name}' is already registered.`);
        }

        this.tools.push(tool);
        return this;
    }

    public get all(): Tool<any, any>[] {
        return this.tools;
    }

    public list(): FunctionLayout[] {
        return this.tools.map((tool) => tool.json());
    }

    public async dispatch<T extends Record<string, any>, R = any>(
        call: ToolCall<T>
    ): Promise<R> {
        const tool = this.tools.find((t) => t.name === call.name);

        if (!tool) {
            throw new Error(`Tool '${call.name}' not found.`);
        }

        return await tool.call(call.args);
    }
}