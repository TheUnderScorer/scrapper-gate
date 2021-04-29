import { ScrapperKey } from '../commonFields/ScrapperKey';
import { useFormState } from 'react-final-form';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';

export const ReloadSections = ({ fieldNameCreator }: ScrapperStepFormProps) => {
  const formState = useFormState({
    subscription: {
      submitting: true,
    },
  });

  return (
    <ScrapperKey
      fieldNameCreator={fieldNameCreator}
      disabled={formState.submitting}
    />
  );
};
