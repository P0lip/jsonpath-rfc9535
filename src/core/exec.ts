import parse from "../parser/index.ts";
import { Stack } from "../utils/stack.ts";
import count from "./functions/count.ts";
import length from "./functions/length.ts";
import match from "./functions/match.ts";
import search from "./functions/search.ts";
import value from "./functions/value.ts";
import type { JsonValue } from "./results.ts";
import type { Callback, Context } from "./types.ts";
import visitQuery from "./visitors/query.ts";

export type Options = {
	capturePaths: boolean;
};

export default function exec(
	input: JsonValue,
	expression: string,
	opts: Options,
	cb: Callback,
): void {
	const ctx: Context = {
		cache: new Map(),
		capturePaths: opts.capturePaths,
		functions: {
			count,
			search,
			value,
			match,
			length,
		},
		regexp: "i-regexp",
		stack: new Stack(),
	};
	visitQuery(ctx, input, input, parse(expression), cb);
}
