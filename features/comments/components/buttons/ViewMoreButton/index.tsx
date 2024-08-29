import React from 'react';

interface ViewCommentButtonProps {
  commentType: string;
  parentId: number;
  page: number;
  numberOfPages: number;
}
const ViewCommentButton: React.FC<ViewCommentButtonProps> = ({ commentType, parentId, page, numberOfPages }) => {
  return <div>ViewCommentButton</div>;
};

export default ViewCommentButton;
