import { ContentStatePayload } from '../../browser/communication/content/contentState.types';

export const contentStateStore = new Map<
  number,
  ContentStatePayload | undefined | null
>();
