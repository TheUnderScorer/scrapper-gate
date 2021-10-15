import { ScrapperRunSettingsForm } from '../../ScrapperRunSettingsForm/ScrapperRunSettingsForm';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';

export const ChangeRunSettingsSections = ({
  fieldNameCreator,
}: ScrapperStepFormProps) => {
  return (
    <ScrapperRunSettingsForm
      getFieldName={(name) => fieldNameCreator(`newRunSettings.${name}`)}
    />
  );
};
