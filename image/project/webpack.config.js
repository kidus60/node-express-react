const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');

const htmlPlugin = new HtmlWebPackPlugin({
    template: path.join(__dirname, "/user-app/public/index.html"),
    filename: "./index.html"
});


const copyWebpackPlugin  = new CopyWebpackPlugin([
    {from:path.join(__dirname, "/user-app/public"),to:'public'} 
])

module.exports = {
    entry: path.join(__dirname, "/user-app/src/index.js"),
    output: { // NEW
        path: path.join(__dirname, '/user-app/build'),
        filename: "[name].js"
    },
    devServer: {
        contentBase: path.join(__dirname, "/user-app/build"),
        compress: true,
        host: '0.0.0.0',
        port: 3000,
        proxy: {
            '/': {
                target: 'http://localhost:8080',
                secure: false
            }
        }
    },
    plugins: [htmlPlugin, copyWebpackPlugin],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                  {
                    loader: 'babel-loader',
                    options: {
                      presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                  }
                ],
              },
            {
                test: /\.s?css$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|svg|jpg|gif|ico|image)$/,
                loader: "file-loader",
                options: { name: '[name].[ext]' }
            }
        ]
    }
};