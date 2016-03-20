const path = require("path");
const webpack = require("webpack");

module.exports = {
    debug: true,
    cache: true,
    devtool: "source-map",
    entry: {
        app: path.join(__dirname, "app")
    },
    output: {
        path: path.join(__dirname, "build", "dist"),
        filename: "pipe.js",
        publicPath: "/plugin/pipeline-view/"
    },
    module: {
        preLoaders: [
            {
                test: /\.(jsx|js)?$/,
                loaders: ["eslint"],
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.js|\.jsx$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015-loose", "react", "stage-0"]
                }
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.eot$|\.woff$|\.woff2$|\.ttf$/,
                loader: "file"
            },
            {
                test: /\.(c|le)ss$/,
                loader: "style!css?modules&sourceMap!less?sourceMap"
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        })
    ],
    resolve: {
        root: [
            path.resolve(__dirname, "node_modules")
        ],
        extensions: ["", ".css", ".less", ".js", ".jsx"]
    },
    devServer: {
        port: 3000,
        host: "0.0.0.0",
        proxy: {
            // Ugly hack to workaround Jenkins's static file URLs
            "*/plugin/pipeline-view/pipe.js": {
                target: "http://localhost:3000/",
                secure: false,
                rewrite: (req) => req.url = req.url.substring(req.url.indexOf("/plugin/pipeline-view/"))
            },
            "*": {
                target: "http://localhost:8080/",
                secure: false
            }
        }
    }
};