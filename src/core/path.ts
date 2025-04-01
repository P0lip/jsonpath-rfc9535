const EMPTY_PATH: Path = [];

export type Path = (string | number)[];

export function joinPathWithKey(path: Path, key: string | number): Path {
	if (path === EMPTY_PATH) {
		return EMPTY_PATH;
	}

	if (typeof key === "number") {
		return [...path, key];
	}

	return [...path, toNormalizedKey(key)];
}

export function getInitialPath(capturePaths: boolean): Path {
	return capturePaths ? [] : EMPTY_PATH;
}

const ESCAPE_REGEX =
	// biome-ignore lint/suspicious/noControlCharactersInRegex: we need control characters to escape Unicode characters
	/[\u0000-\u001f'\\]/g;

function escapeValue(ch: string): string {
	const code = ch.charCodeAt(0);
	switch (code) {
		case 0x8 /* backspace */:
			return "\\b";
		case 0xc /* form feed */:
			return "\\f";
		case 0xa /* line feed */:
			return "\\n";
		case 0xd /* carriage return */:
			return "\\r";
		case 0x9 /* horizontal tab */:
			return "\\t";
		case 0x27 /* apostrophe */:
			return "\\'";
		case 0x5c /* backslash */:
			return "\\\\";
		default:
			return `\\u${code.toString(16).padStart(4, "0")}`;
	}
}

export function toNormalizedKey(key: string): string {
	return key.replace(ESCAPE_REGEX, escapeValue);
}

export function toNormalizedPath(path: Path): string {
	let normalizedPath = "$";
	for (const key of path) {
		if (typeof key === "number") {
			normalizedPath += `[${key}]`;
		} else {
			normalizedPath += `['${key}']`;
		}
	}

	return normalizedPath;
}
