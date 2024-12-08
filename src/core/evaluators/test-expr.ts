import type { TestExpr } from "../../parser/ast.ts";
import { assertDefinedNodeType } from "../../utils/assertions.ts";
import type { Context, StackItem } from "../types.ts";
import evalFilterQuery from "./filter-query.ts";
import evalFunctionExpr from "./function-expr.ts";

export default function evalTestExpr(
	ctx: Context,
	item: StackItem,
	node: TestExpr,
): boolean {
	switch (node.expression.type) {
		case "FilterQuery":
			return evalFilterQuery(ctx, item, node.expression).length > 0;
		case "FunctionExpr":
			return evalFunctionExpr(ctx, item, node.expression) === true;
		default:
			assertDefinedNodeType(node.expression);
	}
}
