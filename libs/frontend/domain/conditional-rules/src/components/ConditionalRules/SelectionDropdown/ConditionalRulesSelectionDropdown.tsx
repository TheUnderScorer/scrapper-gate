import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import {
  Centered,
  Dropdown,
  MenuItemProperties,
} from '@scrapper-gate/frontend/ui';
import { ConditionalRule } from '@scrapper-gate/shared/domain/conditional-rules';
import React, { useMemo } from 'react';
import { FrontendConditionalRuleDefinition } from '../../../types';

export interface ConditionalRulesSelectionDropdownProps {
  onAdd: (rule: ConditionalRule) => unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  definitions: FrontendConditionalRuleDefinition<any>[];
}

export const ConditionalRulesSelectionDropdown = ({
  onAdd,
  definitions,
}: ConditionalRulesSelectionDropdownProps) => {
  const items = useMemo<MenuItemProperties[]>(
    () => [
      {
        type: 'subHeader',
        content: 'Select rule:',
        id: 'rule_subheader',
      },
      ...definitions.map((definition) => ({
        id: definition.definition.type,
        content: definition.label,
        icon: definition.icon,
        sx: {
          minWidth: '200px',
        },
        onClick: () =>
          onAdd({
            ruleType: definition.definition.type,
          } as ConditionalRule),
      })),
    ],
    [definitions, onAdd]
  );

  return (
    <Dropdown
      items={items}
      activator={({ onClick }) => (
        <Centered>
          <Button startIcon={<Add />} onClick={onClick} variant="outlined">
            Add rule
          </Button>
        </Centered>
      )}
    />
  );
};
