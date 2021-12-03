import { Box } from '@mui/material';
import { scrapperJavascriptFunctionName } from '@scrapper-gate/shared/domain/scrapper';
import { variableTypeDef } from '@scrapper-gate/shared/domain/variables';
import { useFormState } from 'react-final-form';
import { ScrapperKey } from '../commonFields/ScrapperKey';
import { Url } from '../commonFields/Url';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';

export const RunJavascriptSections = ({
  fieldNameCreator,
  CodeEditor,
  nodeIndex,
}: ScrapperStepFormProps) => {
  const { submitting } = useFormState({
    subscription: {
      submitting: true,
    },
  });

  return (
    <>
      <ScrapperKey disabled={submitting} fieldNameCreator={fieldNameCreator} />
      <Box width="100%" height="100%">
        <CodeEditor
          initialValue={`// Enter your code here.
// You can access variables by using "context.variables.$KEY".
// Ex. context.variables.my_variable
// You can return values, by returning object with key "values".
// Ex. return { values: document.querySelector('#some-id').textContent }
// Refer to docs for examples 😎.

/**
 * Runs current step
 * @param {Context} context
 * @returns {?Result}
 */
function ${scrapperJavascriptFunctionName}(context) {
    return {
      values: 'my_value'
    }
}
        `}
          additionalJsLib={`
${variableTypeDef}

/**
 * @typedef {Object} Result - Result of a scrapper step
 * @property {*} values - Values from current step
 */

/**
 * @typedef {Object} Context - Defines scrapper variable
 * @property {Object.<string, Variable>} variables - Stores scrapper variables
 */
          `}
          name={fieldNameCreator('jsCode')}
          label="Code"
          helperText="Enter JavaScript code that will be run on current page."
          language="javascript"
        />
      </Box>
      <Url
        disabled={submitting}
        fieldNameCreator={fieldNameCreator}
        nodeIndex={nodeIndex}
      />
    </>
  );
};
