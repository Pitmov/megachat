var webpack = require('webpack');
module.exports = {
    entry: {
        app: ["./js/main.js"]
    },
    resolve: {
        modulesDirectories: [
            './js/',
            './node_modules/'
        ]
    },
    output: {
        path: "./build/",
        publicPath: "/html/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.html/,
                loader: 'html',
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
                loader: 'url-loader'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ],
    devtool: 'source-map'
};