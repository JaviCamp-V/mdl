'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ExtendOverallReview } from '@/features/reviews/types/interfaces/ExtendReviewResponse';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@/components/common/Divider';
import ItemPagination from '@/components/common/ItemPagination';
import SelectField from '@/components/common/Select';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import { formatStringDate } from '@/utils/formatters';
import OverallReviewCard from '../../cards/OverallReview';
import NoReviews from '../NoReview';

interface AllReviewsProps extends MediaDetailsProps {
  reviews: ExtendOverallReview[];
  totalEpisodes?: number;
}

const createdAtComparator = (a: ExtendOverallReview, b: ExtendOverallReview) => {
  return formatStringDate(a.createdAt).getTime() - formatStringDate(b.createdAt).getTime();
};
const helpfulComparator = (a: ExtendOverallReview, b: ExtendOverallReview) => {
  return b.helpful.numberOfHelpfulReviews - a.helpful.numberOfHelpfulReviews;
};

const AllReviews: React.FC<AllReviewsProps> = ({ reviews, mediaType, mediaId, totalEpisodes }) => {
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

  if (sortedReviews.length === 0)
    return <NoReviews mediaId={mediaId} mediaType={mediaType} containerStyle={{ minHeight: '40vh' }} />;

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
      <Divider marginBottom={0} />
      <Grid
        container
        spacing={0}
        sx={{ borderRight: '1px solid hsla(210,8%,51%,.13)', borderLeft: '1px solid hsla(210,8%,51%,.13)' }}
      >
        {sortedReviews.slice((page - 1) * 10, page * 10).map((review: ExtendOverallReview, index: number, arr) => (
          <Grid
            item
            xs={12}
            key={review.id}
            sx={{ borderBottom: index !== arr.length - 1 ? '1px solid hsla(210,8%,51%,.13)' : 'none' }}
          >
            <OverallReviewCard review={review} totalEpisodes={totalEpisodes} />
          </Grid>
        ))}
      </Grid>
      <Divider marginTop={0} />

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
