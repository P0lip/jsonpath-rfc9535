import * as assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Nothing } from "../../results.ts";
import evalFunctionExpr from "../function-expr.ts";

describe("evalFunctionExpr", () => {
	it("should return false for unknown function", () => {
		const ctx = { functions: {} };
		const item = {
			root: {
				a: null,
			},
			value: null,
			index: 1,
		};
		const node = {
			type: "FunctionExpr",
			name: "unknownFunction",
			arguments: [],
		};
		const result = evalFunctionExpr(ctx, item, node);
		assert.strictEqual(result, false);
	});

	it("should return false for incorrect number of arguments", () => {
		const ctx = {
			functions: {
				fn: {
					definition: { parameters: ["ValueType"] },
					declaration: () => true,
				},
			},
		};
		const item = {
			root: {
				a: null,
			},
			value: null,
			index: 1,
		};
		const node = {
			type: "FunctionExpr",
			name: "fn",
			arguments: [],
		};
		const result = evalFunctionExpr(ctx, item, node);
		assert.strictEqual(result, false);
	});

	it("should return function result for correct arguments and types", () => {
		const ctx = {
			functions: {
				fn: {
					definition: { parameters: ["ValueType"] },
					declaration: () => "result",
				},
			},
		};
		const item = {};
		const node = {
			type: "FunctionExpr",
			name: "fn",
			arguments: [
				{
					type: "Literal",
					value: "arg",
				},
			],
		};
		const result = evalFunctionExpr(ctx, item, node);
		assert.strictEqual(result, "result");
	});

	it("given ValueType, should should coerce NodeList with more than a single node to Nothing", () => {
		const ctx = {
			functions: {
				fn: {
					definition: { parameters: ["ValueType"] },
					declaration: (_, value) => value === Nothing,
				},
			},
		};
		const root = [
			{
				b: 1,
			},
			{
				b: 2,
			},
		];
		const item = {
			root,
			value: root,
			index: 0,
		};
		const node = {
			type: "FunctionExpr",
			name: "fn",
			arguments: [
				{
					type: "FilterQuery",
					value: {
						type: "RelQuery",
						segments: [
							{
								type: "DescendantSegment",
								node: {
									type: "MemberNameShorthand",
									value: "b",
								},
							},
						],
					},
				},
			],
		};
		const result = evalFunctionExpr(ctx, item, node);
		assert.strictEqual(result, true);
	});

	it("given ValueType, should should coerce empty NodeList to Nothing", () => {
		const ctx = {
			functions: {
				fn: {
					definition: { parameters: ["ValueType"] },
					declaration: (_, value) => value === Nothing,
				},
			},
		};
		const root = [];
		const item = {
			root,
			value: root,
			index: 0,
		};
		const node = {
			type: "FunctionExpr",
			name: "fn",
			arguments: [
				{
					type: "FilterQuery",
					value: {
						type: "RelQuery",
						segments: [
							{
								type: "DescendantSegment",
								node: {
									type: "MemberNameShorthand",
									value: "b",
								},
							},
						],
					},
				},
			],
		};
		const result = evalFunctionExpr(ctx, item, node);
		assert.strictEqual(result, true);
	});

	it("should return false for invalid NodesType argument", () => {
		const ctx = {
			functions: {
				fn: {
					definition: { parameters: ["NodesType"] },
					declaration: () => {},
				},
			},
		};
		const item = {
			root: {
				a: null,
			},
			value: null,
			index: 1,
		};
		const node = {
			type: "FunctionExpr",
			name: "fn",
			arguments: [
				{
					type: "Literal",
					value: "abc",
				},
			],
		};
		const result = evalFunctionExpr(ctx, item, node);
		assert.strictEqual(result, false);
	});

	it("should return false for invalid LogicalType argument", () => {
		const ctx = {
			functions: {
				fn: {
					definition: { parameters: ["LogicalType"] },
					declaration: () => {},
				},
			},
		};
		const item = {
			root: {
				a: 123,
			},
			value: 123,
			index: 1,
		};
		const node = {
			type: "FunctionExpr",
			name: "fn",
			arguments: [
				{
					type: "Literal",
					value: 123,
				},
			],
		};
		const result = evalFunctionExpr(ctx, item, node);
		assert.strictEqual(result, false);
	});

	it("given LogicalType, should should coerce non-empty NodeList to LogicalFalse", () => {
		const ctx = {
			functions: {
				fn: {
					definition: { parameters: ["LogicalType"] },
					declaration: (_, value) => value === true,
				},
			},
		};
		const root = [
			{
				b: 1,
			},
			{
				b: 2,
			},
		];
		const item = {
			root,
			value: root,
			index: 0,
		};
		const node = {
			type: "FunctionExpr",
			name: "fn",
			arguments: [
				{
					type: "FilterQuery",
					value: {
						type: "RelQuery",
						segments: [
							{
								type: "DescendantSegment",
								node: {
									type: "MemberNameShorthand",
									value: "b",
								},
							},
						],
					},
				},
			],
		};
		const result = evalFunctionExpr(ctx, item, node);
		assert.strictEqual(result, true);
	});

	it("given LogicalType, should should coerce empty NodeList to LogicalFalse", () => {
		const ctx = {
			functions: {
				fn: {
					definition: { parameters: ["LogicalType"] },
					declaration: (_, value) => value === false,
				},
			},
		};
		const root = [];
		const item = {
			root,
			value: root,
			index: 0,
		};
		const node = {
			type: "FunctionExpr",
			name: "fn",
			arguments: [
				{
					type: "FilterQuery",
					value: {
						type: "RelQuery",
						segments: [
							{
								type: "DescendantSegment",
								node: {
									type: "MemberNameShorthand",
									value: "b",
								},
							},
						],
					},
				},
			],
		};
		const result = evalFunctionExpr(ctx, item, node);
		assert.strictEqual(result, true);
	});

	it("should return function result for valid LogicalType argument", () => {
		const ctx = {
			functions: {
				fn: {
					definition: { parameters: ["LogicalType"] },
					declaration: () => "result",
				},
			},
		};
		const item = {
			root: {
				a: "abc",
			},
			value: "abc",
			index: 1,
		};
		const node = {
			type: "FunctionExpr",
			name: "fn",
			arguments: [
				{
					type: "Literal",
					value: true,
				},
			],
		};
		const result = evalFunctionExpr(ctx, item, node);
		assert.strictEqual(result, "result");
	});
});
