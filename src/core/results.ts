import { isPlainObject } from "../utils/guards.ts";

const nodeLists = new WeakSet();

export const isNodeList = (value: unknown): value is ValueType[] => {
	return typeof value === "object" && value !== null && nodeLists.has(value);
};

export const isJsonValue = (value: unknown): value is JsonValue => {
	switch (typeof value) {
		case "string":
		case "number":
		case "boolean":
			return true;
		case "object":
			return value === null || isPlainObject(value) || isArray(value);
		default:
			return false;
	}
};

export const isArray = (value: unknown): value is unknown[] =>
	Array.isArray(value) && !isNodeList(value);

export const createNodeList = (): JsonValue[] => {
	const list: JsonValue[] = [];
	nodeLists.add(list);
	return list;
};

export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| {
			[key: string]: JsonValue;
	  };
export type ValueType = JsonValue | typeof Nothing;
export type NodesType = Exclude<ValueType[], typeof Nothing>;
export type LogicalType = boolean;
export type NodeList = ValueType[];

export const Nothing = Symbol("Nothing");
