import {
  BaseNodeProperties,
  IsValidConnectionParams,
} from '../FlowBuilder.types';

export const ensureCorrectEdgeSourceTarget = ({
  connection,
}: IsValidConnectionParams<BaseNodeProperties>) => {
  return connection.source !== connection.target;
};
