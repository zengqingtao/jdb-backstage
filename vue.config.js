const webpack = require("webpack");
const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require("terser-webpack-plugin");
const isProduction = process.env.NODE_ENV === "production";

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: "./",
  lintOnSave: false,
  productionSourceMap: false,
  outputDir: process.env.outputDir,
  devServer: {
    open: true,
  },
  configureWebpack: {
    resolve: {
      extensions: [".js", ".json", ".vue"],
    },
    devtool: 'source-map'
  },
  chainWebpack: (config) => {
    config.when(process.env.NODE_ENV !== "development", (config) => {
      config.optimization.minimizer([
        new TerserPlugin({
          terserOptions: { compress: { drop_console: true } },
        }),
      ]);
    });
    if (isProduction) {
    //   config.plugin("webpack-bundle-analyzer").use(BundleAnalyzerPlugin);
      // 删除预加载
      config.plugins.delete("preload");
      config.plugins.delete("prefetch");
    }
    config.plugin("provide").use(webpack.ProvidePlugin, [
      {
        "window.Quill": "quill/dist/quill.js",
        Quill: "quill/dist/quill.js",
      },
    ]);
    config.when(process.env.NODE_ENV === "development", (config) =>
      config.devtool("cheap-source-map")
    );
    config.resolve.alias
      .set("components", resolve("src/components"))
      .set("mixins", resolve("src/mixins"))
      .set("styles", resolve("src/assets/styles"))
      .set("api", resolve("src/api"))
      .set("js", resolve("src/assets/js"));
    config.module
      .rule("images")
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        bypassOnDebug: true,
        disable: true,
      })
      .end();
  },
};
