import { JoiMessages } from './types';

export const validationMessages = {
  [JoiMessages.Required]: 'This field is required.',
  [JoiMessages.Email]: 'Must be a valid e-mail.',
  [JoiMessages.Uri]: 'Must be a valid url.',
  [JoiMessages.HtmlAttribute]: 'Invalid attribute.',
  [JoiMessages.NoSpecialChars]:
    'Space and special characters (@#$%^&*()/><|[]) are not allowed.',
  [JoiMessages.Number]: 'Must be a number.',
  [JoiMessages.Empty]: 'This field cannot be empty.',
};
