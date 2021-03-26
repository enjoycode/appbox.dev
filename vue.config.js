const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    publicPath: '/dev/',
    runtimeCompiler: false,
    productionSourceMap: false,
    configureWebpack: {
        plugins: [
            new MonacoWebpackPlugin({
                output: 'js', languages: ['css', 'html', 'javascript', 'json', 'less', 'markdown', 'scss', 'typescript', 'xml'],
                features: ['accessibilityHelp', 'bracketMatching', 'caretOperations', 'clipboard',
                    'codeAction', 'codelens', 'colorDetector', 'comment', 'contextmenu', 'coreCommands',
                    'cursorUndo', 'dnd', 'find', 'folding', 'fontZoom', 'format', 'goToDefinitionCommands',
                    'goToDefinitionMouse', 'gotoError', 'gotoLine', 'hover', 'inPlaceReplace', 'inspectTokens',
                    'iPadShowKeyboard', 'linesOperations', '!links', 'multicursor', 'parameterHints',
                    'quickCommand', 'quickOutline', 'referenceSearch', 'rename', 'smartSelect', 'snippets',
                    'suggest', 'toggleHighContrast', 'toggleTabFocusMode', 'transpose', 'wordHighlighter',
                    'wordOperations', 'wordPartOperations']
            }),
            new CopyWebpackPlugin([
                { from: './node_modules/onigasm/lib/onigasm.wasm' },
                { from: './src/components/CodeEditor/CSharpFeatures/csharp.tmLanguage.json'},
                { from: './src/components/CodeEditor/JavaFeatures/java.tmLanguage.json'},
                { from: './node_modules/@fortawesome/fontawesome-free/metadata/categories.yml'}
            ])
        ]
    },
    devServer: {
        proxy: {
            '/login': {
                target: 'http://10.211.55.8:8000/',
                secure: false
            },
            '/api': {
                target: 'http://10.211.55.8:8000/',
                secure: false
            },
            '/blob': {
                target: 'http://10.211.55.8:8000/',
                secure: false
            },
            '/ws': {
                target: 'ws://10.211.55.8:8000/',
                secure: false,
                ws: true
            },
            '/ssh': {
                target: 'ws://10.211.55.8:8000/',
                secure: false,
                ws: true
            }
        }
    }
}
