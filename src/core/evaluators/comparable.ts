import type { Comparable } from "../../parser/ast.ts";
import { assertDefinedNodeType } from "../../utils/assertions.ts";
import { createNodeList } from "../results.ts";
import type { Context, StackItem } from "../types.ts";
import visitQuery from "../visitors/query.ts";
import evalFunctionExpr from "./function-expr.ts";

export default function evalComparable(
	ctx: Context,
	item: StackItem,
	node: Comparable,
): unknown {
	switch (node.type) {
		case "Literal":
			return node.value;
		case "RelSingularQuery":
		case "AbsSingularQuery": {
			const root = node.type === "RelSingularQuery" ? item.value : item.root;
			if (node.segments.length === 0) {
				return root;
			}

			const nodeList = createNodeList();
			visitQuery(ctx, item.root, root, node, (v) => {
				nodeList.push(v);
			});
			return nodeList;
		}
		case "FunctionExpr":
			return evalFunctionExpr(ctx, item, node);
		default:
			assertDefinedNodeType(node);
	}
}
