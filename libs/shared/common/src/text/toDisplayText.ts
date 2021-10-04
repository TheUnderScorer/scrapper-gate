import lowerCase from 'lodash.lowercase';
import capitalize from 'lodash.capitalize';
import { createPipe } from 'remeda';

export const toDisplayText = createPipe(lowerCase, capitalize);
