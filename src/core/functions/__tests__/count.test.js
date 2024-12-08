import * as assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createNodeList } from "../../results.ts";
import count from "../count.ts";

describe("count", () => {
	it("should return the length of a NodeList", () => {
		const nodeList = createNodeList();
		nodeList.push(1, "a", null, false, {});
		const result = count.declaration({}, nodeList);
		assert.strictEqual(result, 5);
	});

	it("should return 0 for an empty NodeList", () => {
		const nodeList = { length: 0 };
		const result = count.declaration({}, nodeList);
		assert.strictEqual(result, 0);
	});

	it("should return 0 for a non-NodeList value", () => {
		const value = { length: 5 };
		const result = count.declaration({}, value);
		assert.strictEqual(result, 0);
	});

	it("should return 0 for null value", () => {
		const result = count.declaration({}, null);
		assert.strictEqual(result, 0);
	});

	it("should return 0 for undefined value", () => {
		const result = count.declaration({}, undefined);
		assert.strictEqual(result, 0);
	});
});
