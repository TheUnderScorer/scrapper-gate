import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import { ScrapperRunSettings } from '@scrapper-gate/shared/schema';

export interface ScrapperRunSettingsFormProps {
  getFieldName: FieldNameCreator;
  initialValue?: ScrapperRunSettings;
}
