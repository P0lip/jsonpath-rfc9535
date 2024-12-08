import * as assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Nothing, createNodeList } from "../../results.ts";
import value from "../value.ts";

describe("value", () => {
	it("should return the single node when nodes array has one element", () => {
		const ctx = { cache: new Map() };
		const nodeList = createNodeList();
		nodeList.push("singleNode");
		const result = value.declaration(ctx, nodeList);
		assert.strictEqual(result, "singleNode");
	});

	it("should return Nothing when nodes array is empty", () => {
		const ctx = { cache: new Map() };
		const nodeList = createNodeList();
		const result = value.declaration(ctx, nodeList);
		assert.strictEqual(result, Nothing);
	});

	it("should return Nothing when nodes array has multiple elements", () => {
		const ctx = { cache: new Map() };
		const nodeList = createNodeList();
		nodeList.push("node1", "node2", "node3");
		const result = value.declaration(ctx, nodeList);
		assert.strictEqual(result, Nothing);
	});
});
