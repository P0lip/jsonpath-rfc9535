import type { ComparisonOp } from "../../parser/ast.ts";
import { assertDefinedComparisonOp } from "../assertions.ts";
import isEqual from "../is-equal.ts";

export default function compareObjects(
	a: Record<string, unknown>,
	b: unknown,
	op: ComparisonOp,
): boolean {
	switch (op) {
		case "==":
		case "<=": // does not offer < comparison
		case ">=": // does not offer < comparison
			return isEqual(a, b);
		case "<": // does not offer < comparison
		case ">": // does not offer < comparison
			return false;
		case "!=":
			return !isEqual(a, b);
		default:
			assertDefinedComparisonOp(op);
	}
}
