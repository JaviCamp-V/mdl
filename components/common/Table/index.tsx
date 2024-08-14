'use client';

import React from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  Box,
  Table as MuiTable,
  SxProps,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import Iconify from '@/components/Icon/Iconify';

export interface DataColumn {
  field: string;
  headerName: string;
  format?: (value: any, values?: any) => string;
  render?: (value: any) => React.ReactNode | string;
  sx?: SxProps;
  justifyContent?: string;
}

interface TableProps {
  columns: DataColumn[];
  filterColumns?: string[];
  rows: any[];
  headStyles?: SxProps;
  cellStyles?: SxProps;
  emptyMessage?: string;
}

const descendingComparator = (a: any, b: any, orderBy: any) => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
};

const getComparator = (order: 'asc' | 'desc', orderBy: any) => {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array: any[], comparator: (a: any, b: any) => number) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const Table: React.FC<TableProps> = ({ columns, filterColumns, rows, headStyles, cellStyles, emptyMessage }) => {
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('title');
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const columnsToDisplay = columns.filter((column) => !filterColumns?.includes(column.field));

  return (
    <TableContainer sx={{ backgroundColor: 'inherit', overflowX: 'hidden' }}>
      <MuiTable
        sx={{
          borderLeft: 'none',
          borderRight: 'none',
          borderColor: 'hsla(210, 8%, 51%, .13)',
          tableLayout: 'auto',
          width: '100%',
          overflowX: 'none'
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              borderTop: '2px solid hsla(210, 8%, 51%, .13)!important',
              borderBottom: '3px solid hsla(210, 8%, 51%, .13)!important',
              ...headStyles
            }}
          >
            {columnsToDisplay.map((column) => (
              <TableCell
                key={column.field}
                sx={{
                  fontWeight: 'bold',
                  fontSize: '14px',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  verticalAlign: 'middle',
                  pointerEvents: column.headerName ? 'auto' : 'none',
                  cursor: column.headerName ? 'pointer' : 'default',
                  // minWidth: '100px',
                  ...cellStyles,
                  ...((column?.sx as any) ?? {})
                }}
                onClick={() => handleRequestSort(column.field)}
              >
                <Box sx={{}}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'nowrap',
                      alignItems: 'center',
                      justifyContent: column?.justifyContent ?? 'center'
                    }}
                  >
                    {column.headerName}
                    {column.headerName && (
                      <Iconify
                        icon={
                          orderBy === column.field && order === 'desc' ? 'mdi:arrow-drop-up' : 'mdi:arrow-down-drop'
                        }
                        width={20}
                        height={20}
                      />
                    )}
                  </Box>
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.length ? (
            stableSort(rows, getComparator(order, orderBy))?.map((row, index) => (
              <TableRow key={`row-${index + 1}`}>
                {columnsToDisplay.map((column) => (
                  <TableCell
                    key={column.field}
                    sx={{ fontSize: '14px', ...cellStyles, ...((column?.sx as any) ?? {}) }}
                  >
                    {(() => {
                      switch (true) {
                        case typeof column?.render === 'function':
                          return column?.render(row);
                        case typeof column?.format === 'function':
                          return column.format(row[column.field], row);
                        default:
                          return row[column.field] ?? '';
                      }
                    })()}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ ...cellStyles, textAlign: 'left' }}>
                {emptyMessage ?? 'No data available'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
