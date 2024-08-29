'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Comment from '@/features/comments/types/interfaces/Comments';
import { useSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Iconify from '@/components/Icon/Iconify';
import { scrollToElementByID, scrollToTopById } from '@/utils/scrollToElement';
import CommentButtons from '../../../buttons/ActionButtons';
import AddCommentForm from '../../../forms/AddComment';

interface CommentBodyProps {
  comment: Comment;
}
const CommentBody: React.FC<CommentBodyProps> = ({ comment }) => {
  const { user, content, commentType, parentId, hasSpoilers, id, mention } = comment;
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = React.useState(false);
  const [showSpoiler, setShowSpoiler] = React.useState(false);
  const isAuthenticated = !!session;
  const isCommentOwner = isAuthenticated && user.id === session?.user?.userId;
  const showContent = !hasSpoilers || showSpoiler || isCommentOwner;
  const showSpoilerButton = hasSpoilers && !isCommentOwner;

  const scrollToMention = () => {
    const to = `comment-${mention.id}`;
    scrollToTopById(to);
  };

  return (
    <React.Fragment>
      {isEditing ? (
        <AddCommentForm
          commentType={comment.commentType}
          parentId={comment.parentId}
          commentBody={{ content, hasSpoilers }}
          commentId={id}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <Box
          sx={{
            minHeight: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5
          }}
        >
          {mention && (
            <Typography
              fontSize={14}
              fontWeight={'bolder'}
              color="primary"
              onClick={scrollToMention}
              sx={{ pointerEvents: 'auto', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
            >
              {`@${mention.deleted || !mention.user.enabled ? '[Deleted]' : mention.user.username}`}
            </Typography>
          )}
          {showSpoilerButton && (
            <Box>
              <Button
                variant="contained"
                sx={{
                  fontSize: '.8rem',
                  textTransform: 'capitalize',
                  backgroundColor: '#3783bb',
                  paddingY: 0,
                  paddingX: 0.5,
                  margin: 0
                }}
                onClick={() => setShowSpoiler((prev) => !prev)}
              >
                {`${showSpoiler ? 'Hide' : 'Reveal'} Spoiler`}
                <Iconify icon={showSpoiler ? 'mdi:arrow-drop-up' : 'mdi:arrow-down-drop'} color="inherit" width={16} />
              </Button>
            </Box>
          )}
          {showContent && (
            <Typography
              fontSize={14}
              lineHeight={1.5}
              sx={{
                whiteSpace: 'pre-wrap'
              }}
            >
              {comment.content}
            </Typography>
          )}
        </Box>
      )}
      <CommentButtons
        commentType={comment.commentType}
        parentId={comment.parentId}
        isCommentOwner={isCommentOwner}
        isAuthenticated={isAuthenticated}
        commentId={comment.id}
        likeCount={comment.likeCount}
        hasUserLiked={comment.hasUserLiked}
        onEditClick={() => setIsEditing(true)}
      />
    </React.Fragment>
  );
};

export default CommentBody;
