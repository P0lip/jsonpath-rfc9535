import type { LogicalType, NodesType, ValueType } from "../results.ts";
import type { Context } from "../types.ts";

type AvailableTypes = {
	ValueType: ValueType;
	LogicalType: LogicalType;
	NodesType: NodesType;
};

export type AvailableType = keyof AvailableTypes;

type TypedArgs<A extends AvailableType[]> = A extends [infer A1]
	? [AvailableTypes[A1 & AvailableType]]
	: A extends [infer A1, infer A2]
		? [AvailableTypes[A1 & AvailableType], AvailableTypes[A2 & AvailableType]]
		: never;

export type FunctionDeclaration<
	A extends AvailableType[],
	R extends AvailableType,
> = {
	declaration: (ctx: Context, ...args: TypedArgs<A>) => AvailableTypes[R];
	definition: {
		parameters: A;
		returnType: R;
	};
};
