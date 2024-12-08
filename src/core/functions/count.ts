import { isNodeList } from "../results.ts";
import type { FunctionDeclaration } from "./types.ts";

export default {
	declaration: function count(ctx, value) {
		if (isNodeList(value)) {
			return value.length;
		}

		return 0;
	},
	definition: {
		parameters: ["NodesType"],
		returnType: "ValueType",
	},
} satisfies FunctionDeclaration<["NodesType"], "ValueType">;
