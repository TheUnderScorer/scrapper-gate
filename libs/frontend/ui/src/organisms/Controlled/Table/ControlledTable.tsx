import {
  Pagination as PaginationComponent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Centered } from '../../../atoms/Centered/Centered';
import { toDisplayText } from '@scrapper-gate/shared/common';
import { BaseEntity } from '@scrapper-gate/shared/schema';
import React, { ReactElement } from 'react';
import tinycolor from 'tinycolor2';
import { useControlled } from '../useControlled';
import { ControlledTableProps } from './ControlledTable.types';

export const ControlledTable = <
  Entity extends Pick<BaseEntity, 'id'>,
  QueryVars = unknown
>(
  props: ControlledTableProps<Entity, QueryVars>
) => {
  const { emptyContent, headers, selectedRowId, onRowClick } = props;

  const {
    didInitialFetch,
    handlePaginationChange,
    items,
    loading,
    page,
    showEmptyContent,
    showPagination,
    totalPages,
  } = useControlled(props);

  if (showEmptyContent) {
    return (
      (emptyContent as ReactElement) ?? (
        <Centered
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            overflowY: 'auto !important' as 'auto',
            overflowX: 'hidden !important' as 'hidden',
          }}
        >
          <Typography>No items found.</Typography>
        </Centered>
      )
    );
  }

  if (loading && !didInitialFetch) {
    return (
      <>
        <Skeleton variant="text" height={40} />
        <Skeleton variant="text" height={40} />
        <Skeleton variant="text" height={40} />
        <Skeleton variant="text" height={40} />
        <Skeleton variant="text" height={40} />
      </>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          {headers.map((header) => (
            <TableCell key={header.entityKey.toString()}>
              {header.label ?? toDisplayText(header.entityKey.toString())}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow
            sx={{
              cursor: onRowClick ? 'pointer' : undefined,
              '&:hover': {
                backgroundColor: (theme) =>
                  onRowClick
                    ? tinycolor(theme.palette.primary.light)
                        .setAlpha(0.1)
                        .toRgbString()
                    : undefined,
              },
            }}
            onClick={(event) => onRowClick?.(item, event)}
            selected={selectedRowId === item.id}
            key={item.id}
          >
            {headers.map((header) => (
              <TableCell key={`${header.entityKey.toString()}-${item.id}`}>
                {header.render
                  ? header.render(item[header.entityKey], item)
                  : item[header.entityKey]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          {showPagination ? (
            <Centered>
              <PaginationComponent
                count={totalPages}
                page={page}
                onChange={handlePaginationChange}
              />
            </Centered>
          ) : undefined}
        </TableRow>
      </TableFooter>
    </Table>
  );
};
