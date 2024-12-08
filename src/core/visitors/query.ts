import type {
	AbsSingularQuery,
	JsonPathQuery,
	RelQuery,
	RelSingularQuery,
} from "../../parser/ast.ts";
import { Stack } from "../../utils/stack.ts";
import type { JsonValue } from "../results.ts";
import type { Callback, Context, StackItem } from "../types.ts";
import { visitSegment } from "./segment.ts";

export default function visitQuery(
	ctx: Context,
	root: JsonValue,
	input: JsonValue,
	node: JsonPathQuery | RelQuery | RelSingularQuery | AbsSingularQuery,
	cb: Callback,
): void {
	const stack = new Stack<StackItem>();
	stack.push({ root, value: input, index: 0 });
	const context: Context = {
		cache: ctx.cache,
		functions: ctx.functions,
		regexp: ctx.regexp,
		stack,
	};

	while (stack.size > 0) {
		// biome-ignore lint/style/noNonNullAssertion: size is guaranteed to be > 0
		const item = stack.pop()!;
		if (item.index === node.segments.length) {
			cb(item.value);
			continue;
		}

		const { value, index } = item;
		const segment = node.segments[index];
		visitSegment(context, item, segment.node);

		if (segment.type === "DescendantSegment") {
			if (Array.isArray(value)) {
				for (const item of value) {
					stack.push({ root, value: item, index });
				}
			} else if (value !== null && typeof value === "object") {
				for (const key of Object.keys(value) as (keyof typeof value)[]) {
					stack.push({ root, value: value[key], index });
				}
			}
		}
	}
}