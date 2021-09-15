const webpack = require('webpack');
const path = require('path');

module.exports = function makeShim(config, regex) {
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(regex, (resource) => {
      const srcPath = path.resolve(path.join(__dirname, './shim.js'));

      resource.request = resource.request.replace(regex, srcPath);
    })
  );

  return config;
};
