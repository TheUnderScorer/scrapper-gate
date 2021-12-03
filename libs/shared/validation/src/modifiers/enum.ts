import joi from 'joi';

export const enumField = (enumObj: Record<string, unknown>) =>
  joi.string().allow(...Object.keys(enumObj));
