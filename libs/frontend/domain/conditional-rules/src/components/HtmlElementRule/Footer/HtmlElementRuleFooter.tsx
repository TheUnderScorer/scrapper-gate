import { Box } from '@mui/material';
import { HtmlElementPicker } from '@scrapper-gate/frontend/ui';
import React from 'react';
import { HtmlElementRuleProps } from '../HtmlElementRule';

export const HtmlElementRuleFooter = ({
  getName,
  fieldVariant,
  picker,
  ...rest
}: HtmlElementRuleProps) => {
  return (
    <Box width="100%">
      {picker ?? (
        <HtmlElementPicker
          sx={{
            width: '100%',
          }}
          label="Selectors"
          variant={fieldVariant}
          name={getName('selectors')}
          {...rest}
        />
      )}
    </Box>
  );
};
