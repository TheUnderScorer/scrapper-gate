const createConfig = require('@nrwl/react/plugins/webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');

function makeShim(baseConfig, regex) {
  baseConfig.plugins.push(
    new webpack.NormalModuleReplacementPlugin(regex, (resource) => {
      const srcPath = path.resolve(path.join(__dirname, '../../tools/shim.js'));

      resource.request = resource.request.replace(regex, srcPath);
    })
  );
}

module.exports = (baseConfig) => {
  const config = createConfig(baseConfig);

  config.entry.main = [path.resolve(__dirname, './src/popup.tsx')];
  config.entry.content = [path.resolve(__dirname, './src/content.tsx')];
  config.entry.contentRoot = [
    path.resolve(__dirname, './src/app/Content/contentRoot.tsx'),
  ];
  config.entry.background = [path.resolve(__dirname, './src/background.ts')];
  config.entry.backgroundMain = [
    path.resolve(__dirname, './src/backgroundMain.ts'),
  ];

  delete config.entry.styles;

  config.output.filename = '[name].js';
  config.output.chunkFilename = '[name].js';

  delete config.optimization.runtimeChunk;
  config.optimization.splitChunks.automaticNameDelimiter = '-';

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

  if (config.devServer) {
    // config.devServer.hot = true;
    config.devServer.writeToDisk = true;
    config.devServer.disableHostCheck = true;
    config.devServer.injectClient = false;
    config.devServer.watchOptions = {
      ignored: /node_modules/,
    };
  }

  makeShim(baseConfig, /faker/);
  makeShim(baseConfig, /@testing-library.*/);

  if (config.mode === 'development') {
    config.devtool = 'cheap-module-source-map';
    config.optimization.removeAvailableModules = false;
    config.optimization.removeEmptyChunks = false;

    delete config.optimization.minimizer;

    config.resolve.symlinks = false;
    config.output.pathinfo = false;
  } else {
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
};
