'use client';

import React from 'react';
import { Box } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

interface ItemPaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}
const ItemPagination: React.FC<ItemPaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const numberOfPages = Math.ceil(totalItems / itemsPerPage);
  return (
    <Pagination
      count={numberOfPages}
      page={currentPage}
      boundaryCount={0} // Number of always visible pages at the beginning and end
      variant="outlined"
      color="primary"
      shape="rounded"
      size="large"
      sx={{ marginTop: 2 }}
      showLastButton={numberOfPages > 1 && currentPage < numberOfPages}
      showFirstButton={numberOfPages > 1 && currentPage > 1}
      hidePrevButton={currentPage === 1}
      hideNextButton={currentPage === numberOfPages}
      onChange={(e, page) => onPageChange(page)}
      renderItem={(item) => {
        if (item.type === 'start-ellipsis' || item.type === 'end-ellipsis') return <Box />;
        return (
          <PaginationItem
            {...item}
            sx={{
              color: '#fff',
              margin: 0, // Remove margin,
              borderColor: 'hsla(210, 8%, 51%, .13)',
              borderRadius: 0,
              ...(item.page === numberOfPages * 10 ? { borderBottomRightRadius: 2, borderTopRightRadius: 2 } : {}),
              ...(item.page === 1 ? { borderBottomLeftRadius: 2, borderTopLeftRadius: 2 } : {}),
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText'
              },
              '&:hover': {
                backgroundColor: 'primary.light'
              },
              '&.MuiPaginationItem-previousNext': {
                '& .MuiSvgIcon-root': {
                  fill: 'primary.main'
                }
              }
            }}
          />
        );
      }}
    />
  );
};

export default ItemPagination;
