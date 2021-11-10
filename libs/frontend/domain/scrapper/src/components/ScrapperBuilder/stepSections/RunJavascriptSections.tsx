import { Box } from '@mui/material';
import { ScrapperKey } from '../commonFields/ScrapperKey';
import { useScrapperCodeLibs } from '../hooks/useScrapperCodeLibs';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';

export const RunJavascriptSections = ({
  fieldNameCreator,
  CodeEditor,
}: ScrapperStepFormProps) => {
  const libs = useScrapperCodeLibs();

  return (
    <>
      <ScrapperKey fieldNameCreator={fieldNameCreator} />
      <Box width="100%" height="100%">
        <CodeEditor
          initialValue={`// Enter your code here.
// You can access variables by using "variables.$KEY". Ex. variables.my_variable
// You can return values, by returning object with key "result".
// Ex. return { result: document.querySelector('#some-id').textContent }
// Refer to docs for examples 😎.
        `}
          additionalJsLib={libs}
          name={fieldNameCreator('jsCode')}
          label="Code"
          helperText="Enter JavaScript code that will be run on current page."
          language="javascript"
        />
      </Box>
    </>
  );
};
