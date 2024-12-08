import type {
	BracketedSelection,
	IndexSelector,
	MemberNameShorthand,
	NameSelector,
	WildcardSelector,
} from "../../parser/ast.ts";
import { assertDefinedNodeType } from "../../utils/assertions.ts";
import {
	isStackItemWithArrayValue,
	isStackItemWithObjectValue,
} from "../../utils/guards.ts";
import type { Context, StackItem } from "../types.ts";
import visitBracketedSelection from "./bracketed-selection.ts";
import visitIndexSelector from "./index-selector.ts";
import visitMemberNameShorthand from "./member-name-shorthand.ts";
import visitNameSelector from "./name-selector.ts";
import visitWildcardSelector from "./wildcard-selector.ts";

export function visitSegment(
	ctx: Context,
	item: StackItem,
	node:
		| BracketedSelection
		| WildcardSelector
		| MemberNameShorthand
		| NameSelector
		| IndexSelector,
): void {
	switch (node.type) {
		case "BracketedSelection":
			return visitBracketedSelection(ctx, item, node);
		case "WildcardSelector":
			return visitWildcardSelector(ctx, item);
		case "MemberNameShorthand":
			if (isStackItemWithObjectValue(item)) {
				visitMemberNameShorthand(ctx, item, node);
			}
			break;
		case "NameSelector":
			if (isStackItemWithObjectValue(item)) {
				visitNameSelector(ctx, item, node);
			}
			break;
		case "IndexSelector":
			if (isStackItemWithArrayValue(item)) {
				visitIndexSelector(ctx, item, node);
			}
			break;
		default:
			assertDefinedNodeType(node);
	}
}
