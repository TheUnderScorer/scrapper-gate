const makeShim = require('../../tools/makeShim');
const { createPipe } = require('remeda');

function setupShims(config) {
  makeShim(config, /faker/);

  config.output.library = {
    type: 'assign',
  };

  return config;
}

module.exports = createPipe(setupShims);
