import React from 'react';
import IconButton from '@mui/material/IconButton';
import Iconify from '@/components/Icon/Iconify';
import { color } from '@/libs/common';

interface AddToCustomListProps {}
const AddToCustomList: React.FC<AddToCustomListProps> = () => {
  return (
    <IconButton
      sx={{
        borderRadius: 0,
        borderBottomRightRadius: '4px',
        borderTopRightRadius: '4px',
        backgroundColor: 'primary.main',
        width: '25%'
      }}
    >
      <Iconify
        icon="material-symbols:list"
        sx={{
          color: color,
          fontSize: 72,
          width: 30,
          height: 30,
          fontWeight: 700
        }}
      />
    </IconButton>
  );
};

export default AddToCustomList;
