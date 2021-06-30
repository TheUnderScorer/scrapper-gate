const slsw = require('serverless-webpack');
const TsConfigPaths = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const tsConfigPath = path.resolve(__dirname, 'tsconfig.json');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const isLocal = slsw.lib.webpack.isLocal;

module.exports = {
  entry: slsw.lib.entries,
  mode: isLocal ? 'development' : 'production',
  externals: [nodeExternals()],
  devtool: 'source-map',
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '../../dist/apps/lambdas'),
  },
  resolve: {
    plugins: [
      new TsConfigPaths({
        configFile: tsConfigPath,
      }),
    ],
  },
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tsconfig: tsConfigPath,
    }),
  ],
};
