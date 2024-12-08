import type { FunctionDeclaration } from "./types.ts";
import constructRegex from "./utils/construct-regex.ts";

export default {
	declaration: function match(ctx, value, pattern) {
		if (typeof value !== "string" || typeof pattern !== "string") {
			return false;
		}

		return constructRegex(ctx, `^${pattern}$`)?.test(value) === true;
	},
	definition: {
		parameters: ["ValueType", "ValueType"],
		returnType: "LogicalType",
	},
} satisfies FunctionDeclaration<["ValueType", "ValueType"], "LogicalType">;
