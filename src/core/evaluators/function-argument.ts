import type { FunctionArgument } from "../../parser/ast.ts";
import { assertDefinedNodeType } from "../../utils/assertions.ts";
import type { Context, StackItem } from "../types.ts";
import evalFilterQuery from "./filter-query.ts";
import evalFunctionExpr from "./function-expr.ts";
import evalLogicalExpr from "./logical-expr.ts";

export default function evalFunctionArgument(
	ctx: Context,
	item: StackItem,
	node: FunctionArgument,
): unknown {
	switch (node.type) {
		case "FunctionExpr":
			return evalFunctionExpr(ctx, item, node);
		case "FilterQuery":
			return evalFilterQuery(ctx, item, node);
		case "LogicalNotExpr":
		case "LogicalAndExpr":
		case "LogicalOrExpr":
		case "TestExpr":
			return evalLogicalExpr(ctx, item, node);
		case "Literal":
			return node.value;
		default:
			assertDefinedNodeType(node);
	}
}
