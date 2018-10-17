const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const config = require('./config')

const extractCSS = new ExtractTextPlugin('libs.css')

module.exports = {
    stats: { modules: false },
    resolve: { extensions: ['.js'] },
    entry: {
        libs: [
            'vue/dist/vue.common.js'
        ],
    },
    module: {
        rules: [
            { test: /\.css(\?|$)/, use: extractCSS.extract({ use: 'css-loader' }) },
            { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' }
        ]
    },
    output: {
        path: path.join(config.build.assetsRoot, config.build.assetsSubDirectory, 'js'),
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: '[name].js',
        library: '[name]_[hash]'
    },
    plugins: [
        extractCSS,
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': process.env.NODE_ENV === 'production'
                ? config.build.env.NODE_ENV : config.dev.env.NODE_ENV
        }),
        new webpack.DllPlugin({
            context: path.join(__dirname, '..'),
            path: path.join(__dirname, '[name].manifest.json'),
            name: '[name]_[hash]'
        }),
        new AssetsPlugin({
            filename: 'libs.assets.json',
            path: __dirname,
            fullPath: false //暂不输出全路径
        })
    ].concat(process.env.NODE_ENV === 'development' ? [] : [
        new webpack.optimize.UglifyJsPlugin()
    ])
};
