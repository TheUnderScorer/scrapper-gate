module.exports = {
  stories: [],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-knobs',
    '@storybook/addon-docs',
  ],
  core: {
    builder: 'webpack5',
  },
};
