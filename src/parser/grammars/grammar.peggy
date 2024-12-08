jsonpath_query = root_identifier segments:(segments) {
  return {
    type: 'JsonPathQuery',
    segments,
  }
}

root_identifier = "$"

segments = (S value:(segment) { return value })*

S = B*

segment = child_segment / descendant_segment

B
  = " "
  / "\t"
  / "\n"
  / "\r"

child_segment
  = node:(
    bracketed_selection
    / ("." value:(wildcard_selector / member_name_shorthand) { return value })
 ){ return { type: "ChildSegment", node } }

descendant_segment
  = ".." node:(bracketed_selection / wildcard_selector / member_name_shorthand) { return { type: "DescendantSegment", node } };

bracketed_selection
  = "[" selectors:(S main:(selector) rest:(S "," S child:(selector) { return child })* { return [main, ...rest] }) S "]" {
    return {
      type: "BracketedSelection",
      selectors,
    }
  }

wildcard_selector
  = "*" { return { type: "WildcardSelector" } }

member_name_shorthand
  = value:$(name_first name_char*) { return { type: "MemberNameShorthand", value } }

selector
  = name_selector
  / wildcard_selector
  / slice_selector
  / index_selector
  / filter_selector

name_first
  = ALPHA
  / "_"
  / [\x80-\ud7ff]
  / [\ue000-\uffff]
  / [\ud800-\udbff] [\udc00-\udfff]

name_char
  = name_first
  / DIGIT

name_selector = value:(string_literal) { return { type: "NameSelector", value } }

slice_selector
  = values:(start:$(start S)? ":" S end:$(end S)? step:(":" value:$(S step?) { return value })? { return { start, end, step } }) {
  	return {
      type: 'SliceSelector',
      start: values.start === "" ? null : Number.parseInt(values.start.trim(), 10),
      end: values.end === "" ? null : Number.parseInt(values.end.trim(), 10),
      step: values.step === "" || values.step === null ? null : Number.parseInt(values.step.trim(), 10),
  	}
}

index_selector
  = value:$(int) { return { type: 'IndexSelector', value: Number.parseInt(value, 10) } }

filter_selector
  = "?" S value:logical_expr { return { type: 'FilterSelector', value } }

ALPHA
  = [\x41-\x5a]
  / [\x61-\x7a]

DIGIT
  = [\x30-\x39]

string_literal
  = value:("\"" value:(double_quoted*) "\"" { return value }
  / "'" value:(single_quoted*) "'" { return value }) { return value.join('') }

start
  = int

end
  = int

step
  = int

int
  = "0"
  / ("-"? DIGIT1 DIGIT*)

logical_expr
  = logical_or_expr

double_quoted
  = $unescaped
  / "'"
  / ESC "\"" { return "\"" }
  / ESC value:escapable {
    switch (value) {
      case "b":
        return "\b";
      case "f":
        return "\f";
      case "n":
        return "\n";
      case "r":
        return "\r";
      case "t":
        return "\t";
      case "/":
        return "/";
      case "\\":
        return "\\";
      default:
        return value.slice(1)
    }
   }

single_quoted
  = $unescaped
  / "\""
  / ESC "'" { return "'" }
  / ESC value:(escapable) {
    switch (value) {
      case "b":
        return "\b";
      case "f":
        return "\f";
      case "n":
        return "\n";
      case "r":
        return "\r";
      case "t":
        return "\t";
      case "/":
        return "/";
      case "\\":
        return "\\";
      default:
        return value.slice(1)
    }
   }

DIGIT1
  = [\x31-\x39]

logical_or_expr
  = left:logical_and_expr rest:(S "||" S value:logical_and_expr { return value })* {
    return rest.length === 0 ? left : {
      type: "LogicalOrExpr",
      left,
      right: rest.length === 1 ? rest[0] : rest.slice(1)
        .reduce((acc, curr) => ({
          type: "LogicalOrExpr",
          left: acc,
          right: curr,
        }), rest[0])
    }
  }

unescaped
  = [\x20-\x21]
  / [\x23-\x26]
  / [\x28-\x5b]
  / [\x5d-\ud7ff]
  / [\ue000-\uffff]
  / [\ud800-\udbff] [\udc00-\udfff]

ESC
  = "\\"

