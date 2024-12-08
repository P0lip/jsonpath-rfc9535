import * as assert from "node:assert/strict";
import { describe, it } from "node:test";
import constructRegex from "../construct-regex.ts";

describe("constructRegex", () => {
	it("should return a RegExp object for a valid pattern", () => {
		const context = { cache: new Map() };
		const pattern = "abc";
		const result = constructRegex(context, pattern);
		assert.ok(result?.source, pattern);
	});

	it("should return null for an invalid pattern", () => {
		const context = { cache: new Map() };
		const pattern = "[abc";
		const result = constructRegex(context, pattern);
		assert.strictEqual(result, null);
	});

	it("should cache the RegExp object for a valid pattern", () => {
		const context = { cache: new Map() };
		const pattern = "abc";
		const result1 = constructRegex(context, pattern);
		const result2 = constructRegex(context, pattern);
		assert.strictEqual(result1, result2);
	});

	it("should handle patterns with escaped characters", () => {
		const context = { cache: new Map() };
		const pattern = "\\d+";
		const result = constructRegex(context, pattern);
		assert.strictEqual(result?.source, "\\d+");
	});

	it("should convert dot", () => {
		const context = { cache: new Map() };
		const pattern = "a.c";
		const result = constructRegex(context, pattern);
		assert.ok(result instanceof RegExp);
		assert.strictEqual(result.source, "a[^\\n\\r]c");
	});

	it("should keep dot in a character class", () => {
		const context = { cache: new Map() };
		const pattern = "[.]";
		const result = constructRegex(context, pattern);
		assert.strictEqual(result?.source, "[.]");
	});

	it("should keep dot in a character class with escaped end bracket", () => {
		const context = { cache: new Map() };
		const pattern = "[.\\]]";
		const result = constructRegex(context, pattern);
		assert.strictEqual(result?.source, "[.\\]]");
	});

	it("should keep dot in a character class with escaped start bracket", () => {
		const context = { cache: new Map() };
		const pattern = "a[\\[.]c";
		const result = constructRegex(context, pattern);
		assert.strictEqual(result?.source, "a[\\[.]c");
	});

	it("should convert dot with escaped brackets to a character class", () => {
		const context = { cache: new Map() };
		const pattern = "\\[.";
		const result = constructRegex(context, pattern);
		assert.strictEqual(result?.source, "\\[[^\\n\\r]");
	});
});
