import { type NodeList, Nothing, isNodeList } from "../../core/results.ts";
import type { ComparisonOp } from "../../parser/ast.ts";
import { assertDefinedComparisonOp } from "../assertions.ts";
import isEqual from "../is-equal.ts";

export default function compareNodeLists(
	a: NodeList,
	b: unknown,
	op: ComparisonOp,
): boolean {
	switch (op) {
		case "==":
		case "<=": // does not offer < comparison
		case ">=": // does not offer < comparison
			return (
				isNodeList(a) && ((isNodeList(b) && isEqual(a, b)) || b === Nothing)
			);
		case "<": // does not offer < comparison
		case ">": // does not offer < comparison
			return false;
		case "!=":
			return !compareNodeLists(a, b, "==");
		default:
			assertDefinedComparisonOp(op);
	}
}
