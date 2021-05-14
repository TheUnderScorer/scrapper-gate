import { Connection } from 'react-flow-renderer';
import { ConnectionSource } from '../FlowBuilder.types';

const isTarget = (element: HTMLElement) => element.classList.contains('target');
const isSource = (element: HTMLElement) => element.classList.contains('source');

export const fallbackConnectHandler = (
  source: ConnectionSource,
  connectionHandler: (connection: Connection) => unknown
) => (event: MouseEvent) => {
  const paths = event.composedPath() as HTMLElement[];

  const [lastPath] = paths;

  const lastPathIsTarget = isTarget(lastPath);
  const lastPathIsSource = isSource(lastPath);

  const isTargetFirstPath = false;

  const isValid =
    (isTargetFirstPath && lastPathIsSource) ||
    (!isTargetFirstPath && lastPathIsTarget);

  if (!isValid) {
    return;
  }

  const lastPathNodeId = lastPath.getAttribute('data-nodeid');
  const lastPathHandleId = lastPath.getAttribute('data-handleid');

  connectionHandler(
    isTargetFirstPath
      ? {
          source: lastPathNodeId,
          sourceHandle: lastPathHandleId,
          target: source.nodeId,
          targetHandle: source.handleId,
        }
      : {
          source: source.nodeId,
          sourceHandle: source.handleId,
          target: lastPathNodeId,
          targetHandle: lastPathNodeId,
        }
  );
};
