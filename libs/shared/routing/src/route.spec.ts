import { paramRoute } from './route';

describe('Param route', () => {
  const route = paramRoute('/test-route/:test?query=:query');

  it('should return url without query if no params are provider', () => {
    expect(route()).toEqual('/test-route/:test');
  });

  it('should return url with params if they were provided', () => {
    expect(
      route({
        test: 'testParam',
        query: true,
      })
    ).toEqual('/test-route/testParam?query=true');
  });
});
