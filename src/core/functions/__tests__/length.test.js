import * as assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Nothing } from "../../results.ts";
import length from "../length.ts";

describe("length", () => {
	it("should return correct length for a string without surrogates", () => {
		const ctx = { cache: new Map() };
		const value = "hello";
		const result = length.declaration(ctx, value);
		assert.strictEqual(result, 5);
	});

	it("should return correct length for a string with surrogate pairs", () => {
		const ctx = { cache: new Map() };
		const value = "hello\uD83D\uDE00";
		const result = length.declaration(ctx, value);
		assert.strictEqual(result, 5);
	});

	it("should return correct length for an empty string", () => {
		const ctx = { cache: new Map() };
		const value = "";
		const result = length.declaration(ctx, value);
		assert.strictEqual(result, 0);
	});

	it("should return correct length for an array", () => {
		const ctx = { cache: new Map() };
		const value = [1, 2, 3];
		const result = length.declaration(ctx, value);
		assert.strictEqual(result, 3);
	});

	it("should return correct length for an empty array", () => {
		const ctx = { cache: new Map() };
		const value = [];
		const result = length.declaration(ctx, value);
		assert.strictEqual(result, 0);
	});

	it("should return correct length for an object", () => {
		const ctx = { cache: new Map() };
		const value = { a: 1, b: 2 };
		const result = length.declaration(ctx, value);
		assert.strictEqual(result, 2);
	});

	it("should return correct length for an empty object", () => {
		const ctx = { cache: new Map() };
		const value = {};
		const result = length.declaration(ctx, value);
		assert.strictEqual(result, 0);
	});

	it("should return Nothing for unsupported types", () => {
		const ctx = { cache: new Map() };
		const value = 12345;
		const result = length.declaration(ctx, value);
		assert.strictEqual(result, Nothing);
	});
});
