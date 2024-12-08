import type { JsonPathQuery } from "./ast.ts";
import { parse } from "./parser.js";

export type { JsonPathQuery };

export default function (input: string): JsonPathQuery {
	return parse(input);
}
