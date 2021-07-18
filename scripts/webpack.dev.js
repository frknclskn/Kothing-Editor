const webpack = require("webpack");
const { merge } = require("webpack-merge");
const path = require("path");
// const os = require("os");
const config = require("./webpack.config");

const port = "8080";

// const localAddress = function () {
//   const network = os.networkInterfaces();
//   for (let key in network) {
//     for (let i = 0; i < network[key].length; i++) {
//       const item = network[key][i];
//       if (
//         item.family === "IPv4" &&
//         item.address !== "127.0.0.1" &&
//         !item.internal
//       ) {
//         return item.address;
//       }
//     }
//   }
// };

module.exports = merge(config, {
  mode: "development",
  entry: path.join(__dirname, "../public/index.js"),
  output: {
    filename: "[name].js",
    chunkFilename: "[chunkhash].js",
  },
  devServer: {
    port: port,
    hot: true,
    compress: true,
    open: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    stats: {
      errorDetails: false, // show error details
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "env.PRODUCTION": "false",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
