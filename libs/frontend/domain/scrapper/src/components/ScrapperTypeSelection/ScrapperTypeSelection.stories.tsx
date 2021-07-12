import { ScrapperType } from '@scrapper-gate/shared/schema';
import { Form } from 'react-final-form';
import { ScrapperTypeSelection } from './ScrapperTypeSelection';

export default {
  title: 'Scrapper type selection',
};

export const Component = () => (
  <Form
    initialValues={{
      type: ScrapperType.Simple,
    }}
    onSubmit={console.log}
    render={() => <ScrapperTypeSelection name="type" />}
  />
);
