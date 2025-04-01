import type { FilterSelector } from "../../parser/ast.ts";
import evalComparisonExpr from "../evaluators/comparison-expr.ts";
import evalLogicalExpr from "../evaluators/logical-expr.ts";
import type { Context, StackItem } from "../types.ts";

export default function visitFilterSelector(
	ctx: Context,
	item: StackItem,
	node: FilterSelector,
): void {
	if (node.value.type === "ComparisonExpr") {
		if (!evalComparisonExpr(ctx, item, node.value)) {
			return;
		}
	} else if (!evalLogicalExpr(ctx, item, node.value)) {
		return;
	}

	ctx.stack.push({
		root: item.root,
		path: item.path,
		value: item.value,
		index: item.index + 1,
	});
}
