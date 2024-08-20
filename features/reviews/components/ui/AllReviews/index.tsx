'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ExtendOverallReview } from '@/features/reviews/types/interfaces/ExtendReviewResponse';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ItemPagination from '@/components/common/ItemPagination';
import SelectField from '@/components/common/Select';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import { formatStringDate } from '@/utils/formatters';
import OverallReviewCard from '../../cards/OverallReviewCard';
import NoReviews from '../NoReview';

interface AllReviewsProps extends MediaDetailsProps {
  reviews: ExtendOverallReview[];
}

const createdAtComparator = (a: ExtendOverallReview, b: ExtendOverallReview) => {
  return formatStringDate(a.createdAt).getTime() - formatStringDate(b.createdAt).getTime();
};
const helpfulComparator = (a: ExtendOverallReview, b: ExtendOverallReview) => {
  return b.helpful.numberOfHelpfulReviews - a.helpful.numberOfHelpfulReviews;
};

const AllReviews: React.FC<AllReviewsProps> = ({ reviews, mediaType, mediaId }) => {
  const [page, setPage] = React.useState<number>(1);
  const [sortedBy, setSortedBy] = React.useState<'helpful' | 'recent'>();
  const router = useRouter();
  const sortedReviews = React.useMemo(() => {
    if (!sortedBy) return reviews;
    return reviews.sort((a, b) => {
      return sortedBy === 'helpful' ? helpfulComparator(a, b) : createdAtComparator(a, b);
    });
  }, [sortedBy, reviews]);

  const onChange = (value: string) => {
    const by = value as 'helpful' | 'recent';
    if (by === sortedBy) return;
    setSortedBy(by);
  };

  const onPageChange = (page: number) => setPage(page);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingX: 2,
          marginBottom: 2
        }}
      >
        <SelectField
          options={[
            { label: 'Most Helpful', value: 'helpful' },
            { label: 'Most Recent', value: 'recent' }
          ]}
          value={sortedBy ?? 'helpful'}
          onChange={onChange}
        />
        <Button variant="contained" onClick={() => router.push(`/${mediaType}/${mediaId}/reviews/new`)}>
          {' '}
          Write Review{' '}
        </Button>
      </Box>
      <Grid container spacing={2} sx={{}}>
        {sortedReviews.length === 0 && <NoReviews mediaId={mediaId} mediaType={mediaType} />}

        {sortedReviews.slice((page - 1) * 10, page * 10).map((review: ExtendOverallReview) => (
          <Grid item xs={12} key={review.id}>
            <OverallReviewCard review={review} />
          </Grid>
        ))}
      </Grid>
      {reviews.length > 10 && (
        <Box sx={{ margin: 2 }}>
          <ItemPagination
            totalItems={reviews.length}
            itemsPerPage={10}
            currentPage={page}
            onPageChange={onPageChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default AllReviews;
