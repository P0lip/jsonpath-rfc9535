import _exec from "./core/exec.ts";
import { toNormalizedPath } from "./core/path.ts";
import type { JsonValue } from "./core/results.ts";
import type { Callback } from "./core/types.ts";

const DEFAULT_OPTIONS = {
	capturePaths: true,
};

export function query(input: JsonValue, expression: string): JsonValue[] {
	const values: JsonValue[] = [];
	_exec(input, expression, { capturePaths: false }, (value) => {
		values.push(value);
	});
	return values;
}

export function paths(input: JsonValue, expression: string): string[] {
	const paths: string[] = [];
	_exec(input, expression, DEFAULT_OPTIONS, (_, path) => {
		paths.push(toNormalizedPath(path));
	});
	return paths;
}

export function exec(input: JsonValue, expression: string, cb: Callback): void {
	_exec(input, expression, DEFAULT_OPTIONS, cb);
}

export function batchExec(
	input: JsonValue,
	expressionToCallback: Map<string, Callback>,
	errorCallback?: ErrorCallback,
): void {
	for (const [expression, cb] of expressionToCallback) {
		try {
			exec(input, expression, cb);
		} catch (e) {
			errorCallback?.(
				e instanceof Error ? e : new Error(String(e)),
				expression,
			);
		}
	}
}

export type { JsonValue };

export type ErrorCallback = (error: Error, expression: string) => void;
export type { Callback } from "./core/types.ts";
export type { Path } from "./core/path.ts";
