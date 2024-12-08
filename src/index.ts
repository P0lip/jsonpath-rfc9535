import exec from "./core/exec.ts";
import type { JsonValue } from "./core/results.ts";

export function query(input: JsonValue, expression: string): JsonValue[] {
	const values: JsonValue[] = [];
	exec(input, expression, (value) => {
		values.push(value);
	});
	return values;
}

export { exec };

export type { JsonValue };
