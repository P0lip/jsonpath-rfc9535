import type { BracketedSelection, FilterSelector } from "../../parser/ast.ts";
import { assertDefinedNodeType } from "../../utils/assertions.ts";
import {
	isStackItemWithArrayValue,
	isStackItemWithObjectValue,
} from "../../utils/guards.ts";
import { joinPathWithKey } from "../path.ts";
import type { JsonValue } from "../results.ts";
import type { Context, StackItem } from "../types.ts";
import visitFilterSelector from "./filter-selector.ts";
import visitIndexSelector from "./index-selector.ts";
import visitNameSelector from "./name-selector.ts";
import visitSliceSelector from "./slice-selector.ts";
import visitWildcardSelector from "./wildcard-selector.ts";

export default function visitBracketedSelection(
	ctx: Context,
	item: StackItem,
	node: BracketedSelection,
): void {
	for (const selector of node.selectors) {
		switch (selector.type) {
			case "NameSelector":
				if (isStackItemWithObjectValue(item)) {
					visitNameSelector(ctx, item, selector);
				}
				break;
			case "SliceSelector":
				if (isStackItemWithArrayValue(item)) {
					visitSliceSelector(ctx, item, selector);
				}
				break;
			case "IndexSelector": {
				if (isStackItemWithArrayValue(item)) {
					visitIndexSelector(ctx, item, selector);
				}
				break;
			}
			case "WildcardSelector":
				visitWildcardSelector(ctx, item);
				break;
			case "FilterSelector": {
				if (isStackItemWithArrayValue(item)) {
					visitFilterSelectorForArrayItem(ctx, item, selector);
				} else if (isStackItemWithObjectValue(item)) {
					visitFilterSelectorForObjectItem(ctx, item, selector);
				}
				break;
			}
			default:
				assertDefinedNodeType(selector);
		}
	}
}

function visitFilterSelectorForArrayItem(
	ctx: Context,
	{ root, path, value, index }: StackItem<JsonValue[]>,
	node: FilterSelector,
) {
	for (let i = 0; i < value.length; i++) {
		visitFilterSelector(
			ctx,
			{
				root,
				path: joinPathWithKey(path, i),
				value: value[i],
				index,
			},
			node,
		);
	}
}

function visitFilterSelectorForObjectItem(
	ctx: Context,
	{ root, path, value, index }: StackItem<Record<string, JsonValue>>,
	node: FilterSelector,
) {
	for (const key of Object.keys(value)) {
		visitFilterSelector(
			ctx,
			{
				root,
				path: joinPathWithKey(path, key),
				value: value[key],
				index,
			},
			node,
		);
	}
}
