const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const StartServerPlugin = require("start-server-webpack-plugin");

function createClientConfig() {
  console.log("client config", path.join(process.cwd(), "src"));
  return {
    devtool: "inline-source-map",
    entry: [
      "react-hot-loader/patch",
      "webpack-dev-server/client?http://localhost:3001",
      "webpack/hot/only-dev-server",
      path.resolve(__dirname, "../src/client/index.tsx")
    ],
    mode: "development",
    target: "web",
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          loader: "ts-loader",
          //exclude: /node_modules/,
          include: [path.resolve(__dirname, "../src")],
          // include: [
          //   path.resolve(__dirname, 'workplace-app'),
          //   path.resolve(__dirname, 'api'),
          //   path.resolve(__dirname, 'workplace-core'),
          //   path.resolve(__dirname, 'workplace-headless'),
          //   path.resolve(__dirname, 'news')
          // ],
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, "tsconfig.json")
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          loader: "file-loader?name=fonts/[name].[ext]"
        }
      ]
    },
    plugins: [
      // new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
      // new webpack.DefinePlugin({
      //   "process.env": { BUILD_TARGET: JSON.stringify("client") },
      // }),
      // new ForkTsCheckerWebpackPlugin({
      //   tsconfig: path.resolve(__dirname, "tsconfig.json"),
      //   memoryLimit: 2048,
      //   tslint: path.resolve(__dirname, "tslint.json"),
      //   reportFiles: ["./consumer/src/**", "./packages/**/src/**"],
      //   ignoreLints: ["**/*.test.*"],
      //   async: true
      // })
      // new SimpleProgressWebpackPlugin( { // Default options
      //   format: 'compact'
      // })
    ],
    resolve: {
      extensions: [".ts", ".tsx", ".mjs", ".js", ".graphql"],
      alias: {
        "@consumer/config": path.join(process.cwd(), "src")
      }
    },
    devServer: {
      host: "localhost",
      port: 3001,
      historyApiFallback: true,
      hot: true,
      headers: { "Access-Control-Allow-Origin": "*" },
      disableHostCheck: true
    },
    output: {
      path: path.join(__dirname, ".build"),
      publicPath: "http://localhost:3001/",
      filename: "client.js"
    }
  };
}

function createServerConfig() {
  return {
    entry: [
      // "@babel/polyfill",
      "webpack/hot/poll?1000",
      path.resolve(__dirname, "../src/index.tsx")
    ],
    target: "node",
    mode: "development",
    externals: [
      nodeExternals({
        whitelist: [
          "webpack/hot/poll?1000"
          // "@refract-cms/server",
          // "@refract-cms/core"
        ]
      })
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          loader: "ts-loader",
          //exclude: /node_modules/,
          include: [path.resolve(__dirname, "../src")],
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, "tsconfig.server.json")
          }
        }
        // {
        //   test: /\.(js|jsx|ts|tsx)?$/,
        //   loader: "prettier-loader",
        //   exclude: /node_modules/
        // },
        // {
        //   test: /\.(graphql|gql)$/,
        //   exclude: /node_modules/,
        //   loader: "graphql-tag/loader"
        // }
      ]
    },
    plugins: [
      new StartServerPlugin("server.js"),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        "process.env": { BUILD_TARGET: JSON.stringify("server") }
      })
      // new ForkTsCheckerWebpackPlugin({
      //   tsconfig: path.resolve(__dirname, "tsconfig.json"),
      //   memoryLimit: 2048,
      //   tslint: path.resolve(__dirname, "tslint.json"),
      //   reportFiles: ["./consumer/src/**", "./packages/**/src/**"],
      //   ignoreLints: ["**/*.test.*"],
      //   async: true
      // })
    ],
    resolve: {
      extensions: [".ts", ".tsx", ".mjs", ".js", ".graphql"],
      alias: {
        "@consumer/config": path.join(process.cwd(), "src")
      }
    },
    output: { path: path.join(__dirname, ".build"), filename: "server.js" }
  };
}

module.exports = {
  createClientConfig,
  createServerConfig
};