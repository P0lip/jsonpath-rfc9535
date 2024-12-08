import type { LogicalExpr } from "../../parser/ast.ts";
import { assertDefinedNodeType } from "../../utils/assertions.ts";
import type { Context, StackItem } from "../types.ts";
import evalComparisonExpr from "./comparison-expr.ts";
import evalTestExpr from "./test-expr.ts";

export default function evalLogicalExpr(
	ctx: Context,
	item: StackItem,
	node: LogicalExpr,
): boolean {
	switch (node.type) {
		case "LogicalNotExpr":
			return !evalLogicalExpr(ctx, item, node.expression);
		case "LogicalAndExpr":
			return (
				evalLogicalExpr(ctx, item, node.left) &&
				evalLogicalExpr(ctx, item, node.right)
			);
		case "LogicalOrExpr":
			return (
				evalLogicalExpr(ctx, item, node.left) ||
				evalLogicalExpr(ctx, item, node.right)
			);
		case "TestExpr":
			return evalTestExpr(ctx, item, node);
		case "ComparisonExpr":
			return evalComparisonExpr(ctx, item, node);
		default:
			assertDefinedNodeType(node);
	}
}
