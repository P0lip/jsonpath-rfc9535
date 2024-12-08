import * as assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Stack } from "../stack.ts";

describe("Stack", () => {
	it("should push and pop elements in first-in-first-out order", () => {
		const stack = new Stack();
		stack.push(1);
		stack.push(2);
		stack.push(3);
		assert.strictEqual(stack.pop(), 1);
		assert.strictEqual(stack.pop(), 2);
		assert.strictEqual(stack.pop(), 3);
	});

	it("should track size of the stack", () => {
		const stack = new Stack();
		assert.strictEqual(stack.size, 0);
		stack.push(1);
		assert.strictEqual(stack.size, 1);
		stack.push(2);
		assert.strictEqual(stack.size, 2);
		stack.pop();
		assert.strictEqual(stack.size, 1);
		stack.pop();
		assert.strictEqual(stack.size, 0);
	});

	it("should not pop elements from an empty stack", () => {
		const stack = new Stack();
		assert.equal(stack.pop(), void 0);
	});
});
