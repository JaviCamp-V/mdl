'use client';

import React from 'react';
import Button from '@mui/material/Button';
import Iconify from '@/components/Icon/Iconify';
import { scrollToTopById } from '@/utils/scrollToElement';


interface ViewCommentButtonProps {
  comments: React.ReactNode;
  commentId: number;
}
const ViewOtherRepliesButton: React.FC<ViewCommentButtonProps> = ({ comments, commentId }) => {
  const [viewOtherReplies, setViewOtherReplies] = React.useState(false);
  const toggleViewReplies = async () => {
    setViewOtherReplies((prev) => !prev);
    if (viewOtherReplies) scrollToTopById(`comment-${commentId}`);
  };
  return (
    <React.Fragment>
      {viewOtherReplies && comments}
      <Button
        variant="text"
        sx={{
          textTransform: 'none',
          fontSize: 14,
          fontWeight: 'bolder',
          color: 'primary',
          '&:hover': { opacity: 0.7, backgroundColor: 'transparent' }
        }}
        startIcon={
          <Iconify icon={viewOtherReplies ? 'mdi:arrow-drop-up' : 'mdi:arrow-down-drop'} color="inherit" width={16} />
        }
        onClick={toggleViewReplies}
      >
        {viewOtherReplies ? 'Hide replies' : 'View replies'}
      </Button>
    </React.Fragment>
  );
};

export default ViewOtherRepliesButton;