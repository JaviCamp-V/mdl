'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SearchResponse from '@/features/media/types/interfaces/SearchResponse';
import Box from '@mui/material/Box';
import ItemPagination from '@/components/common/ItemPagination';
import SearchItemCard from '../../cards/SearchItem';

const SearchResults: React.FC<SearchResponse> = ({ results, total_pages, page }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minHeight: '60vh'
        }}
      >
        {results.map((result) => (
          <SearchItemCard key={result.id} details={result} />
        ))}
      </Box>
      <ItemPagination totalItems={total_pages * 90} itemsPerPage={90} currentPage={page} onPageChange={onPageChange} />
    </Box>
  );
};

export default SearchResults;
