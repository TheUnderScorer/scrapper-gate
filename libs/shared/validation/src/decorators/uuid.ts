import * as jf from 'joiful';

export const uuid = () =>
  jf
    .string()
    .regex(
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
    );
