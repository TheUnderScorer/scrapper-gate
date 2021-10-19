import { toMatchImageSnapshot } from 'jest-image-snapshot';

export const registerToMatchImageSnapshot = () => {
  expect.extend({ toMatchImageSnapshot });
};
