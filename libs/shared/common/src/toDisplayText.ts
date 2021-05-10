import lowerCase from 'lodash.lowercase';
import capitalize from 'lodash.capitalize';

export const toDisplayText = (value: string) => capitalize(lowerCase(value));
