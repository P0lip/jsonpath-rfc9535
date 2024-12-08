import * as assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Nothing, createNodeList } from "../../../core/results.ts";
import compare from "../compare.ts";

describe("Comparisons", () => {
	const $ = {
		absent1: createNodeList(),
		absent2: createNodeList(),
		absent: createNodeList(),
		obj: { x: "y" },
		arr: [2, 3],
	};

	const cases = [
		{
			// 'Empty nodelists',
			condition: "$.absent1 == $.absent2",
			values: [$.absent1, $.absent2, "=="],
			expected: true,
		},
		{
			// '== implies <=',
			condition: "$.absent1 <= $.absent2",
			values: [$.absent1, $.absent2, "<="],
			expected: true,
		},
		{
			// 'Empty nodelist',
			condition: "$.absent == 'g'",
			values: [$.absent, "g", "=="],
			expected: false,
		},
		{
			// 'Empty nodelists',
			condition: "$.absent1 != $.absent2",
			values: [$.absent1, $.absent2, "!="],
			expected: false,
		},
		{
			// 'Empty nodelist',
			condition: "$.absent != 'g'",
			values: [$.absent, "g", "!="],
			expected: true,
		},
		{
			// 'Numeric comparison',
			condition: "1 <= 2",
			values: [1, 2, "<="],
			expected: true,
		},
		{
			// 'Strict, numeric comparison',
			condition: "1 > 2",
			values: [1, 2, ">"],
			expected: false,
		},
		{
			// 'Type mismatch',
			condition: "13 == '13'",
			values: [13, "13", "=="],
			expected: false,
		},
		{
			// 'String comparison',
			condition: "'a' <= 'b'",
			values: ["a", "b", "<="],
			expected: true,
		},
		{
			// 'Strict, string comparison',
			condition: "'a' > 'b'",
			values: ["a", "b", ">"],
			expected: false,
		},
		{
			// 'Type mismatch',
			condition: "$.obj == $.arr",
			values: [$.obj, $.arr, "=="],
			expected: false,
		},
		{
			// 'Type mismatch',
			condition: "$.obj != $.arr",
			values: [$.obj, $.arr, "!="],
			expected: true,
		},
		{
			// 'Object comparison',
			condition: "$.obj == $.obj",
			values: [$.obj, $.obj, "=="],
			expected: true,
		},
		{
			// 'Object comparison',
			condition: "$.obj != $.obj",
			values: [$.obj, $.obj, "!="],
			expected: false,
		},
		{
			// 'Array comparison',
			condition: "$.arr == $.arr",
			values: [$.arr, $.arr, "=="],
			expected: true,
		},
		{
			// 'Array comparison',
			condition: "$.arr != $.arr",
			values: [$.arr, $.arr, "!="],
			expected: false,
		},
		{
			// 'Type mismatch',
			condition: "$.obj == 17",
			values: [$.obj, 17, "=="],
			expected: false,
		},
		{
			// 'Type mismatch',
			condition: "$.obj != 17",
			values: [$.obj, 17, "!="],
			expected: true,
		},
		{
			// Objects and arrays do not offer < comparison
			condition: "$.obj <= $.arr",
			values: [$.obj, $.arr, "<="],
			expected: false,
		},
		{
			// Objects and arrays do not offer < comparison
			condition: "$.obj < $.arr",
			values: [$.obj, $.arr, "<"],
			expected: false,
		},
		{
			// Arrays do not offer < comparison
			condition: "1 <= $.arr",
			values: [1, $.arr, "<="],
			expected: false,
		},
		{
			// Arrays do not offer < comparison
			condition: "1 >= $.arr",
			values: [1, $.arr, ">="],
			expected: false,
		},
		{
			// Arrays do not offer < comparison
			condition: "1 > $.arr",
			values: [1, $.arr, ">"],
			expected: false,
		},
		{
			// Arrays do not offer < comparison
			condition: "1 < $.arr",
			values: [1, $.arr, "<"],
			expected: false,
		},
		{
			// '== implies <=',
			condition: "true <= true",
			values: [true, true, "<="],
			expected: true,
		},
		{
			// Booleans do not offer < comparison
			condition: "true > true",
			values: [true, true, ">"],
			expected: false,
		},
		{
			// Empty NodeList equal Nothing
			condition: "$[?@.a == length(@.b)]",
			values: [$.absent1, Nothing, "=="],
			expected: true,
		},
	];

	for (const { condition, values, expected } of cases) {
		it(`should return ${expected} for ${condition}`, () => {
			assert.deepStrictEqual(
				compare(values[0], values[1], values[2]),
				expected,
			);
		});
	}
});
