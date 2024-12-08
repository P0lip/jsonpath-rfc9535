import { Nothing, isNodeList } from "../../core/results.ts";
import type { ComparisonOp } from "../../parser/ast.ts";
import { assertDefinedComparisonOp } from "../assertions.ts";

export default function compareNothing(
	a: typeof Nothing,
	b: unknown,
	op: ComparisonOp,
): boolean {
	switch (op) {
		case "==":
		case "<=": // does not offer < comparison
		case ">=": // does not offer < comparison
			return b === Nothing || (isNodeList(b) && b.length === 0);
		case "<": // does not offer < comparison
		case ">": // does not offer < comparison
			return false;
		case "!=":
			return !compareNothing(a, b, "==");
		default:
			assertDefinedComparisonOp(op);
	}
}
