import type { NameSelector } from "../../parser/ast.ts";
import type { JsonValue } from "../results.ts";
import type { Context, StackItem } from "../types.ts";

export default function visitNameSelector(
	ctx: Context,
	{ root, index, value }: StackItem<Record<string, JsonValue>>,
	node: NameSelector,
): void {
	if (Object.hasOwn(value, node.value)) {
		ctx.stack.push({
			root,
			value: value[node.value],
			index: index + 1,
		});
	}
}
