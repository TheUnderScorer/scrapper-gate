import { applyVariablesToText, TemplateType } from './template';

describe('Apply variables to text', () => {
  it('should replace templates with values', () => {
    const result = applyVariablesToText({
      text: 'Hello {{name}}, today is {{date}}. {{name}} repeat.',
      variables: {
        name: 'John',
        date: '1990-02-19',
      },
    });

    expect(result).toEqual('Hello John, today is 1990-02-19. John repeat.');
  });

  it('should replace templates with values for dot template', () => {
    const result = applyVariablesToText({
      text: '/test-route/:param1/:param2',
      variables: {
        param1: 'testParam',
        param2: 'anotherTestParam',
      },
      type: TemplateType.Colon,
    });

    expect(result).toEqual('/test-route/testParam/anotherTestParam');
  });
});
