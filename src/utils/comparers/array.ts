import { isNodeList } from "../../core/results.ts";
import type { ComparisonOp } from "../../parser/ast.ts";
import { assertDefinedComparisonOp } from "../assertions.ts";
import isEqual from "../is-equal.ts";

export default function compareArrays(
	a: unknown,
	b: unknown,
	op: ComparisonOp,
): boolean {
	switch (op) {
		case "==":
		case ">=": // does not offer < comparison
		case "<=": // does not offer < comparison
			return !isNodeList(a) && !isNodeList(b) && isEqual(a, b);
		case "<": // does not offer < comparison
		case ">": // does not offer < comparison
			return false;
		case "!=":
			return !compareArrays(a, b, "==");
		default:
			assertDefinedComparisonOp(op);
	}
}
