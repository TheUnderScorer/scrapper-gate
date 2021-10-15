import { action } from '@storybook/addon-actions';
import { Form } from 'react-final-form';
import { ScrapperRunSettingsForm } from './ScrapperRunSettingsForm';

export default {
  title: 'Scrapper Run Settings Form',
};

export const Component = () => {
  return (
    <Form
      onSubmit={action('submit')}
      render={() => (
        <ScrapperRunSettingsForm getFieldName={(name) => name ?? ''} />
      )}
    />
  );
};
