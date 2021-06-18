import { Maybe } from '@scrapper-gate/shared/common';
import {
  Connection,
  Edge,
  Node,
  NodeProps,
  OnConnectStartParams,
  Position,
  removeElements,
  XYPosition,
} from 'react-flow-renderer';
import { ComponentType, MouseEvent, ReactNode } from 'react';
import { FlowBuilderInstanceContext } from './providers/FlowBuilderInstance.provider';
import { NormalEdgeVariations } from './edgeTypes/NormalEdge.types';
import { MenuItemProperties, Selection } from '@scrapper-gate/frontend/common';
import { FieldNameCreator } from '@scrapper-gate/frontend/form';

export interface FlowBuilderAddApi<T extends BaseNodeProperties> {
  flowInstance: FlowBuilderInstanceContext['flowInstance'];
  items: FlowBuilderItem<T>[];
  getNodes: () => Node<T>[];
  getFurthestNode: (pos: 'x' | 'y') => Node<T>;
  sourceNode?: NodeProps<T>;
  position?: XYPosition;
}

export type FlowBuilderItem<T extends BaseNodeProperties> = Node<T> | Edge<T>;

export interface FlowBuilderRemoveApi<T extends BaseNodeProperties> {
  removeElements: typeof removeElements;
  items: FlowBuilderItem<T>[];
}

export interface CreateNodeResult<
  T extends BaseNodeProperties = BaseNodeSelectionProperties
> {
  createdNodes?: Node[];
  items: FlowBuilderItem<T>[];
  nodeToCenterOn?: Node;
}

export interface NodeContentHelpers {
  getFieldName: FieldNameCreator;
}

export enum ConditionalNodeEdgeType {
  True = 'True',
  False = 'False',
}

export interface BaseNodeProperties {
  isFirst?: boolean;
  isLast?: boolean;
  hideHandles?: boolean;
  hideDropdown?: boolean;
  onClick?: (node: NodeProps<this>) => unknown;
  isForPlaceholder?: boolean;
  prevNodeId?: string;
  nextNodeId?: string;
  targetPosition?: Position;
  icon?: ReactNode;
  sourcePosition?: Position;
  title?: ReactNode;
  dropdownMenu?: (node: NodeProps<this>) => MenuItemProperties[];
  noContent?: boolean;
  cannotBeDeleted?: boolean;
  sourceHandle?: string;
  targetHandle?: string;
  edgeVariation?: NormalEdgeVariations;
  conditionalType?: ConditionalNodeEdgeType;
}

export interface BaseNodeSelectionProperties extends BaseNodeProperties {
  type: string;
  id?: string;
  position?: XYPosition;
}

export interface FlowBuilderPlaceholderProperties extends BaseNodeProperties {
  dropTitle?: string;
  additionalSources?: Position[];
}

export enum FlowBuilderNodeTypes {
  Action = 'Action',
  Conditional = 'Conditional',
  Start = 'Start',
  End = 'End',
}

export enum FlowBuilderEdgeTypes {
  Normal = 'Normal',
}

export enum FlowBuilderDropTypes {
  Node = 'Node',
}

export interface NodeEdgesAggregate<T extends BaseNodeProperties>
  extends Node<T> {
  sourceEdges: Edge<T>[];
  targetEdges: Edge<T>[];
}

export interface NodeEdges<T extends BaseNodeProperties> {
  nodes: Map<string, Node<T>>;
  edges: Map<string, Edge<T>>;
  items: FlowBuilderItem<T>[];
}

export interface NodeIconBoxProps {
  className?: string;
  icon?: ReactNode;
  width?: number;
  height?: number;
  onClick?: (event: MouseEvent) => unknown;
  iconClassName?: string;
  handles?: ReactNode;
}

export interface HandleBag<T extends BaseNodeProperties> {
  node: NodeProps<T>;
  isValidConnectionChecker?: (connection: Connection) => boolean;
}

export type BoxWithIconComponent = (props: NodeIconBoxProps) => JSX.Element;

export interface NodeMetadata<T extends BaseNodeProperties> {
  boxWithIcon: BoxWithIconComponent;
  handles: (bag: HandleBag<T>) => ReactNode;
  handlesData?: {
    [Key in Position]?: Partial<Edge<T>>;
  };
}

export type ConnectionSource = OnConnectStartParams;

export interface FlowBuilderFormState<
  T extends BaseNodeProperties = BaseNodeProperties
> {
  items: FlowBuilderItem<T>[];
}

export interface IsValidConnectionParams<T extends BaseNodeProperties> {
  node: NodeProps<T>;
  connection: Connection;
  items: FlowBuilderItem<T>[];
}

export interface NodeContentProps extends NodeContentHelpers {
  nodeIndex: number;
}

export type NodeContentComponent = ComponentType<NodeContentProps>;

export interface NodesCreatorApi<
  T extends BaseNodeProperties,
  S extends BaseNodeSelectionProperties
> {
  handleConnect: (params: Connection, items: FlowBuilderItem<T>[]) => Edge;
  createNode: (selection: Selection<S>) => Promise<Maybe<FlowBuilderItem<T>[]>>;
}
