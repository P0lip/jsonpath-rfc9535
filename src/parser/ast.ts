export type JsonPathQuery = {
	type: "JsonPathQuery";
	segments: Segment[];
};

export type Segment = ChildSegment | DescendantSegment;

export type SingularQuerySegment = {
	type: "SingularQuerySegment";
	node: NameSelector | MemberNameShorthand | IndexSelector;
};

export type ChildSegment = {
	type: "ChildSegment";
	node: BracketedSelection | WildcardSelector | MemberNameShorthand;
};

export type DescendantSegment = {
	type: "DescendantSegment";
	node: BracketedSelection | WildcardSelector | MemberNameShorthand;
};

export type BracketedSelection = {
	type: "BracketedSelection";
	selectors: Selector[];
};

export type WildcardSelector = {
	type: "WildcardSelector";
};

export type MemberNameShorthand = {
	type: "MemberNameShorthand";
	value: string;
};

export type Selector =
	| NameSelector
	| WildcardSelector
	| SliceSelector
	| IndexSelector
	| FilterSelector;

export type NameSelector = {
	type: "NameSelector";
	value: string;
};

export type SliceSelector = {
	type: "SliceSelector";
	start: number | null;
	end: number | null;
	step: number | null;
};

export type IndexSelector = {
	type: "IndexSelector";
	value: number;
};

export type FilterSelector = {
	type: "FilterSelector";
	value: LogicalExpr | ComparisonExpr;
};

export type LogicalExpr =
	| LogicalOrExpr
	| LogicalAndExpr
	| LogicalNotExpr
	| TestExpr
	| ComparisonExpr;

export type LogicalOrExpr = {
	type: "LogicalOrExpr";
	left: LogicalExpr;
	right: LogicalExpr;
};

export type LogicalAndExpr = {
	type: "LogicalAndExpr";
	left: LogicalExpr;
	right: LogicalExpr;
};

export type LogicalNotExpr = {
	type: "LogicalNotExpr";
	expression: LogicalExpr;
};

export type TestExpr = {
	type: "TestExpr";
	expression: FilterQuery | FunctionExpr;
};

export type FilterQuery = {
	type: "FilterQuery";
	value: RelQuery | JsonPathQuery;
};

export type FunctionExpr = {
	type: "FunctionExpr";
	name: string;
	arguments: FunctionArgument[];
};

export type FunctionArgument = Exclude<
	Literal | FilterQuery | LogicalExpr | FunctionExpr,
	ComparisonExpr
>;

export type RelQuery = {
	type: "RelQuery";
	segments: Segment[];
};

export type RelSingularQuery = {
	type: "RelSingularQuery";
	segments: SingularQuerySegment[];
};

export type AbsSingularQuery = {
	type: "AbsSingularQuery";
	segments: SingularQuerySegment[];
};

export type ComparisonExpr = {
	type: "ComparisonExpr";
	left: Comparable;
	right: Comparable;
	op: ComparisonOp;
};

export type Comparable =
	| Literal
	| RelSingularQuery
	| AbsSingularQuery
	| FunctionExpr;

export type Literal = {
	type: "Literal";
	value: string | number | boolean | null;
};

export type ComparisonOp = "==" | "!=" | "<" | "<=" | ">" | ">=";
