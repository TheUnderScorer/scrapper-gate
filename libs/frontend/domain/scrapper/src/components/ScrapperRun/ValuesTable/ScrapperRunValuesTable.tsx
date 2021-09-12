import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@material-ui/core';
import { Centered, Emoji, InformationBox } from '@scrapper-gate/frontend/ui';
import { useMemo } from 'react';
import { ScrapperRunValuesTableProps } from './ScrapperRunValuesTable.types';

export const ScrapperRunValuesTable = ({
  values,
}: ScrapperRunValuesTableProps) => {
  const keys = useMemo(() => values && Object.keys(values), [values]);
  const entries = useMemo(() => values && Object.entries(values), [values]);

  const theme = useTheme();

  if (!keys?.length || !entries?.length) {
    return (
      <Centered>
        <InformationBox
          title={
            <>
              No values found <Emoji>{theme.emojis.empty}</Emoji>
            </>
          }
          subTitle="There are no values for this scrapper run, yet."
        />
      </Centered>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {keys.map((key) => (
              <TableCell key={key}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {entries.map(([key, value]) => (
              <TableCell key={key}>{value?.join(', ')}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
