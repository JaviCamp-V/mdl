import React from 'react';
import { Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface DataColumn {
  field: string;
  headerName: string;
  format?: (value: any) => string;
  render?: (value: any) => JSX.Element;
}

interface TableProps {
  columns: DataColumn[];
  rows: any[];
}
const Table: React.FC<TableProps> = ({ columns, rows }) => {
  return (
    <TableContainer sx={{ backgroundColor: 'inherit', overflowX: 'hidden' }}>
      <MuiTable
        sx={{
          borderLeft: 'none',
          borderRight: 'none',
          borderColor: 'hsla(210, 8%, 51%, .13)',
          tableLayout: 'fixed',
          width: '100%',
          overflowX: 'none'
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              borderTop: '2px solid hsla(210, 8%, 51%, .13)!important',
              borderBottom: '3px solid hsla(210, 8%, 51%, .13)!important'
            }}
          >
            {columns.map((column) => (
              <TableCell
                key={column.field}
                sx={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'normal', wordWrap: 'break-word' }}
              >
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={`row-${index + 1}`}>
              {columns.map((column) => (
                <TableCell key={column.field} sx={{ fontSize: '14px' }}>
                  {(() => {
                    switch (true) {
                      case typeof column?.render === 'function':
                        return column?.render(row);
                      case typeof column?.format === 'function':
                        return column.format(row[column.field]);
                      default:
                        return row[column.field] ?? '';
                    }
                  })()}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
