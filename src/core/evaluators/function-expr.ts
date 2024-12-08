import type { FunctionExpr } from "../../parser/ast.ts";
import { assertNever } from "../../utils/assertions.ts";
import {
	type LogicalType,
	type NodeList,
	Nothing,
	type ValueType,
	isJsonValue,
	isNodeList,
} from "../results.ts";
import type { Context, StackItem } from "../types.ts";
import evalFunctionArgument from "./function-argument.ts";

function coerceValueType(value: ValueType | NodeList): ValueType {
	if (isNodeList(value)) {
		return value.length === 1 ? value[0] : Nothing;
	}

	return value;
}

export default function evalFunctionExpr(
	ctx: Context,
	item: StackItem,
	node: FunctionExpr,
): unknown {
	if (!isKnownFunction(ctx.functions, node.name)) {
		return false;
	}

	const fn = ctx.functions[node.name];
	if (fn.definition.parameters.length !== node.arguments.length) {
		return false;
	}

	const args: (ValueType | NodeList | LogicalType)[] = [];
	for (let i = 0; i < node.arguments.length; i++) {
		const value = evalFunctionArgument(ctx, item, node.arguments[i]);
		const param = fn.definition.parameters[i];

		switch (param) {
			case "ValueType":
				if (!isNodeList(value) && !isJsonValue(value)) {
					return false;
				}

				args.push(coerceValueType(value));
				break;
			case "NodesType":
				if (!isNodeList(value)) {
					return false;
				}

				args.push(value);
				break;
			case "LogicalType":
				if (typeof value === "boolean") {
					args.push(value);
				} else if (isNodeList(value)) {
					args.push(value.length > 0);
				} else {
					return false;
				}
				break;
			default:
				assertNever(param, "Unknown function argument type");
		}
	}

	// we could validate the return type here,
	// but currently all functions are well-typed when it comes to returned values
	return fn.declaration(
		ctx,
		// @ts-expect-error
		...args,
	);
}

function isKnownFunction(
	functions: Context["functions"],
	name: string,
): name is keyof Context["functions"] {
	return Object.hasOwn(functions, name);
}
