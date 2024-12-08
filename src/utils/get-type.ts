import { Nothing, isArray, isNodeList } from "../core/results.ts";
import { isPlainObject } from "./guards.ts";

export default function getType(value: unknown) {
	switch (typeof value) {
		case "object":
			if (value === null) {
				return "null";
			}

			if (isNodeList(value)) {
				return "NodeList";
			}

			if (isArray(value)) {
				return "array";
			}

			if (isPlainObject(value)) {
				return "object";
			}

			throw new TypeError(`Unknown type: ${value}`);
		case "string":
			return "string";
		case "number":
			return "number";
		case "boolean":
			return "boolean";
		default:
			if (value === Nothing) {
				return "Nothing";
			}

			throw new TypeError(`Unknown type: ${value}`);
	}
}
