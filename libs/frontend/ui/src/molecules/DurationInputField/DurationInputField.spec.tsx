import { Duration, toDisplayText } from '@scrapper-gate/shared/common';
import { DurationUnit } from '@scrapper-gate/shared/schema';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DurationInputField } from './DurationInputField';

describe('<DurationInputField />', () => {
  it('should render without crashing', () => {
    const cmp = render(<DurationInputField />);

    expect(cmp).toMatchSnapshot();
  });

  it('should handle value change in selected duration', () => {
    const onChange = jest.fn();
    const initialDuration = Duration.fromHours(1);

    const cmp = render(
      <DurationInputField
        value={initialDuration}
        onChange={onChange}
        label="Duration"
      />
    );

    const input = cmp.container.querySelector<HTMLInputElement>('input');
    const select = cmp.container.querySelector<HTMLInputElement>(
      '.MuiSelect-nativeInput'
    );

    expect(input?.value).toEqual('1');
    expect(select?.value).toEqual(DurationUnit.Hours);
  });

  it('should not change input value after duration change', () => {
    const onChange = jest.fn();
    const initialDuration = Duration.fromHours(1);

    const cmp = render(
      <DurationInputField
        value={initialDuration}
        onChange={onChange}
        label="Duration"
      />
    );

    act(() => {
      userEvent.click(cmp.getByText(toDisplayText(DurationUnit.Hours)));
    });

    act(() => {
      userEvent.click(cmp.getByText(toDisplayText(DurationUnit.Seconds)));
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(Duration.fromSeconds(1));
  });
});
