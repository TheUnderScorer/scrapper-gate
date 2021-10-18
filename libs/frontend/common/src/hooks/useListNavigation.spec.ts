import {
  NavigationDirection,
  useListNavigation,
} from '@scrapper-gate/frontend/common';
import { act, renderHook } from '@testing-library/react-hooks';

describe('useListNavigation', () => {
  it('should support navigation up/down', () => {
    const { result } = renderHook(() =>
      useListNavigation({
        items: [1, 2, 3, 4],
      })
    );

    expect(result.current.activeItem).toEqual(1);

    act(() => {
      result.current.handleNavigation(NavigationDirection.Bottom);
    });

    expect(result.current.activeItem).toEqual(2);

    act(() => {
      result.current.handleNavigation(NavigationDirection.Top);
    });

    expect(result.current.activeItem).toEqual(1);

    act(() => {
      result.current.handleNavigation(NavigationDirection.Top);
    });

    expect(result.current.activeItem).toEqual(4);

    act(() => {
      result.current.handleNavigation(NavigationDirection.Bottom);
    });

    expect(result.current.activeItem).toEqual(1);
  });
});
