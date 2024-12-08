import * as assert from "node:assert/strict";
import { describe, it } from "node:test";
import match from "../match.ts";

describe("match", () => {
	it("should return true for an exact match", () => {
		const ctx = { cache: new Map() };
		const value = "hello";
		const pattern = "hello";
		const result = match.declaration(ctx, value, pattern);
		assert.strictEqual(result, true);
	});

	it("should return false for a non-matching pattern", () => {
		const ctx = { cache: new Map() };
		const value = "hello world";
		const pattern = "hello";
		const result = match.declaration(ctx, value, pattern);
		assert.strictEqual(result, false);
	});

	it("should return false for non-string value", () => {
		const ctx = { cache: new Map() };
		const value = 12345;
		const pattern = "12345";
		const result = match.declaration(ctx, value, pattern);
		assert.strictEqual(result, false);
	});

	it("should return false for non-string pattern", () => {
		const ctx = { cache: new Map() };
		const value = "hello";
		const pattern = 12345;
		const result = match.declaration(ctx, value, pattern);
		assert.strictEqual(result, false);
	});

	it("should return false for invalid regex pattern", () => {
		const ctx = { cache: new Map() };
		const value = "hello";
		const pattern = "[hello";
		const result = match.declaration(ctx, value, pattern);
		assert.strictEqual(result, false);
	});

	it("should handle special characters in pattern", () => {
		const ctx = { cache: new Map() };
		const value = "hello.world";
		const pattern = "hello\\.world";
		const result = match.declaration(ctx, value, pattern);
		assert.strictEqual(result, true);
	});
});
