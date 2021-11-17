module.exports = {
  stories: [],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-knobs',
    '@storybook/addon-docs',
    '@storybook/addon-actions',
  ],
  core: {
    builder: 'webpack5',
  },
};
