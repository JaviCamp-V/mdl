import React from 'react';
import { getCommentsCount } from '@/features/comments/services/commentService';
import CommentType from '@/features/comments/types/enums/CommentType';
import { Typography } from '@mui/material';
import { isErrorResponse } from '@/utils/handleError';


interface CommentCountProps {
  commentType: CommentType;
  parentId: number;
}
const CommentCount: React.FC<CommentCountProps> = async ({ commentType, parentId }) => {
  const response = await getCommentsCount(commentType, parentId);
  return (
    <Typography fontSize={16} fontWeight={700} lineHeight={1} component="span">
      {`(${isErrorResponse(response) ? 0 : response.total})`}
    </Typography>
  );
};

export default CommentCount;