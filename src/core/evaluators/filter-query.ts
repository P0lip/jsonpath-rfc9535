import type { FilterQuery } from "../../parser/ast.ts";
import { assertDefinedNodeType } from "../../utils/assertions.ts";
import { type NodeList, createNodeList } from "../results.ts";
import type { Context, StackItem } from "../types.ts";
import visitQuery from "../visitors/query.ts";

export default function evalFilterQuery(
	ctx: Context,
	item: StackItem,
	node: FilterQuery,
): NodeList {
	const list = createNodeList();

	switch (node.value.type) {
		case "RelQuery":
			visitQuery(ctx, item.root, item.value, node.value, (value) => {
				list.push(value);
			});
			break;
		case "JsonPathQuery":
			visitQuery(ctx, item.root, item.root, node.value, (value) => {
				list.push(value);
			});
			break;
		default:
			assertDefinedNodeType(node.value);
	}

	return list;
}
