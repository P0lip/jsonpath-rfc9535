import * as assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createNodeList } from "../../core/results.ts";
import isEqual from "../is-equal.ts";

describe("isEqual", () => {
	it("should return true for equal strings", () => {
		assert.strictEqual(isEqual("test", "test"), true);
	});

	it("should return false for different strings", () => {
		assert.strictEqual(isEqual("test", "different"), false);
	});

	it("should return true for equal numbers", () => {
		assert.strictEqual(isEqual(123, 123), true);
	});

	it("should return false for different numbers", () => {
		assert.strictEqual(isEqual(123, 456), false);
	});

	it("should return true for equal booleans", () => {
		assert.strictEqual(isEqual(true, true), true);
	});

	it("should return false for different booleans", () => {
		assert.strictEqual(isEqual(true, false), false);
	});

	it("should return true for equal null values", () => {
		assert.strictEqual(isEqual(null, null), true);
	});

	it("should return true for equal objects", () => {
		assert.strictEqual(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 }), true);
	});

	it("should return false for different objects", () => {
		assert.strictEqual(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 }), false);
		assert.strictEqual(isEqual({ a: 1, b: 2 }, { a: 1 }), false);
		assert.strictEqual(isEqual({ b: 2 }, { a: 1 }), false);
	});

	it("should return true for equal arrays", () => {
		assert.strictEqual(isEqual([1, 2, 3], [1, 2, 3]), true);
	});

	it("should return false for different arrays", () => {
		assert.strictEqual(isEqual([1, 2, 3], [1, 2, 4]), false);
	});

	it("should return true for equal NodeLists", () => {
		const nodeList1 = createNodeList();
		nodeList1.push(123);
		const nodeList2 = createNodeList();
		nodeList2.push(123);
		assert.strictEqual(isEqual(nodeList1, nodeList2), true);
	});

	it("should return false for different NodeLists", () => {
		const nodeList1 = createNodeList();
		nodeList1.push(123);
		const nodeList2 = createNodeList();
		nodeList2.push(456);
		assert.strictEqual(isEqual(nodeList1, nodeList2), false);
	});

	it("should return false for different types", () => {
		assert.strictEqual(isEqual("test", 123), false);
	});

	it("should throw for invalid JSON values", () => {
		assert.throws(() => isEqual(new Date(), 1));
		assert.throws(() => isEqual(1, new Date()));
		assert.throws(() => isEqual(null, undefined));
		assert.throws(() => isEqual(undefined, null));
		assert.throws(() => isEqual(new Map(), []));
	});
});
