import type { Stack } from "../utils/stack.ts";
import type { AvailableType, FunctionDeclaration } from "./functions/types.ts";
import type { Path } from "./path.ts";
import type { JsonValue } from "./results.ts";

export type Callback = (v: JsonValue, p: Path) => void;

export type RegexpType = "i-regexp" | "ecmascript-regexp";

export type Context = {
	readonly cache: Map<string, unknown>;
	readonly functions: Record<
		string,
		FunctionDeclaration<AvailableType[], AvailableType>
	>;
	readonly capturePaths: boolean;
	readonly regexp: RegexpType;
	readonly stack: Stack<StackItem>;
};

export type StackItem<V extends JsonValue = JsonValue> = {
	root: JsonValue;
	path: Path;
	value: V;
	index: number;
};
