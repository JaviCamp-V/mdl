import React from 'react';
import { getComments } from '@/features/comments/services/commentService';
import CommentType from '@/features/comments/types/enums/CommentType';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { isErrorResponse } from '@/utils/handleError';
import LoadMoreCommentButton from '../../buttons/LoadMoreButton';
import CommentCard from '../../cards/Comment';

interface AllCommentsProps {
  commentType: CommentType;
  parentId: number;
  page?: number;
}

interface LoadCommentPageProps {
  page: number;
  isLastPage: boolean;
  commentType: CommentType;
  parentId: number;
}

const LoadCommentPage: React.FC<LoadCommentPageProps> = async ({ commentType, parentId, page, isLastPage }) => {
  const response = await getComments(commentType, parentId, page);
  if (isErrorResponse(response)) return <Typography fontSize={14}>No comments found</Typography>;
  if (isLastPage && response.total === 0)
    return (
      <Typography fontSize={16} marginX={2} padding={2} fontWeight={'bolder'}>
        No comments found
      </Typography>
    );
  return (
    <React.Fragment>
      {response.results.map((comment) => (
        <Grid item xs={12} key={comment.id}>
          <Box sx={{ paddingX: 2.5, width: '100%' }}>
            <CommentCard comment={comment} />
          </Box>
        </Grid>
      ))}
      {response.total !== 0 && response.page !== response.numberOfPages - 1 && isLastPage && (
        <Grid item xs={12} sx={{ marginX: 2 }}>
          <LoadMoreCommentButton page={response.page} />
        </Grid>
      )}
    </React.Fragment>
  );
};
const AllComments: React.FC<AllCommentsProps> = async ({ commentType, parentId, page = 1 }) => {
  return (
    <Grid container spacing={2}>
      {[...Array(page)].map((_, index) => (
        <React.Fragment key={`page-${index + 1}`}>
          <React.Suspense fallback={<LoadingSkeleton height={'30vh'} />}>
            <LoadCommentPage
              page={index}
              isLastPage={index === page - 1}
              commentType={commentType}
              parentId={parentId}
            />
          </React.Suspense>
        </React.Fragment>
      ))}
    </Grid>
  );
};

export default AllComments;
