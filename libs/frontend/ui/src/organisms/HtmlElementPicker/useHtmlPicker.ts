import { useCallback, useEffect, useRef, useState } from 'react';
import { HtmlPicker } from '@scrapper-gate/frontend/html-picker';
import tinycolor from 'tinycolor2';
import { HtmlElementPickerProps } from './HtmlElementPicker.types';
import { Selector, SelectorType } from '@scrapper-gate/shared/schema';
import { useTheme } from '@material-ui/core';

export interface UseHtmlPickerProps
  extends Pick<
    HtmlElementPickerProps,
    'ignoredElementsContainer' | 'container'
  > {
  open: boolean;
  toggleOpen: (open: boolean) => void;
  getValueByMode: (element: Element) => Selector;
  multiSelect: boolean;
  value: Selector[];
  onChange: (value: Selector[]) => void;
  mode: SelectorType;
  clickEnabled: boolean;
}

export const useHtmlPicker = ({
  open,
  getValueByMode,
  ignoredElementsContainer,
  multiSelect,
  toggleOpen,
  value,
  onChange,
  container,
  mode,
  clickEnabled,
}: UseHtmlPickerProps) => {
  const theme = useTheme();

  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null
  );

  const callback = useCallback(
    (target: Element, event: Event) => {
      if (
        ignoredElementsContainer?.contains(target) ||
        event.type === 'mousemove'
      ) {
        return;
      }

      const newValue = getValueByMode(target);

      if (!newValue.value) {
        return;
      }

      if (!multiSelect) {
        onChange([newValue]);

        toggleOpen(false);
      } else {
        onChange([...(value ?? []), newValue]);
      }
    },
    [
      ignoredElementsContainer,
      getValueByMode,
      multiSelect,
      onChange,
      toggleOpen,
      value,
    ]
  );

  const pickerRef = useRef<HtmlPicker | null>(null);

  useEffect(() => {
    if (pickerRef.current) {
      pickerRef.current.close();
    }

    if (open) {
      pickerRef.current = new HtmlPicker({
        background: tinycolor(theme.palette.primary.light)
          .setAlpha(0.5)
          .toRgbString(),
        borderWidth: 2,
        ignoreElementsContainer: ignoredElementsContainer,
        onElementHover: async (element) => {
          if (
            ignoredElementsContainer?.contains(element) ||
            !getValueByMode(element).value
          ) {
            return;
          }

          setHoveredElement(element);
        },
        action: {
          trigger: 'click',
          callback,
        },
      });
    } else {
      pickerRef.current = null;
    }
  }, [
    open,
    theme,
    pickerRef,
    onChange,
    container,
    ignoredElementsContainer,
    callback,
    mode,
    getValueByMode,
  ]);

  useEffect(() => {
    if (!open) {
      setHoveredElement(null);
    }
  }, [open]);

  useEffect(() => {
    if (pickerRef.current) {
      pickerRef.current.preventClick = !clickEnabled;
      pickerRef.current.action = {
        trigger: 'click',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        callback: clickEnabled ? () => {} : callback,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickEnabled, pickerRef.current, callback]);

  return {
    pickerRef,
    hoveredElement,
  };
};
