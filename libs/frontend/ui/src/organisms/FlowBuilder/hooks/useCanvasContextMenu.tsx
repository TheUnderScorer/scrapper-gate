import { PopoverPosition } from '@material-ui/core';
import { Sort } from '@material-ui/icons';
import { MenuItemProperties, Selection } from '@scrapper-gate/frontend/common';
import { Perhaps } from '@scrapper-gate/shared/common';
import React, {
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { OpenCloseContextMenuBag } from '../../../molecules/ContextMenu/ContextMenu.types';
import { FilterTextField } from '../../../molecules/FilterTextField/FilterTextField';
import { BaseNodeSelectionProperties } from '../FlowBuilder.types';
import { useFlowBuilderInstanceContext } from '../providers/FlowBuilderInstance.provider';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { useFlowBuilderSelection } from '../providers/FlowBuilderSelection.provider';
import { useAddItem } from './useAddItem';

export interface UseCanvasContextMenuProps {
  containerRef: MutableRefObject<HTMLElement | undefined>;
}

export const useCanvasContextMenu = ({
  containerRef,
}: UseCanvasContextMenuProps) => {
  const { selection } = useFlowBuilderSelection();
  const [filteredSelection, setFilteredSelection] = useState(selection);
  const [menuPos, setMenuPos] = useState<Perhaps<PopoverPosition>>(null);

  const { flowInstance } = useFlowBuilderInstanceContext();
  const addItem = useAddItem();
  const nodeLabel = useFlowBuilderContextSelector((ctx) => ctx.nodesLabel);

  const menuRef = useRef<HTMLDivElement>();

  const handleAdd = useCallback(
    (item: Selection<BaseNodeSelectionProperties>) => async () => {
      if (!flowInstance || !containerRef.current || !menuPos) {
        return;
      }

      const { top, left } = menuPos;
      const containerBounds = containerRef.current.getBoundingClientRect();

      const position = flowInstance.project({
        x: left - containerBounds.left,
        y: top - containerBounds.top,
      });

      await addItem(item, { position });
    },
    [flowInstance, containerRef, menuPos, addItem]
  );

  const handleOpen = useCallback(({ position }: OpenCloseContextMenuBag) => {
    setMenuPos(position);

    setTimeout(() => {
      menuRef.current
        ?.querySelector<HTMLInputElement>('#nodes_filter_context_menu')
        ?.focus();
    }, 250);
  }, []);

  const handleClose = useCallback(() => {
    setMenuPos(null);
  }, []);

  const menuItems = useMemo<MenuItemProperties[]>(() => {
    const nodeTypesItems: Perhaps<MenuItemProperties[]> =
      filteredSelection?.map((item) => {
        const { icon, label } = item;

        return {
          id: label,
          content: label,
          icon: icon,
          onClick: handleAdd(item),
        };
      });

    return [
      {
        id: 'nodes_subheader',
        type: 'subHeader',
        content: nodeLabel ?? 'Nodes',
      },
      {
        id: 'nodes_filter',
        type: 'input',
        content: (
          <FilterTextField
            id="nodes_filter_context_menu"
            size="small"
            placeholder="Search steps..."
            items={selection ?? []}
            onItemsChange={setFilteredSelection}
            filterKeys={['label']}
          />
        ),
      },
      ...(nodeTypesItems ?? []),
      {
        id: 'sort_divider',
        type: 'divider',
      },
      {
        id: 'Sort',
        content: 'Sort nodes',
        icon: <Sort />,
      },
    ];
  }, [filteredSelection, nodeLabel, selection, handleAdd]);

  return {
    menuItems,
    handleOpen,
    menuRef,
    handleClose,
  };
};
