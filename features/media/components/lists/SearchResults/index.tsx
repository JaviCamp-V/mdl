'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SearchResponse from '@/features/media/types/interfaces/SearchResponse';
import Box from '@mui/material/Box';
import ItemPagination from '@/components/common/ItemPagination';
import { scrollToTopById } from '@/utils/scrollToElement';
import NoSearchResults from '../../cards/NoSearchResults';
import SearchItemCard from '../../cards/SearchItem';

const SearchResults: React.FC<SearchResponse> = ({ results, total_pages, page, pagingMethod }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [customPage, setCustomPage] = React.useState<number>(1);

  React.useEffect(() => {
    if (pagingMethod === 'custom') {
      setCustomPage(1);
    }
  }, [results]);
  const onPageChange = (page: number) => {
    if (pagingMethod && pagingMethod === 'custom') {
      if (currentPage === page) return;
      setCustomPage(page);
      scrollToTopById('search-results');

      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };
  // slice the results to show only 20 items per page if custom paging is enabled
  const startIndex = pagingMethod === 'custom' ? (customPage - 1) * 20 : 0;
  const endIndex = pagingMethod === 'custom' ? startIndex + 20 : results.length;
  const totalItems = pagingMethod === 'custom' ? results.length : total_pages;
  const currentPage = pagingMethod === 'custom' ? customPage : page;
  return (
    <Box id={'search-results'}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minHeight: '60vh'
        }}
      >
        {results.length === 0 && <NoSearchResults />}
        {results.slice(startIndex, endIndex).map((result) => (
          <SearchItemCard key={result.id} details={result} />
        ))}
      </Box>
      {total_pages !== 0 && (
        <ItemPagination
          totalItems={totalItems}
          itemsPerPage={20}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
    </Box>
  );
};

export default SearchResults;
