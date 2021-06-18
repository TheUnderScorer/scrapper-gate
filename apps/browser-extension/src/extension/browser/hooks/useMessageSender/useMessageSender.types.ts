import {
  MessagesPayloadMap,
  MessageTypes,
} from '../../communication/messageResult.types';

export enum Target {
  activeTab = 'activeTab',
  background = 'background',
}

export interface MessageSenderHookProps<Type extends MessageTypes> {
  target: Target;
  type: Type;
}

export type MessageSenderSend<Type extends MessageTypes> = (
  payload?: MessagesPayloadMap[Type]
) => Promise<void>;

export interface MessageSenderState<Data = unknown> {
  data: Data | null;
  loading: boolean;
  error: Error | null;
  called: boolean;
}

export type MessageSenderResult<Type extends MessageTypes, Data = unknown> = [
  MessageSenderSend<Type>,
  MessageSenderState<Data>
];
