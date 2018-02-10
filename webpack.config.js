const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "index.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: ["raw-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".md"]
  },
  devServer: {
    compress: true,
    hot: true,
    open: true
  },
  externals: {
    remark: "remark"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ]
};
