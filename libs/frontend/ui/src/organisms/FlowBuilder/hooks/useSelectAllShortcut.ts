import { useStoreActions } from 'react-flow-renderer';
import { useHotkeys } from 'react-hotkeys-hook';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { useKeyboardShortcuts } from '@scrapper-gate/frontend/keyboard-shortcuts';

export const useSelectAllShortcut = () => {
  const getItems = useFlowBuilderItemsSelector((items) => items.getItems);
  const setSelected = useStoreActions((actions) => actions.setSelectedElements);

  const hotkeys = useKeyboardShortcuts();

  return useHotkeys(
    hotkeys.selectAll,
    (event) => {
      event.preventDefault();

      setSelected(getItems());
    },
    [setSelected, getItems]
  );
};
