'use client';

import React from 'react';
import { markReviewHelpful, removeHelpfulRating } from '@/features/reviews/services/reviewUpdateService';
import { capitalCase } from 'change-case';
import { useSession } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface AddHelpfulRatingButtonsProps {
  reviewId: number;
  isHelpful: boolean | null | undefined;
}
const AddHelpfulRatingButtons: React.FC<AddHelpfulRatingButtonsProps> = ({ reviewId, isHelpful }) => {
  const { data: session } = useSession();

  const addHelpfulRating = async (newIsHelpful: boolean | null) => {
    if (!session?.user) {
      enqueueSnackbar('Please login to add helpful rating', { variant: 'default' });
      return;
    }
    if (isHelpful === newIsHelpful) {
      return;
    }
    const response =
      newIsHelpful === null ? await removeHelpfulRating(reviewId) : await markReviewHelpful(reviewId, newIsHelpful);
    const action = newIsHelpful === null ? 'removed' : 'marked';
    if (response && 'errors' in response) {
      const message = response.errors.map((error) => capitalCase(error.message)).join(', ');
      enqueueSnackbar(message, { variant: 'error' });
      return;
    }
    enqueueSnackbar(`Successfully ${action} helpful rating`, { variant: 'success' });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginY: 1.5
      }}
    >
      <Typography fontSize={14} sx={{ opacity: 0.6 }}>
        Was this review helpful?
      </Typography>
      <Button
        variant={isHelpful ? 'outlined' : 'contained'}
        color={isHelpful ? 'success' : 'info'}
        sx={{ padding: 0, textTransform: 'capitalize', fontSize: 12 }}
        onClick={() => addHelpfulRating(true)}
      >
        Yes
      </Button>
      <Button
        variant={isHelpful === false ? 'outlined' : 'contained'}
        color={isHelpful === false ? 'error' : 'info'}
        sx={{ padding: 0, textTransform: 'capitalize', fontSize: 12 }}
        onClick={() => addHelpfulRating(false)}
      >
        No
      </Button>
      {isHelpful !== null && (
        <Button
          variant="contained"
          color={'info'}
          sx={{ padding: 0, textTransform: 'capitalize', fontSize: 12 }}
          onClick={() => addHelpfulRating(null)}
        >
          Cancel
        </Button>
      )}
    </Box>
  );
};

export default AddHelpfulRatingButtons;
