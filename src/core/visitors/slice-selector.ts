import type { SliceSelector } from "../../parser/ast.ts";
import { joinPathWithKey } from "../path.ts";
import type { JsonValue } from "../results.ts";
import type { Context, StackItem } from "../types.ts";

function normalize(i: number, len: number): number {
	return i >= 0 ? i : len + i;
}

function bounds(
	start: number,
	end: number,
	step: number,
	len: number,
): [number, number] {
	const nStart = normalize(start, len);
	const nEnd = normalize(end, len);

	if (step >= 0) {
		const lower = Math.min(Math.max(nStart, 0), len);
		const upper = Math.min(Math.max(nEnd, 0), len);
		return [lower, upper];
	}

	const upper = Math.min(Math.max(nStart, -1), len - 1);
	const lower = Math.min(Math.max(nEnd, -1), len - 1);
	return [lower, upper];
}

export default function visitSliceSelector(
	ctx: Context,
	{ root, path, value, index }: StackItem<JsonValue[]>,
	node: SliceSelector,
): void {
	const step = node.step ?? 1;
	const defaultStart = step >= 0 ? 0 : value.length - 1;
	const defaultEnd = step >= 0 ? value.length : -value.length - 1;

	const nStart =
		node.start === null ? defaultStart : normalize(node.start, value.length);
	const nEnd =
		node.end === null ? defaultEnd : normalize(node.end, value.length);
	const [lower, upper] = bounds(nStart, nEnd, step, value.length);

	if (step > 0) {
		let i = lower;
		while (i < upper) {
			ctx.stack.push({
				root,
				path: joinPathWithKey(path, i),
				value: value[i],
				index: index + 1,
			});
			i += step;
		}
	} else if (step < 0) {
		let i = upper;
		while (lower < i) {
			ctx.stack.push({
				root,
				path: joinPathWithKey(path, i),
				value: value[i],
				index: index + 1,
			});
			i += step;
		}
	}
}
