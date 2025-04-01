import * as assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toNormalizedKey } from "../path.ts";

describe("toNormalizedKey", () => {
	for (const [ch, expected] of [
		["\u0008", /* \b; backspace */ "\\b"],
		["\u000c", /* \f; form feed */ "\\f"],
		["\u000a", /* \n; line feed */ "\\n"],
		["\u000d", /* \r; carriage return */ "\\r"],
		["\u0009", /* \t; horizontal tab */ "\\t"],
		["\u0027", /* '; apostrophe */ "\\'"],
		["\u005c", /* \; backslash */ "\\\\"],
		// a few control characters that are in range
		["\u0000", "\\u0000"],
		["\u0002", "\\u0002"],
		["\u0006", "\\u0006"],
		["\u0007", "\\u0007"],
		["\u000b", "\\u000b"],
		["\u000e", "\\u000e"],
		["\u000f", "\\u000f"],
		["\u0010", "\\u0010"],
		["\u0014", "\\u0014"],
		["\u0016", "\\u0016"],
		["\u001a", "\\u001a"],
		["\u001c", "\\u001c"],
		["\u001f", "\\u001f"],
	]) {
		it(`escapes ${JSON.stringify(ch)}`, () => {
			assert.strictEqual(toNormalizedKey(ch), expected);
		});
	}
});
