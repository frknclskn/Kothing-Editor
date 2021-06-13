const webpack = require("webpack");
const { merge } = require("webpack-merge");
const config = require("./webpack.config");
const util = require("./util");

const port = "8080";

module.exports = merge(config, {
  mode: "development",
  entry: util.resolve("public/index.js"),
  output: {
    filename: "[name].js",
    chunkFilename: "[chunkhash].js"
  },
  devServer: {
    port: port,
    hot: true,
    compress: true,
    open: true,
    overlay: {
      warnings: true,
      errors: true,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "env.PRODUCTION": "false",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
