import { Perhaps } from '@scrapper-gate/shared/common';
import { BaseEntity } from '@scrapper-gate/shared/schema';
import { MouseEvent, ReactNode } from 'react';
import { ControlledBaseProps } from '../Controlled.types';

export interface ControlledTableHeader<
  Entity = BaseEntity,
  Key extends keyof Entity = keyof Entity
> {
  entityKey: Key;
  label?: string;
  sortable?: boolean;
  render?: (data: Entity[Key], entity: Entity) => ReactNode;
}

export interface ControlledTableProps<
  Entity extends Pick<BaseEntity, 'id'>,
  QueryVars = unknown
> extends ControlledBaseProps<Entity, QueryVars> {
  headers: ControlledTableHeader<Entity>[];
  selectedRowId?: Perhaps<string>;
  onRowClick?: (item: Entity, event: MouseEvent) => unknown;
}
