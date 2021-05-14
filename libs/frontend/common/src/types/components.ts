import * as React from 'react';

export type SvgComponent = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & { title?: string }
>;
