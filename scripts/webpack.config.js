const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const developmentEnv = process.env.NODE_ENV !== "production";

module.exports = {
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: ["babel-loader"],
        include: [path.join(__dirname, "src")],
      },
      {
        test: /\.(ts)$/i,
        use: ["babel-loader", "ts-loader"],
        exclude: ["/node_modules/"],
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
        type: "asset",
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".json", ".css"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: developmentEnv
        ? path.join(__dirname, "../public/index.html")
        : path.join(__dirname, "../public/example.html"),
      filename: path.join(__dirname, "../dist/index.html"),
      favicon: path.join(__dirname, "../public/favicon.ico"),
      inject: developmentEnv ? "body" : "head",
      scriptLoading: developmentEnv ? "defer" : "blocking",
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
