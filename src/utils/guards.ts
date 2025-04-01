import type { JsonValue } from "../core/results.ts";
import type { StackItem } from "../core/types.ts";

export function isPlainObject(
	value: unknown,
): value is Record<string, unknown> {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
}

export const isStackItemWithArrayValue = (
	item: StackItem,
): item is StackItem<JsonValue[]> => Array.isArray(item.value);

export const isStackItemWithObjectValue = (
	item: StackItem,
): item is StackItem<Record<string, JsonValue>> => isPlainObject(item.value);
