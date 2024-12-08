import type { MemberNameShorthand } from "../../parser/ast.ts";
import type { JsonValue } from "../results.js";
import type { Context, StackItem } from "../types.ts";

export default function visitMemberNameShorthand(
	ctx: Context,
	{ root, index, value }: StackItem<Record<string, JsonValue>>,
	node: MemberNameShorthand,
): void {
	if (Object.hasOwn(value, node.value)) {
		ctx.stack.push({ root, value: value[node.value], index: index + 1 });
	}
}
