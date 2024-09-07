'use client';

import { updateRecommendationLike } from '@/features/recommendations/service/recommendationService';
import { useSession } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Iconify from '@/components/Icon/Iconify';

interface LikeButtonProps {
  recommendationID: number;
  hasUserLiked: boolean;
  numberOfLikes: number;
}

const RecommendationLikeButton: React.FC<LikeButtonProps> = ({ hasUserLiked, numberOfLikes, recommendationID }) => {
  const { data: session } = useSession();

  const onClick = async () => {
    if (!session?.user) {
      enqueueSnackbar('Please login to like a recommendation', { variant: 'default' });
      return;
    }
    const response = await updateRecommendationLike(recommendationID, !hasUserLiked);
    if (response && 'errors' in response) {
      response.errors.forEach((error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
      return;
    }
    enqueueSnackbar(response.message, { variant: 'success' });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
      <Typography fontSize={14}>{numberOfLikes}</Typography>
      <IconButton sx={{ margin: 0, padding: 0 }} onClick={onClick}>
        <Iconify icon="mdi:heart-outline" color={hasUserLiked ? '#f44455' : 'text.primary'} width={14} height={14} />
      </IconButton>
    </Box>
  );
};

export default RecommendationLikeButton;
