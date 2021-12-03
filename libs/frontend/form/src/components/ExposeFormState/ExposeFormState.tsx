import { styled } from '@mui/material/styles';
import { MutableRefObject, useCallback } from 'react';
import { useForm } from 'react-final-form';

const StyledButton = styled('button')`
  display: none;
`;

export interface ExposeFormStateProps {
  targetRef: MutableRefObject<HTMLElement | undefined>;
}

export const ExposeFormState = ({ targetRef }: ExposeFormStateProps) => {
  const form = useForm();

  const handleClick = useCallback(() => {
    const state = JSON.stringify(form.getState());

    targetRef.current?.setAttribute('data-form-state', state);
  }, [form, targetRef]);

  return (
    <StyledButton className="expose-form-state" onClick={handleClick}>
      Expose state
    </StyledButton>
  );
};
