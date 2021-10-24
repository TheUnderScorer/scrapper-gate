const makeShim = require('../../tools/makeShim');
const createConfig = require('@nrwl/react/plugins/webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const { createPipe } = require('remeda');

function removeProgressPlugin(config) {
  // There are two ProgressPlugins, and this causes build to fail
  const index = config.plugins.findIndex(
    (plugin) =>
      plugin.constructor?.name === 'ProgressPlugin' &&
      plugin.modulesCount === 500
  );

  config.plugins.splice(index, 1);

  return config;
}

function copyManifest(config) {
  config.plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: '../manifest.json',
          to: '../../../dist/apps/browser-extension',
        },
      ],
    })
  );

  return config;
}

function resolveCorrectQueryString(config) {
  config.resolve.alias['query-string'] = path.resolve(
    __dirname,
    '../../node_modules/query-string'
  );

  return config;
}

function setupDevServer(config) {
  if (config.devServer) {
    // config.devServer.hot = true;
    config.devServer.writeToDisk = true;
    config.devServer.disableHostCheck = true;
    config.devServer.injectClient = false;
    config.devServer.watchOptions = {
      ignored: /node_modules/,
    };
  }

  return config;
}

function setupShims(config) {
  makeShim(config, /faker/);
  makeShim(config, /@testing-library.*/);

  return config;
}

function modifyBundle(config) {
  config.output.publicPath = '/';

  if (config.mode === 'development') {
    config.devtool = 'cheap-module-source-map';
    config.optimization.removeAvailableModules = false;
    config.optimization.removeEmptyChunks = false;

    delete config.optimization.minimizer;

    config.resolve.symlinks = false;
    config.output.pathinfo = false;
  } else {
    delete config.devtool;

    if (process.env.ANALYZE_BUNDLE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
        })
      );
    }

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      })
    );
  }

  return config;
}

function cleanupEntries(config) {
  delete config.entry.styles;

  config.output.filename = '[name].js';
  config.output.chunkFilename = '[name].js';

  delete config.optimization.runtimeChunk;
  config.optimization.splitChunks.automaticNameDelimiter = '-';

  return config;
}

function setupEntries(config) {
  config.entry.main = [path.resolve(__dirname, './src/app/popup/popup.tsx')];
  config.entry.content = [
    path.resolve(__dirname, './src/app/content/content.tsx'),
  ];
  config.entry.contentMain = [
    path.resolve(__dirname, './src/app/content/contentMain.tsx'),
  ];
  config.entry.background = [path.resolve(__dirname, './src/background.ts')];
  config.entry.backgroundMain = [
    path.resolve(__dirname, './src/backgroundMain.ts'),
  ];

  return config;
}

module.exports = createPipe(
  createConfig,
  removeProgressPlugin,
  setupEntries,
  cleanupEntries,
  copyManifest,
  resolveCorrectQueryString,
  setupDevServer,
  setupShims,
  modifyBundle
);
