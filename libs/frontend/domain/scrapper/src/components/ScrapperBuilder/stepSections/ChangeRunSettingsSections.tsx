import { useFormState } from 'react-final-form';
import { ScrapperRunSettingsForm } from '../../ScrapperRunSettingsForm/ScrapperRunSettingsForm';
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
    <ScrapperRunSettingsForm
      disabled={formState.submitting}
      getFieldName={(name) => fieldNameCreator(`newRunSettings.${name}`)}
    />
  );
};
