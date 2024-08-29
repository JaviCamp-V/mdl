'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Button from '@mui/material/Button';

interface LoadMoreCommentButtonProps {
  page: number;
}
const LoadMoreCommentButton: React.FC<LoadMoreCommentButtonProps> = ({ page }) => {
  const pathname = usePathname();
  const router = useRouter();
  const loadMoreComment = () => {
    router.push(`${pathname}?comments=${page + 2}`, { scroll: false });
  };
  return (
    <Button
      variant="contained"
      color="info"
      sx={{ textTransform: 'capitalize', width: '100%' }}
      onClick={loadMoreComment}
    >
      Load More Comment
    </Button>
  );
};

export default LoadMoreCommentButton;
