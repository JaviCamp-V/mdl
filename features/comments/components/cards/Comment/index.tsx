import React from 'react';
import { getComments, refreshCommentsCache } from '@/features/comments/services/commentService';
import CommentType from '@/features/comments/types/enums/CommentType';
import Comment from '@/features/comments/types/interfaces/Comments';
import { Box, Grid, Typography } from '@mui/material';
import Avatar from '@/components/common/Avatar';
import Link from '@/components/common/Link';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { formatDateToDistance } from '@/utils/formatters';
import { isErrorResponse } from '@/utils/handleError';
import routes from '@/libs/routes';
import CommentButtons from '../../buttons/ActionButtons';
import CommentBody from './CommentBody';

interface CommentCardProps {
  comment: Comment;
}

interface CommentRepliesProps {
  commentId: number;
}
const CommentReplies: React.FC<CommentRepliesProps> = async ({ commentId }) => {
  const response = await getComments(CommentType.COMMENT, commentId, 0);
  if (isErrorResponse(response)) return <Typography color={'error'}>Error loading replies</Typography>;
  const { results, total } = response;

  return (
    <Grid container spacing={1} sx={{}}>
      {results.map((comment) => (
        <Grid item key={comment.id} xs={12} sx={{}}>
          <CommentCard comment={comment} />
        </Grid>
      ))}
    </Grid>
  );
};

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const { user, deleted, updatedAt, commentType } = comment;
  return (
    <Box
      id={`comment-${comment.id}`}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'left',
        gap: 1.5,
        alignItems: 'flex-start',
        height: '100%',
        width: '100%'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%' }}>
        <Avatar src={user.avatarUrl} username={user.username} isDeleted={deleted || !user.enabled} />
        {commentType === CommentType.COMMENT && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1.5,
              height: '100%',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                width: '1px',
                backgroundColor: '#36383a',
                height: '95%',
                borderRadius: '50%'
              }}
            />
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
          {deleted ? (
            <Typography fontSize={14} fontWeight={'bolder'} color="primary">{`[Deleted]`}</Typography>
          ) : (
            <Link
              href={routes.user.profile.replace('{username}', user.username)}
              sx={{ fontSize: 14, fontWeight: 'bolder' }}
            >
              {user.displayName}
            </Link>
          )}

          <Typography fontSize={12} sx={{ opacity: 0.6 }}>
            {formatDateToDistance(updatedAt)}
          </Typography>
        </Box>
        {deleted ? (
          <Typography sx={{ fontSize: 14, wordWrap: 'break-word', opacity: 0.6, paddingBottom: 1, minHeight: 40 }}>
            This comment has been deleted
          </Typography>
        ) : (
          <CommentBody comment={comment} />
        )}
        <React.Suspense fallback={<LoadingSkeleton height={'40vh'} />}>
          <CommentReplies commentId={comment.id} />
        </React.Suspense>
      </Box>
    </Box>
  );
};

export default CommentCard;
