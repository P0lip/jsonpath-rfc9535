import { isPlainObject } from "../../utils/guards.ts";
import { joinPathWithKey } from "../path.ts";
import type { Context, StackItem } from "../types.ts";

export default function visitWildcardSelector(
	ctx: Context,
	{ root, path, value, index }: StackItem,
): void {
	if (Array.isArray(value)) {
		for (let i = 0; i < value.length; i++) {
			ctx.stack.push({
				root,
				path: joinPathWithKey(path, i),
				value: value[i],
				index: index + 1,
			});
		}
	} else if (isPlainObject(value)) {
		for (const key of Object.keys(value) as (keyof typeof value)[]) {
			ctx.stack.push({
				root,
				path: joinPathWithKey(path, key),
				value: value[key],
				index: index + 1,
			});
		}
	}
}
