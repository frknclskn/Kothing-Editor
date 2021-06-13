const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const util = require("./util");
const developmentEnv = process.env.NODE_ENV !== "production";

module.exports = {
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [util.resolve("src")],
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          developmentEnv ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
      {
        test: /\.scss$/,
        use: [
          developmentEnv ? "style-loader" : MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.less$/,
        use: [
          developmentEnv ? "style-loader" : MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
          { loader: "less-loader" },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: 'asset',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".css"],
    alias: {
      "@": util.resolve("src"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: developmentEnv ? util.resolve("public/index.html") : util.resolve("public/example.html"),
      filename: util.resolve("dist/index.html"),
      favicon: util.resolve("public/favicon.ico"),
      inject: developmentEnv ? "body" : "head",
      scriptLoading: developmentEnv ? "defer": "blocking",
      minify: developmentEnv
        ? false
        : {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
          },
    }),
  ],
};
