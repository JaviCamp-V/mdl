import React from 'react';
import { getComments } from '@/features/comments/services/commentService';
import CommentType from '@/features/comments/types/enums/CommentType';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { isErrorResponse } from '@/utils/handleError';
import CommentCard from '../../cards/Comment';

interface AllCommentsProps {
  commentType: CommentType;
  parentId: number;
}
const AllComments: React.FC<AllCommentsProps> = async ({ commentType, parentId }) => {
  const response = await getComments(commentType, parentId);
  if (isErrorResponse(response)) {
    return <Box>{response.message}</Box>;
  }
  const { results, numberOfPages } = response;
  return (
    <Grid container spacing={2}>
      {results.map((comment, index, arr) => (
        <Grid
          item
          xs={12}
          key={comment.id}
          sx={{ borderBottom: index !== arr.length - 1 ? '1px solid hsla(210,8%,51%,.13)' : 'none' }}
        >
          <Box sx={{ paddingX: 2.5, width: '100%' }}>
            <CommentCard comment={comment} />
          </Box>
        </Grid>
      ))}
      {numberOfPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', paddingY: 2, backgroundColor: 'primary' }}>
          <Typography sx={{ cursor: 'pointer' }} variant="body2">
            Load more comments
          </Typography>
        </Box>
      )}
    </Grid>
  );
};

export default AllComments;
