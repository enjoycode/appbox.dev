// Difficulty: Moderate
// CSharp language definition
// Takes special care to color types and namespaces nicely.
// (note: this can't be done completely accurately though on a lexical level,
//  but we are getting quite close :-) )
//
// Todo: support unicode identifiers
// Todo: special color for documentation comments and attributes
export default {
    keywords: [
        'extern', 'alias', 'using', 'bool', 'decimal', 'sbyte', 'byte', 'short',
        'ushort', 'int', 'uint', 'long', 'ulong', 'char', 'float', 'double',
        'object', 'dynamic', 'string', 'assembly', 'module', 'is', 'as', 'ref',
        'out', 'this', 'base', 'new', 'typeof', 'void', 'checked', 'unchecked',
        'default', 'delegate', 'var', 'const', 'if', 'else', 'switch', 'case',
        'while', 'do', 'for', 'foreach', 'in', 'break', 'continue', 'goto',
        'return', 'throw', 'try', 'catch', 'finally', 'lock', 'yield', 'from',
        'let', 'where', 'join', 'on', 'equals', 'into', 'orderby', 'ascending',
        'descending', 'select', 'group', 'by', 'namespace', 'partial', 'class',
        'field', 'event', 'method', 'param', 'property', 'public', 'protected',
        'internal', 'private', 'abstract', 'sealed', 'static', 'struct', 'readonly',
        'volatile', 'virtual', 'override', 'params', 'get', 'set', 'add', 'remove',
        'operator', 'true', 'false', 'implicit', 'explicit', 'interface', 'enum',
        'null',
        '=', ':',
    ],

    typeKeywords: [
        'bool', 'byte', 'char', 'decimal', 'double', 'fixed', 'float',
        'int', 'long', 'object', 'sbyte', 'short', 'string', 'uint', 'ulong',
        'ushort', 'void'
    ],

    keywordInType: [
        'struct', 'new', 'where', 'class'
    ],

    typeFollows: [
        'as', 'class', 'interface', 'struct', 'enum', 'new', 'where',
        ':',
    ],

    namespaceFollows: [
        'namespace', 'using',
    ],

    operators: [
        '??', '||', '&&', '|', '^', '&', '==', '!=', '<=', '>=', '<<',
        '+', '-', '*', '/', '%', '!', '~', '++', '--', '+=',
        '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '>>', '=>'
    ],

    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    // escape sequences
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    // The main tokenizer for our languages
    tokenizer: {
        root: [
            // Try to show type names nicely: for parameters: Type name
            [/[A-Z][\w]*(?=[\.\w]*(\s|\/\*!\*\/)+\w)/, 'type.identifier'],

            // Generic types List<int>.
            // Unfortunately, colors explicit nested generic method instantiation as Method<List<int>>(x) wrongly
            [/([A-Z][\w]*[\.\w]*)(<)(?![^>]+>\s*(?:\(|$))/, ['type.identifier', { token: '@brackets', next: '@type' }]],
            [/([A-Z][\w]*[\.\w]*)(<)/, ['identifier', { token: '@brackets', next: '@type' }]],

            // These take care of 'System.Console.WriteLine'.
            // These two rules are not 100% right: if a non-qualified field has an uppercase name
            // it colors it as a type.. but you could use this.Field to circumenvent this.
            [/[A-Z][\w]*(?=\.[A-Z])/, 'type.identifier'],
            [/[A-Z][\w]*(?=\.[a-z_])/, 'type.identifier', '@qualified'],

            // identifiers and keywords
            [/[a-zA-Z_]\w*/, {
                cases: {
                    '@typeFollows': { token: 'keyword', next: '@type' },
                    '@namespaceFollows': { token: 'keyword', next: '@namespace' },
                    '@typeKeywords': { token: 'type.identifier', next: '@qualified' },
                    '@keywords': { token: 'keyword', next: '@qualified' },
                    '@default': { token: 'identifier', next: '@qualified' }
                }
            }],

            // whitespace
            { include: '@whitespace' },

            // delimiters and operators
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, {
                cases: {
                    '@operators': 'operator',
                    '@default': ''
                }
            }],

            // literal string
            [/@"/, { token: 'string.quote', bracket: '@open', next: '@litstring' }],

            // numbers
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],

            // delimiter: after number because of .\d floats
            [/[;,.]/, 'delimiter'],

            // strings
            [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
            [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

            // characters
            [/'[^\\']'/, 'string'],
            [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
            [/'/, 'string.invalid']
        ],

        qualified: [
            [/[a-zA-Z_][\w]*/, {
                cases: {
                    '@typeFollows': { token: 'keyword', next: '@type' },
                    '@typeKeywords': 'type.identifier',
                    '@keywords': 'keyword',
                    '@default': 'identifier'
                }
            }],
            [/\./, 'delimiter'],
            ['', '', '@pop'],
        ],

        type: [
            { include: '@whitespace' },
            [/[A-Z]\w*/, 'type.identifier'],
            // identifiers and keywords
            [/[a-zA-Z_]\w*/, {
                cases: {
                    '@typeKeywords': 'type.identifier',
                    '@keywordInType': 'keyword',
                    '@keywords': { token: '@rematch', next: '@popall' },
                    '@default': 'type.identifier'
                }
            }],
            [/[<]/, '@brackets', '@type_nested'],
            [/[>]/, '@brackets', '@pop'],
            [/[\.,:]/, {
                cases: {
                    '@keywords': 'keyword',
                    '@default': 'delimiter'
                }
            }],
            ['', '', '@popall'], // catch all
        ],

        type_nested: [
            [/[<]/, '@brackets', '@type_nested'],
            { include: 'type' }
        ],

        namespace: [
            { include: '@whitespace' },
            [/[A-Z]\w*/, 'namespace'],
            [/[\.=]/, 'keyword'],
            ['', '', '@pop'],
        ],

        comment: [
            [/[^\/*]+/, 'comment'],
            // [/\/\*/,    'comment', '@push' ],    // no nested comments :-(
            ["\\*/", 'comment', '@pop'],
            [/[\/*]/, 'comment']
        ],

        string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],

        litstring: [
            [/[^"]+/, 'string'],
            [/""/, 'string.escape'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],

        whitespace: [
            [/^[ \t\v\f]*#\w.*$/, 'namespace.cpp'],
            [/[ \t\v\f\r\n]+/, 'white'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
        ],
    },
};
