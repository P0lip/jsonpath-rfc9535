import * as assert from "node:assert/strict";
import { describe, it } from "node:test";

import { query } from "../index.ts";

describe("regression tests", () => {
	// https://github.com/P0lip/jsonpath-rfc9535/issues/5
	describe("chained && (issue #5)", () => {
		it("returns [] when the third && condition is false", () => {
			assert.deepStrictEqual(
				query([{ a: "1" }], '$[?(@.a=="1" && @.a=="1" && @.a=="0")]'),
				[],
			);
		});

		it("matches only when all three && conditions are true", () => {
			assert.deepStrictEqual(
				query([{ a: "1" }], '$[?(@.a=="1" && @.a=="1" && @.a=="1")]'),
				[{ a: "1" }],
			);
		});
	});
});
