const slsw = require('serverless-webpack');
const TsConfigPaths = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const tsConfigPath = path.resolve(__dirname, 'tsconfig.app.json');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const isLocal = slsw.lib.webpack.isLocal;

module.exports = {
  entry: slsw.lib.entries,
  mode: isLocal ? 'development' : 'production',
  externals: [nodeExternals()],
  devtool: 'source-map',
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '../../dist/apps/lambdas'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [
      new TsConfigPaths({
        configFile: tsConfigPath,
        logLevel: 'info',
        mainFields: ['main', 'browser', 'module'],
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true,
          configFile: tsConfigPath,
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      typescript: {
        configFile: tsConfigPath,
      },
    }),
  ],
};
