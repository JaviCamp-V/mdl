'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Suggestion } from '@/features/recommendations/types/interface/Suggestion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@/components/common/Divider';
import ItemPagination from '@/components/common/ItemPagination';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import GroupedSuggestionCard from '../../cards/GroupedSuggestion';
import NoRecommendation from '../NoRec';

interface AllRecommendationsProps extends MediaDetailsProps {
  suggestions: Suggestion[];
}
const AllRecommendations: React.FC<AllRecommendationsProps> = ({ suggestions, mediaId, mediaType }) => {
  const router = useRouter();
  const [page, setPage] = React.useState<number>(1);
  const onPageChange = (page: number) => setPage(page);

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{ paddingX: 2, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}
      >
        <Button
          variant="contained"
          onClick={() => router.push(`/${mediaType}/${mediaId}/recommendations/new`)}
          sx={{ textTransform: 'capitalize' }}
        >
          Add Recommendation
        </Button>
      </Box>
      <Divider marginBottom={0} />

      {suggestions.length === 0 && (
        <NoRecommendation
          mediaId={mediaId}
          mediaType={mediaType}
          containerStyle={{ minHeight: '40vh', paddingTop: 4 }}
        />
      )}
      <Grid
        container
        spacing={0}
        sx={{ borderRight: '1px solid hsla(210,8%,51%,.13)', borderLeft: '1px solid hsla(210,8%,51%,.13)' }}
      >
        {suggestions.slice((page - 1) * 10, page * 10).map((suggestion, index: number, arr) => (
          <Grid
            item
            xs={12}
            key={`${suggestion.mediaId}-${suggestion.mediaType}`}
            sx={{ borderBottom: index !== arr.length - 1 ? '1px solid hsla(210,8%,51%,.13)' : 'none' }}
          >
            <GroupedSuggestionCard suggestion={suggestion} />
          </Grid>
        ))}
      </Grid>
      {suggestions.length > 0 && <Divider marginTop={0} />}
      {suggestions.length > 10 && (
        <Box sx={{ margin: 2 }}>
          <ItemPagination
            totalItems={suggestions.length}
            itemsPerPage={10}
            currentPage={page}
            onPageChange={onPageChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default AllRecommendations;
