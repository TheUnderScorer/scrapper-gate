import { Runtime } from 'webextension-polyfill';
import { AuthTokens } from '@scrapper-gate/shared/schema';

export enum MessageTypes {
  ToggleContent = 'ToggleContent',
  InjectContentScript = 'InjectContentScript',
  ScrapperOverlayToggled = 'ScrapperOverlayToggled',
  SetContentRoute = 'SetContentRoute',
  ContentRouteChanged = 'ContentRouteChanged',
  GetContentRoute = 'GetContentRoute',
  Logout = 'Logout',
  GetActiveTab = 'GetActiveTab',
  Test = 'Test',
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

export type StoredRoutes = Record<string, StoredRoute>;

export type MessagesPayloadMap = {
  [MessageTypes.ToggleContent]: MessagePayload<ContentToggleHookPayload>;
  [MessageTypes.Test]: MessagePayload<boolean>;
  [MessageTypes.SetContentRoute]: MessagePayload<string>;
  [MessageTypes.ScrapperOverlayToggled]: MessagePayload<boolean>;
  [MessageTypes.ContentRouteChanged]: StoredRoute;
  [MessageTypes.GetActiveTab]: never;
  [MessageTypes.Logout]: never;
  [MessageTypes.InjectContentScript]: never;
  [MessageTypes.GetContentRoute]: never;
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
