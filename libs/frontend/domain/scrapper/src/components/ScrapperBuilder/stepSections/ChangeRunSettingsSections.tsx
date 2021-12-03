import { useFormState } from 'react-final-form';
import { ScrapperRunSettingsForm } from '../../ScrapperRunSettingsForm/ScrapperRunSettingsForm';
import { ScrapperKey } from '../commonFields/ScrapperKey';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';

export const ChangeRunSettingsSections = ({
  fieldNameCreator,
}: ScrapperStepFormProps) => {
  const formState = useFormState({
    subscription: {
      submitting: true,
    },
  });

  return (
    <>
      <ScrapperKey
        fieldNameCreator={fieldNameCreator}
        disabled={formState.submitting}
      />
      <ScrapperRunSettingsForm
        disabled={formState.submitting}
        getFieldName={(name) => fieldNameCreator(`newRunSettings.${name}`)}
      />
    </>
  );
};
