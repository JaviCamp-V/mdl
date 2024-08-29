import React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Iconify from '@/components/Icon/Iconify';

interface EditCommentButtonProps {
  toggleEdit: () => void;
  isCommentOwner: boolean;
}
const EditCommentButton: React.FC<EditCommentButtonProps> = ({ toggleEdit, isCommentOwner }) => {
  if (!isCommentOwner) return;

  return (
    <MenuItem onClick={toggleEdit}>
      <ListItemIcon>
        <Iconify icon="mdi:edit-outline" fontSize="small" color="text.primary" width={14} />
      </ListItemIcon>
      <ListItemText>Edit</ListItemText>
    </MenuItem>
  );
};

export default EditCommentButton;
