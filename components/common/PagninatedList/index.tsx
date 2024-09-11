'use client';

import React from 'react';
import { Box, Grid } from '@mui/material';
import { scrollToTop, scrollToTopById } from '@/utils/scrollToElement';
import Divider from '../Divider';
import ItemPagination from '../ItemPagination';

interface PaginatedListProps<T> {
  items: T[];
  itemsPerPage: number;
  renderItem: (item: T) => React.ReactNode;
  id?: string;
  switchPage?: number;
}
const PaginatedList = <T,>({ items, itemsPerPage, renderItem, id, switchPage }: PaginatedListProps<T>) => {
  const [page, setPage] = React.useState<number>(1);
  const onPageChange = (page: number) => {
    setPage(page);
    if (id) return scrollToTopById(id);
    scrollToTop();
  };

  React.useEffect(() => {
    if (switchPage === page) return;
    onPageChange(switchPage ?? 1);
  }, [switchPage]);

  return (
    <Box>
      <Grid
        container
        spacing={0}
        sx={{ borderRight: '1px solid hsla(210,8%,51%,.13)', borderLeft: '1px solid hsla(210,8%,51%,.13)' }}
      >
        {items.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item, index, arr) => (
          <Grid
            item
            xs={12}
            key={`item-${index + 1}`}
            sx={{ borderBottom: index !== arr.length - 1 ? '1px solid hsla(210,8%,51%,.13)' : 'none' }}
          >
            {renderItem(item)}
          </Grid>
        ))}
      </Grid>
      <Divider marginTop={0} />

      {items.length > itemsPerPage && (
        <Box sx={{ margin: 2 }}>
          <ItemPagination
            totalItems={items.length}
            itemsPerPage={itemsPerPage}
            currentPage={page}
            onPageChange={onPageChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default PaginatedList;
