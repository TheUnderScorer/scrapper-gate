import { useKeyboardShortcuts } from '@scrapper-gate/frontend/keyboard-shortcuts';
import { useStoreActions } from 'react-flow-renderer';
import { useHotkeys } from 'react-hotkeys-hook';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';

export const useSelectAllShortcut = () => {
  const getItems = useFlowBuilderItemsSelector((items) => items.getItems);
  const setSelected = useStoreActions((actions) => actions.setSelectedElements);

  const hotkeys = useKeyboardShortcuts();

  return useHotkeys(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    hotkeys!.selectAll,
    (event) => {
      event.preventDefault();

      setSelected(getItems());
    },
    [setSelected, getItems]
  );
};
