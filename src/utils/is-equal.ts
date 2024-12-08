import getType from "./get-type.ts";

function isEqualArray(a: unknown[], b: unknown[]): boolean {
	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i++) {
		if (!isEqual(a[i], b[i])) {
			return false;
		}
	}

	return true;
}

function isEqualObject(
	a: Record<string, unknown>,
	b: Record<string, unknown>,
): boolean {
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	if (aKeys.length !== bKeys.length) {
		return false;
	}

	for (const key of aKeys) {
		if (!Object.hasOwn(b, key)) {
			return false;
		}

		if (!isEqual(a[key], b[key])) {
			return false;
		}
	}

	return true;
}

export default function isEqual(left: unknown, right: unknown): boolean {
	if (getType(left) !== getType(right)) {
		return false;
	}

	switch (getType(left)) {
		case "string":
		case "number":
		case "boolean":
		case "null":
			return left === right;
		case "object":
			return isEqualObject(
				left as Record<string, unknown>,
				right as Record<string, unknown>,
			);
		case "array":
		case "NodeList":
			return isEqualArray(left as unknown[], right as unknown[]);
		default:
			return false;
	}
}
