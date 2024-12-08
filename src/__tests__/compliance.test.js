import * as assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import { join } from "node:path";
import { describe, it } from "node:test";

import { query } from "../index.ts";
const { tests } = JSON.parse(
	await fs.readFile(
		join(import.meta.dirname, "./jsonpath-compliance-test-suite/cts.json"),
		"utf8",
	),
);

describe("JSONPath Compliance Test Suite", () => {
	for (const { name, selector, document, ...rest } of tests) {
		it(name, () => {
			switch (true) {
				case Object.hasOwn(rest, "invalid_selector"):
					try {
						assert.throws(() => query(document, selector));
					} catch {
						assert.deepStrictEqual(query(document, selector), []);
					}

					break;
				case Object.hasOwn(rest, "result"):
					assert.deepStrictEqual(query(document, selector), rest.result);
					break;
				// one of the results must match
				case Object.hasOwn(rest, "results"): {
					for (const result of rest.results) {
						try {
							assert.deepStrictEqual(query(document, selector), result);
							return;
						} catch {
							// ignore
						}
					}

					throw new Error("No result matched");
				}
				default:
					throw new Error("Invalid test case");
			}
		});
	}
});