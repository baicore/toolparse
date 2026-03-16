export type ArgDefinition =
    | { type: "string"; description: string; minLength?: number }
    | { type: "number" | "integer"; description: string; minimum?: number }
    | { type: "boolean"; description: string };

// Backward compatible alias for existing consumers.
export type ArgDefiniton = ArgDefinition;

export interface FunctionArgs {
    [key: string]: ArgDefinition;
}

export type F<T = Record<string, any>, R = any> = (args: T) => R | Promise<R>;
export type FT = "object" | "array";

export interface FunctionLayout {
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: {
            type: "object" | "array";
            properties: Record<string, any>;
            required: string[];
        }
    }
}

export interface ToolCall<T = Record<string, any>> {
    name: string;
    args: T;
}