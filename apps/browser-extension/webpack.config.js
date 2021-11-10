const makeShim = require('../../tools/makeShim');
const createConfig = require('@nrwl/react/plugins/webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const { createPipe } = require('remeda');
const MonacoPlugin = require('monaco-editor-webpack-plugin');

function copyManifest(config) {
  config.plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: './manifest.json',
          to: '../../../dist/apps/browser-extension',
        },
      ],
    })
  );

  return config;
}

function setupAliases(config) {
  config.resolve.alias['query-string'] = path.resolve(
    __dirname,
    '../../node_modules/query-string'
  );

  return config;
}

function setupDevServer(config) {
  if (config.devServer) {
    // config.devServer.hot = true;
    config.devServer.client = false;
    config.devServer.allowedHosts = 'all';

    if (!config.devServer.devMiddleware) {
      config.devServer.devMiddleware = {};
    }

    if (!config.devServer.static) {
      config.devServer.static = {};
    }

    Object.assign(config.devServer.static, {
      watch: {
        ...config.devServer.static.watch,
        ignored: /node_modules/,
      },
    });

    Object.assign(config.devServer.devMiddleware, {
      writeToDisk: true,
    });
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
    config.devtool = 'inline-source-map';
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

// TODO Remove unnecessary features
function setupMonaco(config) {
  config.plugins.push(
    new MonacoPlugin({
      languages: ['typescript', 'javascript'],
    })
  );

  return config;
}

module.exports = createPipe(
  createConfig,
  setupEntries,
  cleanupEntries,
  copyManifest,
  setupAliases,
  setupDevServer,
  setupShims,
  modifyBundle,
  setupMonaco
);
