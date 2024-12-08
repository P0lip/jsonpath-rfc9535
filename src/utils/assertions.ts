export function assertDefinedNodeType(node: never): never {
	throw new TypeError(
		// biome-ignore lint/complexity/useLiteralKeys: type exhaustiveness
		`Unexpected node type: ${node["type"]}`,
	);
}

export function assertDefinedComparisonOp(op: never): never {
	throw new TypeError(`Unexpected comparison operator: ${op}`);
}

export function assertNever(_: never, message: string): never {
	throw new Error(message);
}
