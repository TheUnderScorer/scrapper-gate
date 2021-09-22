import { TextFieldProps } from '@mui/material';
import { FormTextField } from '@scrapper-gate/frontend/form';
import { EditRow } from '../EditRow/EditRow';
import { EditRowProps } from '../EditRow/EditRow.types';

export interface RowTextFieldProps
  extends Omit<EditRowProps, 'children'>,
    Pick<TextFieldProps, 'variant'> {}

export const RowTextField = ({
  variant = 'standard',
  ...rest
}: RowTextFieldProps) => {
  return (
    <EditRow {...rest}>
      {(props) => <FormTextField name={props.name} variant={variant} />}
    </EditRow>
  );
};