escapable
  = "b"
  / "f"
  / "n"
  / "r"
  / "t"
  / "/"
  / "\\"
  / "u" hexchar

logical_and_expr
  = conditions:(main:basic_expr rest:(S "&&" S value:basic_expr { return value })* { return [main, ...rest] }) {
    return conditions.length === 1 ? conditions[0] : {
      type: "LogicalAndExpr",
      left: conditions[0],
      right: conditions.length === 2 ? conditions[1] : conditions.slice(2)
        .reduce((acc, curr) => ({
          type: "LogicalOrExpr",
          left: acc,
          right: curr,
        }), conditions[1])
    }
  }

hexchar
  = value:((non_surrogate { return String.fromCharCode(Number.parseInt(text(), 16)) })
  / (h:$high_surrogate "\\" "u" l:$low_surrogate { return (
    String.fromCharCode(Number.parseInt(h, 16)) + String.fromCharCode(Number.parseInt(l, 16))
  )})) { return value }

basic_expr
  = paren_expr
  / comparison_expr
  / test_expr

non_surrogate
  = ((DIGIT / "A"i / "B"i / "C"i / "E"i / "F"i) HEXDIG|3|)
  / ("D"i [\x30-\x37] HEXDIG|2|)

high_surrogate
  = "D"i ("8" / "9" / "A"i / "B"i) HEXDIG|2|

low_surrogate
  = "D"i ("C"i / "D"i / "E"i / "F"i) HEXDIG|2|

paren_expr
  = not:(logical_not_op S)? "(" S expression:logical_expr S ")" {
    return not !== null ? {
      type: "LogicalNotExpr",
      expression
    } : expression
  }

comparison_expr
  = left:comparable S op:comparison_op S right:comparable { return {
    type: "ComparisonExpr",
    left,
    op,
    right,
  } }

test_expr
  = not:(logical_not_op S)? expression:(filter_query / function_expr) {
    return not !== null ? {
      type: "LogicalNotExpr",
      expression: {
        type: "TestExpr",
        expression
      }
    } : {
      type: "TestExpr",
      expression
    }
  }

HEXDIG
  = DIGIT
  / "A"i
  / "B"i
  / "C"i
  / "D"i
  / "E"i
  / "F"i

logical_not_op
  = "!"

comparable
  = literal
  / singular_query
  / function_expr

comparison_op
  = "=="
  / "!="
  / "<="
  / ">="
  / "<"
  / ">"

filter_query
  = value:(rel_query / jsonpath_query) { return { type: "FilterQuery", value } }

function_expr
  = name:function_name "(" S args:(f:function_argument r:(S "," S rest:function_argument { return rest })* { return [f, ...r] })? S ")" { return {
    type: "FunctionExpr",
    name,
    arguments: args,
  } }

literal
  = value:(number
    / string_literal
    / true
    / false
    / null) { return { type: 'Literal', value } }

singular_query
  = rel_singular_query
  / abs_singular_query

rel_query
  = current_node_identifier segments:segments { return { type: "RelQuery", segments } }

function_name
  = $(function_name_first function_name_char*)

function_argument
  = literal
  / filter_query
  / function_expr
  / logical_expr

number
  = value:$((int / "-0") frac? exp?) { return Number(value) }

true
  = "true" { return true }

false
  = "false" { return false }

null
  = "null" { return null }

rel_singular_query
  = current_node_identifier segments:(singular_query_segments) { return { type: "RelSingularQuery", segments } }

abs_singular_query
  = root_identifier segments:(singular_query_segments) { return { type: "AbsSingularQuery", segments } }

current_node_identifier
  = "@"

function_name_first
  = LCALPHA

function_name_char
  = function_name_first
  / "_"
  / DIGIT

frac
  = "." DIGIT+

exp
  = "e"i ("-" / "+")? DIGIT+

singular_query_segments
  = segments:(S segment:(name_segment / index_segment) { return {
    type: 'SingularQuerySegment',
    node: segment
   }})* { return segments }

LCALPHA
  = [\x61-\x7a]

name_segment
  = ("[" value:name_selector "]" { return value })
  / ("." value:member_name_shorthand { return value })

index_segment
  = "[" selector:index_selector "]" { return { type: "IndexSelector", selector } }
