import type { ComparisonOp } from "../../parser/ast.ts";
import { assertDefinedComparisonOp } from "../assertions.ts";

export default function compareNumbers(
	a: number,
	b: unknown,
	op: ComparisonOp,
): boolean {
	switch (op) {
		case "==":
			return a === b;
		case "<":
			return typeof b === "number" && a < b;
		case "!=":
			return !compareNumbers(a, b, "==");
		case "<=":
			return compareNumbers(a, b, "<") || compareNumbers(a, b, "==");
		case ">":
			return typeof b === "number" && compareNumbers(b, a, "<");
		case ">=":
			return (
				(typeof b === "number" && compareNumbers(b, a, "<")) ||
				compareNumbers(a, b, "==")
			);
		default:
			assertDefinedComparisonOp(op);
	}
}
