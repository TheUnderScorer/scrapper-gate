import * as jf from 'joiful';

export const enumValue = (obj: Record<string, string | number>) =>
  jf.string().valid(Object.values(obj));

export const optionalEnum = (obj: Record<string, string | number>) =>
  enumValue(obj).optional().allow(null);

export const requiredEnum = (obj: Record<string, string | number>) =>
  enumValue(obj).required();
