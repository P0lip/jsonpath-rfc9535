import * as assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import { join } from "node:path";
import { describe, it } from "node:test";

import { paths, query } from "../index.ts";

const examplesDir = join(import.meta.dirname, "./fixtures/examples");

const fixtures = await Promise.all(
	(await Array.fromAsync(fs.glob("**/*.json", { cwd: examplesDir }))).map(
		async (filename) => ({
			name: filename,
			data: JSON.parse(await fs.readFile(join(examplesDir, filename), "utf8")),
		}),
	),
);

describe("RFC 9535 Spec Examples", () => {
	for (const {
		name,
		data: { queries, document },
	} of fixtures) {
		describe(name, () => {
			for (const { path, values, paths: expectedPaths } of queries) {
				describe(path, () => {
					it("query", () => {
						assert.deepStrictEqual(query(document, path), values);
					});

					it("paths", () => {
						assert.deepStrictEqual(paths(document, path), expectedPaths);
					});
				});
			}
		});
	}
});
