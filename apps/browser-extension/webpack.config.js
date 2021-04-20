const createConfig = require('@nrwl/react/plugins/webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (config) => {
  const preppedConfig = createConfig(config);

  preppedConfig.entry.main = [path.resolve(__dirname, './src/popup.tsx')];
  preppedConfig.entry.content = [path.resolve(__dirname, './src/content.tsx')];
  preppedConfig.entry.contentRoot = [
    path.resolve(__dirname, './src/app/Content/contentRoot.tsx'),
  ];
  preppedConfig.entry.background = [
    path.resolve(__dirname, './src/background.ts'),
  ];
  preppedConfig.entry.backgroundMain = [
    path.resolve(__dirname, './src/backgroundMain.ts'),
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
    preppedConfig.devServer.hot = true;
    preppedConfig.devServer.writeToDisk = true;
    preppedConfig.devServer.disableHostCheck = true;
    preppedConfig.devServer.injectClient = false;
  }

  if (preppedConfig.mode === 'development') {
    preppedConfig.optimization.removeAvailableModules = false;
    preppedConfig.optimization.removeEmptyChunks = false;

    delete preppedConfig.optimization.minimizer;

    preppedConfig.resolve.symlinks = false;
    preppedConfig.output.pathinfo = false;
    preppedConfig.cache = {
      type: 'memory',
    };
  }

  return preppedConfig;
};
