import {
  ContentStateChangePayload,
  GetContentStatePayload,
} from './content/contentState.types';
import { Runtime } from 'webextension-polyfill-ts';
import { AuthTokens } from '@scrapper-gate/shared/schema';

export enum MessageTypes {
  ToggleContent = 'ToggleContent',
  InjectContent = 'InjectContent',
  ScrapperOverlayToggled = 'ScrapperOverlayToggled',
  SetContentRoute = 'SetContentRoute',
  ContentRouteChanged = 'ContentRouteChanged',
  Logout = 'Logout',
  GetActiveTab = 'GetActiveTab',
  Test = 'Test',
  ContentStateChanged = 'ContentStateChanged',
  GetContentState = 'GetContentState',
}

type MessagePayload<Payload> = Payload | null | undefined;

export interface ContentToggleHookPayload {
  visible: boolean;
  path?: string;
  tokens: AuthTokens;
}

export interface StoredRoute {
  pathname: string;
  search: string;
  state?: unknown;
}

export type MessagesPayloadMap = {
  [MessageTypes.ToggleContent]: MessagePayload<ContentToggleHookPayload>;
  [MessageTypes.Test]: MessagePayload<boolean>;
  [MessageTypes.SetContentRoute]: MessagePayload<string>;
  [MessageTypes.ScrapperOverlayToggled]: MessagePayload<boolean>;
  [MessageTypes.ContentRouteChanged]: StoredRoute;
  [MessageTypes.GetActiveTab]: never;
  [MessageTypes.ContentStateChanged]: MessagePayload<ContentStateChangePayload>;
  [MessageTypes.GetContentState]: MessagePayload<GetContentStatePayload>;
  [MessageTypes.Logout]: never;
  [MessageTypes.InjectContent]: never;
};

export interface Message<Type, Payload = unknown> {
  type: Type;
  payload?: Payload;
}

export interface MessageResult<Payload> {
  result: boolean;
  error?: Error;
  payload?: Payload;
}

export type MessageHandler<Type, Payload, Result = unknown> = (
  message: Message<Type, Payload>,
  sender: Runtime.MessageSender
) => Promise<MessageResult<Result> | void>;

export type HandlersMap = {
  [Key in MessageTypes]?: MessageHandler<Key, MessagesPayloadMap[Key]>;
};
