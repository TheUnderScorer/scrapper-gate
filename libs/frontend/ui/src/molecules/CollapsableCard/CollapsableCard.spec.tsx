/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { CollapsableCard } from './CollapsableCard';

describe('<CollapsableCard />', () => {
  it('should handle collapse only on btn click', () => {
    const { container } = render(<CollapsableCard />);

    const btn = container.querySelector('.collapsable-card-btn');
    const summary = container.querySelector('.MuiAccordionSummary-content');

    act(() => {
      fireEvent.click(summary!);
    });

    expect(btn!.classList.contains('expanded')).toBeFalsy();

    act(() => {
      fireEvent.click(btn!);
    });

    expect(btn!.classList.contains('expanded')).toBeTruthy();
  });

  it('should handle close', () => {
    const onClose = jest.fn();
    const { container } = render(
      <CollapsableCard closable onClose={onClose} />
    );

    const btn = container.querySelector('.close-collapsable-card');
    expect(btn).toBeDefined();

    act(() => {
      fireEvent.click(btn!);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
