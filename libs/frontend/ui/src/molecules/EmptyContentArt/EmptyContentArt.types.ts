import { InformationBoxProps } from '../InformationBox/InformationBox';

export interface EmptyContentArtProps
  extends Pick<InformationBoxProps, 'sx' | 'title' | 'subTitle'> {
  onCreate?: () => unknown;
  createText: string;
}
