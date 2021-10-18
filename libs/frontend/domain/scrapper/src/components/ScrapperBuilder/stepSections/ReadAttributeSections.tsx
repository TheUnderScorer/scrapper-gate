import { VariablesAutocomplete } from '@scrapper-gate/frontend/domain/variables';
import { ExternalLink } from '@scrapper-gate/frontend/ui';
import { useCallback, useState } from 'react';
import { useFormState } from 'react-final-form';
import { createPipe, flatMap, uniq } from 'remeda';
import { ScrapperKey } from '../commonFields/ScrapperKey';
import { Url } from '../commonFields/Url';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';

const extractAttributes = createPipe(
  flatMap<HTMLElement, string>((element) =>
    Array.from(element.attributes).map((attr) => attr.name)
  ),
  uniq()
);

export const ReadAttributeSections = ({
  fieldNameCreator,
  ElementPicker,
  nodeIndex,
}: ScrapperStepFormProps) => {
  const formState = useFormState({
    subscription: {
      submitting: true,
    },
  });

  const [attributes, setAttributes] = useState<string[]>([]);

  const getNewAttributes = useCallback((elements: HTMLElement[]) => {
    if (!elements?.length) {
      setAttributes([]);

      return [];
    }

    const newAttributes = extractAttributes(elements);

    setAttributes(newAttributes);
  }, []);

  return (
    <>
      <ScrapperKey
        fieldNameCreator={fieldNameCreator}
        disabled={formState.submitting}
      />
      <ElementPicker
        onElements={getNewAttributes}
        nodeIndex={nodeIndex}
        fieldNameCreator={fieldNameCreator}
        disabled={formState.submitting}
      />
      <VariablesAutocomplete
        name={fieldNameCreator('attributeToRead')}
        options={attributes}
        label="Attribute to read"
        helperText={
          <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes">
            Learn more about HTML attributes
          </ExternalLink>
        }
      />
      <Url fieldNameCreator={fieldNameCreator} nodeIndex={nodeIndex} />
    </>
  );
};
