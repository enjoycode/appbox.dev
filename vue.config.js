const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    runtimeCompiler: false,
    productionSourceMap: false,
    configureWebpack: {
        plugins: [
            new MonacoWebpackPlugin(undefined, ['csharp', 'css', 'html', 'javascript', 'json', 'less', 'markdown', 'scss', 'typescript', 'xml'], undefined)
        ]
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://10.211.55.3:5000/',
                secure: false
            },
            '/blob': {
                target: 'http://10.211.55.3:5000/',
                secure: false
            },
            '/wsapi': {
                target: 'ws://10.211.55.3:5000/',
                secure: false,
                ws: true
            },
            '/ssh': {
                target: 'ws://10.211.55.3:5000/',
                secure: false,
                ws: true
            }
        }
    }
}