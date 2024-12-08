import type { ComparisonOp } from "../../parser/ast.ts";
import { assertDefinedComparisonOp } from "../assertions.ts";

function compareString(
	a: unknown,
	b: unknown,
	op: Extract<ComparisonOp, "==" | "<">,
): boolean {
	if (typeof a !== "string" || typeof b !== "string") {
		return false;
	}

	switch (op) {
		case "==":
			return a === b;
		case "<": {
			let index = 0;
			while (a.length > index && b.length > index) {
				const leftCode = a.charCodeAt(index);
				const rightCode = b.charCodeAt(index);
				if (leftCode === rightCode) {
					index++;
					continue;
				}

				return a.charCodeAt(index) < b.charCodeAt(index);
			}

			return a.length < b.length;
		}
		default:
			assertDefinedComparisonOp(op);
	}
}

export default function (a: string, b: unknown, op: ComparisonOp): boolean {
	switch (op) {
		case "==":
		case "<":
			return compareString(a, b, op);
		case "!=":
			return !compareString(a, b, "==");
		case "<=":
			return compareString(a, b, "<") || compareString(a, b, "==");
		case ">":
			return compareString(b, a, "<");
		case ">=":
			return compareString(b, a, "<") || compareString(a, b, "==");
		default:
			assertDefinedComparisonOp(op);
	}
}
