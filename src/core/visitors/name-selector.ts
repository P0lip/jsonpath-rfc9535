import type { NameSelector } from "../../parser/ast.ts";
import { joinPathWithKey } from "../path.ts";
import type { JsonValue } from "../results.ts";
import type { Context, StackItem } from "../types.ts";

export default function visitNameSelector(
	ctx: Context,
	{ root, path, value, index }: StackItem<Record<string, JsonValue>>,
	node: NameSelector,
): void {
	if (Object.hasOwn(value, node.value)) {
		ctx.stack.push({
			root,
			path: joinPathWithKey(path, node.value),
			value: value[node.value],
			index: index + 1,
		});
	}
}
