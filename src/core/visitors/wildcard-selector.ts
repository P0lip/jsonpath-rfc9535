import { isPlainObject } from "../../utils/guards.ts";
import type { Context, StackItem } from "../types.ts";

export default function visitWildcardSelector(
	ctx: Context,
	{ root, index, value }: StackItem,
): void {
	if (Array.isArray(value)) {
		for (const item of value) {
			ctx.stack.push({ root, value: item, index: index + 1 });
		}
	} else if (isPlainObject(value)) {
		for (const key of Object.keys(value) as (keyof typeof value)[]) {
			ctx.stack.push({ root, value: value[key], index: index + 1 });
		}
	}
}
