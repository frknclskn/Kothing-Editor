const path = require("path");
const os = require("os");

exports.resolve = function (dir) {
  return path.join(__dirname, "..", dir);
};

exports.staticPath = function (dir) {
  return path.join("/", dir);
};

exports.localAddress = function () {
  const network = os.networkInterfaces();
  for (let key in network) {
    for (let i = 0; i < network[key].length; i++) {
      const item = network[key][i];
      if (
        item.family === "IPv4" &&
        item.address !== "127.0.0.1" &&
        !item.internal
      ) {
        return item.address;
      }
    }
  }
};
