import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  HtmlPicker,
  UniqueSelector,
} from '@scrapper-gate/frontend/html-picker';
import tinycolor from 'tinycolor2';
import { HtmlElementPickerProps } from './HtmlElementPicker.types';
import { Selector, SelectorType } from '@scrapper-gate/shared/schema';
import { useTheme } from '@material-ui/core';
import { prefix } from '@scrapper-gate/shared/common';

export interface UseHtmlPickerProps
  extends Pick<
    HtmlElementPickerProps,
    'ignoredElementsContainer' | 'container'
  > {
  open: boolean;
  getValueByMode: (element: Element) => Selector;
  appendElement: (target: Element, event: Event) => void;
  mode: SelectorType;
  clickEnabled: boolean;
  elementDropdownRef: MutableRefObject<HTMLDivElement | undefined>;
  uniqueSelector: UniqueSelector;
}

export const useHtmlPicker = ({
  open,
  getValueByMode,
  ignoredElementsContainer,
  appendElement,
  container,
  mode,
  clickEnabled,
  elementDropdownRef,
  uniqueSelector,
}: UseHtmlPickerProps) => {
  const theme = useTheme();

  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null
  );

  const [selectedElementSelector, setSelectedElementSelector] = useState<
    string | null
  >(null);

  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null
  );

  const pickerRef = useRef<HtmlPicker | null>(null);

  const setTarget = useCallback(
    (element: HTMLElement, event?: MouseEvent) => {
      if (!pickerRef.current) {
        return;
      }

      pickerRef.current.setTarget(element, event);
      pickerRef.current.selectedElement = element;
    },
    [pickerRef]
  );

  useEffect(() => {
    if (pickerRef.current) {
      pickerRef.current.dispose();
    }

    if (open) {
      pickerRef.current = new HtmlPicker({
        background: tinycolor(theme.palette.primary.light)
          .setAlpha(0.5)
          .toRgbString(),
        zIndex: theme.zIndex.modal + 10,
        borderWidth: 2,
        ignoreElementsContainer: ignoredElementsContainer,
        onElementHover: async (element) => {
          if (
            ignoredElementsContainer?.contains(element) ||
            !getValueByMode(element).value ||
            element.classList.contains(prefix('highlight'))
          ) {
            return;
          }

          setHoveredElement(element);
        },
        shouldHandleOutsideClick: (element) =>
          !elementDropdownRef.current?.contains(element) &&
          !ignoredElementsContainer?.contains(element),
        onElementSelect: (element) => {
          if (!pickerRef.current) {
            return;
          }

          const isHighLight = element?.classList?.contains(prefix('highlight'));

          if (!element || isHighLight) {
            setSelectedElement(null);

            if (isHighLight) {
              pickerRef.current.selectedElement = undefined;
            }

            return;
          }

          setSelectedElement(element);
        },
        action: {
          trigger: 'click',
          callback: appendElement,
        },
      });
    } else {
      pickerRef.current = null;
    }
  }, [
    open,
    theme,
    pickerRef,
    container,
    ignoredElementsContainer,
    mode,
    getValueByMode,
    elementDropdownRef,
    appendElement,
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
        callback: clickEnabled ? () => {} : appendElement,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickEnabled, pickerRef.current, appendElement]);

  useEffect(() => {
    if (!selectedElement) {
      setSelectedElementSelector(null);

      return;
    }

    setSelectedElementSelector(uniqueSelector(selectedElement));
  }, [selectedElement, uniqueSelector]);

  return {
    pickerRef,
    hoveredElement,
    selectedElement,
    selectedElementSelector,
    setTarget,
  };
};
