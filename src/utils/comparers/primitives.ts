import type { ComparisonOp } from "../../parser/ast.ts";
import { assertDefinedComparisonOp } from "../assertions.ts";

export default function comparePrimitives(
	a: boolean | null,
	b: unknown,
	op: ComparisonOp,
): boolean {
	switch (op) {
		case "==":
		case "<=": // do not offer < comparison
		case ">=": // do not offer < comparison
			return a === b;
		case "<":
		case ">":
			return false;
		case "!=":
			return !comparePrimitives(a, b, "==");
		default:
			assertDefinedComparisonOp(op);
	}
}
