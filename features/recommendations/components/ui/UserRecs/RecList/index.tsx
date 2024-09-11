'use client';

import React from 'react';
import { RecommendationDetails } from '@/features/recommendations/types/interface/Recommendation';
import { Box, Grid } from '@mui/material';
import Divider from '@/components/common/Divider';
import ItemPagination from '@/components/common/ItemPagination';
import { scrollToElementByID, scrollToTop, scrollToTopById } from '@/utils/scrollToElement';
import RecommendationDetailsCard from '../../../cards/RecDetailsCard';

interface UserRecommendationListProps {
  recommendations: RecommendationDetails[];
}
const UserRecommendationList: React.FC<UserRecommendationListProps> = ({ recommendations }) => {
  const [page, setPage] = React.useState<number>(1);
  const onPageChange = (page: number) => {
    setPage(page);
    scrollToTopById('user-recommendation-list');
  };
  return (
    <Box id="user-recommendation-list">
      <Grid container spacing={0}>
        {recommendations.slice((page - 1) * 10, page * 10).map((recommendation, index: number, arr) => (
          <Grid
            item
            xs={12}
            key={recommendation.id}
            sx={{ borderBottom: index !== arr.length - 1 ? '1px solid hsla(210,8%,51%,.13)' : 'none' }}
          >
            <RecommendationDetailsCard recommendation={recommendation} />
          </Grid>
        ))}
      </Grid>
      {recommendations.length > 0 && <Divider marginTop={0} />}
      {recommendations.length > 10 && (
        <Box sx={{ margin: 2 }}>
          <ItemPagination
            totalItems={recommendations.length}
            itemsPerPage={10}
            currentPage={page}
            onPageChange={onPageChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default UserRecommendationList;
