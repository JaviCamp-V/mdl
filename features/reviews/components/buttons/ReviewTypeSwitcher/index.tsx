import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ReviewType from '@/features/reviews/types/enums/ReviewType';
import { Button, ButtonGroup } from '@mui/material';
import { userRoutes } from '@/libs/routes';

interface ReviewTypeSwitcherProps {
  currentReviewType: ReviewType;
  username: string;
}
// user profile page only
const ReviewTypeSwitcher: React.FC<ReviewTypeSwitcherProps> = ({ currentReviewType, username }) => {
  const router = useRouter();
  const onClick = (reviewType: ReviewType) => {
    if (currentReviewType === reviewType) return;
    const path = `${userRoutes.profile.replace('{username}', username)}/reviews/${reviewType.toLowerCase()}`;
    router.push(path);
  };
  return (
    <ButtonGroup sx={{ height: '100%' }}>
      {Object.values(ReviewType).map((reviewType) => (
        <Button
          key={reviewType}
          onClick={() => onClick(reviewType)}
          variant={currentReviewType === reviewType ? 'contained' : 'outlined'}
          sx={{ textTransform: 'capitalize' }}
        >
          {`${reviewType !== ReviewType.OVERALL ? reviewType.toLowerCase() : ''} Reviews`}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default ReviewTypeSwitcher;
