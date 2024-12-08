import type { ComparisonExpr } from "../../parser/ast.ts";
import compare from "../../utils/comparers/compare.ts";
import type { Context, StackItem } from "../types.ts";
import evalComparable from "./comparable.ts";

export default function evalComparisonExpr(
	ctx: Context,
	item: StackItem,
	node: ComparisonExpr,
): boolean {
	const leftValue = evalComparable(ctx, item, node.left);
	const rightValue = evalComparable(ctx, item, node.right);
	return compare(leftValue, rightValue, node.op);
}
