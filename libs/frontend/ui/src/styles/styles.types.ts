import { SerializedStyles, Theme } from '@emotion/react';

export type StylesFn = (theme: Theme) => SerializedStyles | string;
