import { render } from '@testing-library/react';
import { Highlight } from './Highlight';

describe('<Highlight />', () => {
  it('should highlight text', () => {
    const cmp = render(<Highlight text="Cool text" value="text" />);

    expect(cmp.container.outerHTML).toMatchSnapshot();
  });

  it('should highlight array of text', () => {
    const cmp = render(
      <Highlight
        text="Lorem ipsum ipsum Lorem test"
        value={['ipsum', 'test']}
      />
    );

    expect(cmp.container.outerHTML).toMatchSnapshot();
  });
});
