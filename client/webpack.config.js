var webpack = require('webpack');
var SvgStore = require('webpack-svgstore-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './src/main.js',
    output: {
        path: './static',
        publicPath: '/static',
        filename: 'build.js'
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//
            },
            {
                test: /\.woff2$/,
                loader: 'file?name=/fonts/[name].[ext]'
            }
        ]
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime', 'lodash']
    },
    sassLoader: {
        includePaths: './src/assets/scss/'
    },
    plugins: [
        new SvgStore('./src/assets/icons/**/*.svg', './', {
            name: 'sprite.svg'
        })
    ]
}

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    );
} else {
    //module.exports.devtool = '#source-map'
}
