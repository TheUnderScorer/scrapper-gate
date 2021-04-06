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

  preppedConfig.output.filename = '[name].js';
  preppedConfig.output.chunkFilename = '[name].js';

  // Don't use runtime chunks
  delete preppedConfig.optimization.runtimeChunk;

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

  preppedConfig.plugins.push(
    new ExtensionReloader({
      manifest: path.resolve(__dirname, 'manifest.json'),
    })
  );

  if (preppedConfig.devServer) {
    preppedConfig.devServer.hot = false;
    preppedConfig.devServer.writeToDisk = true;
  }

  return preppedConfig;
};
