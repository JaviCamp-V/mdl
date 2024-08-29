import React from 'react';
import { usePathname } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Iconify from '@/components/Icon/Iconify';

interface ShareButtonProps {
  commentId: number;
}
const ShareCommentButton: React.FC<ShareButtonProps> = ({ commentId }) => {
  const pathname = usePathname();
  const copyToClipboard = () => {
    const link = `${window.location.origin}${pathname}#comment-${commentId}`;
    navigator.clipboard.writeText(link).then(() => {
      enqueueSnackbar('Copied to clipboard', { variant: 'success' });
    });
  };
  return (
    <MenuItem onClick={copyToClipboard}>
      <ListItemIcon>
        <Iconify icon="mdi:share-outline" fontSize="small" color="text.primary" width={14} />
      </ListItemIcon>
      <ListItemText>Share Link</ListItemText>
    </MenuItem>
  );
};

export default ShareCommentButton;
