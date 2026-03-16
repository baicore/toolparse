'use strict';

class Tool {
  fn;
  fd;
  fa;
  fs;
  ft;
  fr;
  constructor(function_description, function_args, function_self, function_type = "object", function_required = [], function_name) {
    this.fn = function_name;
    this.fd = function_description;
    this.fa = function_args;
    this.fs = function_self;
    this.ft = function_type;
    this.fr = function_required;
  }
  get name() {
    return this.fn ?? this.fs.name;
  }
  call(args) {
    return this.fs(args);
  }
  json() {
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
    };
  }
}
class ToolRegistry {
  tools = [];
  add(tool) {
    if (this.tools.some((t) => t.name === tool.name)) {
      throw new Error(`Tool '${tool.name}' is already registered.`);
    }
    this.tools.push(tool);
    return this;
  }
  get all() {
    return this.tools;
  }
  list() {
    return this.tools.map((tool) => tool.json());
  }
  async dispatch(call) {
    const tool = this.tools.find((t) => t.name === call.name);
    if (!tool) {
      throw new Error(`Tool '${call.name}' not found.`);
    }
    return await tool.call(call.args);
  }
}

exports.Tool = Tool;
exports.ToolRegistry = ToolRegistry;
