import React from 'react';
import CommentType from '@/features/comments/types/enums/CommentType';
import { Box, Typography } from '@mui/material';
import Divider from '@/components/common/Divider';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import AddCommentForm from '../../forms/AddComment';
import AllComments from '../AllComments';
import CommentCount from '../CommentCount';


interface CommentsSectionProps {
  commentType: CommentType;
  parentId: number;
  page?: number;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ commentType, parentId, page }) => {
  return (
    <Box sx={{ paddingY: 2 }}>
      <Typography paddingX={2} fontSize={16} fontWeight={700} lineHeight={1}>
        {'Comments '}{' '}
        <React.Suspense fallback={<span> 0</span>}>
          <CommentCount commentType={commentType} parentId={parentId} />
        </React.Suspense>
      </Typography>

      <Divider />
      <Box sx={{ paddingX: 2 }}>
        <AddCommentForm commentType={commentType} parentId={parentId} />
      </Box>
      <Divider />
      <React.Suspense fallback={<LoadingSkeleton height="40vh" />}>
        <AllComments commentType={commentType} parentId={parentId} page={page} />
      </React.Suspense>
    </Box>
  );
};

export default CommentsSection;