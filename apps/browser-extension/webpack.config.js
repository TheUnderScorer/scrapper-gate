const createConfig = require('@nrwl/react/plugins/webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');

module.exports = (config) => {
  const preppedConfig = createConfig(config);

  preppedConfig.entry.main = [path.resolve(__dirname, './src/popup.tsx')];
  preppedConfig.entry.content = [path.resolve(__dirname, './src/content.tsx')];
  preppedConfig.entry.background = [
    path.resolve(__dirname, './src/background.ts'),
  ];

  delete preppedConfig.entry.styles;

  preppedConfig.output.filename = '[name].js';
  preppedConfig.output.chunkFilename = '[name].js';

  delete preppedConfig.optimization.runtimeChunk;
  preppedConfig.optimization.splitChunks.automaticNameDelimiter = '-';

  preppedConfig.plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: '../manifest.json',
          to: '../../../dist/apps/browser-extension',
        },
      ],
    })
  );

  if (preppedConfig.devServer) {
    preppedConfig.devServer.hot = false;
    preppedConfig.devServer.writeToDisk = true;
    preppedConfig.devServer.headers = {
      // We're doing CORS request for HMR
      'Access-Control-Allow-Origin': '*',
    };
    preppedConfig.devServer.disableHostCheck = true;
    preppedConfig.devServer.https = true;
  }

  if (preppedConfig.mode === 'development') {
    preppedConfig.plugins.push(
      new ExtensionReloader({
        manifest: path.resolve(__dirname, 'manifest.json'),
        port: 4200,
        entries: {
          contentScript: 'content',
          background: 'background',
          extensionPage: 'main',
        },
      })
    );

    preppedConfig.optimization.removeAvailableModules = false;
    preppedConfig.optimization.removeEmptyChunks = false;

    delete preppedConfig.optimization.minimizer;

    preppedConfig.resolve.symlinks = false;
    preppedConfig.output.pathinfo = false;
    preppedConfig.cache = {
      type: 'memory',
    };
  }

  preppedConfig.output.globalObject = 'window';

  return preppedConfig;
};
