const createConfig = require('@nrwl/react/plugins/webpack');

module.exports = (config) => {
  const preppedConfig = createConfig(config);

  if (preppedConfig.devServer) {
    preppedConfig.devServer.hot = false;
    preppedConfig.devServer.writeToDisk = true;
  }

  return preppedConfig;
};
