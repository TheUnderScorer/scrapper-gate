import React, { useRef } from 'react';
import { Form } from 'react-final-form';
import { Box, GlobalStyles, Stack } from '@mui/material';
import { HtmlElementPicker } from './HtmlElementPicker';
import { HtmlElementPickerValidationRules } from './HtmlElementPicker.types';
import { highlight } from '../../styles/highlight';

export default {
  title: 'Molecules/HTML Element Picker',
  component: HtmlElementPicker,
};

export const Picker = () => {
  const ignoredElementsContainer = useRef<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>();

  return (
    <Form
      onSubmit={console.log}
      render={() => (
        <>
          <GlobalStyles styles={highlight('')} />
          <Stack
            direction="row"
            spacing={2}
            style={{
              width: '90vw',
              height: '80vh',
            }}
          >
            <Box ref={ignoredElementsContainer} width="50%">
              <HtmlElementPicker
                validationRules={[
                  HtmlElementPickerValidationRules.ElementsExist,
                  HtmlElementPickerValidationRules.ValidSelector,
                ]}
                container={containerRef.current}
                ignoredElementsContainer={ignoredElementsContainer.current}
                portal={ignoredElementsContainer.current}
                name="picker"
              />
            </Box>
            <Box ref={containerRef} width="50%">
              <div id="el_1">First element</div>
              <button id="btn">Btn</button>
              <div id="text_nested">
                <span className="text">First text</span>
                <span className="text">Second text</span>
              </div>
            </Box>
          </Stack>
        </>
      )}
    />
  );
};
