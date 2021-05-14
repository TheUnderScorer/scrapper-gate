export enum ContentStates {
  ChangingScrapper = 'ChangingScrapper',
  CreatingScrapper = 'CreatingScrapper',
  ViewingResult = 'ViewingResult',
}

export interface ContentStatePayload {
  state: ContentStates;
  payload?: unknown;
}

export interface ContentStateChangePayload extends ContentStatePayload {
  tabId?: number;
}

export interface GetContentStatePayload {
  tabId?: number;
}
