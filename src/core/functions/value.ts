import { Nothing } from "../results.ts";
import type { FunctionDeclaration } from "./types.ts";

export default {
	declaration: function value(ctx, nodes) {
		if (nodes.length === 1) {
			return nodes[0];
		}

		return Nothing;
	},
	definition: {
		parameters: ["NodesType"],
		returnType: "ValueType",
	},
} satisfies FunctionDeclaration<["NodesType"], "ValueType">;
