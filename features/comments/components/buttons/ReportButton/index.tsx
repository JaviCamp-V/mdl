import React from 'react';
import { enqueueSnackbar } from 'notistack';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Iconify from '@/components/Icon/Iconify';

interface ReportButtonProps {
  commentId: number;
  isCommentOwner: boolean;
  isAuthenticated: boolean;
}
const ReportCommentButton: React.FC<ReportButtonProps> = ({ commentId, isAuthenticated, isCommentOwner }) => {
  if (isCommentOwner) return;
  const reportComment = () => {
    if (!isAuthenticated) {
      enqueueSnackbar('Please login to report', { variant: 'default' });
      return;
    }

    enqueueSnackbar('Feature not implemented yet', { variant: 'default' });
  };
  return (
    <MenuItem onClick={reportComment}>
      <ListItemIcon>
        <Iconify icon="mdi:report-problem" fontSize="small" color="text.primary" width={14} />
      </ListItemIcon>
      <ListItemText>Report</ListItemText>
    </MenuItem>
  );
};

export default ReportCommentButton;
