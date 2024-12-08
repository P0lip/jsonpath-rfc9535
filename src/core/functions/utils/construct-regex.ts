import type { Context } from "../../types.ts";

function isBackslash(code: number): code is 92 {
	return code === 92;
}

function eatCharacterClass(pattern: string, start: number): number {
	let maybeEscaped = false;
	let i = start;
	while (i < pattern.length) {
		const ch = pattern.charCodeAt(i);
		i++;
		if (isBackslash(ch)) {
			maybeEscaped = true;
			continue;
		}

		if (ch === 93 /* ] */) {
			if (!maybeEscaped) {
				break;
			}

			maybeEscaped = false;
		}
	}

	return i;
}

function toEcmaScriptPattern(pattern: string): string {
	let ecmaScriptPattern = pattern;
	for (let i = 0; i < pattern.length; i++) {
		const ch = pattern.charCodeAt(i);
		if (isBackslash(ch)) {
			i++;
		} else if (ch === 91 /* [ */) {
			i = eatCharacterClass(pattern, i);
		} else if (ch === 46 /* . */) {
			ecmaScriptPattern = `${pattern.slice(0, i)}[^\n\r]${pattern.slice(i + 1)}`;
		}
	}

	return ecmaScriptPattern;
}

export default function constructRegex(
	{ cache }: Context,
	pattern: string,
): RegExp | null {
	const store = (cache.get("regexps") ?? {}) as {
		[key: string]: RegExp | null;
	};
	if (!cache.has("regexps")) {
		cache.set("regexps", store);
	}

	if (Object.hasOwn(store, pattern)) {
		return store[pattern];
	}

	try {
		const r = RegExp(toEcmaScriptPattern(pattern), "u");
		store[pattern] = r;
		return r;
	} catch {
		store[pattern] = null;
		return null;
	}
}
