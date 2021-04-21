import { applyVariablesToText, TemplateType } from './template';

describe('Apply variables to text', () => {
  it('should replace templates with values', () => {
    const result = applyVariablesToText(
      'Hello {{name}}, today is {{date}}. {{name}} repeat.',
      {
        name: 'John',
        date: '1990-02-19',
      }
    );

    expect(result).toEqual('Hello John, today is 1990-02-19. John repeat.');
  });

  it('should replace templates with values for dot template', () => {
    const result = applyVariablesToText(
      '/test-route/:param1/:param2',
      {
        param1: 'testParam',
        param2: 'anotherTestParam',
      },
      TemplateType.Dot
    );

    expect(result).toEqual('/test-route/testParam/anotherTestParam');
  });
});
