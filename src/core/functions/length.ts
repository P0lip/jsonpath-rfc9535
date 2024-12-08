import { isPlainObject } from "../../utils/guards.ts";
import { Nothing } from "../results.ts";
import type { FunctionDeclaration } from "./types.ts";

// Any Unicode code point except high-surrogate and low-surrogate code points.
function countUnicodeScalarValues(str: string): number {
	let count = 0;
	for (let i = 0; i < str.length; i++) {
		const code = str.charCodeAt(i);
		if ((code >= 0 && code <= 0xd7ff) || (code >= 0xe000 && code <= 0x10ffff)) {
			count++;
		}
	}
	return count;
}

export default {
	declaration: function length(ctx, value) {
		if (typeof value === "string") {
			return countUnicodeScalarValues(value);
		}

		if (Array.isArray(value)) {
			return value.length;
		}

		if (isPlainObject(value)) {
			return Object.keys(value).length;
		}

		return Nothing;
	},
	definition: {
		parameters: ["ValueType"],
		returnType: "ValueType",
	},
} satisfies FunctionDeclaration<["ValueType"], "ValueType">;
