type ArgDefinition = {
    type: "string";
    description: string;
    minLength?: number;
} | {
    type: "number" | "integer";
    description: string;
    minimum?: number;
} | {
    type: "boolean";
    description: string;
};
type ArgDefiniton = ArgDefinition;
interface FunctionArgs {
    [key: string]: ArgDefinition;
}
type F<T = Record<string, any>, R = any> = (args: T) => R | Promise<R>;
type FT = "object" | "array";
interface FunctionLayout {
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: {
            type: "object" | "array";
            properties: Record<string, any>;
            required: string[];
        };
    };
}
interface ToolCall<T = Record<string, any>> {
    name: string;
    args: T;
}

declare class Tool<T extends Record<string, any>, R = any> {
    private fn;
    private fd;
    private fa;
    private fs;
    private ft;
    private fr;
    constructor(function_description: string, function_args: FunctionArgs, function_self: F<T, R>, function_type?: FT, function_required?: string[], function_name?: string);
    get name(): string;
    call(args: T): Promise<R> | R;
    json(): FunctionLayout;
}
declare class ToolRegistry {
    private tools;
    add<T extends Record<string, any>, R>(tool: Tool<T, R>): this;
    get all(): Tool<any, any>[];
    list(): FunctionLayout[];
    dispatch<T extends Record<string, any>, R = any>(call: ToolCall<T>): Promise<R>;
}

export { Tool, ToolRegistry };
export type { ArgDefinition, ArgDefiniton, F, FT, FunctionArgs, FunctionLayout, ToolCall };
