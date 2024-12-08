import {
	type JsonValue,
	type NodeList,
	type Nothing,
	isNodeList,
} from "../../core/results.ts";
import type { ComparisonOp } from "../../parser/ast.ts";
import { assertNever } from "../assertions.ts";
import getType from "../get-type.ts";
import compareArrays from "./array.ts";
import compareNodeLists from "./node-lists.ts";
import compareNothing from "./nothing.ts";
import compareNumbers from "./number.ts";
import compareObjects from "./object.ts";
import comparePrimitives from "./primitives.ts";
import compareStrings from "./string.ts";

export default function compare(
	a: unknown,
	b: unknown,
	op: ComparisonOp,
): boolean {
	const leftValue = isNodeList(a) && a.length === 1 ? a[0] : a;
	const leftType = getType(leftValue);
	const rightValue = isNodeList(b) && b.length === 1 ? b[0] : b;

	switch (leftType) {
		case "string":
			return compareStrings(leftValue as string, rightValue, op);
		case "number":
			return compareNumbers(leftValue as number, rightValue, op);
		case "boolean":
		case "null":
			return comparePrimitives(leftValue as boolean | null, rightValue, op);
		case "object":
			return compareObjects(
				leftValue as Record<string, JsonValue>,
				rightValue,
				op,
			);
		case "array":
			return compareArrays(leftValue as JsonValue[], rightValue, op);
		case "Nothing":
			return compareNothing(leftValue as typeof Nothing, rightValue, op);
		case "NodeList":
			return compareNodeLists(leftValue as NodeList, rightValue, op);
		default:
			assertNever(leftType, "Unknown type");
	}
}
