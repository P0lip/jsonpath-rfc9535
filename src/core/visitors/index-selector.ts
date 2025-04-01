import type { IndexSelector } from "../../parser/ast.ts";
import { joinPathWithKey } from "../path.ts";
import type { JsonValue } from "../results.ts";
import type { Context, StackItem } from "../types.ts";

function getArrayIndex(index: number, length: number): number {
	return index < 0 ? length + index : index;
}

export default function visitIndexSelector(
	ctx: Context,
	item: StackItem<JsonValue[]>,
	node: IndexSelector,
): void {
	const index = getArrayIndex(node.value, item.value.length);
	if (index >= 0 && index < item.value.length) {
		ctx.stack.push({
			root: item.root,
			path: joinPathWithKey(item.path, index),
			value: item.value[index],
			index: item.index + 1,
		});
	}
}
